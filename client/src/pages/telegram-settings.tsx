import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { queryClient, apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Bot,
  Webhook
} from "lucide-react";

export default function TelegramSettings() {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [allowedUsers, setAllowedUsers] = useState("");

  // For demo, using company ID 1
  const companyId = 1;

  const { data: telegramSettings, isLoading } = useQuery({
    queryKey: ["/api/companies", companyId, "telegram-settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => apiRequest(`/api/companies/${companyId}/telegram-settings`, 'POST', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "telegram-settings"] });
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات تلجرام بنجاح",
      });
    },
    onError: () => {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    },
  });

  const setWebhookMutation = useMutation({
    mutationFn: (data: { botToken: string; webhookUrl: string }) => 
      apiRequest('/api/telegram/set-webhook', 'POST', data),
    onSuccess: (data: any) => {
      if (data.ok) {
        toast({
          title: "تم تعيين الـ Webhook",
          description: "تم ربط البوت بالنظام بنجاح",
        });
      } else {
        toast({
          title: "خطأ في تعيين الـ Webhook",
          description: data.description || "حدث خطأ أثناء ربط البوت",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "خطأ في الاتصال",
        description: "حدث خطأ أثناء الاتصال بـ Telegram",
        variant: "destructive",
      });
    },
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
    // Auto-generate webhook URL based on current domain
    const currentDomain = window.location.hostname;
    const port = window.location.port;
    const protocol = window.location.protocol;
    const baseUrl = port && port !== "80" && port !== "443" 
      ? `${protocol}//${currentDomain}:${port}` 
      : `${protocol}//${currentDomain}`;
    setWebhookUrl(`${baseUrl}/api/telegram/webhook`);
  }, []);

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      companyId,
      botToken,
      webhookUrl,
      isActive,
      allowedUsers,
    });
  };

  const handleSetWebhook = () => {
    if (!botToken || !webhookUrl) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال رمز البوت ورابط الـ Webhook",
        variant: "destructive",
      });
      return;
    }

    setWebhookMutation.mutate({ botToken, webhookUrl });
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رابط الـ Webhook إلى الحافظة",
    });
  };

  const testBot = () => {
    if (!botToken) {
      toast({
        title: "رمز البوت مطلوب",
        description: "يرجى إدخال رمز البوت أولاً",
        variant: "destructive",
      });
      return;
    }

    window.open(`https://t.me/${botToken.split(':')[0]}`, '_blank');
  };

  return (
    <div className="flex h-screen bg-gray-50 rtl">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title="إعدادات تلجرام" />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MessageCircle className="w-8 h-8 ml-3 text-blue-600" />
                إعدادات تلجرام
              </h1>
              <p className="text-gray-600 mt-2">إعداد وإدارة بوت تلجرام للنظام المحاسبي</p>
            </div>

            {/* Bot Setup Instructions */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="w-5 h-5 ml-2 text-blue-600" />
                  تعليمات إنشاء البوت
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">خطوات إنشاء بوت تلجرام:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                      <li>افتح تطبيق تلجرام وابحث عن <code className="bg-blue-100 px-1 rounded">@BotFather</code></li>
                      <li>أرسل الأمر <code className="bg-blue-100 px-1 rounded">/newbot</code></li>
                      <li>اتبع التعليمات لإنشاء البوت الخاص بك</li>
                      <li>انسخ رمز البوت (Token) والصقه في الحقل أدناه</li>
                      <li>احفظ الإعدادات وقم بتعيين الـ Webhook</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bot Configuration */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 ml-2 text-gray-600" />
                  إعداد البوت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bot Token */}
                <div>
                  <Label htmlFor="botToken">رمز البوت (Bot Token) *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="botToken"
                      type="password"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      className="flex-1"
                      dir="ltr"
                    />
                    <Button variant="outline" onClick={testBot} disabled={!botToken}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    احصل على الرمز من @BotFather في تلجرام
                  </p>
                </div>

                {/* Webhook URL */}
                <div>
                  <Label htmlFor="webhookUrl">رابط الـ Webhook</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="webhookUrl"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      placeholder="https://yourapp.replit.app/api/telegram/webhook"
                      className="flex-1"
                      dir="ltr"
                    />
                    <Button variant="outline" onClick={copyWebhookUrl}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    الرابط الذي سيستقبل رسائل البوت
                  </p>
                </div>

                {/* Allowed Users */}
                <div>
                  <Label htmlFor="allowedUsers">المستخدمون المسموح لهم (اختياري)</Label>
                  <Textarea
                    id="allowedUsers"
                    value={allowedUsers}
                    onChange={(e) => setAllowedUsers(e.target.value)}
                    placeholder="user1, user2, user3"
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    قائمة بأسماء المستخدمين المسموح لهم باستخدام البوت (فاصلة بين كل اسم)
                  </p>
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="isActive">تفعيل البوت</Label>
                    <p className="text-sm text-gray-500">تشغيل أو إيقاف البوت</p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <Button 
                onClick={handleSaveSettings}
                disabled={updateSettingsMutation.isPending}
                className="flex-1"
              >
                {updateSettingsMutation.isPending ? "جاري الحفظ..." : "حفظ الإعدادات"}
              </Button>
              
              <Button 
                onClick={handleSetWebhook}
                disabled={setWebhookMutation.isPending || !botToken || !webhookUrl}
                variant="outline"
                className="flex-1"
              >
                <Webhook className="w-4 h-4 ml-2" />
                {setWebhookMutation.isPending ? "جاري التعيين..." : "تعيين Webhook"}
              </Button>
            </div>

            {/* Bot Commands */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 ml-2 text-green-600" />
                  أوامر البوت المتاحة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-blue-100 p-2 rounded">
                        <Bot className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <code className="font-semibold">/start</code> أو <code className="font-semibold">بداية</code>
                        <p className="text-sm text-gray-600">رسالة الترحيب وقائمة الأوامر</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-green-100 p-2 rounded">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <code className="font-semibold">/الملخص</code> أو <code className="font-semibold">الملخص</code>
                        <p className="text-sm text-gray-600">عرض الملخص المالي</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-orange-100 p-2 rounded">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <code className="font-semibold">/الحسابات</code> أو <code className="font-semibold">الحسابات</code>
                        <p className="text-sm text-gray-600">عرض دليل الحسابات</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-purple-100 p-2 rounded">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <code className="font-semibold">/القيود</code> أو <code className="font-semibold">القيود</code>
                        <p className="text-sm text-gray-600">عرض آخر القيود المحاسبية</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-red-100 p-2 rounded">
                        <ExternalLink className="w-4 h-4 text-red-600" />
                      </div>
                      <div>
                        <code className="font-semibold">/التقارير</code> أو <code className="font-semibold">التقارير</code>
                        <p className="text-sm text-gray-600">عرض التقارير المالية</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="bg-gray-100 p-2 rounded">
                        <Settings className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <code className="font-semibold">/المساعدة</code> أو <code className="font-semibold">المساعدة</code>
                        <p className="text-sm text-gray-600">عرض تعليمات الاستخدام</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}