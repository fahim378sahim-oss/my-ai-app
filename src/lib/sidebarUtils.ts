import type { Conversation } from '../types/assistant';

function getTimeBucket(timestamp: number): 'Today' | 'Yesterday' | 'Previous 7 days' | 'Older' {
  const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const oneDay = 24 * 60 * 60 * 1000;
        if (timestamp >= startOfToday) return 'Today';
          if (timestamp >= startOfToday - oneDay) return 'Yesterday';
            if (timestamp >= startOfToday - 7 * oneDay) return 'Previous 7 days';
              return 'Older';
              }

              export function groupConversations(
                conversations: Conversation[],
                  searchQuery: string,
                  ): Array<{ label: string; items: Conversation[] }> {
                    const q = searchQuery.trim().toLowerCase();
                      const filtered = (
                          q
                                ? conversations.filter(
                                          (c) =>
                                                      c.title.toLowerCase().includes(q) ||
                                                                  c.messages.some((m) => m.content.toLowerCase().includes(q)),
                                                                          )
                                                                                : conversations
                                                                                  ).sort((a, b) => b.updatedAt - a.updatedAt);

                                                                                    const pinned = filtered.filter((c) => c.pinned);
                                                                                      const buckets: Record<string, Conversation[]> = {
                                                                                          Today: [],
                                                                                              Yesterday: [],
                                                                                                  'Previous 7 days': [],
                                                                                                      Older: [],
                                                                                                        };
                                                                                                          for (const conv of filtered.filter((c) => !c.pinned)) {
                                                                                                              buckets[getTimeBucket(conv.updatedAt)].push(conv);
                                                                                                                }

                                                                                                                  const sections: Array<{ label: string; items: Conversation[] }> = [];
                                                                                                                    if (pinned.length > 0) sections.push({ label: 'Pinned', items: pinned });
                                                                                                                      for (const label of ['Today', 'Yesterday', 'Previous 7 days', 'Older']) {
                                                                                                                          if (buckets[label].length > 0) sections.push({ label, items: buckets[label] });
                                                                                                                            }
                                                                                                                              return sections;
                                                                                                                              }