import { FileText, X } from 'lucide-react';
import type { Attachment } from '../types/assistant';

interface AttachmentChipsProps {
  attachments: Attachment[];
    onRemove: (id: string) => void;
    }

    export function AttachmentChips({ attachments, onRemove }: AttachmentChipsProps) {
      if (attachments.length === 0) return null;

        return (
            <div className="flex flex-wrap gap-2 px-3.5 pt-3">
                  {attachments.map((att) => (
                          <div
                                    key={att.id}
                                              className="relative flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/80 pr-2 pl-2 py-1.5 text-xs text-slate-700 dark:text-slate-200"
                                                      >
                                                                {att.kind === 'image' && att.previewUrl ? (
                                                                            <img
                                                                                          src={att.previewUrl}
                                                                                                        alt={att.name}
                                                                                                                      referrerPolicy="no-referrer"
                                                                                                                                    className="w-8 h-8 rounded-lg object-cover shrink-0"
                                                                                                                                                />
                                                                                                                                                          ) : (
                                                                                                                                                                      <div className="w-8 h-8 rounded-lg bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                                                                                                                                                    <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                                                                                                                                                                                </div>
                                                                                                                                                                                                          )}
                                                                                                                                                                                                                    <span className="max-w-[120px] sm:max-w-[160px] truncate">{att.name}</span>
                                                                                                                                                                                                                              <button
                                                                                                                                                                                                                                          type="button"
                                                                                                                                                                                                                                                      onClick={() => onRemove(att.id)}
                                                                                                                                                                                                                                                                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                                                                                                                                                                                                                                                                              aria-label={`Remove ${att.name}`}
                                                                                                                                                                                                                                                                                        >
                                                                                                                                                                                                                                                                                                    <X className="w-3.5 h-3.5" />
                                                                                                                                                                                                                                                                                                              </button>
                                                                                                                                                                                                                                                                                                                      </div>
                                                                                                                                                                                                                                                                                                                            ))}
                                                                                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                                                                                  );
                                                                                                                                                                                                                                                                                                                                  }
