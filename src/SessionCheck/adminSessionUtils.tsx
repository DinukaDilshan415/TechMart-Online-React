import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

export const adminCheckSession = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${TECHMART_BASE_URL}/AdminCheckSession`, {
      credentials: "include",
      headers: {
        ...DEFAULT_HEADERS,
      }
    });
    const data = await res.json();
    return data.loggedIn;
  } catch (err) {
    console.error("Session check failed:", err);
    return false;
  }
};