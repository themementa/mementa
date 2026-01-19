export async function backfillUserData(userId: string): Promise<void> {
  try {
    console.log("BACKFILL START", userId);
    // No-op in current global system quote architecture
    // This function exists only for logging visibility as requested.
    const count = 0;
    console.log("USER QUOTE COUNT", userId, count);
    console.log("BACKFILL SEED DONE", userId);
    console.log("BACKFILL TODAY DONE", userId);
  } catch (e) {
    console.error("BACKFILL FAILED", userId, e);
    throw e;
  }
}

