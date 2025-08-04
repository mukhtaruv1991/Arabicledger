import { useState } from "react";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

export default function Landing() {
  const [view, setView] = useState<'login' | 'signup'>('login');

  const renderContent = () => {
    if (view === 'login') {
      return <LoginForm onSwitchToSignup={() => setView('signup')} />;
    }
    if (view === 'signup') {
      return <SignupForm onSwitchToLogin={() => setView('login')} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div><h1 className="text-xl font-bold text-gray-900">نظام المحاسبة الذكي</h1></div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {renderContent()}
      </main>
    </div>
  );
}
