// المحتوى الكامل لملف client/src/pages/companies.tsx (محدّث)
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
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Building2, MapPin, Phone, Mail, Hash, Search } from "lucide-react";

export default function Companies() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ["/api/companies"],
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

  const createCompanyMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/companies", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({ title: "تم بنجاح", description: "تم إنشاء الشركة بنجاح" });
      setIsDialogOpen(false);
      setEditingCompany(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل في إنشاء الشركة", variant: "destructive" }),
  });

  const updateCompanyMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/companies/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({ title: "تم بنجاح", description: "تم تحديث الشركة بنجاح" });
      setIsDialogOpen(false);
      setEditingCompany(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل في تحديث الشركة", variant: "destructive" }),
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/companies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({ title: "تم بنجاح", description: "تم حذف الشركة بنجاح" });
    },
    onError: () => toast({ title: "خطأ", description: "فشل في حذف الشركة", variant: "destructive" }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      nameArabic: formData.get("nameArabic") as string,
      taxNumber: formData.get("taxNumber") as string,
      address: formData.get("address") as string,
      addressArabic: formData.get("addressArabic") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      isActive: true,
    };

    if (editingCompany) {
      updateCompanyMutation.mutate({ id: editingCompany.id, data });
    } else {
      createCompanyMutation.mutate(data);
    }
  };

  const companiesData = (companies as any[]) || [];
  // بقية الكود يبقى كما هو...
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="إدارة الشركات" subtitle="إدارة وتتبع الشركات المختلفة" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* بقية الواجهة تبقى كما هي */}
        </main>
      </div>
    </div>
  );
}
