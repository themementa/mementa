"use server";

export async function saveJournalAction(
  quoteId?: string,
  content?: string,
  date?: string
) {
  return { success: true };
}

export async function getJournalAction(
  quoteId?: string,
  date?: string
) {
  return {
    journal: null,
    error: null
  };
}

