// المحتوى الكامل لملف client/src/hooks/useAuth.ts
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// تعريف شكل بيانات المستخدم التي ستعود من الخادم
interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  role: 'user' | 'admin' | 'superadmin';
  organizationName?: string;
  adminEmail?: string;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
    queryFn: () => apiRequest("GET", "/api/auth/me"),
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
