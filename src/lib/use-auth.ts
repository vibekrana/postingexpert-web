export function useAuth() {
  // UI placeholder
  const isAuthenticated = true;

  return {
    isAuthenticated,
    user: {
      name: "Aman",
      role: "admin",
    },
  };
}
