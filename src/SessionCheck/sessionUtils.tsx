import { TECHMART_BASE_URL, DEFAULT_HEADERS } from '../api/client';

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${TECHMART_BASE_URL}/CheckSession`, {
      credentials: "include",
      headers: {
        ...DEFAULT_HEADERS,
      }
    });
    const data = await res.json();
    console.log(data.loggedIn);
    return data.loggedIn;
  } catch (err) {
    console.error("Session check failed:", err);
    return false;
  }
};
