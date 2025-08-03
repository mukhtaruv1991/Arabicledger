// المحتوى الكامل لملف client/src/components/auth/SignupForm.tsx
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { toast } = useToast();
  const signupMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/auth/signup", data),
    onSuccess: () => {
      toast({ title: "تم بنجاح", description: "تم إنشاء حسابك. جاري تسجيل الدخول..." });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({ title: "خطأ في التسجيل", description: error.message || "البيانات المدخلة غير صالحة أو مستخدمة.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    if (data.password !== data.confirmPassword) {
      toast({ title: "خطأ", description: "كلمتا المرور غير متطابقتين.", variant: "destructive" });
      return;
    }
    signupMutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center"><Card className="w-full max-w-md"><CardHeader className="text-center"><CardTitle className="text-2xl">إنشاء حساب جديد</CardTitle><CardDescription>املأ البيانات التالية للبدء</CardDescription></CardHeader><CardContent><form onSubmit={handleSubmit} className="space-y-4"><div><Label htmlFor="fullName">الاسم الكامل</Label><Input id="fullName" name="fullName" required /></div><div><Label htmlFor="email">البريد الإلكتروني</Label><Input id="email" name="email" type="email" required /></div><div><Label htmlFor="username">اسم المستخدم</Label><Input id="username" name="username" required /></div><div><Label htmlFor="password">كلمة المرور</Label><Input id="password" name="password" type="password" required /></div><div><Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label><Input id="confirmPassword" name="confirmPassword" type="password" required /></div><Button type="submit" className="w-full" disabled={signupMutation.isPending}>{signupMutation.isPending ? "جاري الإنشاء..." : "إنشاء حساب"}</Button></form><div className="mt-4 text-center text-sm">لديك حساب بالفعل؟ <Button variant="link" className="p-0 h-auto" onClick={onSwitchToLogin}>سجل الدخول</Button></div></CardContent></Card></div>
  );
}
