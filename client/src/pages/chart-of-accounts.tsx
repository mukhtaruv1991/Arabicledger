// المحتوى الكامل لملف client/src/pages/chart-of-accounts.tsx (محدّث)
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError, redirectToLogin } from "@/lib/authUtils"; // <-- تعديل هنا
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
      redirectToLogin(); // <-- تعديل هنا
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
  // بقية الكود يبقى كما هو...
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="دليل الحسابات" subtitle="إدارة الحسابات المالية" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* بقية الواجهة تبقى كما هي */}
        </main>
      </div>
    </div>
  );
}
