export interface PostHistoryEntry {
  id: string;
  prompt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PostResponse {
  id: number;
  title: string;
  promptText: string | null;
  userId: string;
  body: string;
  status: string;
  createdAt: string;
}

const api_url = import.meta.env.VITE_API_URL;

const mapPostResponseToEntry = (p: PostResponse): PostHistoryEntry => ({
  id: String(p.id),
  prompt: p.promptText ?? '',
  content: p.body ?? '',
  createdAt: (p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()),
  updatedAt: (p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString()),
});

export const getPostHistory = async (pageSize = 100): Promise<PostHistoryEntry[]> => {
  try {
    const res = await fetch(`${api_url}/Post/posts?pageIndex=1&pageSize=${pageSize}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return [];
    const paginated = await res.json();
    const items = paginated.items ?? paginated.data ?? paginated; 
    if (!Array.isArray(items)) return [];
    return items.map(mapPostResponseToEntry);
  } catch {
    return [];
  }
};

export const addPostHistoryEntry = async (prompt: string, content: string): Promise<PostHistoryEntry | null> => {
  const p = prompt.trim();
  const c = content.trim();
  if (!c) return null;

  try {
    const body = {
      Title: c.substring(0, 200),
      Body: c,
      PromptText: p,
      Status: "Draft"
    };
    const res = await fetch(`${api_url}/Post/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    if (!res.ok) return null;
    const created = await res.json();
    return mapPostResponseToEntry(created);
  } catch {
    return null;
  }
};

export const updatePostHistoryEntry = async (
  id: string,
  data: { prompt: string; content: string }
): Promise<boolean> => {
  try {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return false;
    const body = {
      Title: data.content.substring(0, 200),
      Body: data.content,
      PromptText: data.prompt,
      Status: "Draft"
    };
    const res = await fetch(`${api_url}/Post/${numericId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const deletePostHistoryEntry = async (id: string): Promise<boolean> => {
  try {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return false;
    const res = await fetch(`${api_url}/Post/${numericId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.ok;
  } catch {
    return false;
  }
};