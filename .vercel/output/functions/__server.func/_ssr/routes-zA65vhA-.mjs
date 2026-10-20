import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LoaderCircle, c as EyeOff, d as ChevronDown, f as Check, i as Square, l as Download, o as FileAudio, r as Trash2, s as Eye, t as Upload, u as Copy } from "../_libs/lucide-react.mjs";
import { t as decode } from "../_libs/audio-type+audio__decode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-zA65vhA-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LANGUAGES = [
	{
		code: "",
		label: "كشف تلقائي"
	},
	{
		code: "ar",
		label: "العربية"
	},
	{
		code: "en",
		label: "الإنجليزية"
	},
	{
		code: "fr",
		label: "الفرنسية"
	},
	{
		code: "es",
		label: "الإسبانية"
	},
	{
		code: "de",
		label: "الألمانية"
	},
	{
		code: "tr",
		label: "التركية"
	},
	{
		code: "fa",
		label: "الفارسية"
	},
	{
		code: "ur",
		label: "الأردية"
	},
	{
		code: "he",
		label: "العبرية"
	},
	{
		code: "ru",
		label: "الروسية"
	},
	{
		code: "uk",
		label: "الأوكرانية"
	},
	{
		code: "zh",
		label: "الصينية"
	},
	{
		code: "ja",
		label: "اليابانية"
	},
	{
		code: "ko",
		label: "الكورية"
	},
	{
		code: "hi",
		label: "الهندية"
	},
	{
		code: "bn",
		label: "البنغالية"
	},
	{
		code: "ta",
		label: "التاميلية"
	},
	{
		code: "pt",
		label: "البرتغالية"
	},
	{
		code: "it",
		label: "الإيطالية"
	},
	{
		code: "nl",
		label: "الهولندية"
	},
	{
		code: "pl",
		label: "البولندية"
	},
	{
		code: "id",
		label: "الإندونيسية"
	},
	{
		code: "ms",
		label: "الملايوية"
	},
	{
		code: "sw",
		label: "السواحيلية"
	},
	{
		code: "sv",
		label: "السويدية"
	},
	{
		code: "da",
		label: "الدنماركية"
	},
	{
		code: "no",
		label: "النرويجية"
	},
	{
		code: "fi",
		label: "الفنلندية"
	},
	{
		code: "el",
		label: "اليونانية"
	},
	{
		code: "ro",
		label: "الرومانية"
	},
	{
		code: "cs",
		label: "التشيكية"
	},
	{
		code: "hu",
		label: "المجرية"
	},
	{
		code: "th",
		label: "التايلاندية"
	},
	{
		code: "vi",
		label: "الفيتنامية"
	},
	{
		code: "ku",
		label: "الكردية"
	}
];
var NAMES = {
	arabic: "العربية",
	english: "الإنجليزية",
	french: "الفرنسية",
	spanish: "الإسبانية",
	german: "الألمانية",
	turkish: "التركية",
	persian: "الفارسية",
	urdu: "الأردية",
	hebrew: "العبرية",
	russian: "الروسية",
	chinese: "الصينية",
	japanese: "اليابانية",
	korean: "الكورية"
};
function languageLabel(code) {
	if (!code) return "غير محددة";
	const known = LANGUAGES.find((item) => item.code === code);
	if (known) return known.label;
	return NAMES[code.toLowerCase()] ?? code;
}
var ENDPOINT = "https://api.groq.com/openai/v1/audio/transcriptions";
var CHAT_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
var MODEL = "whisper-large-v3";
var TRANSLATE_MODEL = "llama-3.3-70b-versatile";
var DECODE_LIMIT = 157286400;
var TARGET_RATE = 16e3;
var CHUNK_SECONDS = 480;
var EXTENSIONS = /* @__PURE__ */ new Set([
	"flac",
	"mp3",
	"mp4",
	"mpeg",
	"mpga",
	"m4a",
	"ogg",
	"wav",
	"webm"
]);
var TranscribeError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.name = "TranscribeError";
		this.status = status;
	}
};
function isSupportedAudio(file) {
	const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
	if (EXTENSIONS.has(ext)) return true;
	if (file.type.startsWith("audio/")) return true;
	return file.type === "video/mp4" || file.type === "video/webm";
}
function formatBytes(size) {
	if (size < 1024) return `${size} بايت`;
	if (size < 1048576) return `${Math.round(size / 1024)} ك.ب`;
	return `${(size / 1048576).toFixed(1)} م.ب`;
}
function formatClock(seconds) {
	const total = Math.max(0, Math.floor(seconds));
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor(total % 3600 / 60);
	const secs = total % 60;
	const mm = String(minutes).padStart(2, "0");
	const ss = String(secs).padStart(2, "0");
	if (hours > 0) return `${hours}:${mm}:${ss}`;
	return `${minutes}:${ss}`;
}
function normalizeApiKey(value) {
	return value.trim().replace(/^bearer\s+/i, "");
}
/** Playback speed sent to Whisper. 1/3 restores a clip that was sped up ×3. */
function stretchPcm(samples, speed) {
	if (speed > .99) return samples;
	const safe = Math.min(1, Math.max(.25, speed));
	const length = Math.max(1, Math.round(samples.length / safe));
	if (samples.length <= 1) return new Float32Array(length).fill(samples[0] ?? 0);
	const out = new Float32Array(length);
	const last = samples.length - 1;
	for (let index = 0; index < length; index += 1) {
		const position = index * last / (length - 1);
		const left = Math.floor(position);
		const frac = position - left;
		const a = samples[left] ?? 0;
		const b = samples[Math.min(last, left + 1)] ?? a;
		out[index] = a + (b - a) * frac;
	}
	return out;
}
async function transcribeRecording(options) {
	const apiKey = normalizeApiKey(options.apiKey);
	if (!apiKey) throw new TranscribeError("أضف مفتاح Groq أولاً.");
	if (!isSupportedAudio(options.file)) throw new TranscribeError("هذا النوع غير مدعوم. استخدم flac أو mp3 أو m4a أو wav أو ogg أو webm.");
	const slowed = options.speed < .99;
	if (!slowed && options.file.size <= 25165824) {
		options.onStatus("جارٍ رفع التسجيل…");
		return requestChunk({
			blob: options.file,
			filename: options.file.name || "recording.audio",
			apiKey,
			language: options.language,
			prompt: options.prompt,
			signal: options.signal,
			onUpload: (ratio) => {
				if (ratio >= 1) options.onStatus("يكتب Whisper النص…");
				else options.onStatus(`جارٍ رفع التسجيل… ${Math.round(ratio * 100)}٪`);
			}
		});
	}
	if (options.file.size > DECODE_LIMIT) throw new TranscribeError("الملف أكبر مما يستطيع المتصفح تقسيمه. اضغطه إلى أقل من ١٥٠ م.ب.");
	options.onStatus(slowed ? "جارٍ إبطاء التسجيل على جهازك…" : "الملف كبير، يجري تجهيزه على جهازك…");
	const decoded = await decodeToPcm(options.file);
	return scaleTimes(await transcribePcm(slowed ? stretchPcm(decoded, options.speed) : decoded, options), slowed ? options.speed : 1);
}
async function transcribePcm(pcm, options) {
	const chunkSamples = CHUNK_SECONDS * TARGET_RATE;
	const total = Math.max(1, Math.ceil(pcm.length / chunkSamples));
	const parts = [];
	let carry = options.prompt.trim();
	for (let index = 0; index < total; index += 1) {
		if (options.signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
		const start = index * chunkSamples;
		const part = await requestChunk({
			blob: encodeWav(pcm.slice(start, Math.min(pcm.length, start + chunkSamples)), TARGET_RATE),
			filename: `part-${index + 1}.wav`,
			apiKey: options.apiKey,
			language: options.language,
			prompt: carry,
			signal: options.signal,
			onUpload: (ratio) => {
				const label = total > 1 ? `الجزء ${index + 1} من ${total}` : "التسجيل";
				if (ratio >= 1) options.onStatus(`يكتب Whisper ${label}…`);
				else options.onStatus(`جارٍ رفع ${label}… ${Math.round(ratio * 100)}٪`);
			}
		});
		parts.push(shift(part, start / TARGET_RATE));
		const tail = part.text.trim().slice(-240);
		carry = [options.prompt.trim(), tail].filter(Boolean).join("\n").slice(-400);
	}
	return merge(parts);
}
async function translateToArabic(options) {
	const chunks = splitText(options.text.trim(), 3500);
	if (chunks.length === 0) return "";
	const apiKey = normalizeApiKey(options.apiKey);
	const translated = [];
	for (let index = 0; index < chunks.length; index += 1) {
		if (options.signal.aborted) throw new DOMException("أُلغي التفريغ", "AbortError");
		options.onStatus(chunks.length > 1 ? `جارٍ ترجمة الجزء ${index + 1} من ${chunks.length}…` : "جارٍ ترجمة النص إلى العربية…");
		const response = await fetch(CHAT_ENDPOINT, {
			method: "POST",
			signal: options.signal,
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: TRANSLATE_MODEL,
				temperature: .2,
				messages: [{
					role: "system",
					content: "ترجم النص إلى العربية الواضحة. أعد الترجمة فقط، وحافظ على الفقرات وأسماء الأعلام والأرقام. لا تضف مقدمة أو شرحاً."
				}, {
					role: "user",
					content: chunks[index]
				}]
			})
		});
		let parsed = null;
		try {
			parsed = await response.json();
		} catch {
			parsed = null;
		}
		if (!response.ok) throw new TranscribeError(explainStatus(response.status, parsed?.error?.message?.trim() ?? ""));
		const content = parsed?.choices?.[0]?.message?.content?.trim() ?? "";
		if (!content) throw new TranscribeError("أعاد Groq ترجمة فارغة.");
		translated.push(content);
	}
	return translated.join("\n\n");
}
function splitText(text, size) {
	if (!text) return [];
	if (text.length <= size) return [text];
	const parts = [];
	let rest = text;
	while (rest.length > size) {
		let cut = rest.lastIndexOf("\n", size);
		if (cut < size * .5) cut = rest.lastIndexOf(" ", size);
		if (cut < size * .5) cut = size;
		parts.push(rest.slice(0, cut).trim());
		rest = rest.slice(cut).trim();
	}
	if (rest) parts.push(rest);
	return parts;
}
async function requestChunk(options) {
	const form = new FormData();
	form.append("file", options.blob, options.filename);
	form.append("model", MODEL);
	form.append("response_format", "verbose_json");
	form.append("temperature", "0");
	form.append("timestamp_granularities[]", "segment");
	if (options.language) form.append("language", options.language);
	const prompt = options.prompt.trim();
	if (prompt) form.append("prompt", prompt.slice(0, 400));
	return normalize(await postForm(form, options.apiKey, options.signal, options.onUpload));
}
function postForm(form, apiKey, signal, onUpload) {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		const fail = (error) => {
			signal.removeEventListener("abort", abort);
			reject(error);
		};
		const abort = () => xhr.abort();
		signal.addEventListener("abort", abort);
		xhr.open("POST", ENDPOINT);
		xhr.setRequestHeader("Authorization", `Bearer ${apiKey}`);
		xhr.upload.onprogress = (event) => {
			if (event.lengthComputable && event.total > 0) onUpload(event.loaded / event.total);
		};
		xhr.onerror = () => fail(new TranscribeError("تعذّر الاتصال بـ Groq. تحقّق من الشبكة ثم أعد المحاولة."));
		xhr.onabort = () => fail(new DOMException("أُلغي التفريغ", "AbortError"));
		xhr.onload = () => {
			signal.removeEventListener("abort", abort);
			let parsed = null;
			try {
				parsed = JSON.parse(xhr.responseText);
			} catch {
				parsed = null;
			}
			if (xhr.status >= 200 && xhr.status < 300 && parsed && typeof parsed.text === "string") {
				resolve(parsed);
				return;
			}
			const detail = parsed?.error?.message?.trim() ?? "";
			reject(new TranscribeError(explainStatus(xhr.status, detail), xhr.status));
		};
		xhr.send(form);
	});
}
function explainStatus(status, detail) {
	if (status === 401 || status === 403) return "مفتاح Groq غير مقبول. تأكد أنه مفتاح فعّال من لوحة Groq.";
	if (status === 413) return "الملف أكبر من الحد الذي يقبله Groq.";
	if (status === 429) return "وصلت إلى حد الطلبات لدى Groq. انتظر قليلاً ثم أعد المحاولة.";
	if (status === 400) return detail ? `لم يقبل Groq التسجيل: ${detail}` : "لم يقبل Groq هذا التسجيل. جرّب ملفاً صوتياً آخر.";
	if (detail) return detail;
	return "تعذّر التفريغ. حاول مرة أخرى.";
}
function normalize(body) {
	const segments = (body.segments ?? []).map((segment) => ({
		start: typeof segment.start === "number" ? segment.start : 0,
		end: typeof segment.end === "number" ? segment.end : 0,
		text: (segment.text ?? "").trim()
	})).filter((segment) => segment.text.length > 0);
	return {
		text: (body.text ?? "").trim(),
		language: body.language,
		duration: typeof body.duration === "number" ? body.duration : void 0,
		segments
	};
}
function scaleTimes(transcript, speed) {
	if (speed > .99) return transcript;
	return {
		...transcript,
		duration: transcript.duration != null ? transcript.duration * speed : void 0,
		segments: transcript.segments.map((segment) => ({
			...segment,
			start: segment.start * speed,
			end: segment.end * speed
		}))
	};
}
function shift(transcript, offset) {
	if (!offset) return transcript;
	return {
		...transcript,
		segments: transcript.segments.map((segment) => ({
			...segment,
			start: segment.start + offset,
			end: segment.end + offset
		}))
	};
}
function merge(parts) {
	const text = parts.map((part) => part.text.trim()).filter(Boolean).join("\n\n");
	const segments = parts.flatMap((part) => part.segments);
	const duration = parts.reduce((sum, part) => sum + (part.duration ?? 0), 0);
	return {
		text,
		language: parts.find((part) => part.language)?.language,
		duration: duration || void 0,
		segments
	};
}
async function decodeToPcm(file) {
	let decoded;
	try {
		decoded = await decode(file);
	} catch {
		throw new TranscribeError("تعذّر قراءة هذا التسجيل. جرّب ملفاً بصيغة mp3 أو m4a أو wav أو ogg أو webm.");
	}
	const first = decoded.channelData[0];
	if (!first || first.length === 0) throw new TranscribeError("التسجيل فارغ.");
	return resampleMono(mixToMono(decoded.channelData), decoded.sampleRate || TARGET_RATE, TARGET_RATE);
}
function mixToMono(channels) {
	const first = channels[0];
	if (!first) return /* @__PURE__ */ new Float32Array();
	if (channels.length === 1) return first;
	const mono = new Float32Array(first.length);
	for (let channel = 0; channel < channels.length; channel += 1) {
		const data = channels[channel];
		if (!data) continue;
		for (let index = 0; index < data.length && index < mono.length; index += 1) mono[index] = (mono[index] ?? 0) + data[index] / channels.length;
	}
	return mono;
}
function resampleMono(samples, fromRate, toRate) {
	if (!fromRate || Math.abs(fromRate - toRate) < 1) return samples;
	const length = Math.max(1, Math.round(samples.length * toRate / fromRate));
	const out = new Float32Array(length);
	const max = Math.max(0, samples.length - 1);
	for (let index = 0; index < length; index += 1) {
		const position = index * fromRate / toRate;
		const left = Math.min(max, Math.floor(position));
		const fraction = Math.min(1, position - left);
		const a = samples[left] ?? 0;
		const b = samples[Math.min(max, left + 1)] ?? a;
		out[index] = a + (b - a) * fraction;
	}
	return out;
}
function encodeWav(samples, sampleRate) {
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
		view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
		offset += 2;
	}
	return new Blob([buffer], { type: "audio/wav" });
}
function writeAscii(view, offset, value) {
	for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
}
var KEY_STORAGE = "midan.groqKey";
var LANG_STORAGE = "midan.language";
var SPEED_STORAGE = "midan.speed";
var MODE_STORAGE = "midan.mode";
var HISTORY_STORAGE = "midan.history.v1";
var HISTORY_LIMIT = 8;
var SPEEDS = [
	{
		value: 1,
		label: "كما هو",
		note: "السرعة الأصلية"
	},
	{
		value: .5,
		label: "نصف",
		note: "لمقطع مسرّع ×٢"
	},
	{
		value: 1 / 3,
		label: "ثلث ×٣",
		note: "لمقطع مسرّع ×٣"
	}
];
function storedSpeed(raw) {
	if (raw === "0.5") return .5;
	if (raw === "0.333") return 1 / 3;
	return 1;
}
function speedKey(speed) {
	if (speed < .4) return "0.333";
	if (speed < .75) return "0.5";
	return "1";
}
function loadHistory() {
	try {
		const raw = localStorage.getItem(HISTORY_STORAGE);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((item) => item && typeof item.text === "string" && typeof item.id === "string");
	} catch {
		return [];
	}
}
function wordCount(text) {
	const trimmed = text.trim();
	if (!trimmed) return 0;
	return trimmed.split(/\s+/).length;
}
function downloadText(filename, text) {
	const base = filename.replace(/\.[^.]+$/, "") || "تفريغ";
	const blob = new Blob([`\uFEFF${text}`], { type: "text/plain;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `${base}.txt`;
	link.click();
	URL.revokeObjectURL(url);
}
function segmentsToText(segments) {
	return segments.map((segment) => `[${formatClock(segment.start)}] ${segment.text}`).join("\n");
}
function Transcriber() {
	const fileInputId = (0, import_react.useId)();
	const resultRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const audioRef = (0, import_react.useRef)(null);
	const abortRef = (0, import_react.useRef)(null);
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [showKey, setShowKey] = (0, import_react.useState)(false);
	const [keyOpen, setKeyOpen] = (0, import_react.useState)(true);
	const [language, setLanguage] = (0, import_react.useState)("ar");
	const [speed, setSpeed] = (0, import_react.useState)(1);
	const [translate, setTranslate] = (0, import_react.useState)(false);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [file, setFile] = (0, import_react.useState)(null);
	const [audioUrl, setAudioUrl] = (0, import_react.useState)("");
	const [fileDuration, setFileDuration] = (0, import_react.useState)(null);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [text, setText] = (0, import_react.useState)("");
	const [originalText, setOriginalText] = (0, import_react.useState)("");
	const [segments, setSegments] = (0, import_react.useState)([]);
	const [detected, setDetected] = (0, import_react.useState)();
	const [resultDuration, setResultDuration] = (0, import_react.useState)();
	const [resultName, setResultName] = (0, import_react.useState)("");
	const [activeId, setActiveId] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [showTimes, setShowTimes] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const storedKey = localStorage.getItem(KEY_STORAGE) ?? "";
		const storedLanguage = localStorage.getItem(LANG_STORAGE) ?? "ar";
		setApiKey(storedKey);
		setKeyOpen(storedKey.length === 0);
		setLanguage(storedLanguage);
		setSpeed(storedSpeed(localStorage.getItem(SPEED_STORAGE)));
		setTranslate(localStorage.getItem(MODE_STORAGE) === "translate");
		setHistory(loadHistory());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const normalized = normalizeApiKey(apiKey);
		if (normalized) localStorage.setItem(KEY_STORAGE, normalized);
		else localStorage.removeItem(KEY_STORAGE);
	}, [apiKey, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(LANG_STORAGE, language);
	}, [language, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(SPEED_STORAGE, speedKey(speed));
		localStorage.setItem(MODE_STORAGE, translate ? "translate" : "transcript");
	}, [
		speed,
		translate,
		hydrated
	]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(HISTORY_STORAGE, JSON.stringify(history));
	}, [history, hydrated]);
	(0, import_react.useEffect)(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.playbackRate = speed;
	}, [speed, audioUrl]);
	(0, import_react.useEffect)(() => {
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
	function takeFile(next) {
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
		const slowed = speed < .99;
		setBusy(true);
		setError("");
		setCopied(false);
		setStatus(slowed ? "جارٍ إبطاء التسجيل…" : "جارٍ التفريغ…");
		try {
			const result = await transcribeRecording({
				file,
				apiKey: key,
				language,
				prompt,
				speed,
				signal: controller.signal,
				onStatus: setStatus
			});
			let body = result.text || "لم يُلتقط كلام في هذا التسجيل.";
			let source = "";
			if (translate && result.text.trim()) try {
				body = await translateToArabic({
					text: result.text,
					apiKey: key,
					signal: controller.signal,
					onStatus: setStatus
				});
				source = result.text;
			} catch (err) {
				if (err instanceof DOMException && err.name === "AbortError") throw err;
				source = "";
				body = result.text;
				setError(err instanceof Error ? `تم التفريغ، وتعذّرت الترجمة: ${err.message}` : "تم التفريغ، وتعذّرت الترجمة.");
			}
			const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
			setText(body);
			setOriginalText(source);
			setSegments(result.segments);
			setDetected(result.language ?? (language || void 0));
			setResultDuration(result.duration);
			setResultName(file.name);
			setActiveId(id);
			setShowTimes(false);
			setHistory((current) => [{
				id,
				name: file.name,
				text: body,
				language: result.language ?? language,
				createdAt: Date.now(),
				duration: result.duration
			}, ...current.filter((item) => item.name !== file.name || item.text !== body)].slice(0, HISTORY_LIMIT));
			setStatus("");
			requestAnimationFrame(() => {
				const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
				resultRef.current?.scrollIntoView({
					behavior: reduce ? "auto" : "smooth",
					block: "start"
				});
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
	function updateText(next) {
		setText(next);
		if (!activeId) return;
		setHistory((current) => current.map((item) => item.id === activeId ? {
			...item,
			text: next
		} : item));
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
	function openSaved(item) {
		setText(item.text);
		setOriginalText("");
		setSegments([]);
		setDetected(item.language || void 0);
		setResultDuration(item.duration);
		setResultName(item.name);
		setActiveId(item.id);
		setError("");
		setShowTimes(false);
	}
	const ready = Boolean(normalizeApiKey(apiKey) && file && !busy);
	const slowed = speed < .99;
	const overLimit = Boolean(file && file.size > 25165824);
	const actionLabel = busy ? "جارٍ العمل" : slowed && translate ? "إبطاء ثم ترجمة" : translate ? "ترجمة" : slowed ? "إبطاء ثم تفريغ" : "تفريغ";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-8 px-5 py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "flex items-end justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-copper",
						children: "Groq · Whisper Large V3"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl leading-none text-ink",
						children: "مداد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-md text-base leading-relaxed text-muted",
						children: "اسحب التسجيل، أبطئه إن كان مسرّعاً، ثم فرّغه أو ترجمه إلى العربية."
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-5 rounded-card border border-line bg-sheet p-5 shadow-sheet md:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm font-semibold text-ink",
								children: "مفتاح Groq"
							}), normalizeApiKey(apiKey) && !keyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setKeyOpen(true),
								className: "text-sm font-medium text-copper",
								children: "تغيير"
							}) : null]
						}), keyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: showKey ? "text" : "password",
										dir: "ltr",
										autoComplete: "off",
										spellCheck: false,
										value: apiKey,
										onChange: (event) => setApiKey(event.target.value),
										placeholder: "gsk_...",
										className: "h-12 min-w-0 flex-1 rounded-xl border border-line bg-paper px-4 text-sm text-ink"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowKey((value) => !value),
										"aria-label": showKey ? "إخفاء المفتاح" : "إظهار المفتاح",
										className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-line bg-paper text-ink",
										children: showKey ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-5" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 text-sm text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "يُحفظ في هذا المتصفح فقط، ويُرسل مع التسجيل إلى Groq لا غير." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "https://console.groq.com/keys",
										target: "_blank",
										rel: "noreferrer",
										className: "font-medium text-copper underline decoration-copper/40 underline-offset-4",
										children: "إنشاء مفتاح"
									})]
								}),
								normalizeApiKey(apiKey) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setKeyOpen(false),
										className: "h-10 rounded-xl bg-ink px-4 text-sm font-medium text-sheet",
										children: "تم"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: clearKey,
										className: "h-10 rounded-xl px-3 text-sm text-muted",
										children: "حذف المفتاح"
									})]
								}) : null
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["محفوظ على هذا الجهاز", normalizeApiKey(apiKey).length >= 8 ? ` · ينتهي بـ ${normalizeApiKey(apiKey).slice(-4)}` : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragEnter: (event) => {
							event.preventDefault();
							setDragging(true);
						},
						onDragOver: (event) => {
							event.preventDefault();
							setDragging(true);
						},
						onDragLeave: (event) => {
							const next = event.relatedTarget;
							if (next instanceof Node && event.currentTarget.contains(next)) return;
							setDragging(false);
						},
						onDrop: (event) => {
							event.preventDefault();
							setDragging(false);
							const next = event.dataTransfer.files[0];
							if (next) takeFile(next);
						},
						className: "rounded-card border border-dashed px-4 py-6 transition-colors " + (dragging ? "border-copper bg-copper-soft" : "border-line bg-paper"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: fileInputId,
							ref: fileInputRef,
							type: "file",
							accept: "audio/*,video/mp4,video/webm,.flac,.mp3,.mp4,.mpeg,.mpga,.m4a,.ogg,.wav,.webm",
							className: "sr-only",
							onChange: (event) => {
								const next = event.target.files?.[0];
								if (next) takeFile(next);
								event.target.value = "";
							}
						}), file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid size-11 shrink-0 place-items-center rounded-xl bg-copper-soft text-copper",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileAudio, { className: "size-5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "truncate text-base font-semibold text-ink",
												title: file.name,
												children: file.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-sm text-muted",
												children: [
													formatBytes(file.size),
													fileDuration != null ? ` · ${formatClock(fileDuration)}` : "",
													slowed ? " · سيُبطأ قبل الإرسال" : "",
													overLimit ? " · سيُقسَّم ثم يُجمع النص" : ""
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setFile(null),
											disabled: busy,
											"aria-label": "إزالة التسجيل",
											className: "grid size-11 shrink-0 place-items-center rounded-xl text-muted",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-5" })
										})
									]
								}),
								audioUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
									ref: audioRef,
									src: audioUrl,
									controls: true,
									preload: "metadata",
									onLoadedMetadata: (event) => {
										event.currentTarget.playbackRate = speed;
										const duration = event.currentTarget.duration;
										if (Number.isFinite(duration)) setFileDuration(duration);
									}
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: fileInputId,
									className: "inline-flex h-11 items-center justify-center rounded-xl border border-line px-4 text-sm font-medium text-ink",
									children: "اختيار تسجيل آخر"
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							htmlFor: fileInputId,
							className: "flex cursor-pointer flex-col items-center gap-3 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-12 place-items-center rounded-full bg-copper-soft text-copper",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-semibold text-ink",
									children: "أسقط التسجيل هنا"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm text-muted",
									children: "أو اضغط للاختيار · mp3 · wav · m4a · ogg · webm"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-ink",
							children: "لغة الكلام"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: language,
								onChange: (event) => setLanguage(event.target.value),
								disabled: busy,
								className: "h-12 w-full appearance-none rounded-xl border border-line bg-paper ps-4 pe-10 text-base text-ink",
								children: LANGUAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: item.code,
									children: item.label
								}, item.code || "auto"))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "pointer-events-none absolute end-3 top-1/2 size-5 -translate-y-1/2 text-muted" })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold text-ink",
								children: "سرعة المقطع"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: SPEEDS.map((item) => {
									const selected = speedKey(speed) === speedKey(item.value);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-pressed": selected,
										disabled: busy,
										onClick: () => setSpeed(item.value),
										className: "h-12 rounded-xl border text-sm font-semibold " + (selected ? "border-copper bg-copper-soft text-copper" : "border-line bg-paper text-ink"),
										children: item.label
									}, item.label);
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [SPEEDS.find((item) => speedKey(speed) === speedKey(item.value))?.note, ". الاستماع يتباطأ هنا أيضاً، والمقطع المُبطأ هو ما يسمعه Whisper."]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-semibold text-ink",
							children: "الناتج"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": !translate,
								disabled: busy,
								onClick: () => setTranslate(false),
								className: "h-12 rounded-xl border text-sm font-semibold " + (!translate ? "border-copper bg-copper-soft text-copper" : "border-line bg-paper text-ink"),
								children: "تفريغ"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": translate,
								disabled: busy,
								onClick: () => setTranslate(true),
								className: "h-12 rounded-xl border text-sm font-semibold " + (translate ? "border-copper bg-copper-soft text-copper" : "border-line bg-paper text-ink"),
								children: "ترجمة إلى العربية"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-sm font-medium text-muted",
							children: "تلميح للنموذج (اختياري)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: prompt,
							onChange: (event) => setPrompt(event.target.value),
							maxLength: 400,
							rows: 3,
							disabled: busy,
							placeholder: "أسماء أو مصطلحات تريد أن يلتزم بها النص",
							className: "mt-3 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-base leading-relaxed text-ink"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void run(),
								disabled: !ready,
								className: "h-12 rounded-xl bg-copper text-base font-semibold text-sheet enabled:hover:bg-copper-deep disabled:bg-line disabled:text-muted",
								children: busy ? "جارٍ العمل" : actionLabel
							}),
							busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								"aria-live": "polite",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-2 text-sm text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-copper" }), status || "جارٍ التفريغ…"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: stop,
									className: "inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "size-3.5" }), "إيقاف"]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: ready ? slowed && translate ? "سيُبطأ المقطع على جهازك، ثم يُفرَّغ ويُترجم إلى العربية." : slowed ? "سيُبطأ المقطع على جهازك ثم يُفرَّغ." : translate ? "سيُفرَّغ التسجيل ثم تُترجم النتيجة إلى العربية." : "جاهز. التسجيل يذهب إلى Groq ولا يُحفظ في التطبيق." : "أضف المفتاح واختر تسجيلاً، ثم اضغط الزر."
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								role: "alert",
								className: "rounded-xl bg-copper-soft px-4 py-3 text-sm leading-relaxed text-danger",
								children: error
							}) : null
						]
					})
				]
			}),
			text ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				ref: resultRef,
				className: "flex scroll-mt-6 flex-col gap-4 rounded-card border border-line bg-sheet p-5 shadow-sheet md:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-semibold text-ink",
							children: originalText ? "الترجمة" : "النص"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								wordCount(text),
								" كلمة",
								resultDuration ? ` · ${formatClock(resultDuration)}` : "",
								detected ? ` · ${languageLabel(detected)}` : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void copyText(),
								className: "inline-flex h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink",
								children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-ok" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), copied ? "نُسخ" : "نسخ"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => downloadText(resultName || "تفريغ", text),
								className: "inline-flex h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "تنزيل"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: text,
						onChange: (event) => updateText(event.target.value),
						dir: "auto",
						spellCheck: true,
						className: "min-h-64 w-full resize-y rounded-xl border border-line bg-paper px-4 py-4 text-lg leading-relaxed text-ink"
					}),
					originalText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "cursor-pointer text-sm font-medium text-muted",
						children: "النص الأصلي قبل الترجمة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						dir: "auto",
						className: "mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink",
						children: originalText
					})] }) : null,
					segments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setShowTimes((value) => !value),
							className: "self-start text-sm font-medium text-copper",
							children: showTimes ? "إخفاء التوقيت" : "إظهار التوقيت"
						}), showTimes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "flex max-h-80 flex-col gap-2 overflow-auto",
								children: segments.map((segment, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-3 text-sm leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 font-medium text-copper",
										dir: "ltr",
										children: formatClock(segment.start)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										dir: "auto",
										className: "text-ink",
										children: segment.text
									})]
								}, `${segment.start}-${index}`))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => downloadText(`${resultName || "تفريغ"}-timed`, segmentsToText(segments)),
								className: "self-start text-sm font-medium text-muted",
								children: "تنزيل مع التوقيت"
							})]
						}) : null]
					}) : null
				]
			}) : null,
			history.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold text-ink",
						children: "على هذا الجهاز"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setHistory([]),
						className: "text-sm text-muted",
						children: "مسح السجل"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: history.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openSaved(item),
						className: "flex w-full items-center justify-between gap-3 rounded-xl border border-line bg-sheet px-4 py-3 text-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium text-ink",
								children: item.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block truncate text-sm text-muted",
								children: item.text
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-sm text-muted",
							children: new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(item.createdAt)
						})]
					}) }, item.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "pb-6 text-sm leading-relaxed text-muted",
				children: "ثلث السرعة يعيد المقطع المسرَّع ×٣ إلى سرعته الطبيعية قبل Whisper. الترجمة إلى العربية تتم بعد التفريغ."
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Transcriber, {});
}
//#endregion
export { Home as component };
