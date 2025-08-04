import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        return await response.json();
      } catch (e) {
        if (e instanceof Error && e.message.startsWith('401')) {
          return null;
        }
        throw e;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
}
