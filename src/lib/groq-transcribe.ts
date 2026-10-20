const ENDPOINT = "https://api.groq.com/openai/v1/audio/transcriptions";
const CHAT_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "whisper-large-v3";
const TRANSLATE_SYSTEM = `أنت مترجم أمين إلى العربية، ولست ملخّصاً.
انقل كل جملة وكل فقرة. لا تلخص ولا تختصر ولا تحذف تفصيلاً أو مثالاً أو رقماً أو اسماً.
لا تضف مقدمة أو خاتمة أو عنواناً أو شرحاً أو رأياً. لا تكمل معلومة ناقصة، ولا تغيّر المعنى اجتهاداً.
يُسمح فقط بتصحيح الخطأ اللغوي الظاهر أو خطأ التفريغ إذا كان المعنى واضحاً من الجملة نفسها.
حافظ على ترتيب الفقرات. أعد النص العربي وحده.`;

const REVIEW_SYSTEM = `راجع الترجمة مقابل الأصل.
أعد أي جملة أو رقم أو اسم سقط من الترجمة.
احذف أي معنى أو شرح أو تلخيص غير موجود في الأصل.
صحّح الخلل اللغوي وخطأ الترجمة فقط، من غير اختصار.
أعد النص العربي الكامل المصحح وحده، من غير ملاحظات.`;

export type TranslateTier = "free" | "pro";

export const TRANSLATE_MODELS: Record<
  TranslateTier,
  { model: string; label: string; detail: string; note: string; chunk: number; maxTokens: number }
> = {
  free: {
    model: "openai/gpt-oss-20b",
    label: "سريع",
    detail: "GPT OSS 20B",
    note: "متاح لمفتاح Groq العادي. أسرع وأقل استهلاكاً، وينقل النص كاملاً.",
    chunk: 3500,
    maxTokens: 8192,
  },
  pro: {
    model: "openai/gpt-oss-120b",
    label: "أدق",
    detail: "GPT OSS 120B",
    note: "أدق للعربية والنصوص الطويلة. يترجم كل جزء ثم يراجعه.",
    chunk: 5000,
    maxTokens: 8192,
  },
};

/** Safe for Groq's free-tier upload cap. Larger files are split in the browser. */
export const DIRECT_LIMIT = 24 * 1024 * 1024;
const DECODE_LIMIT = 250 * 1024 * 1024; // Increased to 250MB for safer handling of large files
const TARGET_RATE = 16_000;
const CHUNK_SECONDS = 90;
const REQUEST_TIMEOUT_MS = 120_000; // Increased timeout for huge files

const EXTENSIONS = new Set([
  "flac",
  "mp3",
  "mp4",
  "mpeg",
  "mpga",
  "m4a",
  "ogg",
  "wav",
  "webm",
]);

export type Segment = {
  start: number;
  end: number;
  text: string;
};

export type Transcript = {
  text: string;
  language?: string;
  duration?: number;
  segments: Segment[];
};

export class TranscribeError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "TranscribeError";
    this.status = status;
  }
}

type GroqBody = {
  text?: string;
  language?: string;
  duration?: number;
  segments?: Array<{ start?: number; end?: number; text?: string }>;
  error?: { message?: string };
};

export function isSupportedAudio(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (EXTENSIONS.has(ext)) return true;
  if (file.type.startsWith("audio/")) return true;
  return file.type === "video/mp4" || file.type === "video/webm";
}

export function formatBytes(size: number): string {
  if (size < 1024) return `${size} بايت`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} ك.ب`;
  return `${(size / (1024 * 1024)).toFixed(1)} م.ب`;
}

export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${minutes}:${ss}`;
}

export function normalizeApiKey(value: string): string {
  return value.trim().replace(/^bearer\s+/i, "");
}

/** Playback speed sent to Whisper. 1/3 restores a clip that was sped up ×3. */
export function stretchPcm(samples: Float32Array, speed: number): Float32Array {
  if (speed > 0.99) return samples;
  const safe = Math.min(1, Math.max(0.25, speed));
  const length = Math.max(1, Math.round(samples.length / safe));
  if (samples.length <= 1) return new Float32Array(length).fill(samples[0] ?? 0);
  const out = new Float32Array(length);
  const last = samples.length - 1;
  for (let index = 0; index < length; index += 1) {
    const position = (index * last) / (length - 1);
    const left = Math.floor(position);
    const frac = position - left;
    const a = samples[left] ?? 0;
    const b = samples[Math.min(last, left + 1)] ?? a;
    out[index] = a + (b - a) * frac;
  }
  return out;
}

