export const LANGUAGES = [
  { code: "", label: "كشف تلقائي" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "الإنجليزية" },
  { code: "fr", label: "الفرنسية" },
  { code: "es", label: "الإسبانية" },
  { code: "de", label: "الألمانية" },
  { code: "tr", label: "التركية" },
  { code: "fa", label: "الفارسية" },
  { code: "ur", label: "الأردية" },
  { code: "he", label: "العبرية" },
  { code: "ru", label: "الروسية" },
  { code: "uk", label: "الأوكرانية" },
  { code: "zh", label: "الصينية" },
  { code: "ja", label: "اليابانية" },
  { code: "ko", label: "الكورية" },
  { code: "hi", label: "الهندية" },
  { code: "bn", label: "البنغالية" },
  { code: "ta", label: "التاميلية" },
  { code: "pt", label: "البرتغالية" },
  { code: "it", label: "الإيطالية" },
  { code: "nl", label: "الهولندية" },
  { code: "pl", label: "البولندية" },
  { code: "id", label: "الإندونيسية" },
  { code: "ms", label: "الملايوية" },
  { code: "sw", label: "السواحيلية" },
  { code: "sv", label: "السويدية" },
  { code: "da", label: "الدنماركية" },
  { code: "no", label: "النرويجية" },
  { code: "fi", label: "الفنلندية" },
  { code: "el", label: "اليونانية" },
  { code: "ro", label: "الرومانية" },
  { code: "cs", label: "التشيكية" },
  { code: "hu", label: "المجرية" },
  { code: "th", label: "التايلاندية" },
  { code: "vi", label: "الفيتنامية" },
  { code: "ku", label: "الكردية" },
] as const;

const NAMES: Record<string, string> = {
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
  korean: "الكورية",
};

export function languageLabel(code: string | undefined): string {
  if (!code) return "غير محددة";
  const known = LANGUAGES.find((item) => item.code === code);
  if (known) return known.label;
  return NAMES[code.toLowerCase()] ?? code;
}
