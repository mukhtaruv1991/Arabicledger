import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
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

  // Get current company (for demo, we'll use company ID 1)
  const companyId = 1;

  const { data: financialSummary, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  const { data: recentEntries, isLoading: entriesLoading, error: entriesError } = useQuery({
    queryKey: ["/api/companies", companyId, "journal-entries"],
  });

  const { data: accounts, isLoading: accountsLoading, error: accountsError } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  // Handle errors with useEffect
  useEffect(() => {
    const errors = [summaryError, entriesError, accountsError].filter(Boolean);
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
  }, [summaryError, entriesError, accountsError, toast]);

  const summary = financialSummary || {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalAccounts: 0,
  };

  const entriesData = recentEntries || [];
  const accountsData = accounts || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar title="لوحة التحكم" subtitle="مرحباً بك في نظام المحاسبة الذكي" />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-revenue">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-revenue-amount">
                      <span className="arabic-number">{summary.totalRevenue.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      <TrendingUp className="inline w-4 h-4 ml-1" />
                      <span className="arabic-number">+١٢%</span> من الشهر الماضي
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-green-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expenses Card */}
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-expenses">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المصروفات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-expenses-amount">
                      <span className="arabic-number">{summary.totalExpenses.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                    <p className="text-sm text-red-600 mt-1">
                      <TrendingDown className="inline w-4 h-4 ml-1" />
                      <span className="arabic-number">-٥%</span> من الشهر الماضي
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <TrendingDown className="text-red-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit Card */}
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-profit">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">صافي الربح</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-profit-amount">
                      <span className="arabic-number">{summary.netProfit.toLocaleString('ar-SA')}</span> ر.س
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      <TrendingUp className="inline w-4 h-4 ml-1" />
                      <span className="arabic-number">+٢٨%</span> من الشهر الماضي
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-blue-600 text-lg" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accounts Card */}
            <Card className="hover:shadow-lg transition-all duration-200" data-testid="card-accounts">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">عدد الحسابات</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="text-accounts-count">
                      <span className="arabic-number">{summary.totalAccounts}</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="arabic-number">+٨</span> حسابات جديدة
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
            {/* Financial Chart */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">الإيرادات والمصروفات</h3>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>آخر ٦ أشهر</option>
                    <option>آخر سنة</option>
                    <option>آخر ٣ سنوات</option>
                  </select>
                </div>
                <FinancialChart data={summary} />
              </CardContent>
            </Card>

            {/* Recent Transactions */}
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
                    <div className="space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                              <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                              </div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : entriesData && entriesData.length > 0 ? (
                    entriesData.slice(0, 4).map((entry: any) => {
                      const isRevenue = entry.details.some((detail: any) => 
                        detail.account.type === 'revenue' && Number(detail.credit) > 0
                      );
                      return (
                        <div key={entry.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg" data-testid={`transaction-${entry.id}`}>
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isRevenue ? 'bg-green-100' : 'bg-red-100'}`}>
                              {isRevenue ? (
                                <Plus className="text-green-600" />
                              ) : (
                                <TrendingDown className="text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900" data-testid={`transaction-description-${entry.id}`}>
                                {entry.descriptionArabic || entry.description}
                              </p>
                              <p className="text-sm text-gray-500" data-testid={`transaction-date-${entry.id}`}>
                                {new Date(entry.date).toLocaleDateString('ar-SA')}
                              </p>
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

          {/* Account Summary Table */}
          <Card className="mb-8" data-testid="card-account-summary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">ملخص الحسابات</h3>
                <div className="flex space-x-2 space-x-reverse">
                  <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-account">
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة حساب جديد
                  </Button>
                  <Button variant="outline" data-testid="button-export">
                    <Download className="w-4 h-4 ml-2" />
                    تصدير
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-medium text-gray-600">رمز الحساب</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">اسم الحساب</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">نوع الحساب</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">الرصيد</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accountsLoading ? (
                      [...Array(4)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td>
                        </tr>
                      ))
                    ) : accountsData && accountsData.length > 0 ? (
                      accountsData.slice(0, 4).map((account: any) => (
                        <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`account-row-${account.id}`}>
                          <td className="py-3 px-4 arabic-number" data-testid={`account-code-${account.id}`}>{account.code}</td>
                          <td className="py-3 px-4 font-medium" data-testid={`account-name-${account.id}`}>
                            {account.nameArabic || account.name}
                          </td>
                          <td className="py-3 px-4 text-gray-600" data-testid={`account-type-${account.id}`}>
                            {account.type === 'assets' ? 'أصول' :
                             account.type === 'liabilities' ? 'خصوم' :
                             account.type === 'equity' ? 'حقوق الملكية' :
                             account.type === 'revenue' ? 'إيرادات' :
                             account.type === 'expenses' ? 'مصروفات' : account.type}
                          </td>
                          <td className="py-3 px-4 font-bold text-green-600 arabic-number" data-testid={`account-balance-${account.id}`}>
                            ٠ ر.س
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`} data-testid={`account-status-${account.id}`}>
                              {account.isActive ? 'نشط' : 'غير نشط'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2 space-x-reverse">
                              <button className="text-blue-600 hover:text-blue-700" data-testid={`button-edit-account-${account.id}`}>
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600" data-testid={`button-view-account-${account.id}`}>
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500" data-testid="empty-accounts">
                          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>لا توجد حسابات</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {accountsData && accountsData.length > 4 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    عرض <span className="arabic-number">١-٤</span> من <span className="arabic-number">{accountsData.length}</span> حساب
                  </p>
                  <div className="flex space-x-2 space-x-reverse">
                    <Button variant="outline" size="sm">السابق</Button>
                    <Button variant="outline" size="sm" className="bg-blue-600 text-white">١</Button>
                    <Button variant="outline" size="sm">٢</Button>
                    <Button variant="outline" size="sm">٣</Button>
                    <Button variant="outline" size="sm">التالي</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card data-testid="card-quick-actions">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">إجراءات سريعة</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group" data-testid="button-quick-add-entry">
                  <div className="text-center">
                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 group-hover:text-blue-600">إضافة قيد جديد</p>
                  </div>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group" data-testid="button-quick-create-report">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 group-hover:text-blue-600">إنشاء تقرير</p>
                  </div>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group" data-testid="button-quick-add-company">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 group-hover:text-blue-600">إضافة شركة</p>
                  </div>
                </button>

                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group" data-testid="button-quick-setup-bot">
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-3" />
                    <p className="font-medium text-gray-700 group-hover:text-blue-600">إعداد البوت</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-6">
        <Button className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-200" data-testid="button-floating-add">
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
