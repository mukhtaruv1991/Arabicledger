import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Filter, UserPlus, Shield, User, Crown } from "lucide-react";

export default function UsersManagement() {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Mock users data since we don't have a users API endpoint
  const mockUsers = [
    {
      id: "1",
      firstName: "أحمد",
      lastName: "محمد",
      email: "ahmed@example.com",
      role: "admin",
      isActive: true,
      createdAt: "2025-01-01",
      profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: "2",
      firstName: "فاطمة",
      lastName: "أحمد",
      email: "fatima@example.com",
      role: "accountant",
      isActive: true,
      createdAt: "2025-01-05",
      profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b90ee8ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: "3",
      firstName: "محمد",
      lastName: "علي",
      email: "mohammed@example.com",
      role: "user",
      isActive: true,
      createdAt: "2025-01-10",
      profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    },
    {
      id: "4",
      firstName: "نورا",
      lastName: "سالم",
      email: "nora@example.com",
      role: "user",
      isActive: false,
      createdAt: "2025-01-15",
      profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
    }
  ];

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'مدير النظام';
      case 'accountant': return 'محاسب';
      case 'user': return 'مستخدم';
      default: return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'accountant': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'user': return <User className="w-4 h-4 text-gray-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-yellow-100 text-yellow-800';
      case 'accountant': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (userId: string, newRole: string) => {
    toast({
      title: "تحديث الصلاحية",
      description: `تم تحديث صلاحية المستخدم إلى ${getRoleLabel(newRole)}`,
    });
  };

  const handleActivateUser = (userId: string, isActive: boolean) => {
    toast({
      title: isActive ? "تفعيل المستخدم" : "إلغاء تفعيل المستخدم",
      description: `تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} المستخدم بنجاح`,
    });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar title="إدارة المستخدمين" subtitle="إدارة المستخدمين والصلاحيات" />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2" data-testid="total-users">
                      <span className="arabic-number">{mockUsers.length}</span>
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المديرين</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-2" data-testid="admin-users">
                      <span className="arabic-number">{mockUsers.filter(u => u.role === 'admin').length}</span>
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المحاسبين</p>
                    <p className="text-2xl font-bold text-blue-600 mt-2" data-testid="accountant-users">
                      <span className="arabic-number">{mockUsers.filter(u => u.role === 'accountant').length}</span>
                    </p>
                  </div>
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">المستخدمين النشطين</p>
                    <p className="text-2xl font-bold text-green-600 mt-2" data-testid="active-users">
                      <span className="arabic-number">{mockUsers.filter(u => u.isActive).length}</span>
                    </p>
                  </div>
                  <User className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في المستخدمين..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-64"
                      data-testid="input-search-users"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48" data-testid="select-filter-role">
                      <Filter className="w-4 h-4 ml-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأدوار</SelectItem>
                      <SelectItem value="admin">مدير النظام</SelectItem>
                      <SelectItem value="accountant">محاسب</SelectItem>
                      <SelectItem value="user">مستخدم</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-user">
                  <UserPlus className="w-4 h-4 ml-2" />
                  إضافة مستخدم جديد
                </Button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full accounting-table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-medium text-gray-600">المستخدم</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">البريد الإلكتروني</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">الدور</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">تاريخ الانضمام</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`user-row-${user.id}`}>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <img
                              src={user.profileImageUrl}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="w-10 h-10 rounded-full object-cover"
                              data-testid={`user-avatar-${user.id}`}
                            />
                            <div>
                              <p className="font-medium text-gray-900" data-testid={`user-name-${user.id}`}>
                                {user.firstName} {user.lastName}
                              </p>
                              {user.id === currentUser?.id && (
                                <span className="text-xs text-blue-600">أنت</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600" data-testid={`user-email-${user.id}`}>
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {getRoleIcon(user.role)}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`} data-testid={`user-role-${user.id}`}>
                              {getRoleLabel(user.role)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive ? 'status-active' : 'status-inactive'
                          }`} data-testid={`user-status-${user.id}`}>
                            {user.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-600 arabic-number" data-testid={`user-created-${user.id}`}>
                          {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2 space-x-reverse">
                            {currentUser?.role === 'admin' && user.id !== currentUser?.id && (
                              <>
                                <Select
                                  value={user.role}
                                  onValueChange={(newRole) => handleRoleChange(user.id, newRole)}
                                >
                                  <SelectTrigger className="w-32" data-testid={`select-user-role-${user.id}`}>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">مدير النظام</SelectItem>
                                    <SelectItem value="accountant">محاسب</SelectItem>
                                    <SelectItem value="user">مستخدم</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleActivateUser(user.id, !user.isActive)}
                                  className={user.isActive ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                                  data-testid={`button-toggle-user-${user.id}`}
                                >
                                  {user.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                                </Button>
                              </>
                            )}
                            {(currentUser?.role !== 'admin' || user.id === currentUser?.id) && (
                              <span className="text-sm text-gray-500">لا توجد عمليات متاحة</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-500" data-testid="empty-users">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">لا توجد مستخدمين</p>
                  <p className="text-sm mt-1">لم يتم العثور على مستخدمين يطابقون البحث</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