export async function transcribeRecording(options: {
  file: File;
  apiKey: string;
  language: string;
  prompt: string;
  speed: number;
  signal: AbortSignal;
  onStatus: (message: string) => void;
  onProgress?: (ratio: number) => void;
}): Promise<Transcript> {
  const apiKey = normalizeApiKey(options.apiKey);
  if (!apiKey) throw new TranscribeError("أضف مفتاح Groq أولاً.");
  if (!isSupportedAudio(options.file)) {
    throw new TranscribeError("هذا النوع غير مدعوم. استخدم flac أو mp3 أو m4a أو wav أو ogg أو webm.");
  }

  const slowed = options.speed < 0.99;
  if (!slowed && options.file.size <= DIRECT_LIMIT) {
    options.onProgress?.(0.08);
    options.onStatus("جارٍ رفع التسجيل");
    return requestChunk({
      blob: options.file,
      filename: options.file.name || "recording.audio",
      apiKey,
      language: options.language,
      prompt: options.prompt,
      signal: options.signal,
      onUpload: (ratio) => {
        options.onProgress?.(0.08 + ratio * 0.92);
        if (ratio >= 1) options.onStatus("يكتب Whisper النص");
        else options.onStatus("جارٍ رفع التسجيل");
      },
    });
  }

  if (options.file.size > DECODE_LIMIT) {
    throw new TranscribeError("الملف أكبر مما يستطيع المتصفح تقسيمه. اضغطه إلى أقل من ٢٥٠ م.ب.");
  }

  const label = slowed ? "جارٍ إبطاء التسجيل" : "جارٍ تجهيز التسجيل";
  const report = (ratio: number, text = label) => {
    const clamped = Math.max(0, Math.min(1, ratio));
    options.onProgress?.(clamped);
    options.onStatus(text);
  };

  //- Enhanced Heartbeat status for huge files
  let heartbeatInterval: NodeJS.Timeout | null = null;
  const startHeartbeat = (msg: string) => {
    heartbeatInterval = setInterval(() => {
      options.onStatus(`${msg} (لا تزال العملية مستمرة...)`);
    }, 5000);
  };
  const stopHeartbeat = () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
  };

  try {
    report(0.05, "جارٍ قراءة التسجيل");
    startHeartbeat("جارٍ قراءة التسجيل");
    const loaded = await loadPcm(options.file, options.signal, report);
    stopHeartbeat();

    report(0.62, "جارٍ تجهيز النسخة الصوتية");
    startHeartbeat("جارٍ تجهيز البيانات الصوتية");
    const atTarget = await resampleMono(loaded.samples, loaded.sampleRate || TARGET_RATE, TARGET_RATE, options.signal, (ratio) =>
      report(0.62 + ratio * 0.1, "جارٍ تجهيز النسخة الصوتية"),
    );
    stopHeartbeat();

    const sampleRate = slowed ? Math.max(8_000, Math.round(TARGET_RATE * options.speed)) : TARGET_RATE;
    const needed = slowed
      ? Math.max(1, Math.round((atTarget.length * sampleRate) / (TARGET_RATE * options.speed)))
      : atTarget.length;
    
    report(0.72, "جارٍ تحسين جودة الصوت");
    startHeartbeat("جارٍ تحسين جودة الصوت");
    const pcm =
      needed === atTarget.length
        ? atTarget
        : await stretchTo(atTarget, needed, options.signal, (ratio) => report(0.72 + ratio * 0.08, "جارٍ تحسين جودة الصوت"));
    stopHeartbeat();

    report(0.82, "جارٍ إرسال التسجيل إلى Groq");
    startHeartbeat("جارٍ إرسال البيانات");
    const transcript = await transcribePcm(pcm, sampleRate, {
      ...options,
      onStatus: (message) => options.onStatus(message),
      onProgress: (ratio) => report(0.82 + ratio * 0.18, "جارٍ إرسال التسجيل"),
    });
    stopHeartbeat();
    
    return scaleTimes(transcript, slowed ? options.speed : 1);
  } catch (err) {
    stopHeartbeat();
    throw err;
  }
}

