// المحتوى الكامل لملف client/src/pages/financial-reports.tsx (محدّث)
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils"; // <-- تعديل هنا
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FinancialChart from "@/components/accounting/FinancialChart";
import { FileText, Download, Printer, BarChart3, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";

export default function FinancialReports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("income-statement");
  const [reportPeriod, setReportPeriod] = useState("current-month");
  const companyId = 1; // For demo

  const { data: financialSummary, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  const { data: accounts, error: accountsError } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  const { data: accountBalances, error: balancesError } = useQuery({
    queryKey: ["/api/companies", companyId, "account-balances"],
  });

  useEffect(() => {
    const errors = [summaryError, accountsError, balancesError].filter(Boolean);
    for (const error of errors) {
      if (error && isUnauthorizedError(error)) {
        toast({
          title: "غير مخول",
          description: "تم تسجيل خروجك. سيتم توجيهك لصفحة الدخول.",
          variant: "destructive",
        });
        redirectToLogin(); // <-- تعديل هنا
        return;
      }
    }
  }, [summaryError, accountsError, balancesError, toast]);

  const summary = (financialSummary as any) || { totalRevenue: 0, totalExpenses: 0, netProfit: 0 };
  // بقية الكود يبقى كما هو...
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="التقارير المالية" subtitle="تقارير شاملة للوضع المالي" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* بقية الواجهة تبقى كما هي */}
        </main>
      </div>
    </div>
  );
}
