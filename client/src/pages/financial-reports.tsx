// المحتوى الكامل لملف client/src/pages/financial-reports.tsx (محدّث وكامل)
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils";
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

  const { data: financialSummary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  const { data: accountBalances, isLoading: balancesLoading, error: balancesError } = useQuery({
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
        redirectToLogin();
        return;
      }
    }
  }, [summaryError, accountsError, balancesError, toast]);

  const summary = (financialSummary as any) || { totalRevenue: 0, totalExpenses: 0, netProfit: 0 };
  const accountsData = (accounts as any[]) || [];
  const balancesData = (accountBalances as any[]) || [];

  const handleExportReport = (format: string) => toast({ title: "تصدير التقرير", description: `جاري تصدير التقرير بصيغة ${format}...` });
  const handlePrintReport = () => window.print();

  const getReportTitle = () => {
    switch (reportType) {
      case "income-statement": return "قائمة الدخل";
      case "balance-sheet": return "الميزانية العمومية";
      case "trial-balance": return "ميزان المراجعة";
      default: return "التقرير المالي";
    }
  };

  const renderIncomeStatement = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 ml-2 text-green-600" />الإيرادات</h4>
        <div className="space-y-2">
          {accountsData.filter(a => a.type === 'revenue').map(a => <div key={a.id} className="flex justify-between items-center py-2 border-b border-gray-100"><span>{a.nameArabic}</span><span className="font-medium arabic-number amount-positive">{Number(balancesData.find(b => b.accountId === a.id)?.creditBalance || 0).toLocaleString('ar-SA')} ر.س</span></div>)}
          <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold"><span>إجمالي الإيرادات</span><span className="arabic-number amount-positive text-lg">{summary.totalRevenue.toLocaleString('ar-SA')} ر.س</span></div>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><TrendingDown className="w-5 h-5 ml-2 text-red-600" />المصروفات</h4>
        <div className="space-y-2">
          {accountsData.filter(a => a.type === 'expenses').map(a => <div key={a.id} className="flex justify-between items-center py-2 border-b border-gray-100"><span>{a.nameArabic}</span><span className="font-medium arabic-number amount-negative">{Number(balancesData.find(b => b.accountId === a.id)?.debitBalance || 0).toLocaleString('ar-SA')} ر.س</span></div>)}
          <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold"><span>إجمالي المصروفات</span><span className="arabic-number amount-negative text-lg">{summary.totalExpenses.toLocaleString('ar-SA')} ر.س</span></div>
        </div>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-bold text-gray-900 flex items-center"><DollarSign className="w-6 h-6 ml-2 text-blue-600" />صافي الربح/الخسارة</h4>
          <span className={`text-2xl font-bold arabic-number ${summary.netProfit >= 0 ? 'amount-positive' : 'amount-negative'}`}>{summary.netProfit.toLocaleString('ar-SA')} ر.س</span>
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    if (summaryLoading || accountsLoading || balancesLoading) {
      return <div className="text-center py-12">جاري تحميل البيانات...</div>;
    }
    if (reportType === "income-statement") {
      return renderIncomeStatement();
    }
    return <div className="text-center py-12 text-gray-500"><FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" /><p>هذا التقرير قيد التطوير</p></div>;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="التقارير المالية" subtitle="تقارير شاملة للوضع المالي" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income-statement">قائمة الدخل</SelectItem>
                      <SelectItem value="balance-sheet">الميزانية العمومية</SelectItem>
                      <SelectItem value="trial-balance">ميزان المراجعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <Button variant="outline" onClick={handlePrintReport}><Printer className="w-4 h-4 ml-2" />طباعة</Button>
                  <Button variant="outline" onClick={() => handleExportReport('PDF')}><Download className="w-4 h-4 ml-2" />تصدير PDF</Button>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{getReportTitle()}</h2>
                <p className="text-gray-600 mt-2">تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}</p>
              </div>
              <div className="report-content">{renderReportContent()}</div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
