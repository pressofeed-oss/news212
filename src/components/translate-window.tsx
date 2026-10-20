import { useEffect, useId, useRef, useState } from "react";
import { Check, Copy, LoaderCircle, Square, X } from "lucide-react";
import {
  TRANSLATE_MODELS,
  normalizeApiKey,
  translateToArabic,
  type TranslateTier,
} from "@/lib/groq-transcribe";

type TranslateWindowProps = {
  open: boolean;
  onClose: () => void;
  apiKey: string;
  tier: TranslateTier;
  onTier: (tier: TranslateTier) => void;
  seed: string;
  locked: boolean;
  onBusy: (busy: boolean) => void;
};

export function TranslateWindow({ open, onClose, apiKey, tier, onTier, seed, locked, onBusy }: TranslateWindowProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const abortRef = useRef<AbortController | null>(null);
  const [source, setSource] = useState("");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    onBusy(busy);
  }, [busy, onBusy]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSource((current) => current || seed);
    setError("");
  }, [open, seed]);

  function close() {
    if (busy) return;
    onClose();
  }

  function stop() {
    abortRef.current?.abort();
  }

  async function run() {
    if (busy || locked) return;
    const key = normalizeApiKey(apiKey);
    if (!key) {
      setError("أضف مفتاح Groq في الصفحة أولاً.");
      return;
    }
    const body = source.trim();
    if (!body) {
      setError("الصق النص الذي تريد ترجمته.");
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setError("");
    setCopied(false);
    setStatus("جارٍ الترجمة الكاملة…");
    try {
      const result = await translateToArabic({
        text: body,
        apiKey: key,
        tier,
        signal: controller.signal,
        onStatus: setStatus,
      });
      setOutput(result);
      setStatus("");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("");
        return;
      }
      setStatus("");
      setError(err instanceof Error ? err.message : "تعذّرت الترجمة.");
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("تعذّر النسخ. حدّد النص وانسخه يدوياً.");
    }
  }

  const model = TRANSLATE_MODELS[tier];

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={close}
      onCancel={(event) => {
        if (busy) event.preventDefault();
      }}
      className="m-auto max-h-[calc(100dvh-1.5rem)] w-[min(42rem,calc(100%-1.5rem))] rounded-card border border-line bg-sheet p-0 text-ink shadow-sheet backdrop:bg-ink/40"
    >
      <div className="flex max-h-[calc(100dvh-1.5rem)] flex-col">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <h2 id={titleId} className="font-display text-3xl leading-none text-ink">
              ترجمة النص الطويل
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              الترجمة تنقل كل الفقرات. لا يُلخَّص الأصل، ولا يُضاف معنى من خارجه. الخطأ اللغوي الظاهر يُصحَّح فقط.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            disabled={busy}
            aria-label="إغلاق"
            className="grid size-11 shrink-0 place-items-center rounded-xl text-muted disabled:opacity-40"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-auto px-5 py-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {(Object.keys(TRANSLATE_MODELS) as TranslateTier[]).map((id) => {
              const item = TRANSLATE_MODELS[id];
              const selected = tier === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected}
                  disabled={busy}
                  onClick={() => onTier(id)}
                  className={
                    "rounded-xl border px-4 py-3 text-start " +
                    (selected ? "border-copper bg-copper-soft" : "border-line bg-paper")
                  }
                >
                  <span className="block text-base font-semibold text-ink">{item.label}</span>
                  <span className="mt-1 block text-sm text-copper" dir="ltr">
                    {item.detail}
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">{item.note}</span>
                </button>
              );
            })}
          </div>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-ink">النص الأصلي</span>
            <textarea
              value={source}
              onChange={(event) => setSource(event.target.value)}
              dir="auto"
              rows={8}
              disabled={busy}
              placeholder="الصق النص الطويل هنا"
              className="min-h-40 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-base leading-relaxed text-ink"
            />
          </label>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void run()}
              disabled={busy || locked || !source.trim()}
              className="h-12 rounded-xl bg-copper text-base font-semibold text-sheet enabled:hover:bg-copper-deep disabled:bg-line disabled:text-muted"
            >
              {busy ? "جارٍ الترجمة" : `ترجمة كاملة · ${model.label}`}
            </button>
            {busy ? (
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm text-ink">
                  <LoaderCircle className="size-4 animate-spin text-copper" />
                  {status || "جارٍ الترجمة…"}
                </p>
                <button
                  type="button"
                  onClick={stop}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium"
                >
                  <Square className="size-3.5" />
                  إيقاف
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted">النموذج الحالي: {model.detail}. النص يُرسل إلى Groq ولا يُحفظ هنا.</p>
            )}
            {error ? (
              <p role="alert" className="rounded-xl bg-copper-soft px-4 py-3 text-sm leading-relaxed text-danger">
                {error}
              </p>
            ) : null}
          </div>

          {output ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">الترجمة</span>
                <button
                  type="button"
                  onClick={() => void copyOutput()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium"
                >
                  {copied ? <Check className="size-4 text-ok" /> : <Copy className="size-4" />}
                  {copied ? "نُسخ" : "نسخ"}
                </button>
              </div>
              <textarea
                value={output}
                onChange={(event) => setOutput(event.target.value)}
                dir="auto"
                rows={8}
                className="min-h-40 w-full resize-y rounded-xl border border-line bg-paper px-4 py-3 text-base leading-relaxed text-ink"
              />
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
