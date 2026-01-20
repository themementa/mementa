import { createSupabaseServerClient } from "@/lib/supabase/server";

type SystemQuoteSeed = {
  original_text: string;
  cleaned_text_en: string;
  cleaned_text_zh_tw: string;
  cleaned_text_zh_cn: string;
};

const DEFAULT_SYSTEM_QUOTES: SystemQuoteSeed[] = [
  {
    original_text: "Discipline aligns intent with action.",
    cleaned_text_en: "Discipline aligns intent with action.",
    cleaned_text_zh_tw: "紀律使意圖與行動一致。",
    cleaned_text_zh_cn: "纪律使意图与行动一致。",
  },
  {
    original_text: "Clarity is the foundation of sound judgment.",
    cleaned_text_en: "Clarity is the foundation of sound judgment.",
    cleaned_text_zh_tw: "清晰是健全判斷的基礎。",
    cleaned_text_zh_cn: "清晰是健全判断的基础。",
  },
  {
    original_text: "Patience transforms pressure into progress.",
    cleaned_text_en: "Patience transforms pressure into progress.",
    cleaned_text_zh_tw: "耐心將壓力轉化為進步。",
    cleaned_text_zh_cn: "耐心将压力转化为进步。",
  },
  {
    original_text: "Integrity preserves trust over time.",
    cleaned_text_en: "Integrity preserves trust over time.",
    cleaned_text_zh_tw: "誠信使信任得以長久維持。",
    cleaned_text_zh_cn: "诚信使信任得以长久维持。",
  },
  {
    original_text: "Consistency turns effort into reliability.",
    cleaned_text_en: "Consistency turns effort into reliability.",
    cleaned_text_zh_tw: "一致性使努力成為可靠。",
    cleaned_text_zh_cn: "一致性使努力成为可靠。",
  },
  {
    original_text: "Preparation reduces the cost of uncertainty.",
    cleaned_text_en: "Preparation reduces the cost of uncertainty.",
    cleaned_text_zh_tw: "準備降低不確定性的成本。",
    cleaned_text_zh_cn: "准备降低不确定性的成本。",
  },
  {
    original_text: "A steady mind guides steady outcomes.",
    cleaned_text_en: "A steady mind guides steady outcomes.",
    cleaned_text_zh_tw: "穩定的心引導穩定的結果。",
    cleaned_text_zh_cn: "稳定的心引导稳定的结果。",
  },
  {
    original_text: "Respect for time is respect for life.",
    cleaned_text_en: "Respect for time is respect for life.",
    cleaned_text_zh_tw: "尊重時間就是尊重生命。",
    cleaned_text_zh_cn: "尊重时间就是尊重生命。",
  },
  {
    original_text: "Deliberate practice builds durable confidence.",
    cleaned_text_en: "Deliberate practice builds durable confidence.",
    cleaned_text_zh_tw: "刻意練習建立持久的自信。",
    cleaned_text_zh_cn: "刻意练习建立持久的自信。",
  },
  {
    original_text: "Accountability converts promises into results.",
    cleaned_text_en: "Accountability converts promises into results.",
    cleaned_text_zh_tw: "承擔責任使承諾化為成果。",
    cleaned_text_zh_cn: "承担责任使承诺化为成果。",
  },
  {
    original_text: "Simplicity reveals what truly matters.",
    cleaned_text_en: "Simplicity reveals what truly matters.",
    cleaned_text_zh_tw: "簡單揭示真正重要的事。",
    cleaned_text_zh_cn: "简单揭示真正重要的事。",
  },
  {
    original_text: "Order in the mind creates order in the day.",
    cleaned_text_en: "Order in the mind creates order in the day.",
    cleaned_text_zh_tw: "心中有序，日子自然有序。",
    cleaned_text_zh_cn: "心中有序，日子自然有序。",
  },
  {
    original_text: "Excellence begins with attention to detail.",
    cleaned_text_en: "Excellence begins with attention to detail.",
    cleaned_text_zh_tw: "卓越始於對細節的關注。",
    cleaned_text_zh_cn: "卓越始于对细节的关注。",
  },
  {
    original_text: "Calm responses preserve difficult conversations.",
    cleaned_text_en: "Calm responses preserve difficult conversations.",
    cleaned_text_zh_tw: "冷靜回應能維持艱難對話。",
    cleaned_text_zh_cn: "冷静回应能维持艰难对话。",
  },
  {
    original_text: "A clear standard makes fairness possible.",
    cleaned_text_en: "A clear standard makes fairness possible.",
    cleaned_text_zh_tw: "清楚的標準使公平成為可能。",
    cleaned_text_zh_cn: "清楚的标准使公平成为可能。",
  },
  {
    original_text: "Measured words carry lasting influence.",
    cleaned_text_en: "Measured words carry lasting influence.",
    cleaned_text_zh_tw: "謹慎的言語帶來長久影響。",
    cleaned_text_zh_cn: "谨慎的言语带来长久影响。",
  },
  {
    original_text: "Steadiness outlasts excitement.",
    cleaned_text_en: "Steadiness outlasts excitement.",
    cleaned_text_zh_tw: "穩健勝過短暫的興奮。",
    cleaned_text_zh_cn: "稳健胜过短暂的兴奋。",
  },
  {
    original_text: "Long-term vision steadies short-term choices.",
    cleaned_text_en: "Long-term vision steadies short-term choices.",
    cleaned_text_zh_tw: "長遠視野穩定短期選擇。",
    cleaned_text_zh_cn: "长远视野稳定短期选择。",
  },
  {
    original_text: "Reliability is a quiet form of leadership.",
    cleaned_text_en: "Reliability is a quiet form of leadership.",
    cleaned_text_zh_tw: "可靠是一種沉靜的領導力。",
    cleaned_text_zh_cn: "可靠是一种沉静的领导力。",
  },
  {
    original_text: "Good judgment grows from clear thinking.",
    cleaned_text_en: "Good judgment grows from clear thinking.",
    cleaned_text_zh_tw: "良好判斷源於清晰思考。",
    cleaned_text_zh_cn: "良好判断源于清晰思考。",
  },
  {
    original_text: "Humility keeps learning open.",
    cleaned_text_en: "Humility keeps learning open.",
    cleaned_text_zh_tw: "謙遜使學習持續開放。",
    cleaned_text_zh_cn: "谦逊使学习持续开放。",
  },
  {
    original_text: "Precision is a form of respect.",
    cleaned_text_en: "Precision is a form of respect.",
    cleaned_text_zh_tw: "精準是一種尊重。",
    cleaned_text_zh_cn: "精准是一种尊重。",
  },
  {
    original_text: "A prepared mind welcomes opportunity.",
    cleaned_text_en: "A prepared mind welcomes opportunity.",
    cleaned_text_zh_tw: "準備好的心迎接機會。",
    cleaned_text_zh_cn: "准备好的心迎接机会。",
  },
  {
    original_text: "Dignity is preserved through principled action.",
    cleaned_text_en: "Dignity is preserved through principled action.",
    cleaned_text_zh_tw: "尊嚴在有原則的行動中得以維持。",
    cleaned_text_zh_cn: "尊严在有原则的行动中得以维持。",
  },
  {
    original_text: "Courtesy strengthens professional relationships.",
    cleaned_text_en: "Courtesy strengthens professional relationships.",
    cleaned_text_zh_tw: "禮貌能強化專業關係。",
    cleaned_text_zh_cn: "礼貌能强化专业关系。",
  },
  {
    original_text: "Focus completes what intention begins.",
    cleaned_text_en: "Focus completes what intention begins.",
    cleaned_text_zh_tw: "專注完成意圖所開始的事。",
    cleaned_text_zh_cn: "专注完成意图所开始的事。",
  },
  {
    original_text: "Quality is sustained by consistent care.",
    cleaned_text_en: "Quality is sustained by consistent care.",
    cleaned_text_zh_tw: "品質由持續的用心維繫。",
    cleaned_text_zh_cn: "品质由持续的用心维系。",
  },
  {
    original_text: "Quiet diligence outperforms noisy ambition.",
    cleaned_text_en: "Quiet diligence outperforms noisy ambition.",
    cleaned_text_zh_tw: "安靜的勤勉勝過喧鬧的野心。",
    cleaned_text_zh_cn: "安静的勤勉胜过喧闹的野心。",
  },
  {
    original_text: "Sound decisions require reflection and evidence.",
    cleaned_text_en: "Sound decisions require reflection and evidence.",
    cleaned_text_zh_tw: "穩健的決策需要反思與證據。",
    cleaned_text_zh_cn: "稳健的决策需要反思与证据。",
  },
  {
    original_text: "Commitment is proven in ordinary days.",
    cleaned_text_en: "Commitment is proven in ordinary days.",
    cleaned_text_zh_tw: "承諾在平凡的日子裡得到證明。",
    cleaned_text_zh_cn: "承诺在平凡的日子里得到证明。",
  },
  {
    original_text: "Excellence is built by the next right step.",
    cleaned_text_en: "Excellence is built by the next right step.",
    cleaned_text_zh_tw: "卓越由下一個正確的步驟累積而成。",
    cleaned_text_zh_cn: "卓越由下一个正确的步骤累积而成。",
  },
  {
    original_text: "Orderly work reduces unnecessary conflict.",
    cleaned_text_en: "Orderly work reduces unnecessary conflict.",
    cleaned_text_zh_tw: "有序的工作減少不必要的衝突。",
    cleaned_text_zh_cn: "有序的工作减少不必要的冲突。",
  },
  {
    original_text: "Clear priorities simplify action.",
    cleaned_text_en: "Clear priorities simplify action.",
    cleaned_text_zh_tw: "清楚的優先順序簡化行動。",
    cleaned_text_zh_cn: "清楚的优先顺序简化行动。",
  },
  {
    original_text: "Steady habits protect progress.",
    cleaned_text_en: "Steady habits protect progress.",
    cleaned_text_zh_tw: "穩定的習慣守護進展。",
    cleaned_text_zh_cn: "稳定的习惯守护进展。",
  },
  {
    original_text: "Learning is strengthened by disciplined repetition.",
    cleaned_text_en: "Learning is strengthened by disciplined repetition.",
    cleaned_text_zh_tw: "紀律的反覆使學習更扎實。",
    cleaned_text_zh_cn: "纪律的反复使学习更扎实。",
  },
  {
    original_text: "A strong foundation makes change sustainable.",
    cleaned_text_en: "A strong foundation makes change sustainable.",
    cleaned_text_zh_tw: "堅實的基礎使改變得以持續。",
    cleaned_text_zh_cn: "坚实的基础使改变得以持续。",
  },
  {
    original_text: "Thoughtfulness transforms routine into excellence.",
    cleaned_text_en: "Thoughtfulness transforms routine into excellence.",
    cleaned_text_zh_tw: "用心使日常成為卓越。",
    cleaned_text_zh_cn: "用心使日常成为卓越。",
  },
  {
    original_text: "Self-control protects long-term goals.",
    cleaned_text_en: "Self-control protects long-term goals.",
    cleaned_text_zh_tw: "自制守護長期目標。",
    cleaned_text_zh_cn: "自制守护长期目标。",
  },
  {
    original_text: "A respectful tone preserves dignity.",
    cleaned_text_en: "A respectful tone preserves dignity.",
    cleaned_text_zh_tw: "尊重的語氣維持尊嚴。",
    cleaned_text_zh_cn: "尊重的语气维持尊严。",
  },
  {
    original_text: "Reliability strengthens every team.",
    cleaned_text_en: "Reliability strengthens every team.",
    cleaned_text_zh_tw: "可靠使每個團隊更強。",
    cleaned_text_zh_cn: "可靠使每个团队更强。",
  },
  {
    original_text: "A clear conscience allows deep focus.",
    cleaned_text_en: "A clear conscience allows deep focus.",
    cleaned_text_zh_tw: "清明的良心帶來深度專注。",
    cleaned_text_zh_cn: "清明的良心带来深度专注。",
  },
  {
    original_text: "Standards determine outcomes.",
    cleaned_text_en: "Standards determine outcomes.",
    cleaned_text_zh_tw: "標準決定結果。",
    cleaned_text_zh_cn: "标准决定结果。",
  },
  {
    original_text: "Deliberate pace prevents careless error.",
    cleaned_text_en: "Deliberate pace prevents careless error.",
    cleaned_text_zh_tw: "有意的節奏避免粗心錯誤。",
    cleaned_text_zh_cn: "有意的节奏避免粗心错误。",
  },
  {
    original_text: "Clear agreements prevent confusion.",
    cleaned_text_en: "Clear agreements prevent confusion.",
    cleaned_text_zh_tw: "清楚的約定避免混亂。",
    cleaned_text_zh_cn: "清楚的约定避免混乱。",
  },
  {
    original_text: "Respect for others begins with self-respect.",
    cleaned_text_en: "Respect for others begins with self-respect.",
    cleaned_text_zh_tw: "尊重他人始於自尊。",
    cleaned_text_zh_cn: "尊重他人始于自尊。",
  },
  {
    original_text: "The best plans are supported by disciplined execution.",
    cleaned_text_en: "The best plans are supported by disciplined execution.",
    cleaned_text_zh_tw: "最佳的計畫仰賴有紀律的執行。",
    cleaned_text_zh_cn: "最佳的计划仰赖有纪律的执行。",
  },
  {
    original_text: "Stable processes protect quality.",
    cleaned_text_en: "Stable processes protect quality.",
    cleaned_text_zh_tw: "穩定的流程守護品質。",
    cleaned_text_zh_cn: "稳定的流程守护品质。",
  },
  {
    original_text: "Careful preparation enables calm execution.",
    cleaned_text_en: "Careful preparation enables calm execution.",
    cleaned_text_zh_tw: "周密準備讓執行更從容。",
    cleaned_text_zh_cn: "周密准备让执行更从容。",
  },
  {
    original_text: "Decisive action follows clear principles.",
    cleaned_text_en: "Decisive action follows clear principles.",
    cleaned_text_zh_tw: "果斷的行動遵循清晰的原則。",
    cleaned_text_zh_cn: "果断的行动遵循清晰的原则。",
  },
  {
    original_text: "A well-ordered plan reduces needless effort.",
    cleaned_text_en: "A well-ordered plan reduces needless effort.",
    cleaned_text_zh_tw: "有序的計畫減少不必要的耗費。",
    cleaned_text_zh_cn: "有序的计划减少不必要的耗费。",
  },
  {
    original_text: "Trust is earned through consistent conduct.",
    cleaned_text_en: "Trust is earned through consistent conduct.",
    cleaned_text_zh_tw: "信任在一致的行為中建立。",
    cleaned_text_zh_cn: "信任在一致的行为中建立。",
  },
  {
    original_text: "Preparedness turns pressure into performance.",
    cleaned_text_en: "Preparedness turns pressure into performance.",
    cleaned_text_zh_tw: "準備充分讓壓力化為表現。",
    cleaned_text_zh_cn: "准备充分让压力化为表现。",
  },
  {
    original_text: "Steady execution makes strategy real.",
    cleaned_text_en: "Steady execution makes strategy real.",
    cleaned_text_zh_tw: "穩定的執行使策略成真。",
    cleaned_text_zh_cn: "稳定的执行使策略成真。",
  },
  {
    original_text: "Order and clarity reduce wasted effort.",
    cleaned_text_en: "Order and clarity reduce wasted effort.",
    cleaned_text_zh_tw: "秩序與清晰減少浪費的努力。",
    cleaned_text_zh_cn: "秩序与清晰减少浪费的努力。",
  },
  {
    original_text: "Sound standards produce sound results.",
    cleaned_text_en: "Sound standards produce sound results.",
    cleaned_text_zh_tw: "良好的標準帶來良好的結果。",
    cleaned_text_zh_cn: "良好的标准带来良好的结果。",
  },
];

export async function seedSystemQuotes(): Promise<void> {
  const supabase = createSupabaseServerClient();

  const { count, error: countError } = await supabase
    .from("system_quotes")
    .select("id", { count: "exact", head: true });

  if (countError) {
    console.error("[seedSystemQuotes] Count failed:", countError);
    throw new Error(countError.message);
  }

  const existingCount = count ?? 0;
  console.log("SYSTEM QUOTES COUNT", existingCount);

  if (existingCount > 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("system_quotes")
    .insert(
      DEFAULT_SYSTEM_QUOTES.map((quote) => ({
        original_text: quote.original_text,
        cleaned_text_en: quote.cleaned_text_en,
        cleaned_text_zh_tw: quote.cleaned_text_zh_tw,
        cleaned_text_zh_cn: quote.cleaned_text_zh_cn,
      }))
    );

  if (insertError) {
    console.error("[seedSystemQuotes] Insert failed:", insertError);
    throw new Error(insertError.message);
  }
}

