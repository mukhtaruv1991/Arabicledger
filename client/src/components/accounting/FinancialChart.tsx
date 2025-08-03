interface FinancialChartProps {
  data: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalAccounts: number;
  };
}

export default function FinancialChart({ data }: FinancialChartProps) {
  return (
    <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white" data-testid="financial-chart">
      <div className="text-center">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <p className="text-lg font-medium">رسم بياني للإيرادات والمصروفات</p>
        <p className="text-sm opacity-80 mt-2">
          الإيرادات: {data.totalRevenue.toLocaleString('ar-SA')} ر.س
        </p>
        <p className="text-sm opacity-80">
          المصروفات: {data.totalExpenses.toLocaleString('ar-SA')} ر.س
        </p>
        <p className="text-sm opacity-80">
          صافي الربح: {data.netProfit.toLocaleString('ar-SA')} ر.س
        </p>
      </div>
    </div>
  );
}

// Import BarChart3 from lucide-react
import { BarChart3 } from "lucide-react";
