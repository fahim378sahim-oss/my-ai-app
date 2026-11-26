import type {
      AssistantMode,
        ChatMessage,
          ThinkingDepth,
            UserProfile,
            } from '../types/assistant';

            interface StreamChatParams {
              messages: ChatMessage[];
                mode: AssistantMode;
                  thinkingDepth: ThinkingDepth;
                    profile: UserProfile;
                      signal?: AbortSignal;
                        onDelta: (chunk: string) => void;
                        }

                        export async function streamChat({
                          messages,
                            mode,
                              thinkingDepth,
                                profile,
                                  signal,
                                    onDelta,
                                    }: StreamChatParams): Promise<void> {
                                      const payload = {
                                          mode,
                                              thinkingDepth,
                                                  profile: {
                                                        name: profile.name,
                                                              role: profile.role,
                                                                    responseStyle: profile.responseStyle,
                                                                          memoryNotes: profile.memoryNotes.map((n) => ({ text: n.text })),
                                                                              },
                                                                                  messages: messages.map((m) => ({
                                                                                        role: m.role,
                                                                                              content: m.content,
                                                                                                    attachments: m.attachments?.map((a) => ({
                                                                                                            name: a.name,
                                                                                                                    mimeType: a.mimeType,
                                                                                                                            kind: a.kind,
                                                                                                                                    data: a.data,
                                                                                                                                          })),
                                                                                                                                              })),
                                                                                                                                                };

                                                                                                                                                  const response = await fetch('/api/chat', {
                                                                                                                                                      method: 'POST',
                                                                                                                                                          headers: { 'Content-Type': 'application/json' },
                                                                                                                                                              body: JSON.stringify(payload),
                                                                                                                                                                  signal,
                                                                                                                                                                    });

                                                                                                                                                                      if (!response.ok) {
                                                                                                                                                                          let errorMessage = `Request failed (${response.status})`;
                                                                                                                                                                              try {
                                                                                                                                                                                    const errData = (await response.json()) as { error?: string };
                                                                                                                                                                                          if (errData.error) errorMessage = errData.error;
                                                                                                                                                                                              } catch {
                                                                                                                                                                                                    // Ignore JSON parse fallback
                                                                                                                                                                                                        }
                                                                                                                                                                                                            throw new Error(errorMessage);
                                                                                                                                                                                                              }

                                                                                                                                                                                                                if (!response.body) {
                                                                                                                                                                                                                    throw new Error('Streaming response body was empty.');
                                                                                                                                                                                                                      }

                                                                                                                                                                                                                        const reader = response.body.getReader();
                                                                                                                                                                                                                          const decoder = new TextDecoder();
                                                                                                                                                                                                                            let buffer = '';

                                                                                                                                                                                                                              while (true) {
                                                                                                                                                                                                                                  const { done, value } = await reader.read();
                                                                                                                                                                                                                                      if (done) break;

                                                                                                                                                                                                                                          buffer += decoder.decode(value, { stream: true });
                                                                                                                                                                                                                                              const events = buffer.split('\n\n');
                                                                                                                                                                                                                                                  buffer = events.pop() ?? '';

                                                                                                                                                                                                                                                      for (const rawEvent of events) {
                                                                                                                                                                                                                                                            const line = rawEvent
                                                                                                                                                                                                                                                                    .split('\n')
                                                                                                                                                                                                                                                                            .find((l) => l.startsWith('data: '));
                                                                                                                                                                                                                                                                                  if (!line) continue;

                                                                                                                                                                                                                                                                                        const jsonText = line.slice(6).trim();
                                                                                                                                                                                                                                                                                              if (!jsonText) continue;

                                                                                                                                                                                                                                                                                                    let parsed: { type: string; text?: string; message?: string };
                                                                                                                                                                                                                                                                                                          try {
                                                                                                                                                                                                                                                                                                                  parsed = JSON.parse(jsonText);
                                                                                                                                                                                                                                                                                                                        } catch {
                                                                                                                                                                                                                                                                                                                                continue;
                                                                                                                                                                                                                                                                                                                                      }

                                                                                                                                                                                                                                                                                                                                            if (parsed.type === 'delta' && parsed.text) {
                                                                                                                                                                                                                                                                                                                                                    onDelta(parsed.text);
                                                                                                                                                                                                                                                                                                                                                          } else if (parsed.type === 'error') {
                                                                                                                                                                                                                                                                                                                                                                  throw new Error(parsed.message || 'Failed to generate response.');
                                                                                                                                                                                                                                                                                                                                                                        } else if (parsed.type === 'done') {
                                                                                                                                                                                                                                                                                                                                                                                return;
                                                                                                                                                                                                                                                                                                                                                                                      }
                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                            }

                                                                                                                                                                                                                                                                                                                                                                                            export async function generateConversationTitle(prompt: string): Promise<string | null> {
                                                                                                                                                                                                                                                                                                                                                                                              try {
                                                                                                                                                                                                                                                                                                                                                                                                  const response = await fetch('/api/title', {
                                                                                                                                                                                                                                                                                                                                                                                                        method: 'POST',
                                                                                                                                                                                                                                                                                                                                                                                                              headers: { 'Content-Type': 'application/json' },
                                                                                                                                                                                                                                                                                                                                                                                                                    body: JSON.stringify({ prompt }),
                                                                                                                                                                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                                                                                                                                                                            if (!response.ok) return null;
                                                                                                                                                                                                                                                                                                                                                                                                                                const data = (await response.json()) as { title?: string };
                                                                                                                                                                                                                                                                                                                                                                                                                                    return data.title?.trim() || null;
                                                                                                                                                                                                                                                                                                                                                                                                                                      } catch {
                                                                                                                                                                                                                                                                                                                                                                                                                                          return null;
                                                                                                                                                                                                                                                                                                                                                                                                                                            }
                                                                                                                                                                                                                                                                                                                                                                                                                                            }
