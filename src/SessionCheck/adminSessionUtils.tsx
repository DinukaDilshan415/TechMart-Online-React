export const adminCheckSession = async (): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:8080/techmart/AdminCheckSession", {
      credentials: "include", // important for session cookies
    });
    const data = await res.json();
    return data.loggedIn;
  } catch (err) {
    console.error("Session check failed:", err);
    return false;
  }
};