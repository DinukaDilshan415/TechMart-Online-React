export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:8080/techmart/CheckSession", {
      credentials: "include", // important for session cookies
    });
    const data = await res.json();
    console.log(data.loggedIn);
    return data.loggedIn;
  } catch (err) {
    console.error("Session check failed:", err);
    return false;
  }
};
