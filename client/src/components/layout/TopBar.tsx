import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun } from "lucide-react";
import { useState } from "react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4" data-testid="top-bar">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">{title}</h2>
          {subtitle && (
            <p className="text-gray-600" data-testid="page-subtitle">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            data-testid="button-theme-toggle"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gray-600" />
            ) : (
              <Moon className="w-4 h-4 text-gray-600" />
            )}
          </Button>
          
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors relative"
            data-testid="button-notifications"
          >
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" data-testid="notification-badge">
              3
            </span>
          </Button>
          
          {/* Current Date */}
          <div className="text-sm text-gray-500" data-testid="current-date">
            <span className="arabic-number">{new Date().toLocaleDateString('ar-SA')}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
