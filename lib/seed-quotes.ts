import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SYSTEM_USER_ID } from "@/lib/constants";
import type { Quote } from "@/lib/quotes";

/**
 * Default seed quotes for new installations
 * These are the same quotes used in the original account
 */
const SEED_QUOTES = [
  { original_text: 'Stillness reveals what noise conceals.', cleaned_text_en: 'Stillness reveals what noise conceals.', cleaned_text_zh_tw: '安靜顯現出喧囂所掩蓋的。', cleaned_text_zh_cn: '安静显现出喧嚣所掩盖的。' },
  { original_text: 'Emotions are visitors that come and go.', cleaned_text_en: 'Emotions are visitors that come and go.', cleaned_text_zh_tw: '情緒是來來去去的訪客。', cleaned_text_zh_cn: '情绪是来来去去的访客。' },
  { original_text: 'The space between thoughts is where peace lives.', cleaned_text_en: 'The space between thoughts is where peace lives.', cleaned_text_zh_tw: '思緒之間的空白，是平靜所在。', cleaned_text_zh_cn: '思绪之间的空白，是平静所在。' },
  { original_text: 'Acceptance is not resignation; it is clarity.', cleaned_text_en: 'Acceptance is not resignation; it is clarity.', cleaned_text_zh_tw: '接納不是放棄，而是清晰。', cleaned_text_zh_cn: '接纳不是放弃，而是清晰。' },
  { original_text: 'Inner calm is not the absence of storms, but the ability to remain steady within them.', cleaned_text_en: 'Inner calm is not the absence of storms, but the ability to remain steady within them.', cleaned_text_zh_tw: '內在平靜不是沒有風暴，而是在風暴中保持穩定。', cleaned_text_zh_cn: '内在平静不是没有风暴，而是在风暴中保持稳定。' },
  { original_text: 'Feelings pass through us like clouds through the sky.', cleaned_text_en: 'Feelings pass through us like clouds through the sky.', cleaned_text_zh_tw: '感受如雲朵般穿過我們，如同穿過天空。', cleaned_text_zh_cn: '感受如云朵般穿过我们，如同穿过天空。' },
  { original_text: 'The present moment holds everything we need.', cleaned_text_en: 'The present moment holds everything we need.', cleaned_text_zh_tw: '當下這一刻包含了我們所需的一切。', cleaned_text_zh_cn: '当下这一刻包含了我们所需的一切。' },
  { original_text: 'Peace comes from understanding, not from changing what is.', cleaned_text_en: 'Peace comes from understanding, not from changing what is.', cleaned_text_zh_tw: '平靜來自理解，而非改變現狀。', cleaned_text_zh_cn: '平静来自理解，而非改变现状。' },
  { original_text: 'We are not our thoughts; we are the awareness that observes them.', cleaned_text_en: 'We are not our thoughts; we are the awareness that observes them.', cleaned_text_zh_tw: '我們不是我們的念頭，而是觀察念頭的覺知。', cleaned_text_zh_cn: '我们不是我们的念头，而是观察念头的觉知。' },
  { original_text: 'Stability grows from roots that reach deep into acceptance.', cleaned_text_en: 'Stability grows from roots that reach deep into acceptance.', cleaned_text_zh_tw: '穩定來自深深扎根於接納的根。', cleaned_text_zh_cn: '稳定来自深深扎根于接纳的根。' },
  { original_text: 'The heart knows its own rhythm when the mind is quiet.', cleaned_text_en: 'The heart knows its own rhythm when the mind is quiet.', cleaned_text_zh_tw: '當心靈安靜時，心知道自己的節奏。', cleaned_text_zh_cn: '当心灵安静时，心知道自己的节奏。' },
  { original_text: 'Resistance creates tension; allowing creates space.', cleaned_text_en: 'Resistance creates tension; allowing creates space.', cleaned_text_zh_tw: '抗拒產生緊張，允許創造空間。', cleaned_text_zh_cn: '抗拒产生紧张，允许创造空间。' },
  { original_text: 'Emotional weather changes, but the sky remains the same.', cleaned_text_en: 'Emotional weather changes, but the sky remains the same.', cleaned_text_zh_tw: '情緒的天氣會變化，但天空依然如故。', cleaned_text_zh_cn: '情绪的天气会变化，但天空依然如故。' },
  { original_text: 'Stillness is not emptiness; it is fullness of presence.', cleaned_text_en: 'Stillness is not emptiness; it is fullness of presence.', cleaned_text_zh_tw: '靜止不是空無，而是存在的豐盈。', cleaned_text_zh_cn: '静止不是空无，而是存在的丰盈。' },
  { original_text: 'The depth of calm is found in the simplicity of being.', cleaned_text_en: 'The depth of calm is found in the simplicity of being.', cleaned_text_zh_tw: '平靜的深度存在於存在的簡單中。', cleaned_text_zh_cn: '平静的深度存在于存在的简单中。' },
  { original_text: 'Feelings are information, not instructions.', cleaned_text_en: 'Feelings are information, not instructions.', cleaned_text_zh_tw: '感受是資訊，不是指令。', cleaned_text_zh_cn: '感受是信息，不是指令。' },
  { original_text: 'Inner stability is built moment by moment, breath by breath.', cleaned_text_en: 'Inner stability is built moment by moment, breath by breath.', cleaned_text_zh_tw: '內在穩定是一刻一刻、一呼一吸建立起來的。', cleaned_text_zh_cn: '内在稳定是一刻一刻、一呼一吸建立起来的。' },
  { original_text: 'The calm center remains untouched by the outer chaos.', cleaned_text_en: 'The calm center remains untouched by the outer chaos.', cleaned_text_zh_tw: '平靜的中心不受外在混亂影響。', cleaned_text_zh_cn: '平静的中心不受外在混乱影响。' },
  { original_text: 'Understanding dissolves judgment; presence dissolves anxiety.', cleaned_text_en: 'Understanding dissolves judgment; presence dissolves anxiety.', cleaned_text_zh_tw: '理解消融判斷，臨在消融焦慮。', cleaned_text_zh_cn: '理解消融判断，临在消融焦虑。' },
  { original_text: 'Peace is not a destination; it is the quality of the journey itself.', cleaned_text_en: 'Peace is not a destination; it is the quality of the journey itself.', cleaned_text_zh_tw: '平靜不是目的地，而是旅程本身的品質。', cleaned_text_zh_cn: '平静不是目的地，而是旅程本身的品质。' },
  { original_text: 'Self-compassion is the foundation of inner strength.', cleaned_text_en: 'Self-compassion is the foundation of inner strength.', cleaned_text_zh_tw: '自我慈悲是內在力量的基礎。', cleaned_text_zh_cn: '自我慈悲是内在力量的基础。' },
  { original_text: 'What we resist persists; what we accept transforms.', cleaned_text_en: 'What we resist persists; what we accept transforms.', cleaned_text_zh_tw: '我們抗拒的會持續，我們接納的會轉化。', cleaned_text_zh_cn: '我们抗拒的会持续，我们接纳的会转化。' },
  { original_text: 'The present moment is the only place where life happens.', cleaned_text_en: 'The present moment is the only place where life happens.', cleaned_text_zh_tw: '當下是生命唯一發生的地方。', cleaned_text_zh_cn: '当下是生命唯一发生的地方。' },
  { original_text: 'Vulnerability is the birthplace of authentic connection.', cleaned_text_en: 'Vulnerability is the birthplace of authentic connection.', cleaned_text_zh_tw: '脆弱是真實連結的誕生地。', cleaned_text_zh_cn: '脆弱是真实连结的诞生地。' },
  { original_text: 'Rest is not a reward; it is a requirement for wholeness.', cleaned_text_en: 'Rest is not a reward; it is a requirement for wholeness.', cleaned_text_zh_tw: '休息不是獎勵，而是完整的必需。', cleaned_text_zh_cn: '休息不是奖励，而是完整的必需。' },
  { original_text: 'The mind settles when we stop trying to control it.', cleaned_text_en: 'The mind settles when we stop trying to control it.', cleaned_text_zh_tw: '當我們停止試圖控制時，心靈會安定下來。', cleaned_text_zh_cn: '当我们停止试图控制时，心灵会安定下来。' },
  { original_text: 'Compassion for ourselves opens the door to compassion for others.', cleaned_text_en: 'Compassion for ourselves opens the door to compassion for others.', cleaned_text_zh_tw: '對自己的慈悲開啟了對他人慈悲的大門。', cleaned_text_zh_cn: '对自己的慈悲开启了对他人慈悲的大门。' },
  { original_text: 'In stillness, we find what we have been searching for in motion.', cleaned_text_en: 'In stillness, we find what we have been searching for in motion.', cleaned_text_zh_tw: '在靜止中，我們找到在行動中一直尋找的。', cleaned_text_zh_cn: '在静止中，我们找到在行动中一直寻找的。' },
  { original_text: 'The body remembers what the mind forgets.', cleaned_text_en: 'The body remembers what the mind forgets.', cleaned_text_zh_tw: '身體記住心靈遺忘的。', cleaned_text_zh_cn: '身体记住心灵遗忘的。' },
  { original_text: 'Gentleness with ourselves creates space for growth.', cleaned_text_en: 'Gentleness with ourselves creates space for growth.', cleaned_text_zh_tw: '對自己的溫柔為成長創造空間。', cleaned_text_zh_cn: '对自己的温柔为成长创造空间。' },
  { original_text: 'Every emotion has a message; every feeling has a purpose.', cleaned_text_en: 'Every emotion has a message; every feeling has a purpose.', cleaned_text_zh_tw: '每種情緒都有訊息，每種感受都有目的。', cleaned_text_zh_cn: '每种情绪都有信息，每种感受都有目的。' },
  { original_text: 'The breath is the bridge between body and mind.', cleaned_text_en: 'The breath is the bridge between body and mind.', cleaned_text_zh_tw: '呼吸是身體與心靈之間的橋樑。', cleaned_text_zh_cn: '呼吸是身体与心灵之间的桥梁。' },
  { original_text: 'Acceptance does not mean approval; it means acknowledgment.', cleaned_text_en: 'Acceptance does not mean approval; it means acknowledgment.', cleaned_text_zh_tw: '接納不意味著認同，而是承認。', cleaned_text_zh_cn: '接纳不意味着认同，而是承认。' },
  { original_text: 'The quieter we become, the more we can hear.', cleaned_text_en: 'The quieter we become, the more we can hear.', cleaned_text_zh_tw: '我們越安靜，聽到的越多。', cleaned_text_zh_cn: '我们越安静，听到的越多。' },
  { original_text: 'Self-acceptance is the first step toward transformation.', cleaned_text_en: 'Self-acceptance is the first step toward transformation.', cleaned_text_zh_tw: '自我接納是轉化的第一步。', cleaned_text_zh_cn: '自我接纳是转化的第一步。' },
  { original_text: 'The present moment is complete in itself.', cleaned_text_en: 'The present moment is complete in itself.', cleaned_text_zh_tw: '當下這一刻本身是完整的。', cleaned_text_zh_cn: '当下这一刻本身是完整的。' },
  { original_text: 'We do not need to fix ourselves; we need to understand ourselves.', cleaned_text_en: 'We do not need to fix ourselves; we need to understand ourselves.', cleaned_text_zh_tw: '我們不需要修復自己，我們需要理解自己。', cleaned_text_zh_cn: '我们不需要修复自己，我们需要理解自己。' },
  { original_text: 'Patience with ourselves is patience with life.', cleaned_text_en: 'Patience with ourselves is patience with life.', cleaned_text_zh_tw: '對自己的耐心就是對生命的耐心。', cleaned_text_zh_cn: '对自己的耐心就是对生命的耐心。' },
  { original_text: 'The mind is like water; when still, it reflects clearly.', cleaned_text_en: 'The mind is like water; when still, it reflects clearly.', cleaned_text_zh_tw: '心靈如水，靜止時清晰映照。', cleaned_text_zh_cn: '心灵如水，静止时清晰映照。' },
  { original_text: 'Emotional storms pass; the witness remains.', cleaned_text_en: 'Emotional storms pass; the witness remains.', cleaned_text_zh_tw: '情緒風暴會過去，見證者依然存在。', cleaned_text_zh_cn: '情绪风暴会过去，见证者依然存在。' },
  { original_text: 'Self-kindness is not weakness; it is wisdom.', cleaned_text_en: 'Self-kindness is not weakness; it is wisdom.', cleaned_text_zh_tw: '對自己仁慈不是軟弱，而是智慧。', cleaned_text_zh_cn: '对自己仁慈不是软弱，而是智慧。' },
  { original_text: 'The depth of our peace matches the depth of our acceptance.', cleaned_text_en: 'The depth of our peace matches the depth of our acceptance.', cleaned_text_zh_tw: '我們平靜的深度與接納的深度相符。', cleaned_text_zh_cn: '我们平静的深度与接纳的深度相符。' },
  { original_text: 'Feelings are temporary; awareness is constant.', cleaned_text_en: 'Feelings are temporary; awareness is constant.', cleaned_text_zh_tw: '感受是暫時的，覺知是恆常的。', cleaned_text_zh_cn: '感受是暂时的，觉知是恒常的。' },
  { original_text: 'Rest is not laziness; it is restoration.', cleaned_text_en: 'Rest is not laziness; it is restoration.', cleaned_text_zh_tw: '休息不是懶惰，而是恢復。', cleaned_text_zh_cn: '休息不是懒惰，而是恢复。' },
  { original_text: 'The present moment is where we meet ourselves.', cleaned_text_en: 'The present moment is where we meet ourselves.', cleaned_text_zh_tw: '當下是我們與自己相遇的地方。', cleaned_text_zh_cn: '当下是我们与自己相遇的地方。' },
  { original_text: 'Compassion begins with the person in the mirror.', cleaned_text_en: 'Compassion begins with the person in the mirror.', cleaned_text_zh_tw: '慈悲從鏡中的人開始。', cleaned_text_zh_cn: '慈悲从镜中的人开始。' },
  { original_text: 'Stillness is the language of the soul.', cleaned_text_en: 'Stillness is the language of the soul.', cleaned_text_zh_tw: '靜止是靈魂的語言。', cleaned_text_zh_cn: '静止是灵魂的语言。' },
  { original_text: 'We cannot force peace; we can only allow it.', cleaned_text_en: 'We cannot force peace; we can only allow it.', cleaned_text_zh_tw: '我們無法強迫平靜，只能允許它。', cleaned_text_zh_cn: '我们无法强迫平静，只能允许它。' },
  { original_text: 'The heart speaks in whispers; we must be quiet to hear it.', cleaned_text_en: 'The heart speaks in whispers; we must be quiet to hear it.', cleaned_text_zh_tw: '心以低語說話，我們必須安靜才能聽見。', cleaned_text_zh_cn: '心以低语说话，我们必须安静才能听见。' },
  { original_text: 'Self-acceptance is not self-indulgence; it is self-respect.', cleaned_text_en: 'Self-acceptance is not self-indulgence; it is self-respect.', cleaned_text_zh_tw: '自我接納不是自我放縱，而是自我尊重。', cleaned_text_zh_cn: '自我接纳不是自我放纵，而是自我尊重。' },
  { original_text: 'The space between stimulus and response is where freedom lives.', cleaned_text_en: 'The space between stimulus and response is where freedom lives.', cleaned_text_zh_tw: '刺激與回應之間的空間，是自由所在。', cleaned_text_zh_cn: '刺激与回应之间的空间，是自由所在。' },
  { original_text: 'Inner peace is not the absence of conflict; it is the presence of understanding.', cleaned_text_en: 'Inner peace is not the absence of conflict; it is the presence of understanding.', cleaned_text_zh_tw: '內在平靜不是沒有衝突，而是有理解存在。', cleaned_text_zh_cn: '内在平静不是没有冲突，而是有理解存在。' },
  { original_text: 'We are enough, not because of what we do, but because of who we are.', cleaned_text_en: 'We are enough, not because of what we do, but because of who we are.', cleaned_text_zh_tw: '我們已經足夠，不是因為我們做了什麼，而是因為我們是誰。', cleaned_text_zh_cn: '我们已经足够，不是因为我们做了什么，而是因为我们是谁。' },
  { original_text: 'The present moment is the only time we have any power.', cleaned_text_en: 'The present moment is the only time we have any power.', cleaned_text_zh_tw: '當下是我們唯一有力量的時候。', cleaned_text_zh_cn: '当下是我们唯一有力量的时候。' },
  { original_text: 'Self-compassion is the antidote to self-criticism.', cleaned_text_en: 'Self-compassion is the antidote to self-criticism.', cleaned_text_zh_tw: '自我慈悲是自我批評的解藥。', cleaned_text_zh_cn: '自我慈悲是自我批评的解药。' },
  { original_text: 'The mind that is still knows what the busy mind cannot see.', cleaned_text_en: 'The mind that is still knows what the busy mind cannot see.', cleaned_text_zh_tw: '靜止的心靈知道忙碌心靈看不見的。', cleaned_text_zh_cn: '静止的心灵知道忙碌心灵看不见的。' },
  { original_text: 'Acceptance is the first step toward change.', cleaned_text_en: 'Acceptance is the first step toward change.', cleaned_text_zh_tw: '接納是改變的第一步。', cleaned_text_zh_cn: '接纳是改变的第一步。' },
  { original_text: 'The breath anchors us in the present moment.', cleaned_text_en: 'The breath anchors us in the present moment.', cleaned_text_zh_tw: '呼吸將我們錨定在當下。', cleaned_text_zh_cn: '呼吸将我们锚定在当下。' },
  { original_text: 'We do not need to be perfect to be worthy of love.', cleaned_text_en: 'We do not need to be perfect to be worthy of love.', cleaned_text_zh_tw: '我們不需要完美才值得被愛。', cleaned_text_zh_cn: '我们不需要完美才值得被爱。' },
  { original_text: 'Stillness is the foundation of all movement.', cleaned_text_en: 'Stillness is the foundation of all movement.', cleaned_text_zh_tw: '靜止是所有行動的基礎。', cleaned_text_zh_cn: '静止是所有行动的基础。' },
  { original_text: 'The present moment is where we find ourselves.', cleaned_text_en: 'The present moment is where we find ourselves.', cleaned_text_zh_tw: '當下是我們找到自己的地方。', cleaned_text_zh_cn: '当下是我们找到自己的地方。' },
];

