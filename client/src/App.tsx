import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "./lib/queryClient";

// صفحات التطبيق
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ChartOfAccounts from "@/pages/chart-of-accounts";
import JournalEntries from "@/pages/journal-entries";
import FinancialReports from "@/pages/financial-reports";
import Companies from "@/pages/companies";
import Users from "@/pages/users";
import TelegramBot from "@/pages/telegram-bot";
import TelegramSettings from "@/pages/telegram-settings";

// مكون شاشة التحميل
function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">جاري التحميل...</p>
        <p className="text-sm text-gray-500">يتم التحقق من حالة تسجيل الدخول</p>
      </div>
    </div>
  );
}

// مكون المسارات المحمية
function PrivateRoutes() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/chart-of-accounts" component={ChartOfAccounts} />
      <Route path="/journal-entries" component={JournalEntries} />
      <Route path="/financial-reports" component={FinancialReports} />
      <Route path="/companies" component={Companies} />
      <Route path="/users" component={Users} />
      <Route path="/telegram-bot" component={TelegramBot} />
      <Route path="/telegram-settings" component={TelegramSettings} />
      {/* أي مسار آخر غير معروف داخل التطبيق سيذهب إلى لوحة التحكم */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

// مكون المسارات العامة
function PublicRoutes() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      {/* أي مسار آخر غير معروف سيذهب إلى صفحة الهبوط */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  // **المنطق الجديد والمحسّن**
  // 1. إذا كنا لا نزال ننتظر الرد من الخادم، نعرض شاشة تحميل.
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 2. بعد وصول الرد، نقرر أي مجموعة من المسارات سنعرضها.
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="font-arabic">
          <Toaster />
          {isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
