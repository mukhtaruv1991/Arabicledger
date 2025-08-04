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
    queryKey: ["/api/auth/user"], // مفتاح الاستعلام يبقى كما هو
    
    // **هذا هو التصحيح الرئيسي**: نستخدم دالة apiRequest
    // التي تضمن إرسال الكوكيز (credentials: "include")
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/auth/user");
        return await response.json();
      } catch (e) {
        // إذا كان الخطأ 401، فهذا طبيعي للمستخدم غير المسجل، لا نعتبره خطأً ينهار التطبيق
        if (e instanceof Error && e.message.startsWith('401')) {
          return null; // إرجاع null يعني أن المستخدم غير مسجل
        }
        throw e; // أي خطأ آخر يجب أن يتم إظهاره
      }
    },
    
    retry: false, // لا نحاول إعادة الطلب عند الفشل
    refetchOnWindowFocus: false, // لا نعيد الطلب عند التركيز على النافذة
  });

  return {
    user,
    isLoading,
    // isAuthenticated تكون صحيحة فقط إذا كان هناك بيانات للمستخدم ولم يكن هناك خطأ
    isAuthenticated: !!user && !error,
    error,
  };
}
