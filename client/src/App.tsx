import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import ChartOfAccounts from "@/pages/chart-of-accounts";
import JournalEntries from "@/pages/journal-entries";
import FinancialReports from "@/pages/financial-reports";
import Companies from "@/pages/companies";
import Users from "@/pages/users";
import TelegramBot from "@/pages/telegram-bot";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/chart-of-accounts" component={ChartOfAccounts} />
          <Route path="/journal-entries" component={JournalEntries} />
          <Route path="/financial-reports" component={FinancialReports} />
          <Route path="/companies" component={Companies} />
          <Route path="/users" component={Users} />
          <Route path="/telegram-bot" component={TelegramBot} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div dir="rtl" className="font-arabic">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