async function transcribePcm(
  pcm: Float32Array,
  sampleRate: number,
  options: {
    apiKey: string;
    language: string;
    prompt: string;
    signal: AbortSignal;
    onStatus: (message: string) => void;
    onProgress?: (ratio: number) => void;
  },
): Promise<Transcript> {
  const chunkSamples = Math.max(1, Math.round(CHUNK_SECONDS * sampleRate));
  const total = Math.max(1, Math.ceil(pcm.length / chunkSamples));
  const parts: Transcript[] = [];
  let carry = options.prompt.trim();

  for (let index = 0; index < total; index += 1) {
    if (options.signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
    const start = index * chunkSamples;
    const slice = pcm.slice(start, Math.min(pcm.length, start + chunkSamples));
    const label = total > 1 ? `الجزء ${index + 1} من ${total}` : "التسجيل";
    options.onProgress?.(index / total);
    options.onStatus(`جارٍ رفع ${label}`);
    const blob = encodeWav(slice, sampleRate);
    const part = await requestChunk({
      blob,
      filename: `part-${index + 1}.wav`,
      apiKey: options.apiKey,
      language: options.language,
      prompt: carry,
      signal: options.signal,
      onUpload: (ratio) => {
        options.onProgress?.((index + ratio) / total);
        options.onStatus(ratio >= 1 ? `يكتب Whisper ${label}...` : `جارٍ رفع ${label}`);
      },
    });
    parts.push(shift(part, start / sampleRate));
    const tail = part.text.trim().slice(-240);
    carry = [options.prompt.trim(), tail].filter(Boolean).join("\n").slice(-400);
  }

  return merge(parts);
}

export async function translateToArabic(options: {
  text: string;
  apiKey: string;
  tier: TranslateTier;
  signal: AbortSignal;
  onStatus: (message: string) => void;
}): Promise<string> {
  const tier = TRANSLATE_MODELS[options.tier] ?? TRANSLATE_MODELS.pro;
  const chunks = splitText(options.text.trim(), tier.chunk);
  if (chunks.length === 0) return "";
  const apiKey = normalizeApiKey(options.apiKey);
  const translated: string[] = [];

  for (let index = 0; index < chunks.length; index += 1) {
    const source = chunks[index] ?? "";
    const label = chunks.length > 1 ? `الجزء ${index + 1} من ${chunks.length}` : "النص";
    const piece = await translateChunk({
      source,
      apiKey,
      tier,
      signal: options.signal,
      depth: 0,
      onStatus: (message) => options.onStatus(chunks.length > 1 ? `${label}: ${message}` : message),
    });
    translated.push(piece);
  }

  return translated.join("\n\n");
}

async function translateChunk(options: {
  source: string;
  apiKey: string;
  tier: (typeof TRANSLATE_MODELS)[TranslateTier];
  signal: AbortSignal;
  depth: number;
  onStatus: (message: string) => void;
}): Promise<string> {
  options.onStatus("جارٍ الترجمة الكاملة…");
  const draft = await askModel({
    apiKey: options.apiKey,
    model: options.tier.model,
    maxTokens: options.tier.maxTokens,
    signal: options.signal,
    system: TRANSLATE_SYSTEM,
    user: options.source,
  });

  const cutOff = draft.finish === "length";
  const short = tooShort(options.source, draft.text);
  if ((cutOff || short) && options.depth < 3 && options.source.length > 500) {
    options.onStatus("الجزء طويل، يُقسم حتى لا يُختصر…");
    const halves = splitText(options.source, Math.ceil(options.source.length / 2)).filter(
      (part) => part && part !== options.source,
    );
    if (halves.length > 1) {
      const done: string[] = [];
      for (const part of halves) {
        done.push(await translateChunk({ ...options, source: part, depth: options.depth + 1 }));
      }
      return done.filter(Boolean).join("\n\n");
    }
  }

  if (!options.tier.model.endsWith("120b")) return draft.text;

  options.onStatus("جارٍ مراجعة الترجمة حتى لا يُحذف شيء أو يُزاد…");
  try {
    const reviewed = await askModel({
      apiKey: options.apiKey,
      model: options.tier.model,
      maxTokens: options.tier.maxTokens,
      signal: options.signal,
      system: REVIEW_SYSTEM,
      user: `الأصل:\n${options.source}\n\nالترجمة:\n${draft.text}`,
    });
    if (!reviewed.text || reviewed.finish === "length" || tooShort(options.source, reviewed.text)) {
      return draft.text;
    }
    if (tooShort(draft.text, reviewed.text) && markers(reviewed.text) + 2 < markers(draft.text)) {
      return draft.text;
    }
    return reviewed.text;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    return draft.text;
  }
}

type ChatBody = {
  choices?: Array<{ finish_reason?: string; message?: { content?: string } }>;
  error?: { message?: string };
};

async function askModel(options: {
  apiKey: string;
  model: string;
  maxTokens: number;
  signal: AbortSignal;
  system: string;
  user: string;
}): Promise<{ text: string; finish?: string }> {
  const response = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    signal: options.signal,
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: options.model,
      temperature: 0,
      reasoning_effort: "low",
      max_tokens: options.maxTokens,
      messages: [
        { role: "system", content: options.system },
        { role: "user", content: options.user },
      ],
    }),
  });
  let parsed: ChatBody | null = null;
  try {
    parsed = (await response.json()) as ChatBody;
  } catch {
    parsed = null;
  }
  if (!response.ok) {
    throw new TranscribeError(explainStatus(response.status, parsed?.error?.message?.trim() ?? ""));
  }
  const choice = parsed?.choices?.[0];
  const text = stripPreamble(choice?.message?.content ?? "");
  if (!text) throw new TranscribeError("أعاد النموذج نصاً فارغاً.");
  return { text, finish: choice?.finish_reason };
}

