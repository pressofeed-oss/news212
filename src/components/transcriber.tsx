import { useEffect, useId, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileAudio,
  LoaderCircle,
  Square,
  Trash2,
  Upload,
  Play,
  Edit3,
  Eye
} from "lucide-react";
import { languageLabel, LANGUAGES } from "@/lib/languages";
import {
  DIRECT_LIMIT,
  formatBytes,
  formatClock,
  isSupportedAudio,
  normalizeApiKey,
  TRANSLATE_MODELS,
  transcribeRecording,
  translateToArabic,
  type Segment,
  type TranslateTier,
} from "@/lib/groq-transcribe";
import { TranslateWindow } from "@/components/translate-window";

const KEY_STORAGE = "midan.groqKey";
const LANG_STORAGE = "midan.language";
const SPEED_STORAGE = "midan.speed";
const MODE_STORAGE = "midan.mode";
const TIER_STORAGE = "midan.translateTier";
const HISTORY_STORAGE = "midan.history.v1";
const HISTORY_LIMIT = 8;

const SPEEDS = [
  { value: 1, label: "كما هو", note: "السرعة الأصلية" },
  { value: 0.5, label: "نصف", note: "لمقطع مسرّع ×٢" },
  { value: 1 / 3, label: "ثلث ×٣", note: "لمقطع مسرّع ×٣" },
] as const;

type SavedTranscript = {
  id: string;
  name: string;
  text: string;
  language: string;
  createdAt: number;
  duration?: number;
};

function storedSpeed(raw: string | null): number {
  if (raw === "0.5") return 0.5;
  if (raw === "0.333") return 1 / 3;
  return 1;
}

function speedKey(speed: number): string {
  if (speed < 0.4) return "0.333";
  if (speed < 0.75) return "0.5";
  return "1";
}

function loadHistory(): SavedTranscript[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedTranscript[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.text === "string" && typeof item.id === "string");
  } catch {
    return [];
  }
}

