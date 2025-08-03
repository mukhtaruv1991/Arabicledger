import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  MessageSquare, 
  Bot, 
  Settings, 
  Link as LinkIcon, 
  Users, 
  CheckCircle, 
  XCircle,
  Copy,
  ExternalLink
} from "lucide-react";

export default function TelegramBot() {
  const { toast } = useToast();
  const [botToken, setBotToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [allowedUsers, setAllowedUsers] = useState("");
  const [isActive, setIsActive] = useState(false);

  // For demo, using company ID 1
  const companyId = 1;

  const { data: telegramSettings, isLoading } = useQuery({
    queryKey: ["/api/companies", companyId, "telegram-settings"],
  });

  // Update form fields when data loads
  useEffect(() => {
    if (telegramSettings) {
      setBotToken(telegramSettings.botToken || "");
      setWebhookUrl(telegramSettings.webhookUrl || "");
      setAllowedUsers(telegramSettings.allowedUsers || "");
      setIsActive(telegramSettings.isActive || false);
    }
  }, [telegramSettings]);

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/telegram-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "telegram-settings"] });
      toast({
        title: "تم بنجاح",
        description: "تم حفظ إعدادات البوت بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في حفظ إعدادات البوت",
        variant: "destructive",
      });
    },
  });

  const setWebhookMutation = useMutation({
    mutationFn: async (data: { botToken: string; webhookUrl: string }) => {
      return await apiRequest("POST", "/api/telegram/set-webhook", data);
    },
    onSuccess: (response: any) => {
      if (response.ok) {
        toast({
          title: "تم بنجاح",
          description: "تم تفعيل البوت بنجاح",
        });
      } else {
        toast({
          title: "خطأ",
          description: "فشل في تفعيل البوت",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في تفعيل البوت",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    const data = {
      companyId,
      botToken,
      webhookUrl,
      allowedUsers,
      isActive,
    };
    saveSettingsMutation.mutate(data);
  };

  const handleSetWebhook = () => {
    if (!botToken || !webhookUrl) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال رمز البوت ورابط الويب هوك",
        variant: "destructive",
      });
      return;
    }

    setWebhookMutation.mutate({ botToken, webhookUrl });
  };

  const handleCopyWebhookUrl = () => {
    const currentDomain = window.location.origin;
    const fullWebhookUrl = `${currentDomain}/api/telegram/webhook`;
    navigator.clipboard.writeText(fullWebhookUrl);
    setWebhookUrl(fullWebhookUrl);
    toast({
      title: "تم النسخ",
      description: "تم نسخ رابط الويب هوك",
    });
  };

  const botCommands = [
    { command: "/start", description: "بداية استخدام البوت" },
    { command: "/الملخص", description: "عرض الملخص المالي" },
    { command: "/الحسابات", description: "عرض دليل الحسابات" },
    { command: "/القيود", description: "عرض آخر القيود المحاسبية" },
    { command: "/التقارير", description: "عرض التقارير المالية" },
    { command: "/المساعدة", description: "عرض قائمة الأوامر" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar title="بوت تيليجرام" subtitle="إعداد وإدارة بوت تيليجرام للمحاسبة" />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bot Configuration */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 space-x-reverse mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">إعدادات البوت</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="botToken">رمز البوت (Bot Token)</Label>
                    <Input
                      id="botToken"
                      type="password"
                      placeholder="أدخل رمز البوت من BotFather"
                      value={botToken}
                      onChange={(e) => setBotToken(e.target.value)}
                      data-testid="input-bot-token"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      احصل على الرمز من @BotFather في تيليجرام
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="webhookUrl">رابط الويب هوك</Label>
                    <div className="flex space-x-2 space-x-reverse">
                      <Input
                        id="webhookUrl"
                        placeholder="رابط استقبال رسائل البوت"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        data-testid="input-webhook-url"
                      />
                      <Button
                        variant="outline"
                        onClick={handleCopyWebhookUrl}
                        data-testid="button-copy-webhook"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      اضغط على أيقونة النسخ لنسخ الرابط التلقائي
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="allowedUsers">المستخدمين المسموح لهم</Label>
                    <Textarea
                      id="allowedUsers"
                      placeholder="أدخل معرفات المستخدمين مفصولة بفواصل (مثال: 123456789,987654321)"
                      value={allowedUsers}
                      onChange={(e) => setAllowedUsers(e.target.value)}
                      rows={3}
                      data-testid="textarea-allowed-users"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      اتركه فارغاً للسماح لجميع المستخدمين
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="isActive">تفعيل البوت</Label>
                      <p className="text-sm text-gray-500">
                        تفعيل أو إلغاء تفعيل استقبال الرسائل
                      </p>
                    </div>
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      data-testid="switch-bot-active"
                    />
                  </div>

                  <div className="flex space-x-3 space-x-reverse pt-4 border-t">
                    <Button
                      onClick={handleSaveSettings}
                      disabled={saveSettingsMutation.isPending}
                      className="flex-1"
                      data-testid="button-save-settings"
                    >
                      حفظ الإعدادات
                    </Button>
                    <Button
                      onClick={handleSetWebhook}
                      disabled={setWebhookMutation.isPending || !botToken || !webhookUrl}
                      variant="outline"
                      className="flex-1"
                      data-testid="button-set-webhook"
                    >
                      تفعيل البوت
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bot Status and Info */}
            <div className="space-y-6">
              {/* Bot Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">حالة البوت</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">حالة البوت</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {isActive ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-600 font-medium" data-testid="bot-status-active">نشط</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-medium" data-testid="bot-status-inactive">غير نشط</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">الويب هوك</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        {webhookUrl ? (
                          <>
                            <LinkIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-600 font-medium" data-testid="webhook-status-configured">مُعد</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-red-600 font-medium" data-testid="webhook-status-not-configured">غير مُعد</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">المستخدمين المسموح لهم</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Users className="w-5 h-5 text-gray-600" />
                        <span className="text-gray-600 font-medium" data-testid="allowed-users-count">
                          {allowedUsers ? allowedUsers.split(',').length : 'جميع المستخدمين'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {botToken && webhookUrl && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ البوت جاهز للاستخدام! يمكنك البحث عن البوت في تيليجرام وبدء المحادثة.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bot Commands */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 space-x-reverse mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">أوامر البوت</h3>
                  </div>

                  <div className="space-y-3">
                    {botCommands.map((cmd, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid={`bot-command-${index}`}>
                        <div>
                          <span className="font-mono text-blue-600 font-medium">{cmd.command}</span>
                          <p className="text-sm text-gray-600 mt-1">{cmd.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 يمكن كتابة الأوامر بدون الرمز / أيضاً. مثال: "الملخص" بدلاً من "/الملخص"
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Setup Instructions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">خطوات الإعداد</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">إنشاء البوت</p>
                        <p className="text-sm text-gray-600">ابحث عن @BotFather في تيليجرام وأرسل /newbot</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">نسخ الرمز</p>
                        <p className="text-sm text-gray-600">انسخ رمز البوت والصقه في الحقل أعلاه</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">تعيين الويب هوك</p>
                        <p className="text-sm text-gray-600">اضغط على نسخ رابط الويب هوك ثم على تفعيل البوت</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 space-x-reverse">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-medium">البدء في الاستخدام</p>
                        <p className="text-sm text-gray-600">ابحث عن البوت في تيليجرام وأرسل /start</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
