import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FinancialChart from "@/components/accounting/FinancialChart";
import { 
  FileText, 
  Download, 
  Printer, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Calendar
} from "lucide-react";

export default function FinancialReports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("income-statement");
  const [reportPeriod, setReportPeriod] = useState("current-month");

  // For demo, using company ID 1
  const companyId = 1;

  const { data: financialSummary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  const { data: accountBalances, isLoading: balancesLoading, error: balancesError } = useQuery({
    queryKey: ["/api/companies", companyId, "account-balances"],
  });

  // Handle errors with useEffect
  useEffect(() => {
    const errors = [summaryError, accountsError, balancesError].filter(Boolean);
    for (const error of errors) {
      if (error && isUnauthorizedError(error)) {
        toast({
          title: "غير مخول",
          description: "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  }, [summaryError, accountsError, balancesError, toast]);

  // Prepare data with defaults
  const summary = financialSummary || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalAccounts: 0,
  };
  
  const accountsData = accounts || [];
  const balancesData = accountBalances || [];

  const summary = financialSummary || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalAccounts: 0,
  };

  const handleExportReport = (format: string) => {
    toast({
      title: "تصدير التقرير",
      description: `جاري تصدير التقرير بصيغة ${format}...`,
    });
  };

  const handlePrintReport = () => {
    window.print();
  };

  const getReportTitle = () => {
    switch (reportType) {
      case "income-statement": return "قائمة الدخل";
      case "balance-sheet": return "الميزانية العمومية";
      case "cash-flow": return "قائمة التدفقات النقدية";
      case "trial-balance": return "ميزان المراجعة";
      case "account-statement": return "كشف حساب";
      default: return "التقرير المالي";
    }
  };

  const getPeriodLabel = () => {
    switch (reportPeriod) {
      case "current-month": return "الشهر الحالي";
      case "current-quarter": return "الربع الحالي";
      case "current-year": return "السنة الحالية";
      case "last-month": return "الشهر الماضي";
      case "last-quarter": return "الربع الماضي";
      case "last-year": return "السنة الماضية";
      default: return "الفترة المحددة";
    }
  };

  const renderIncomeStatement = () => (
    <div className="space-y-6">
      {/* Revenue Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 ml-2 text-green-600" />
          الإيرادات
        </h4>
        <div className="space-y-2">
          {accountsData.filter((account: any) => account.type === 'revenue').map((account: any) => {
            const balance = balancesData.find((b: any) => b.accountId === account.id);
            return (
              <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{account.nameArabic || account.name}</span>
                <span className="font-medium arabic-number amount-positive">
                  {Number(balance?.creditBalance || 0).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            );
          })}
          <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold">
            <span>إجمالي الإيرادات</span>
            <span className="arabic-number amount-positive text-lg">
              {summary.totalRevenue.toLocaleString('ar-SA')} ر.س
            </span>
          </div>
        </div>
      </div>

      {/* Expenses Section */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingDown className="w-5 h-5 ml-2 text-red-600" />
          المصروفات
        </h4>
        <div className="space-y-2">
          {accountsData.filter((account: any) => account.type === 'expenses').map((account: any) => {
            const balance = balancesData.find((b: any) => b.accountId === account.id);
            return (
              <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{account.nameArabic || account.name}</span>
                <span className="font-medium arabic-number amount-negative">
                  {Number(balance?.debitBalance || 0).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            );
          })}
          <div className="flex justify-between items-center py-3 border-t-2 border-gray-300 font-bold">
            <span>إجمالي المصروفات</span>
            <span className="arabic-number amount-negative text-lg">
              {summary.totalExpenses.toLocaleString('ar-SA')} ر.س
            </span>
          </div>
        </div>
      </div>

      {/* Net Profit Section */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <h4 className="text-xl font-bold text-gray-900 flex items-center">
            <DollarSign className="w-6 h-6 ml-2 text-blue-600" />
            صافي الربح/الخسارة
          </h4>
          <span className={`text-2xl font-bold arabic-number ${summary.netProfit >= 0 ? 'amount-positive' : 'amount-negative'}`}>
            {summary.netProfit.toLocaleString('ar-SA')} ر.س
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {summary.netProfit >= 0 ? 'ربح' : 'خسارة'} للفترة من {getPeriodLabel()}
        </p>
      </div>
    </div>
  );

  const renderBalanceSheet = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Assets */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">الأصول</h4>
        <div className="space-y-2">
          {accounts?.filter((account: any) => account.type === 'assets').map((account: any) => {
            const balance = accountBalances?.find((b: any) => b.accountId === account.id);
            return (
              <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">{account.nameArabic || account.name}</span>
                <span className="font-medium arabic-number">
                  {Number(balance?.debitBalance || 0).toLocaleString('ar-SA')} ر.س
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liabilities & Equity */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">الخصوم وحقوق الملكية</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">الخصوم</h5>
            <div className="space-y-2">
              {accounts?.filter((account: any) => account.type === 'liabilities').map((account: any) => {
                const balance = accountBalances?.find((b: any) => b.accountId === account.id);
                return (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{account.nameArabic || account.name}</span>
                    <span className="font-medium arabic-number">
                      {Number(balance?.creditBalance || 0).toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-800 mb-2">حقوق الملكية</h5>
            <div className="space-y-2">
              {accounts?.filter((account: any) => account.type === 'equity').map((account: any) => {
                const balance = accountBalances?.find((b: any) => b.accountId === account.id);
                return (
                  <div key={account.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{account.nameArabic || account.name}</span>
                    <span className="font-medium arabic-number">
                      {Number(balance?.creditBalance || 0).toLocaleString('ar-SA')} ر.س
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrialBalance = () => (
    <div className="overflow-x-auto">
      <table className="w-full accounting-table">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-right py-3 px-4 font-medium text-gray-600">رمز الحساب</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">اسم الحساب</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">مدين</th>
            <th className="text-right py-3 px-4 font-medium text-gray-600">دائن</th>
          </tr>
        </thead>
        <tbody>
          {accounts?.map((account: any) => {
            const balance = accountBalances?.find((b: any) => b.accountId === account.id);
            const debitBalance = Number(balance?.debitBalance || 0);
            const creditBalance = Number(balance?.creditBalance || 0);
            
            if (debitBalance === 0 && creditBalance === 0) return null;
            
            return (
              <tr key={account.id} className="border-b border-gray-100">
                <td className="py-3 px-4 arabic-number font-mono">{account.code}</td>
                <td className="py-3 px-4">{account.nameArabic || account.name}</td>
                <td className="py-3 px-4 arabic-number font-medium">
                  {debitBalance > 0 ? debitBalance.toLocaleString('ar-SA') : '-'}
                </td>
                <td className="py-3 px-4 arabic-number font-medium">
                  {creditBalance > 0 ? creditBalance.toLocaleString('ar-SA') : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderReportContent = () => {
    if (summaryLoading || accountsLoading || balancesLoading) {
      return (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      );
    }

    switch (reportType) {
      case "income-statement":
        return renderIncomeStatement();
      case "balance-sheet":
        return renderBalanceSheet();
      case "trial-balance":
        return renderTrialBalance();
      case "cash-flow":
        return (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>قائمة التدفقات النقدية قيد التطوير</p>
          </div>
        );
      case "account-statement":
        return (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>كشف الحساب قيد التطوير</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar title="التقارير المالية" subtitle="تقارير شاملة للوضع المالي" />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-green-600 mt-2" data-testid="total-revenue">
                      <span className="arabic-number">{summary.totalRevenue.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
                    <p className="text-2xl font-bold text-red-600 mt-2" data-testid="total-expenses">
                      <span className="arabic-number">{summary.totalExpenses.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                    <p className={`text-2xl font-bold mt-2 ${summary.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`} data-testid="net-profit">
                      <span className="arabic-number">{summary.netProfit.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">نظرة عامة على الأداء المالي</h3>
              <FinancialChart data={summary} />
            </CardContent>
          </Card>

          {/* Reports Section */}
          <Card>
            <CardContent className="p-6">
              {/* Report Controls */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-48" data-testid="select-report-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income-statement">قائمة الدخل</SelectItem>
                      <SelectItem value="balance-sheet">الميزانية العمومية</SelectItem>
                      <SelectItem value="trial-balance">ميزان المراجعة</SelectItem>
                      <SelectItem value="cash-flow">قائمة التدفقات النقدية</SelectItem>
                      <SelectItem value="account-statement">كشف حساب</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={reportPeriod} onValueChange={setReportPeriod}>
                    <SelectTrigger className="w-48" data-testid="select-report-period">
                      <Calendar className="w-4 h-4 ml-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current-month">الشهر الحالي</SelectItem>
                      <SelectItem value="current-quarter">الربع الحالي</SelectItem>
                      <SelectItem value="current-year">السنة الحالية</SelectItem>
                      <SelectItem value="last-month">الشهر الماضي</SelectItem>
                      <SelectItem value="last-quarter">الربع الماضي</SelectItem>
                      <SelectItem value="last-year">السنة الماضية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    variant="outline"
                    onClick={handlePrintReport}
                    data-testid="button-print-report"
                  >
                    <Printer className="w-4 h-4 ml-2" />
                    طباعة
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExportReport('PDF')}
                    data-testid="button-export-pdf"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تصدير PDF
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleExportReport('Excel')}
                    data-testid="button-export-excel"
                  >
                    <Download className="w-4 h-4 ml-2" />
                    تصدير Excel
                  </Button>
                </div>
              </div>

              {/* Report Header */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900" data-testid="report-title">
                  {getReportTitle()}
                </h2>
                <p className="text-gray-600 mt-2" data-testid="report-period">
                  الفترة: {getPeriodLabel()} | تاريخ التقرير: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </div>

              {/* Report Content */}
              <div className="report-content" data-testid="report-content">
                {renderReportContent()}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
