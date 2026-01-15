import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureQuotesSeeded } from "@/lib/seed-quotes";
import { ensureUserQuotesSeeded } from "@/lib/user-quotes-seed";

/**
 * Initialize default data for a new user
 * - Ensures system master quotes exist (shared globally as source)
 * - Seeds user's personal quotes from system master
 * - Creates default user settings in user_metadata
 * 
 * This function is idempotent - safe to call multiple times.
 */
export async function initializeUserData(userId: string): Promise<void> {
  try {
    console.log(`[initializeUserData] Initializing data for user ${userId}...`);
    
    // Ensure system master quotes exist (idempotent - only seeds if not already present)
    await ensureQuotesSeeded();
    
    // Seed user's personal quotes from system master (idempotent)
    await ensureUserQuotesSeeded(userId);
    
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

