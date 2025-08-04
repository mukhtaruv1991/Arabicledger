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
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

// **هذا هو المكون الجديد الذي يقرر ماذا سيعرض**
function AppRouter() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <PrivateRoutes /> : <PublicRoutes />;
}

// **هذا هو المكون الرئيسي الذي يوفر كل شيء**
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="font-arabic">
          <Toaster />
          <AppRouter />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
