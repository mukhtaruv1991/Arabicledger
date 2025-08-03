import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, Users, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">نظام المحاسبة الذكي</h1>
                <p className="text-sm text-gray-500">إدارة مالية متطورة</p>
              </div>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-login"
            >
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            نظام المحاسبة الذكي
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            نظام محاسبة شامل يدعم اللغة العربية مع واجهة حديثة وتكامل مع تطبيق تيليجرام للإدارة المالية المتطورة
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-get-started"
            >
              ابدأ الآن
            </Button>
            <Button variant="outline" size="lg" data-testid="button-learn-more">
              تعرف على المزيد
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">دليل الحسابات</h3>
              <p className="text-gray-600 text-sm">
                إدارة شاملة لجميع الحسابات المالية مع التصنيف الهيكلي
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">التقارير المالية</h3>
              <p className="text-gray-600 text-sm">
                تقارير مالية شاملة ومخططات بيانية لتحليل الأداء المالي
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">إدارة الشركات</h3>
              <p className="text-gray-600 text-sm">
                دعم الشركات المتعددة مع إدارة منفصلة لكل شركة
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">تكامل تيليجرام</h3>
              <p className="text-gray-600 text-sm">
                بوت تيليجرام للوصول السريع للبيانات المالية والتقارير
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-center mb-8">المزايا الرئيسية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-600">المحاسبة المتطورة</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• دليل حسابات شامل ومرن</li>
                <li>• قيود محاسبية تلقائية وآمنة</li>
                <li>• حسابات فرعية متعددة المستويات</li>
                <li>• تتبع الأرصدة في الوقت الفعلي</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-green-600">التقارير والتحليل</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• تقارير مالية معيارية</li>
                <li>• مخططات بيانية تفاعلية</li>
                <li>• تصدير البيانات بصيغ متعددة</li>
                <li>• تحليل الاتجاهات المالية</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-purple-600">إدارة الأعمال</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• دعم الشركات المتعددة</li>
                <li>• إدارة المستخدمين والصلاحيات</li>
                <li>• النسخ الاحتياطي التلقائي</li>
                <li>• الأمان والحماية المتقدمة</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-600">التكامل الذكي</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• بوت تيليجرام للاستعلامات</li>
                <li>• إشعارات فورية ومخصصة</li>
                <li>• واجهة برمجة تطبيقات مفتوحة</li>
                <li>• تكامل مع الأنظمة الخارجية</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © ٢٠٢٥ نظام المحاسبة الذكي. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
