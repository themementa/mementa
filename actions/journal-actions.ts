"use server";

export async function saveJournalAction(formData?: FormData) {
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

