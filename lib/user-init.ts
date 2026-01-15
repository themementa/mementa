import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureQuotesSeeded } from "@/lib/seed-quotes";
import { ensureUserQuotesSeeded } from "@/lib/user-quotes-seed";
import { getTodaysUserQuote } from "@/lib/daily-quotes-global";

/**
 * Unified user initialization function
 * Responsibilities:
 * - If user has < 100 quotes → seed full master quotes into quotes table
 * - If daily_quotes has no row for today → create one by picking random quote from user's quotes
 * - Must be idempotent and safe to call multiple times
 * 
 * This function ensures:
 * 1. Every user always has a full quotes collection seeded
 * 2. Every user always has a Today's Quote record in daily_quotes
 * 3. Existing users with broken or partial data are auto-repaired
 */
export async function initializeUserData(userId: string): Promise<void> {
  try {
    console.log(`[initializeUserData] Initializing data for user ${userId}...`);
    
    // Ensure system master quotes exist (idempotent - only seeds if not already present)
    await ensureQuotesSeeded();
    
    // Seed user's personal quotes from system master (idempotent)
    // This checks if user has < 100 quotes and seeds if needed
    await ensureUserQuotesSeeded(userId);
    
    // Ensure today's quote exists in daily_quotes (idempotent)
    // This will create a daily_quotes entry if it doesn't exist
    // Must never return null - if no quotes exist, it will seed and retry
    const todaysQuote = await getTodaysUserQuote(userId);
    if (todaysQuote) {
      console.log(`[initializeUserData] Today's quote ensured for user ${userId}`);
    } else {
      // This should never happen if seeding worked correctly
      console.error(`[initializeUserData] CRITICAL: Could not create today's quote for user ${userId} - no quotes available after seeding`);
      throw new Error(`Failed to ensure today's quote for user ${userId} - no quotes available`);
    }
    
    // Initialize user settings in user_metadata (idempotent)
    const supabase = createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      console.warn(`[initializeUserData] Could not fetch user ${userId} for settings init`);
      return;
    }
    
    // Only set default settings if they don't exist
    if (!user.user_metadata?.settings) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          settings: {
            dailyQuoteReminder: false,
            gentleCheckIn: false,
            notificationTime: "09:00",
            editAllowedAfterSave: true,
          },
        },
      });
      
      if (updateError) {
        console.warn(`[initializeUserData] Failed to initialize user settings:`, updateError);
      } else {
        console.log(`[initializeUserData] User settings initialized for ${userId}`);
      }
    }
    
    console.log(`[initializeUserData] Initialization complete for user ${userId}`);
  } catch (error) {
    console.error("[initializeUserData] Error initializing user data:", error);
    // Don't throw - allow the app to continue even if initialization fails
    // The user can still use the app, they just won't have initial settings
  }
}