function markers(text: string): number {
  return text
    .split(/[.!?؟\n]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 8).length;
}

function tooShort(source: string, output: string): boolean {
  const sourceMarks = markers(source);
  const outputMarks = markers(output);
  if (sourceMarks >= 4 && outputMarks < Math.ceil(sourceMarks * 0.6)) return true;
  return source.length > 500 && output.length < source.length * 0.35;
}

function stripPreamble(value: string): string {
  let text = value.trim().replace(/^```[\w-]*\n?/, "").replace(/\n?```$/, "").trim();
  const lines = text.split("\n");
  while (lines.length > 1 && /^(الترجمة|إليك|هذه الترجمة|ملاحظة|translation|here is)\b/i.test(lines[0]?.trim() ?? "")) {
    lines.shift();
  }
  return lines.join("\n").trim();
}

function splitText(text: string, size: number): string[] {
  if (!text) return [];
  if (text.length <= size) return [text];
  const parts: string[] = [];
  let rest = text;
  while (rest.length > size) {
    let cut = rest.lastIndexOf("\n", size);
    if (cut < size * 0.5) cut = rest.lastIndexOf(" ", size);
    if (cut < size * 0.5) cut = size;
    parts.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) parts.push(rest);
  return parts;
}

async function requestChunk(options: {
  blob: Blob;
  filename: string;
  apiKey: string;
  language: string;
  prompt: string;
  signal: AbortSignal;
  onUpload: (ratio: number) => void;
}): Promise<Transcript> {
  const form = new FormData();
  form.append("file", options.blob, options.filename);
  form.append("model", MODEL);
  form.append("response_format", "verbose_json");
  form.append("temperature", "0");
  form.append("timestamp_granularities[]", "segment");
  if (options.language) form.append("language", options.language);
  const prompt = options.prompt.trim();
  if (prompt) form.append("prompt", prompt.slice(0, 400));

  const body = await postForm(form, options.apiKey, options.signal, options.onUpload);
  return normalize(body);
}

