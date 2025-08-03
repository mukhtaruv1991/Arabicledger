import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import FinancialChart from "@/components/accounting/FinancialChart";
import { TrendingUp, TrendingDown, DollarSign, FileText, Plus } from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const companyId = 1; // For demo

  const { data: financialSummary, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  useEffect(() => {
    if (summaryError && isUnauthorizedError(summaryError)) {
      toast({
        title: "غير مخول",
        description: "يرجى تسجيل الدخول للمتابعة.",
        variant: "destructive",
      });
      setLocation("/"); // إعادة التوجيه إلى الصفحة الرئيسية (التي ستعرض نموذج الدخول)
    }
  }, [summaryError, toast, setLocation]);

  const summary = (financialSummary as any) || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalAccounts: 0,
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="لوحة التحكم" subtitle="مرحباً بك في نظام المحاسبة الذكي" />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card><CardContent className="p-6"><div><p>إجمالي الإيرادات</p><p className="text-2xl font-bold">{summary.totalRevenue.toLocaleString('ar-SA')} ر.س</p></div></CardContent></Card>
            <Card><CardContent className="p-6"><div><p>إجمالي المصروفات</p><p className="text-2xl font-bold">{summary.totalExpenses.toLocaleString('ar-SA')} ر.س</p></div></CardContent></Card>
            <Card><CardContent className="p-6"><div><p>صافي الربح</p><p className="text-2xl font-bold">{summary.netProfit.toLocaleString('ar-SA')} ر.س</p></div></CardContent></Card>
            <Card><CardContent className="p-6"><div><p>عدد الحسابات</p><p className="text-2xl font-bold">{summary.totalAccounts}</p></div></CardContent></Card>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card><CardContent className="p-6"><h3 className="text-lg font-bold">الإيرادات والمصروفات</h3><FinancialChart data={summary} /></CardContent></Card>
          </div>
        </main>
      </div>
    </div>
  );
}
