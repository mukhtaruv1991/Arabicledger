// المحتوى الكامل لملف client/src/pages/dashboard.tsx (محدّث وكامل)
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FinancialChart from "@/components/accounting/FinancialChart";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Plus,
  Download,
  Eye,
  Edit,
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const companyId = 1; // For demo

  const { data: financialSummary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  const { data: recentEntries, isLoading: entriesLoading, error: entriesError } = useQuery({
    queryKey: ["/api/companies", companyId, "journal-entries"],
  });

  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  useEffect(() => {
    const errors = [summaryError, entriesError, accountsError].filter(Boolean);
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
  }, [summaryError, entriesError, accountsError, toast]);

  const summary = (financialSummary as any) || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, totalAccounts: 0 };
  const entriesData = (recentEntries as any[]) || [];
  const accountsData = (accounts as any[]) || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="لوحة التحكم" subtitle="مرحباً بك في نظام المحاسبة الذكي" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-revenue">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-revenue-amount">
                      <span className="arabic-number">{summary.totalRevenue.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-expenses">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-expenses-amount">
                      <span className="arabic-number">{summary.totalExpenses.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="text-red-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-profit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-profit-amount">
                      <span className="arabic-number">{summary.netProfit.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-accounts">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">عدد الحسابات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-accounts-count">
                      <span className="arabic-number">{summary.totalAccounts}</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-yellow-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Tables Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">الإيرادات والمصروفات</h3>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>آخر ٦ أشهر</option>
                    <option>آخر سنة</option>
                  </select>
                </div>
                <FinancialChart data={summary} />
              </CardContent>
            </Card>
            <Card data-testid="card-recent-transactions">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">آخر المعاملات</h3>
                  <Button variant="link" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    عرض الكل
                  </Button>
                </div>
                <div className="space-y-4">
                  {entriesLoading ? (
                    <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="animate-pulse"><div className="h-4 bg-gray-200 rounded w-24 mb-2"></div><div className="h-3 bg-gray-200 rounded w-16"></div></div>)}</div>
                  ) : entriesData && entriesData.length > 0 ? (
                    entriesData.slice(0, 4).map((entry: any) => {
                      const isRevenue = entry.details.some((detail: any) => detail.account.type === 'revenue' && Number(detail.credit) > 0);
                      return (
                        <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg" data-testid={`transaction-${entry.id}`}>
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isRevenue ? 'bg-green-100' : 'bg-red-100'}`}>
                              {isRevenue ? <Plus className="text-green-600" /> : <TrendingDown className="text-red-600" />}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900" data-testid={`transaction-description-${entry.id}`}>{entry.descriptionArabic || entry.description}</p>
                              <p className="text-sm text-gray-500" data-testid={`transaction-date-${entry.id}`}>{new Date(entry.date).toLocaleDateString('ar-SA')}</p>
                            </div>
                          </div>
                          <span className={`font-bold ${isRevenue ? 'text-green-600' : 'text-red-600'}`} data-testid={`transaction-amount-${entry.id}`}>
                            {isRevenue ? '+' : '-'}{Number(entry.totalDebit).toLocaleString('ar-SA')} ر.س
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-500" data-testid="empty-transactions">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>لا توجد معاملات حديثة</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
