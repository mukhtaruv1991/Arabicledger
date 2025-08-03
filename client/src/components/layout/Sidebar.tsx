import { Link, useLocation } from "wouter";
import { Calculator, BarChart3, FileText, Building2, Users, MessageSquare, Home, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "لوحة التحكم", href: "/", icon: Home, current: false },
  { name: "دليل الحسابات", href: "/chart-of-accounts", icon: FileText, current: false },
  { name: "القيود المحاسبية", href: "/journal-entries", icon: Calculator, current: false },
  { name: "التقارير المالية", href: "/financial-reports", icon: BarChart3, current: false },
  { name: "إدارة الشركات", href: "/companies", icon: Building2, current: false },
  { name: "إدارة المستخدمين", href: "/users", icon: Users, current: false },
  { name: "بوت تيليجرام", href: "/telegram-bot", icon: MessageSquare, current: false },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const userData = user || {};

  return (
    <div className="w-64 bg-white shadow-lg border-l border-gray-200 flex flex-col" data-testid="sidebar">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">نظام المحاسبة</h1>
            <p className="text-sm text-gray-500">الذكي</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-4" data-testid="navigation-menu">
        <div className="px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:border-r-3 hover:border-blue-600 ${
                    isActive
                      ? "bg-blue-50 border-r-3 border-blue-600 text-blue-600"
                      : ""
                  }`}
                  data-testid={`nav-${item.href.replace("/", "") || "dashboard"}`}
                >
                  <item.icon className="w-5 h-5 ml-3" />
                  <span className="font-medium">{item.name}</span>
                </a>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200" data-testid="user-profile">
        <div className="flex items-center space-x-3 space-x-reverse">
          <img
            src={userData?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"}
            alt="صورة المستخدم"
            className="w-10 h-10 rounded-full object-cover"
            data-testid="user-avatar"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900" data-testid="user-name">
              {userData?.firstName || "مستخدم"} {userData?.lastName || ""}
            </p>
            <p className="text-xs text-gray-500" data-testid="user-role">
              {userData?.role === "admin" ? "مدير النظام" : "مستخدم"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = "/api/logout"}
            className="text-gray-400 hover:text-gray-600"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