function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function downloadText(filename: string, text: string) {
  const base = filename.replace(/\.[^.]+$/, "") || "تفريغ";
  const blob = new Blob([`\uFEFF${text}`], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${base}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function segmentsToText(segments: Segment[]): string {
  return segments.map((segment) => `[${formatClock(segment.start)}] ${segment.text}`).join("\n");
}

export function Transcriber() {
  const fileInputId = useId();
  const resultRef = useRef<HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keyOpen, setKeyOpen] = useState(true);
  const [language, setLanguage] = useState("ar");
  const [speed, setSpeed] = useState(1);
  const [translate, setTranslate] = useState(false);
  const [tier, setTier] = useState<TranslateTier>("pro");
  const [translateOpen, setTranslateOpen] = useState(false);
  const [windowBusy, setWindowBusy] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [fileDuration, setFileDuration] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [detected, setDetected] = useState<string | undefined>();
  const [resultDuration, setResultDuration] = useState<number | undefined>();
  const [resultName, setResultName] = useState("");
  const [activeId, setActiveId] = useState("");
  const [copied, setCopied] = useState(false);
  const [showTimes, setShowTimes] = useState(false);
  const [history, setHistory] = useState<SavedTranscript[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem(KEY_STORAGE) ?? "";
    const storedLanguage = localStorage.getItem(LANG_STORAGE) ?? "ar";
    setApiKey(storedKey);
    setKeyOpen(storedKey.length === 0);
    setLanguage(storedLanguage);
    setSpeed(storedSpeed(localStorage.getItem(SPEED_STORAGE)));
    setTranslate(localStorage.getItem(MODE_STORAGE) === "translate");
    setTier(localStorage.getItem(TIER_STORAGE) === "free" ? "free" : "pro");
    setHistory(loadHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const normalized = normalizeApiKey(apiKey);
    if (normalized) localStorage.setItem(KEY_STORAGE, normalized);
    else localStorage.removeItem(KEY_STORAGE);
  }, [apiKey, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LANG_STORAGE, language);
  }, [language, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SPEED_STORAGE, speedKey(speed));
    localStorage.setItem(MODE_STORAGE, translate ? "translate" : "transcript");
    localStorage.setItem(TIER_STORAGE, tier);
  }, [speed, translate, tier, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(HISTORY_STORAGE, JSON.stringify(history));
  }, [history, hydrated]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
  }, [speed, audioUrl]);

  useEffect(() => {
    if (!file) {
      setAudioUrl("");
      setFileDuration(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setFileDuration(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  function takeFile(next: File) {
    if (!isSupportedAudio(next)) {
      setError("هذا النوع غير مدعوم. استخدم flac أو mp3 أو m4a أو wav أو ogg أو webm.");
      return;
    }
    setError("");
    setFile(next);
  }

  function clearKey() {
    setApiKey("");
    setShowKey(false);
    setKeyOpen(true);
    localStorage.removeItem(KEY_STORAGE);
  }

  async function run() {
    if (busy) return;
    const key = normalizeApiKey(apiKey);
    if (!key) {
      setKeyOpen(true);
      setError("أضف مفتاح Groq أولاً. يُحفظ على هذا الجهاز فقط.");
      return;
    }
    if (!file) {
      setError("اسحب تسجيلاً أو اختر ملفاً.");
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const slowed = speed < 0.99;
    setBusy(true);
    setError("");
    setCopied(false);
    setProgress(3);
    setStatus(slowed ? "جارٍ إبطاء التسجيل… ٣٪" : "جارٍ التفريغ… ٣٪");

    try {
      const result = await transcribeRecording({
        file,
        apiKey: key,
        language,
        prompt,
        speed,
        signal: controller.signal,
        onStatus: setStatus,
        onProgress: (ratio) => setProgress((current) => Math.max(current, Math.min(100, Math.round(ratio * 100)))),
      });
      let body = result.text || "لم يُلتقط كلام في هذا التسجيل.";
      let source = "";
      if (translate && result.text.trim()) {
        try {
          body = await translateToArabic({
            text: result.text,
            apiKey: key,
            tier,
            signal: controller.signal,
            onStatus: setStatus,
          });
          source = result.text;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") throw err;
          source = "";
          body = result.text;
          setError(
            err instanceof Error
              ? `تم التفريغ، وتعذّرت الترجمة: ${err.message}`
              : "تم التفريغ، وتعذّرت الترجمة.",
          );
        }
      }
      const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setText(body);
      setOriginalText(source);
      setSegments(result.segments);
      setDetected(result.language ?? (language || undefined));
      setResultDuration(result.duration);
      setResultName(file.name);
      setActiveId(id);
      setShowTimes(false);
      setHistory((current) =>
        [
          {
            id,
            name: file.name,
            text: body,
            language: result.language ?? language,
            createdAt: Date.now(),
            duration: result.duration,
          },
          ...current.filter((item) => item.name !== file.name || item.text !== body),
        ].slice(0, HISTORY_LIMIT),
      );
      setStatus("");
      requestAnimationFrame(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        resultRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("");
        return;
      }
      setStatus("");
      setError(err instanceof Error ? err.message : "تعذّر التفريغ.");
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function updateText(next: string) {
    setText(next);
    if (!activeId) return;
    setHistory((current) =>
      current.map((item) => (item.id === activeId ? { ...item, text: next } : item)),
    );
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("تعذّر النسخ. حدّد النص وانسخه يدوياً.");
    }
  }

  function openSaved(item: SavedTranscript) {
    setText(item.text);
    setOriginalText("");
    setSegments([]);
    setDetected(item.language || undefined);
    setResultDuration(item.duration);
    setResultName(item.name);
    setActiveId(item.id);
    setError("");
    setShowTimes(false);
  }

  function seekTo(time: number) {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      audioRef.current.play().catch(() => {});
    }
  }

  const ready = Boolean(normalizeApiKey(apiKey) && file && !busy && !windowBusy);
  const slowed = speed < 0.99;
  const overLimit = Boolean(file && file.size > DIRECT_LIMIT);
  const actionLabel = busy
    ? "جارٍ العمل"
    : slowed && translate
      ? "إبطاء ثم ترجمة"
      : translate
        ? "ترجمة"
        : slowed
          ? "إبطاء ثم تفريغ"
          : "تفريغ";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-5 py-10 md:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-copper">Groq · Whisper Large V3</p>
          <h1 className="font-display text-5xl leading-none text-ink">مداد - النسخة المطورة</h1>
          <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
            اسحب التسجيل، أبطئه إن كان مسرّعاً، ثم فرّغه أو ترجمه إلى العربية.
          </p>
        </div}
        <button
          type="button"
          onClick={() => setTranslateOpen(true)}
          className="mb-1 shrink-0 rounded-xl border border-line bg-sheet px-3 py-2 text-sm font-semibold text-ink"
        >
          ترجمة نص طويل
        </button>
      </header>

      <section className="flex flex-col gap-5 rounded-card border border-line bg-sheet p-5 shadow-sheet md:p-7">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink">مفتاح Groq</h2>
            {normalizeApiKey(apiKey) && !keyOpen ? (
              <button
                type="button"
                onClick={() => setKeyOpen(true)}
                className="text-sm font-medium text-copper"
              >
                تغيير
              </button>
            ) : null}
          </div>

          {keyOpen ? (
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input
                  type={showKey ? "text" : "password"}
                  dir="ltr"
                  autoComplete="off"
                  spellCheck={false}
                  value={apiKey}
                  onChange={(event) => setApiKey(event.target.value)}
                  placeholder="gsk_..."
                  className="h-12 min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 text-sm text-ink"
                />
                <button
                  type="button"
                  onClick={() => setShowKey((value) => !value)}
                  aria-label={showKey ? "إخفاء المفتاح" : "إظهار المفتاح"}
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-paper text-ink"
                >
                  {showKey ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
                <p>يُحفظ في هذا المتصفح فقط، ويُرسل مع التسجيل إلى Groq لا غير.</p>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-copper underline decoration-copper/40 underline-offset-4"
                >
                  إنشاء مفتاح
                </a>
              </div}
              {normalizeApiKey(apiKey) ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setKeyOpen(false)}
                    className="h-10 rounded-xl bg-ink px-4 text-sm font-medium text-sheet"
                  >
                    تم
                  </button>
                  <button
                    type="button"
                    onClick={clearKey}
                    className="h-10 rounded-xl px-3 text-sm text-muted"
                  >
                    حذف المفتاح
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted">
              محفوظ على هذا الجهاز
              {normalizeApiKey(apiKey).length >= 8
                ? ` · ينتهي بـ ${normalizeApiKey(apiKey).slice(-4)}`
                : ""}
            </p>
          )}
        </div>

        <div
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            const next = event.relatedTarget;
            if (next instanceof Node && event.currentTarget.contains(next)) return;
            setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const next = event.dataTransfer.files[0];
            if (next) takeFile(next);
          }}
          className={
            "rounded-card border border-dashed px-4 py-6 transition-colors " +
            (dragging ? "border-copper bg-copper-soft" : "border-line bg-paper")
          }
        >
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/mp4,video/webm,.flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm"
            className="sr-only"
            onChange={(event) => {
              const next = event.target.files?.[0];
              if (next) takeFile(next);
              event.target.value = "";
            }}
          />

          {file ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper">
                  <FileAudio className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-ink" title={file.name}>
                    {file.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {formatBytes(file.size)}
                    {fileDuration != null ? ` · ${formatClock(fileDuration)}` : ""}
                    {slowed ? " · سيُبطأ قبل الإرسال" : ""}
                    {overLimit ? " · سيُقسَّم ثم يُجمع النص" : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  disabled={busy}
                  aria-label="إزالة التسجيل"
                  className="grid size-11 shrink-0 place-items-center rounded-xl text-muted"
                >
                  <Trash2 className="size-5" />
                </button>
              </div>
              {audioUrl ? (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  controls
                  preload="metadata"
                  onLoadedMetadata={(event) => {
                    event.currentTarget.playbackRate = speed;
                    event.currentTarget.preservesPitch = false;
                    const duration = event.currentTarget.duration;
                    if (Number.isFinite(duration)) setFileDuration(duration);
                  }}
                  onPlay={(event) => {
                    event.currentTarget.playbackRate = speed;
                    event.currentTarget.preservesPitch = false;
                  }}
                />
              ) : null}
              {slowed ? (
                <p className="text-base font-semibold text-ink">
                  {fileDuration != null
                    ? `بعد الإبطاء: ${formatClock(fileDuration / speed)} بدل ${formatClock(fileDuration)}`
                    : "سيُسمَع التسجيل ويُفرَّغ بالسرعة البطيئة، لا بالسرعة الأصلية."}
                </p>
              ) : null}
              <label
                htmlFor={fileInputId}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-ink"
              >
                اختيار تسجيل آخر
              </label>
            </div>
          ) : (
            <label htmlFor={fileInputId} className="flex cursor-pointer flex-col items-center gap-3 text-center">
              <span className="grid size-12 place-items-center rounded-full bg-copper-soft text-copper">
                <Upload className="size-5" />
              </span>
              <span className="text-lg font-semibold text-ink">أسقط التسجيل هنا</span>
              <span className="text-sm text-muted">أو اضغط للاختيار · mp3 · wav · m4a · ogg · webm</span>
            </label>
          )}
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">لغة الكلام</span>
          <span className="relative">
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              disabled={busy}
              className="h-12 w-full appearance-none rounded-xl border border-line bg-paper ps-4 pe-10 text-base text-ink"
            >
              {LANGUAGES.map((item) => (
                <option key={item.code || "auto"} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted" />
          </span>
        </label>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">سرعة المقطع</span>
          <div className="grid grid-cols-3 gap-2">
            {SPEEDS.map((item) => {
              const selected = speedKey(speed) === speedKey(item.value);
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={selected}
                  disabled={busy}
                  onClick={() => setSpeed(item.value)}
                  className={
                    "h-12 rounded-xl border text-sm font-semibold " +
                    (selected
                      ? "border-copper bg-copper-soft text-copper"
                      : "border-line bg-paper text-ink")
                  }
                >
                  {item.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-muted">
            {SPEEDS.find((item) => speedKey(speed) === speedKey(item.value))?.note}. الاستماع يتباطأ هنا أيضاً،
            والمقطع المُبطأ هو ما يسمعه Whisper.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-ink">الناتج</span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-pressed={!translate}
              disabled={busy}
              onClick={() => setTranslate(false)}
              className={
                "h-12 rounded-xl border text-sm font-semibold " +
                (!translate ? "border-copper bg-copper-soft text-copper" : "border-line bg-paper text-ink")
              }
            >
              تفريغ
            </button>
            <button
              type="button"
              aria-pressed={translate}
              disabled={busy}
              onClick={() => setTranslate(true)}
              className={
                "h-12 rounded-xl border text-sm font-semibold " +
                (translate ? "border-copper bg-copper-soft text-copper" : "border-line bg-paper text-ink")
              }
            >
              ترجمة إلى العربية
            </button>
          </div>
          <button
            type="button"
            onClick={() => setTranslateOpen(true)}
            className="self-start text-sm font-medium text-copper"
          >
            النموذج: {TRANSLATE_MODELS[tier].label} · {TRANSLATE_MODELS[tier].detail}
          </button>
        </div>

        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-muted">تلميح للنموذج (اختياري)</summary>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            maxLength={400}
            rows={3}
            disabled={busy}
            placeholder="أسماء أو مصطلحات تريد أن يلتزم بها النص"
            className="mt-3 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-base leading-relaxed text-ink"
          />
        </details>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => void run()}
            disabled={!ready}
            className="h-12 rounded-xl bg-copper text-base font-semibold text-sheet enabled:hover:bg-copper-deep disabled:bg-line disabled:text-muted"
          >
            {busy ? `جارٍ العمل · ${progress}٪` : actionLabel}
          </button>
          {busy ? (
            <div className="flex flex-col gap-3" aria-live="polite">
              <div
                className="h-3 overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div className="h-full bg-copper" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-semibold text-ink">
                  <LoaderCircle className="me-2 inline size-4 animate-spin text-copper" />
                  {progress}٪ · {status}
                </p>
                <button
                  type="button"
                  onClick={stop}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink"
                >
                  <Square className="size-3.5" />
                  إيقاف
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">
              {ready
                ? slowed && translate
                  ? "سيُبطأ المقطع على جهازك، ثم يُفرَّغ ويُترجم إلى العربية."
                  : slowed
                    ? "سيُبطأ المقطع على جهازك ثم يُفرَّغ."
                    : translate
                      ? "سيُفرَّغ التسجيل ثم تُترجم النتيجة إلى العربية."
                      : "جاهز. التسجيل يذهب إلى Groq ولا يُحفظ في التطبيق."
                : "أضف المفتاح واختر تسجيلاً، ثم اضغط الزر."}
            </p>
          )}
          {error ? (
            <p role="alert" className="rounded-xl bg-copper-soft px-4 py-3 text-sm leading-relaxed text-danger">
              {error}
            </p>
          ) : null}
        </div>
      </section>

      {text ? (
        <section
          ref={resultRef}
          className="flex scroll-mt-6 flex-col gap-4 rounded-card border border-line bg-sheet p-5 shadow-sheet md:p-7"
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">{originalText ? "الترجمة" : "النص"}</h2>
                <p className="mt-1 text-sm text-muted">
                  {wordCount(text)} كلمة
                  {resultDuration ? ` · ${formatClock(resultDuration)}` : ""}
                  {detected ? ` · ${languageLabel(detected)}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-line bg-paper px-3 text-xs font-medium text-ink hover:bg-paper-soft"
              >
                {isEditing ? <Eye className="size-3.5" /> : <Edit3 className="size-3.5" />}
                {isEditing ? "عرض تفاعلي" : "تعديل النص"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void copyText()}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink"
              >
                {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
                {copied ? "نُسخ" : "نسخ"}
              </button>
              <button
                type="button"
                onClick={() => downloadText(resultName || "تفريغ", text)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink"
              >
                <Download className="size-4" />
                تنزيل
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={text}
              onChange={(event) => updateText(event.target.value)}
              dir="auto"
              spellCheck
              className="min-h-64 w-full resize-y rounded-xl border border-line bg-paper px-4 py-4 text-lg leading-relaxed text-ink"
            />
          ) : (
            <div
              dir="auto"
              className="min-h-64 w-full rounded-xl border border-line bg-paper px-4 py-4 text-lg leading-relaxed text-ink"
            >
              {segments.length > 0 ? (
                <div className="flex flex-wrap gap-x-1 gap-y-2">
                  {segments.map((segment, index) => (
                    <span
                      key={`${segment.start}-${index}`}
                      onClick={() => seekTo(segment.start)}
                      className="cursor-pointer rounded-md px-0.5 transition-colors hover:bg-copper-soft hover:text-copper"
                      title={`انقر للانتقال إلى ${formatClock(segment.start)}`}
                    >
                      {segment.text}{" "}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-muted italic">النص متاح ولكن لا توجد توقيتات تفاعلية.</p>
              )}
            </div>
          )}

          {originalText ? (
            <details>
              <summary className="cursor-pointer text-sm font-medium text-muted">النص الأصلي قبل الترجمة</summary>
              <p dir="auto" className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                {originalText}
              </p>
            </details>
          ) : null}

          {segments.length > 0 ? (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setShowTimes((value) => !value)}
                className="self-start text-sm font-medium text-copper"
              >
                {showTimes ? "إخفاء التوقيت" : "إظهار التوقيت"}
              </button>
              {showTimes ? (
                <div className="flex flex-col gap-2">
                  <ol className="flex max-h-80 flex-col gap-2 overflow-auto">
                    {segments.map((segment, index) => (
                      <li key={`${segment.start}-${index}`} className="flex gap-3 text-sm leading-relaxed">
                        <span
                          className="shrink-0 cursor-pointer font-medium text-copper hover:underline"
                          dir="ltr"
                          onClick={() => seekTo(segment.start)}
                        >
                          {formatClock(segment.start)}
                        </span>
                        <span dir="auto" className="text-ink">
                          {segment.text}
                        </span>
                      </li>
                    ))}
                  </ol>
                  <button
                    type="button"
                    onClick={() => downloadText(`${resultName || "تفريغ"}-timed`, segmentsToText(segments))}
                    className="self-start text-sm font-medium text-muted"
                  >
                    تنزيل مع التوقيت
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {history.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-ink">على هذا الجهاز</h2>
            <button
              type="button"
              onClick={() => setHistory([])}
              className="text-sm text-muted"
            >
              مسح السجل
            </button>
          </div>
          <ul className="flex flex-col gap-2">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openSaved(item)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-sheet px-4 py-3 text-start"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{item.name}</span>
                    <span className="mt-1 block truncate text-sm text-muted">{item.text}</span>
                  </span>
                  <span className="shrink-0 text-sm text-muted">
                    {new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(item.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="pb-6 text-sm leading-relaxed text-muted">
        ثلث السرعة يعيد المقطع المسرّع ×٣ إلى سرعته الطبيعية قبل Whisper. الترجمة الكاملة لا تلخص النص ولا تضيف إليه.
      </footer>
      <TranslateWindow
        open={translateOpen}
        onClose={() => setTranslateOpen(false)}
        apiKey={apiKey}
        tier={tier}
        onTier={setTier}
        seed={originalText || text}
        locked={busy}
        onBusy={setWindowBusy}
      />
    </main>
  );
}
