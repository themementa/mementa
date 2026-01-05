"use server";

import { requireUser } from "@/lib/auth";
import { saveJournalEntry, getJournalEntry, deleteJournalEntry } from "@/lib/journals";

export async function saveJournalAction(formData: FormData) {
  const user = await requireUser();
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
  const user = await requireUser();
  
  try {
    const journal = await getJournalEntry(user.id, quoteId, dateString);
    return { journal };
  } catch (error) {
    console.error("[getJournalAction] Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to get journal" };
  }
}

export async function deleteJournalAction(journalId: string) {
  const user = await requireUser();
  
  try {
    await deleteJournalEntry(journalId, user.id);
    return { success: true };
  } catch (error) {
    console.error("[deleteJournalAction] Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to delete journal" };
  }
}



