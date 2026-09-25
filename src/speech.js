// SpeechSynthesisVoice has no gender field. Match known female Mandarin voice
// names rather than selecting an arbitrary (possibly male or Cantonese) voice.
export const PRONUNCIATION_RATE = 0.5;
export function femaleMandarinVoice(voices) {
  const femaleName = /ting[ -]?ting|mei[ -]?jia|li[ -]?li|xiaoxiao|xiaoyi|xiaohan|xiaomo|xiaoxuan|xiaorui|xiaoshuang|xiaoyou|huihui|yaoyao|hanhan|yating|female|婷婷|美佳|莉莉|晓晓|晓伊|慧慧|瑶瑶/i;
  const candidates = voices.filter(v => /^(zh[-_](CN|TW|SG)(?:[-_]|$)|cmn(?:[-_]|$))/i.test(v.lang) && (femaleName.test(v.name) || /Google 普通话/.test(v.name)));
  // Prefer a mainland Mandarin voice when several female voices are installed.
  return candidates.find(v => /^zh[-_]CN/i.test(v.lang)) || candidates[0] || null;
}
