export interface PostHistoryEntry {
  id: string;
  prompt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "generated_posts_history_v1";

export const getPostHistory = (): PostHistoryEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PostHistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const savePostHistory = (items: PostHistoryEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addPostHistoryEntry = (prompt: string, content: string) => {
  const p = prompt.trim();
  const c = content.trim();
  if (!c) return;

  const now = new Date().toISOString();
  const current = getPostHistory();
  const next: PostHistoryEntry[] = [
    {
      id: crypto.randomUUID(),
      prompt: p,
      content: c,
      createdAt: now,
      updatedAt: now,
    },
    ...current,
  ];

  savePostHistory(next);
};

export const updatePostHistoryEntry = (
  id: string,
  data: { prompt: string; content: string }
) => {
  const now = new Date().toISOString();
  const next = getPostHistory().map((item) =>
    item.id === id
      ? {
          ...item,
          prompt: data.prompt.trim(),
          content: data.content.trim(),
          updatedAt: now,
        }
      : item
  );

  savePostHistory(next);
};

export const deletePostHistoryEntry = (id: string) => {
  const next = getPostHistory().filter((item) => item.id !== id);
  savePostHistory(next);
};