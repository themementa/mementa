"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { JournalWithQuote } from "@/lib/journals";
import { useLanguage } from "@/app/providers/language-provider";
import { getTranslation, getQuoteDisplayText } from "@/lib/i18n";
import { deleteJournalAction, saveJournalAction } from "@/actions/journal-actions";

type MomentsPageProps = {
  journals: JournalWithQuote[];
};

export function MomentsPage({ journals: initialJournals }: MomentsPageProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const [journals, setJournals] = useState(initialJournals);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleEdit = (journal: JournalWithQuote) => {
    setEditingId(journal.id);
    setEditContent(journal.content);
  };

  const handleSave = async (journal: JournalWithQuote) => {
    if (!editContent.trim()) return;

    // Use the original date from journal.created_at
    const dateString = new Date(journal.created_at).toISOString().split("T")[0];
    const formData = new FormData();
    formData.append("quote_id", journal.quote_id);
    formData.append("date", dateString);
    formData.append("content", editContent);

    try {
      await saveJournalAction(formData);
      setEditingId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to save journal:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDeleteClick = (journalId: string) => {
    setDeleteConfirmId(journalId);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return;

    try {
      await deleteJournalAction(deleteConfirmId);
      setJournals(journals.filter((j) => j.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Failed to delete journal:", error);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  if (!journals.length) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-12" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)' }}>
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-semibold text-stone-800 text-center mb-8">
            {getTranslation(language, "myMoments")}
          </h1>
          <div className="bg-white/50 rounded-3xl shadow-sm p-16 md:p-24 text-center">
            <p className="text-lg text-stone-600 text-heading-tone">
              {getTranslation(language, "noMoments")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
            <p className="text-base text-stone-700 mb-6">
              {getTranslation(language, "confirmDeleteMoment")}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                className="text-sm text-stone-600 hover:text-stone-800 px-4 py-2 bg-stone-100 rounded touch-manipulation"
              >
                {getTranslation(language, "cancel")}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="text-sm text-white hover:bg-red-700 px-4 py-2 bg-red-600 rounded touch-manipulation"
              >
                {getTranslation(language, "confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6 py-6" style={{ background: 'linear-gradient(135deg, #FAF9F6 0%, #F7F6F3 50%, #F4F3F0 100%)', minHeight: '100vh' }}>
        <div className="w-full max-w-4xl mx-auto px-4">
          {/* Page Title with Settings Link */}
          <h1 className="text-2xl font-semibold text-stone-800 text-center mb-8">
            {getTranslation(language, "myMoments")}
          </h1>

        {/* Journal Cards */}
        <ul className="space-y-6">
          {journals.map((journal) => {
            const date = new Date(journal.created_at);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            const timestamp = `${day}-${month}-${year} ${hours}:${minutes}`;
            const quoteText = getQuoteDisplayText(journal.quote, language ?? "zh-tw");
            const isEditing = editingId === journal.id;

            return (
              <li key={journal.id}>
                <div className="bg-white/60 rounded-2xl shadow-sm p-6 md:p-8">
                  {/* Date and Actions */}
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs text-stone-400">
                      {timestamp}
                    </p>
                    {!isEditing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(journal)}
                          className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1 rounded touch-manipulation"
                        >
                          {getTranslation(language, "edit")}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(journal.id)}
                          className="text-xs text-stone-500 hover:text-red-600 px-2 py-1 rounded touch-manipulation"
                        >
                          {getTranslation(language, "delete")}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quote - subtle, smaller - 樣式 B */}
                  <div className="mb-4">
                    <p className="text-sm text-stone-500 text-content-tone" style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
                      {quoteText}
                    </p>
                  </div>

                  {/* User's journal content - main focus - 樣式 B */}
                  <div className="pt-4 border-t border-stone-200">
                    {isEditing ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full text-base md:text-lg text-stone-700 p-2 border border-stone-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-stone-400 text-content-tone"
                          rows={4}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSave(journal)}
                            className="text-sm text-stone-600 hover:text-stone-800 px-4 py-2 bg-stone-100 rounded touch-manipulation"
                          >
                            {getTranslation(language, "save")}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2 bg-stone-50 rounded touch-manipulation"
                          >
                            {getTranslation(language, "cancel")}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-base md:text-lg text-stone-700 whitespace-pre-wrap text-content-tone">
                        {journal.content}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
    </>
  );
}