function postForm(
  form: FormData,
  apiKey: string,
  signal: AbortSignal,
  onUpload: (ratio: number) => void,
): Promise<GroqBody> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let settled = false;
    let timedOut = false;
    const finish = (error?: Error, body?: GroqBody) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener("abort", abort);
      if (error) reject(error);
      else if (body) resolve(body);
    };
    const abort = () => xhr.abort();
    signal.addEventListener("abort", abort);

    xhr.open("POST", ENDPOINT);
    xhr.timeout = REQUEST_TIMEOUT_MS;
    xhr.setRequestHeader("Authorization", `Bearer ${apiKey}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) onUpload(event.loaded / event.total);
    };
    xhr.onerror = () => finish(new TranscribeError("تعذّر الاتصال بـ Groq. تحقّق من الشبكة ثم أعد المحاولة."));
    xhr.ontimeout = () => {
      timedOut = true;
      xhr.abort();
      finish(new TranscribeError("انتهت مهلة Groq لهذا الجزء. أعد المحاولة."));
    };
    xhr.onabort = () => {
      if (!timedOut) finish(new DOMException("أُلغي التفريغ", "AbortError"));
    };
    xhr.onload = () => {
      let parsed: GroqBody | null = null;
      try {
        parsed = JSON.parse(xhr.responseText) as GroqBody;
      } catch {
        parsed = null;
      }
      if (xhr.status >= 200 && xhr.status < 300 && parsed && typeof parsed.text === "string") {
        finish(undefined, parsed);
        return;
      }
      const detail = parsed?.error?.message?.trim() ?? "";
      finish(new TranscribeError(explainStatus(xhr.status, detail), xhr.status));
    };
    xhr.send(form);
  });
}

function explainStatus(status: number, detail: string): string {
  if (/does not exist|do not have access|model_not_found/i.test(detail)) {
    return "نموذج الترجمة القديم لم يعد متاحاً لمفتاحك. حدّث الصفحة ثم أعد المحاولة.";
  }
  if (status === 401 || status === 403) {
    return "مفتاح Groq غير مقبول. تأكد أنه مفتاح فعّال من لوحة Groq.";
  }
  if (status === 413) return "الملف أكبر من الحد الذي يقبله Groq.";
  if (status === 429) return "وصلت إلى حد الطلبات لدى Groq. انتظر قليلاً ثم أعد المحاولة.";
  if (status === 400) {
    return detail ? `لم يقبل Groq الطلب: ${detail}` : "لم يقبل Groq هذا الطلب.";
  }
  if (detail) return detail;
  return "تعذّر التفريغ. حاول مرة أخرى.";
}

function normalize(body: GroqBody): Transcript {
  const segments = (body.segments ?? [])
    .map((segment) => ({
      start: typeof segment.start === "number" ? segment.start : 0,
      end: typeof segment.end === "number" ? segment.end : 0,
      text: (segment.text ?? "").trim(),
    }))
    .filter((segment) => segment.text.length > 0);

  return {
    text: (body.text ?? "").trim(),
    language: body.language,
    duration: typeof body.duration === "number" ? body.duration : undefined,
    segments,
  };
}

function scaleTimes(transcript: Transcript, speed: number): Transcript {
  if (speed > 0.99) return transcript;
  return {
    ...transcript,
    duration: transcript.duration != null ? transcript.duration * speed : undefined,
    segments: transcript.segments.map((segment) => ({
      ...segment,
      start: segment.start * speed,
      end: segment.end * speed,
    })),
  };
}

function shift(transcript: Transcript, offset: number): Transcript {
  if (!offset) return transcript;
  return {
    ...transcript,
    segments: transcript.segments.map((segment) => ({
      ...segment,
      start: segment.start + offset,
      end: segment.end + offset,
    })),
  };
}

function merge(parts: Transcript[]): Transcript {
  const text = parts
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join("\n\n");
  const segments = parts.flatMap((part) => part.segments);
  const duration = parts.reduce((sum, part) => sum + (part.duration ?? 0), 0);
  return {
    text,
    language: parts.find((part) => part.language)?.language,
    duration: duration || undefined,
    segments,
  };
}

async function loadPcm(
  file: File,
  signal: AbortSignal,
  report: (ratio: number, text?: string) => void,
): Promise<{ samples: Float32Array; sampleRate: number }> {
  const bytes = await file.arrayBuffer();
  if (signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
  let shown = 0.12;
  const forward = (ratio: number, text?: string) => {
    shown = Math.max(shown, ratio);
    report(shown, text);
  };
  forward(0.12, "جارٍ قراءة التسجيل");
  const native = await decodeNative(bytes, signal);
  if (native) return native;

  forward(0.4, "جارٍ قراءة التسجيل");
  return decodeWithLibrary(bytes);
}

async function decodeWithLibrary(bytes: ArrayBuffer): Promise<{ samples: Float32Array; sampleRate: number }> {
  const decodeAudio = (await import("@audio/decode")).default;
  const decoded = await decodeAudio(bytes);
  const first = decoded.channelData[0];
  if (!first || first.length === 0) throw new TranscribeError("التسجيل فارغ.");
  if (decoded.channelData.length === 1) return { samples: first, sampleRate: decoded.sampleRate || TARGET_RATE };
  const mono = new Float32Array(first.length);
  for (let channel = 0; channel < decoded.channelData.length; channel += 1) {
    const data = decoded.channelData[channel];
    if (!data) continue;
    for (let index = 0; index < data.length && index < mono.length; index += 1) {
      mono[index] = (mono[index] ?? 0) + data[index] / decoded.channelData.length;
    }
  }
  return { samples: mono, sampleRate: decoded.sampleRate || TARGET_RATE };
}

function createAudioContext(): AudioContext | null {
  const scope = globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext };
  const Ctor = scope.AudioContext ?? scope.webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

async function decodeNative(
  bytes: ArrayBuffer,
  signal: AbortSignal,
): Promise<{ samples: Float32Array; sampleRate: number } | null> {
  const ctx = createAudioContext();
  if (!ctx) return null;
  try {
    const decoded = await new Promise<AudioBuffer>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("timeout")), 15_000); // Increased timeout for large files
      const onAbort = () => {
        clearTimeout(timer);
        reject(new DOMException("أُلغي التفريغ", "AbortError"));
      };
      signal.addEventListener("abort", onAbort);
      void ctx.decodeAudioData(bytes.slice(0)).then(
        (buffer) => {
          clearTimeout(timer);
          signal.removeEventListener("abort", onAbort);
          resolve(buffer);
        },
        (error: unknown) => {
          clearTimeout(timer);
          signal.removeEventListener("abort", onAbort);
          reject(error instanceof Error ? error : new Error("decode"));
        },
      );
    });
    if (signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
    if (decoded.length === 0) throw new TranscribeError("التسجيل فارغ.");
    const mono = new Float32Array(decoded.length);
    const channels = decoded.numberOfChannels || 1;
    const block = 500_000; // Increased block size for faster processing
    for (let channel = 0; channel < channels; channel += 1) {
      const data = decoded.getChannelData(channel);
      for (let start = 0; start < data.length; start += block) {
        if (signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
        const end = Math.min(data.length, start + block);
        for (let index = start; index < end; index += 1) mono[index] = (mono[index] ?? 0) + data[index] / channels;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    return { samples: mono, sampleRate: decoded.sampleRate || TARGET_RATE };
  } catch (error) {
    if (error instanceof TranscribeError || (error instanceof DOMException && error.name === "AbortError")) throw error;
    return null;
  } finally {
    void ctx.close().catch(() => undefined);
  }
}

async function resampleMono(
  samples: Float32Array,
  fromRate: number,
  toRate: number,
  signal: AbortSignal,
  onProgress: (ratio: number) => void,
): Promise<Float32Array> {
  if (!fromRate || Math.abs(fromRate - toRate) < 1) {
    onProgress(1);
    return samples;
  }
  return stretchTo(samples, Math.max(1, Math.round((samples.length * toRate) / fromRate)), signal, onProgress, fromRate, toRate);
}

async function stretchTo(
  samples: Float32Array,
  length: number,
  signal: AbortSignal,
  onProgress: (ratio: number) => void,
  fromRate = samples.length,
  toRate = length,
): Promise<Float32Array> {
  if (samples.length === length) {
    onProgress(1);
    return samples;
  }
  const out = new Float32Array(length);
  const max = Math.max(0, samples.length - 1);
  const block = 500_000; // Increased block size for speed
  for (let start = 0; start < length; start += block) {
    if (signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
    const end = Math.min(length, start + block);
    for (let index = start; index < end; index += 1) {
      const position = (index * fromRate) / toRate;
      const left = Math.min(max, Math.floor(position));
      const fraction = Math.min(1, position - left);
      const a = samples[left] ?? 0;
      const b = samples[Math.min(max, left + 1)] ?? a;
      out[index] = a + (b - a) * fraction;
    }
    onProgress(end / length);
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  return out;
}

function encodeWav(samples: Float32Array, sampleRate: number): Blob {
  const dataBytes = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataBytes);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + dataBytes, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, dataBytes, true);

  let offset = 44;
  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index] ?? 0));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: "audio/wav" });
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}
