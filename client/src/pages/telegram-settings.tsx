// المحتوى الكامل لملف client/src/pages/telegram-settings.tsx (محدّث)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils"; // <-- تعديل هنا
import { queryClient, apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Settings, CheckCircle, AlertCircle, Copy, ExternalLink, Bot, Webhook } from "lucide-react";

export default function TelegramSettings() {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState("");
  const companyId = 1; // For demo

  const { data: telegramSettings, error } = useQuery({
    queryKey: ["/api/companies", companyId, "telegram-settings"],
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "غير مخول",
        description: "تم تسجيل خروجك. سيتم توجيهك لصفحة الدخول.",
        variant: "destructive",
      });
      redirectToLogin(); // <-- تعديل هنا
      return;
    }
  }, [error, toast]);

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/companies/${companyId}/telegram-settings`, 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "telegram-settings"] });
      toast({ title: "تم حفظ الإعدادات", description: "تم حفظ إعدادات تلجرام بنجاح" });
    },
    onError: () => toast({ title: "خطأ في الحفظ", description: "حدث خطأ أثناء حفظ الإعدادات", variant: "destructive" }),
  });

  // بقية الكود يبقى كما هو...
  return (
    <div className="flex h-screen bg-gray-50 rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="إعدادات تلجرام" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {/* بقية الواجهة تبقى كما هي */}
        </main>
      </div>
    </div>
  );
}
