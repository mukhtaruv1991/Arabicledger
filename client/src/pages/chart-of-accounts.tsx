// المحتوى الكامل لملف client/src/pages/chart-of-accounts.tsx (محدّث وكامل)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, Filter } from "lucide-react";

export default function ChartOfAccounts() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const companyId = 1; // For demo

  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
      toast({
        title: "غير مخول",
        description: "تم تسجيل خروجك. سيتم توجيهك لصفحة الدخول.",
        variant: "destructive",
      });
      redirectToLogin();
      return;
    }
  }, [error, toast]);

  const createAccountMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/accounts", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "accounts"] });
      toast({ title: "تم بنجاح", description: "تم إنشاء الحساب بنجاح" });
      setIsDialogOpen(false);
      setEditingAccount(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل في إنشاء الحساب", variant: "destructive" }),
  });

  const updateAccountMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/accounts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "accounts"] });
      toast({ title: "تم بنجاح", description: "تم تحديث الحساب بنجاح" });
      setIsDialogOpen(false);
      setEditingAccount(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل في تحديث الحساب", variant: "destructive" }),
  });

  const deleteAccountMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/accounts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "accounts"] });
      toast({ title: "تم بنجاح", description: "تم حذف الحساب بنجاح" });
    },
    onError: () => toast({ title: "خطأ", description: "فشل في حذف الحساب", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      nameArabic: formData.get("nameArabic") as string,
      type: formData.get("type") as string,
      subType: formData.get("subType") as string,
      companyId,
      isActive: true,
    };

    if (editingAccount) {
      updateAccountMutation.mutate({ id: editingAccount.id, data });
    } else {
      createAccountMutation.mutate(data);
    }
  };

  const accountsData = (accounts as any[]) || [];

  const filteredAccounts = accountsData.filter((account: any) => {
    const matchesSearch =
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.nameArabic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || account.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'assets': return 'أصول';
      case 'liabilities': return 'خصوم';
      case 'equity': return 'حقوق الملكية';
      case 'revenue': return 'إيرادات';
      case 'expenses': return 'مصروفات';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="دليل الحسابات" subtitle="إدارة الحسابات المالية" />
        <main className="flex-1 p-6 overflow-y-auto">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في الحسابات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-64"
                    />
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48"><Filter className="w-4 h-4 ml-2" /><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      <SelectItem value="assets">أصول</SelectItem>
                      <SelectItem value="liabilities">خصوم</SelectItem>
                      <SelectItem value="equity">حقوق الملكية</SelectItem>
                      <SelectItem value="revenue">إيرادات</SelectItem>
                      <SelectItem value="expenses">مصروفات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 ml-2" />إضافة حساب جديد</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader><DialogTitle>{editingAccount ? "تعديل الحساب" : "إضافة حساب جديد"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div><Label htmlFor="code">رمز الحساب</Label><Input id="code" name="code" defaultValue={editingAccount?.code || ""} required /></div>
                      <div><Label htmlFor="name">اسم الحساب (بالإنجليزية)</Label><Input id="name" name="name" defaultValue={editingAccount?.name || ""} required /></div>
                      <div><Label htmlFor="nameArabic">اسم الحساب (بالعربية)</Label><Input id="nameArabic" name="nameArabic" defaultValue={editingAccount?.nameArabic || ""} required /></div>
                      <div>
                        <Label htmlFor="type">نوع الحساب</Label>
                        <Select name="type" defaultValue={editingAccount?.type || ""} required>
                          <SelectTrigger><SelectValue placeholder="اختر نوع الحساب" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assets">أصول</SelectItem>
                            <SelectItem value="liabilities">خصوم</SelectItem>
                            <SelectItem value="equity">حقوق الملكية</SelectItem>
                            <SelectItem value="revenue">إيرادات</SelectItem>
                            <SelectItem value="expenses">مصروفات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div><Label htmlFor="subType">النوع الفرعي</Label><Input id="subType" name="subType" defaultValue={editingAccount?.subType || ""} placeholder="مثال: أصول متداولة" /></div>
                      <div className="flex space-x-2 space-x-reverse pt-4">
                        <Button type="submit" disabled={createAccountMutation.isPending || updateAccountMutation.isPending}>{editingAccount ? "تحديث" : "إضافة"}</Button>
                        <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); setEditingAccount(null); }}>إلغاء</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-medium text-gray-600">رمز الحساب</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">اسم الحساب</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">النوع</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">الحالة</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => <tr key={i} className="border-b border-gray-100"><td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td><td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div></td><td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></td><td className="py-3 px-4"><div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></div></td><td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td></tr>)
                    ) : filteredAccounts && filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account: any) => (
                        <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 arabic-number font-mono">{account.code}</td>
                          <td className="py-3 px-4 font-medium">{account.nameArabic || account.name}</td>
                          <td className="py-3 px-4 text-gray-600">{getTypeLabel(account.type)}</td>
                          <td className="py-3 px-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{account.isActive ? 'نشط' : 'غير نشط'}</span></td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2 space-x-reverse">
                              <Button variant="ghost" size="sm" onClick={() => { setEditingAccount(account); setIsDialogOpen(true); }} className="text-blue-600 hover:text-blue-700"><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" onClick={() => { if (confirm("هل أنت متأكد من حذف هذا الحساب؟")) { deleteAccountMutation.mutate(account.id); } }} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} className="text-center py-8 text-gray-500"><div className="flex flex-col items-center"><Plus className="w-12 h-12 text-gray-300 mb-4" /><p>لا توجد حسابات</p><p className="text-sm mt-1">قم بإضافة حساب جديد للبدء</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
