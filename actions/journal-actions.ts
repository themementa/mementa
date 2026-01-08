"use server";

import { getCurrentUser } from "@/lib/auth";
import { saveJournalEntry, getJournalEntry, deleteJournalEntry } from "@/lib/journals";

export async function saveJournalAction(formData: FormData) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const quoteId = String(formData.get("quote_id") || "");
  const dateString = String(formData.get("date") || ""); // YYYY-MM-DD format
  const content = String(formData.get("content") || "").trim();

  if (!quoteId || !dateString) {
    return { error: "Missing required fields" };
  }

  try {
    await saveJournalEntry({
      userId: user.id,
      quoteId,
      dateString,
      content,
    });
    return { success: true };
  } catch (error) {
    console.error("[saveJournalAction] Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to save journal" };
  }
}

export async function getJournalAction(quoteId: string, dateString: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    const journal = await getJournalEntry(
      user.id,
      quoteId,
      dateString
    );
    return journal;
  } catch (error) {
    return null;
  }
}

export async function deleteJournalAction(journalId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  try {
    await deleteJournalEntry(journalId, user.id);
    return { success: true };
  } catch (error) {
    console.error("[deleteJournalAction] Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to delete journal" };
  }
}



