-- Migration: Create system_quotes table and seed initial quotes
--
-- Usage:
-- 1. Open Supabase SQL Editor
-- 2. Paste and run this file

CREATE TABLE IF NOT EXISTS system_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text TEXT NOT NULL,
  cleaned_text_en TEXT,
  cleaned_text_zh_tw TEXT,
  cleaned_text_zh_cn TEXT,
  cleaned_text_zh_hans TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE system_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access to system_quotes"
  ON system_quotes
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated can read system_quotes"
  ON system_quotes
  FOR SELECT
  USING (auth.role() = 'authenticated');

INSERT INTO system_quotes (original_text, cleaned_text_en, cleaned_text_zh_tw, cleaned_text_zh_cn)
VALUES
  ('Discipline is the bridge between intention and achievement.', 'Discipline is the bridge between intention and achievement.', '紀律是意圖與成就之間的橋樑。', '纪律是意图与成就之间的桥梁。'),
  ('Clarity of purpose gives strength to every decision.', 'Clarity of purpose gives strength to every decision.', '目的清晰使每個決定更有力量。', '目的清晰使每个决定更有力量。'),
  ('Patience is a quiet form of courage.', 'Patience is a quiet form of courage.', '耐心是一種安靜的勇氣。', '耐心是一种安静的勇气。'),
  ('Integrity is maintained in small choices made consistently.', 'Integrity is maintained in small choices made consistently.', '誠信在持續的細小選擇中得以維持。', '诚信在持续的细小选择中得以维持。'),
  ('Progress is measured by the quality of effort, not the speed of results.', 'Progress is measured by the quality of effort, not the speed of results.', '進步以努力的品質衡量，而非成果的速度。', '进步以努力的品质衡量，而非成果的速度。'),
  ('A steady mind creates a steady path.', 'A steady mind creates a steady path.', '平穩的心造就平穩的道路。', '平稳的心造就平稳的道路。'),
  ('Respect for time is respect for life.', 'Respect for time is respect for life.', '尊重時間就是尊重生命。', '尊重时间就是尊重生命。'),
  ('Thoughtful preparation prevents avoidable regret.', 'Thoughtful preparation prevents avoidable regret.', '深思的準備能避免可避免的遺憾。', '深思的准备能避免可避免的遗憾。'),
  ('True confidence is built through honest practice.', 'True confidence is built through honest practice.', '真正的自信來自誠實的練習。', '真正的自信来自诚实的练习。'),
  ('Responsibility enlarges the scope of freedom.', 'Responsibility enlarges the scope of freedom.', '責任拓展自由的幅度。', '责任拓展自由的幅度。'),
  ('Simplicity reveals what is essential.', 'Simplicity reveals what is essential.', '簡單揭示真正重要的事物。', '简单揭示真正重要的事物。'),
  ('A calm response is a mark of mastery.', 'A calm response is a mark of mastery.', '冷靜的回應是成熟的標誌。', '冷静的回应是成熟的标志。'),
  ('Consistency turns effort into reliability.', 'Consistency turns effort into reliability.', '一致性使努力成為可靠。', '一致性使努力成为可靠。'),
  ('Humility keeps learning open.', 'Humility keeps learning open.', '謙遜讓學習持續開放。', '谦逊让学习持续开放。'),
  ('Quality is never an accident; it is a habit.', 'Quality is never an accident; it is a habit.', '品質絕非偶然，而是一種習慣。', '品质绝非偶然，而是一种习惯。'),
  ('Honest feedback is a gift to growth.', 'Honest feedback is a gift to growth.', '誠實的回饋是成長的禮物。', '诚实的回馈是成长的礼物。'),
  ('Order in the mind brings order to the day.', 'Order in the mind brings order to the day.', '心中有序，日子自然有序。', '心中有序，日子自然有序。'),
  ('Excellence begins with attention to detail.', 'Excellence begins with attention to detail.', '卓越始於對細節的關注。', '卓越始于对细节的关注。'),
  ('A deliberate pause prevents careless error.', 'A deliberate pause prevents careless error.', '有意識的停頓能避免粗心的錯誤。', '有意识的停顿能避免粗心的错误。'),
  ('Focus is the quiet power that completes work.', 'Focus is the quiet power that completes work.', '專注是完成工作的沉靜力量。', '专注是完成工作的沉静力量。'),
  ('A prepared mind welcomes opportunity.', 'A prepared mind welcomes opportunity.', '準備好的心迎接機會。', '准备好的心迎接机会。'),
  ('Dignity is preserved through principled action.', 'Dignity is preserved through principled action.', '尊嚴在有原則的行動中得以維持。', '尊严在有原则的行动中得以维持。'),
  ('Courtesy strengthens every professional relationship.', 'Courtesy strengthens every professional relationship.', '禮貌能強化每一段專業關係。', '礼貌能强化每一段专业关系。'),
  ('Long-term vision steadies short-term choices.', 'Long-term vision steadies short-term choices.', '長遠視野穩定短期選擇。', '长远视野稳定短期选择。'),
  ('Measured words carry lasting influence.', 'Measured words carry lasting influence.', '謹慎的言語具有長久的影響力。', '谨慎的言语具有长久的影响力。'),
  ('Clear standards make fair judgments possible.', 'Clear standards make fair judgments possible.', '清楚的標準使公正的判斷成為可能。', '清楚的标准使公正的判断成为可能。'),
  ('When priorities are clear, action becomes simple.', 'When priorities are clear, action becomes simple.', '優先順序清楚時，行動就變得簡單。', '优先顺序清楚时，行动就变得简单。'),
  ('Steadiness outlasts excitement.', 'Steadiness outlasts excitement.', '穩健勝過短暫的興奮。', '稳健胜过短暂的兴奋。'),
  ('A reliable system protects valuable energy.', 'A reliable system protects valuable energy.', '可靠的系統保護珍貴的精力。', '可靠的系统保护珍贵的精力。'),
  ('Wisdom is shown in what we refuse as well as what we choose.', 'Wisdom is shown in what we refuse as well as what we choose.', '智慧體現在拒絕與選擇之中。', '智慧体现在拒绝与选择之中。'),
  ('Precision is a form of respect.', 'Precision is a form of respect.', '精準是一種尊重。', '精准是一种尊重。'),
  ('Accountability turns promises into outcomes.', 'Accountability turns promises into outcomes.', '承擔責任使承諾成為成果。', '承担责任使承诺成为成果。'),
  ('Stable habits protect us during unstable seasons.', 'Stable habits protect us during unstable seasons.', '穩定的習慣在不穩定的時期保護我們。', '稳定的习惯在不稳定的时期保护我们。'),
  ('Learning is strengthened by disciplined repetition.', 'Learning is strengthened by disciplined repetition.', '紀律的反覆使學習更扎實。', '纪律的反复使学习更扎实。'),
  ('A strong foundation makes change sustainable.', 'A strong foundation makes change sustainable.', '堅實的基礎使改變得以持續。', '坚实的基础使改变得以持续。'),
  ('Good judgment is the result of clear thinking.', 'Good judgment is the result of clear thinking.', '良好的判斷源於清晰的思考。', '良好的判断源于清晰的思考。'),
  ('Thoughtfulness transforms routine into excellence.', 'Thoughtfulness transforms routine into excellence.', '用心使日常成為卓越。', '用心使日常成为卓越。'),
  ('Self-control is the guardian of long-term goals.', 'Self-control is the guardian of long-term goals.', '自制是長期目標的守護者。', '自制是长期目标的守护者。'),
  ('Sound decisions require both data and reflection.', 'Sound decisions require both data and reflection.', '穩健的決策需要數據與反思。', '稳健的决策需要数据与反思。'),
  ('A respectful tone preserves difficult conversations.', 'A respectful tone preserves difficult conversations.', '尊重的語氣能維持困難對話。', '尊重的语气能维持困难对话。'),
  ('Commitment is proven in ordinary days.', 'Commitment is proven in ordinary days.', '承諾在平凡的日子裡得到證明。', '承诺在平凡的日子里得到证明。'),
  ('Reliability is a quiet form of leadership.', 'Reliability is a quiet form of leadership.', '可靠是一種沉靜的領導力。', '可靠是一种沉静的领导力。'),
  ('A clear conscience allows deep focus.', 'A clear conscience allows deep focus.', '清明的良心帶來深度專注。', '清明的良心带来深度专注。'),
  ('Excellence is built by choosing the next right step.', 'Excellence is built by choosing the next right step.', '卓越由下一個正確的步驟累積而成。', '卓越由下一个正确的步骤累积而成。'),
  ('Orderly work reduces unnecessary conflict.', 'Orderly work reduces unnecessary conflict.', '有序的工作減少不必要的衝突。', '有序的工作减少不必要的冲突。'),
  ('Consistent evaluation leads to consistent improvement.', 'Consistent evaluation leads to consistent improvement.', '持續的評估帶來持續的改進。', '持续的评估带来持续的改进。'),
  ('Respect for others begins with self-respect.', 'Respect for others begins with self-respect.', '尊重他人始於自尊。', '尊重他人始于自尊。'),
  ('Every outcome reflects the standards we tolerate.', 'Every outcome reflects the standards we tolerate.', '每個結果都反映我們容許的標準。', '每个结果都反映我们容许的标准。'),
  ('Quiet diligence outperforms noisy ambition.', 'Quiet diligence outperforms noisy ambition.', '安靜的勤勉勝過喧鬧的野心。', '安静的勤勉胜过喧闹的野心。'),
  ('The best plans are supported by disciplined execution.', 'The best plans are supported by disciplined execution.', '最佳的計畫仰賴有紀律的執行。', '最佳的计划仰赖有纪律的执行。');

