// المحتوى الكامل لملف client/src/pages/telegram-settings.tsx (محدّث وكامل)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils";
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
      redirectToLogin();
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

  useEffect(() => {
    if (telegramSettings) {
      setBotToken((telegramSettings as any).botToken || "");
      setWebhookUrl((telegramSettings as any).webhookUrl || "");
      setIsActive((telegramSettings as any).isActive || false);
      setAllowedUsers((telegramSettings as any).allowedUsers || "");
    }
  }, [telegramSettings]);

  useEffect(() => {
    const currentDomain = window.location.hostname;
    const protocol = window.location.protocol;
    setWebhookUrl(`${protocol}//${currentDomain}/api/telegram/webhook`);
  }, []);

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({ companyId, botToken, webhookUrl, isActive, allowedUsers });
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({ title: "تم النسخ", description: "تم نسخ رابط الـ Webhook إلى الحافظة" });
  };

  return (
    <div className="flex h-screen bg-gray-50 rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="إعدادات تلجرام" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader><CardTitle>إعدادات بوت تلجرام</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="botToken">رمز البوت (Bot Token)</Label>
                  <Input id="botToken" type="password" value={botToken} onChange={(e) => setBotToken(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="webhookUrl">رابط الـ Webhook</Label>
                  <div className="flex gap-2 mt-1">
                    <Input id="webhookUrl" value={webhookUrl} readOnly />
                    <Button variant="outline" onClick={copyWebhookUrl}><Copy className="w-4 h-4" /></Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="allowedUsers">المستخدمون المسموح لهم</Label>
                  <Textarea id="allowedUsers" value={allowedUsers} onChange={(e) => setAllowedUsers(e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">تفعيل البوت</Label>
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <Button onClick={handleSaveSettings} disabled={updateSettingsMutation.isPending}>
                  {updateSettingsMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
