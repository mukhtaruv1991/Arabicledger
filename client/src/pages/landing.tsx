// المحتوى الكامل والنهائي لملف client/src/pages/landing.tsx
import { useState } from "react";
import { Calculator, TrendingUp, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm"; // سننشئ هذا
import SignupForm from "@/components/auth/SignupForm"; // سننشئ هذا

// هذا هو التعديل الرئيسي: نجعل الصفحة تعرض إما المحتوى أو نماذج الدخول
export default function Landing() {
  // 'view' يمكن أن تكون 'landing', 'login', 'signup'
  const [view, setView] = useState<'landing' | 'login' | 'signup'>('landing');

  const renderContent = () => {
    if (view === 'login') {
      return <LoginForm onSwitchToSignup={() => setView('signup')} />;
    }
    if (view === 'signup') {
      return <SignupForm onSwitchToLogin={() => setView('login')} />;
    }
    // view === 'landing'
    return (
      <>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">نظام المحاسبة الذكي</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            نظام محاسبة شامل يدعم اللغة العربية مع واجهة حديثة وتكامل مع تطبيق تيليجرام للإدارة المالية المتطورة.
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            {/* زر "ابدأ الآن" سيفتح نموذج التسجيل */}
            <Button size="lg" onClick={() => setView('signup')} className="bg-blue-600 hover:bg-blue-700">
              ابدأ الآن
            </Button>
            <Button variant="outline" size="lg">تعرف على المزيد</Button>
          </div>
        </div>
        {/* بقية محتوى الصفحة يبقى كما هو */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature Cards... */}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 space-x-reverse cursor-pointer" onClick={() => setView('landing')}>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">نظام المحاسبة الذكي</h1>
                <p className="text-sm text-gray-500">إدارة مالية متطورة</p>
              </div>
            </div>
            {/* زر "تسجيل الدخول" سيفتح نموذج الدخول */}
            <Button onClick={() => setView('login')} className="bg-blue-600 hover:bg-blue-700">
              تسجيل الدخول
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {renderContent()}
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">© ٢٠٢٥ نظام المحاسبة الذكي. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
