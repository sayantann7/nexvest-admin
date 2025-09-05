export const API_BASE = "https://nexvest-backend.sayantannandi13.workers.dev";

export interface AdminInfo {
  id: string;
  username: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  link?: string;
}

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

export interface SigninResponse {
  message: string;
  token: string;
  admin: AdminInfo;
}

export async function signin(username: string, password: string): Promise<SigninResponse> {
  const res = await fetch(`${API_BASE}/admin/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    throw new Error(`Signin failed (${res.status})`);
  }
  return res.json();
}

export async function changePassword(token: string, currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/admin/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  if (!res.ok) throw new Error('Password change failed');
  return res.json();
}

export async function listArticles(): Promise<Article[]> {
  const res = await fetch(`${API_BASE}/article`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch articles');
  return res.json();
}

export async function getArticle(id: string): Promise<Article> {
  const res = await fetch(`${API_BASE}/article/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch article');
  return res.json();
}

export async function createArticle(token: string, data: { title: string; content: string; thumbnailFile: File; link?: string }): Promise<Article> {
  const form = new FormData();
  form.append('title', data.title);
  form.append('content', data.content);
  form.append('thumbnail', data.thumbnailFile);
  if(data.link) form.append('link', data.link);
  const res = await fetch(`${API_BASE}/article`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  if (!res.ok) throw new Error('Failed to create article');
  return res.json();
}

export async function updateArticle(token: string, id: string, data: { title: string; content: string; thumbnailFile?: File; thumbnail?: string; link?: string }): Promise<Article> {
  let res: Response;
  if (data.thumbnailFile) {
    const form = new FormData();
    form.append('title', data.title);
    form.append('content', data.content);
    form.append('thumbnail', data.thumbnailFile);
    if(data.link) form.append('link', data.link);
    res = await fetch(`${API_BASE}/article/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: form
    });
  } else {
    res = await fetch(`${API_BASE}/article/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: data.title, content: data.content, thumbnail: data.thumbnail, link: data.link })
    });
  }
  if (!res.ok) {
    let msg = 'Failed to update article';
    try { const t = await res.text(); if (t) msg += `: ${t}`; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteArticle(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/article/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) {
    let msg = 'Failed to delete article';
    try { const t = await res.text(); if (t) msg += `: ${t}`; } catch {}
    throw new Error(msg);
  }
}

export async function listUsers(): Promise<UserRecord[]> {
  const res = await fetch(`${API_BASE}/user`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('nexvestAdminToken');
}

export function setToken(token: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nexvestAdminToken', token);
}

export function clearToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('nexvestAdminToken');
}
