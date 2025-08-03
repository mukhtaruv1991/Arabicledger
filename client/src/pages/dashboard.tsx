// المحتوى الكامل لملف client/src/pages/dashboard.tsx (محدّث)
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils"; // <-- تعديل هنا
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

  const { data: financialSummary, error: summaryError } = useQuery({
    queryKey: ["/api/companies", companyId, "financial-summary"],
  });

  const { data: recentEntries, error: entriesError } = useQuery({
    queryKey: ["/api/companies", companyId, "journal-entries"],
  });

  const { data: accounts, error: accountsError } = useQuery({
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
        redirectToLogin(); // <-- تعديل هنا
        return;
      }
    }
  }, [summaryError, entriesError, accountsError, toast]);

  const summary = (financialSummary as any) || { totalRevenue: 0, totalExpenses: 0, netProfit: 0, totalAccounts: 0 };
  const entriesData = (recentEntries as any[]) || [];
  const accountsData = (accounts as any[]) || [];

  // بقية الكود يبقى كما هو...
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
          {/* بقية الواجهة تبقى كما هي */}
        </main>
      </div>
    </div>
  );
}
