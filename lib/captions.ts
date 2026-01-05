/**
 * 根據金句文字產生幾句 IG 風格 caption（非 AI，純樣板＋簡單字串處理）
 */
export function generateCaptionsFromQuote(quote: string): string[] {
  const base = quote?.trim() || "";
  const short =
    base.length > 120 ? base.slice(0, 117).trimEnd() + "…" : base;

  const captions: string[] = [];

  captions.push(`「${short}」\n\n記得把這句話帶進今天的每一個選擇。`);

  captions.push(
    `今天想起這句話：\n「${short}」\n\n如果你也有共鳴，試著用行動回應它。`
  );

  captions.push(
    `不是每一天都要拼命前進，有時候只是把這句話放在心裡：「${short}」\n\n#mementa #每日一念`
  );

  return captions;
}