/**
 * System user_id for all global seed quotes
 * These quotes are shared across all users
 */

/**
 * Check if system quotes exist in the database
 */
export async function hasQuotes(): Promise<boolean> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("quotes")
    .select("id")
    .eq("user_id", SYSTEM_USER_ID)
    .limit(1)
    .maybeSingle();

  if (error) {
    if (error.code === "PGRST116") {
      // No system quotes found
      return false;
    }
    console.error("[hasQuotes] Database error:", error);
    throw new Error(error.message);
  }

  return data !== null;
}

/**
 * Seed default quotes into the database
 * This should only be called once when the database is empty
 * Uses the fixed user_id as per database rules
 */
export async function seedQuotes(): Promise<void> {
  const supabase = createSupabaseServerClient();

  // Check if quotes already exist
  const quotesExist = await hasQuotes();
  if (quotesExist) {
    console.log("[seedQuotes] Quotes already exist, skipping seed");
    return;
  }

  console.log(`[seedQuotes] Seeding ${SEED_QUOTES.length} default quotes...`);

  // Insert all seed quotes with system user_id
  const { error } = await supabase
    .from("quotes")
    .insert(
      SEED_QUOTES.map((quote) => ({
        user_id: SYSTEM_USER_ID,
        original_text: quote.original_text,
        cleaned_text_en: quote.cleaned_text_en,
        cleaned_text_zh_tw: quote.cleaned_text_zh_tw,
        cleaned_text_zh_cn: quote.cleaned_text_zh_cn,
      }))
    );

  if (error) {
    console.error("[seedQuotes] Failed to seed quotes:", error);
    throw new Error(`Failed to seed quotes: ${error.message}`);
  }

  console.log(`[seedQuotes] Successfully seeded ${SEED_QUOTES.length} quotes`);
}

/**
 * Ensure quotes are seeded (idempotent - safe to call multiple times)
 * This function checks if quotes exist and seeds them if not
 */
export async function ensureQuotesSeeded(): Promise<void> {
  try {
    const quotesExist = await hasQuotes();
    if (!quotesExist) {
      await seedQuotes();
    }
  } catch (error) {
    console.error("[ensureQuotesSeeded] Error ensuring quotes are seeded:", error);
    // Don't throw - allow the app to continue even if seeding fails
    // The UI will show empty state instead
  }
}

