import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { toast } = useToast();
  const loginMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/auth/login", data),
    onSuccess: () => {
      toast({ title: "تم بنجاح", description: "تم تسجيل دخولك بنجاح." });
      window.location.href = "/"; // إعادة تحميل الصفحة للانتقال إلى لوحة التحكم
    },
    onError: (error: any) => {
      toast({ title: "خطأ في الدخول", description: error.message || "البيانات المدخلة غير صحيحة.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    loginMutation.mutate(data);
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">تسجيل الدخول</CardTitle>
          <CardDescription>أدخل بياناتك للوصول إلى حسابك</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="login">البريد الإلكتروني / اسم المستخدم</Label>
              <Input id="login" name="login" required />
            </div>
            <div>
              <Label htmlFor="password">كلمة المرور</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? "جاري الدخول..." : "دخول"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ليس لديك حساب؟ <Button variant="link" className="p-0 h-auto" onClick={onSwitchToSignup}>أنشئ حسابًا جديدًا</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
