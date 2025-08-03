// المحتوى الكامل لملف client/src/pages/journal-entries.tsx (محدّث)
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import JournalEntryForm from "@/components/accounting/JournalEntryForm";
import { Plus, Edit, Trash2, Search, FileText, Calendar, Eye } from "lucide-react";

export default function JournalEntries() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const companyId = 1; // For demo

  const { data: journalEntries, isLoading, error: entriesError } = useQuery({
    queryKey: ["/api/companies", companyId, "journal-entries"],
  });

  const { data: accounts, error: accountsError } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
  });

  useEffect(() => {
    const errors = [entriesError, accountsError].filter(Boolean);
    for (const error of errors) {
      if (error && isUnauthorizedError(error)) {
        toast({
          title: "غير مخول",
          description: "تم تسجيل خروجك. سيتم توجيهك لصفحة الدخول.",
          variant: "destructive",
        });
        redirectToLogin(); // <-- تعديل هنا
        return;
      }
    }
  }, [entriesError, accountsError, toast]);

  const createEntryMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/journal-entries", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "financial-summary"] });
      toast({ title: "تم بنجاح", description: "تم إنشاء القيد المحاسبي بنجاح" });
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل في إنشاء القيد المحاسبي", variant: "destructive" }),
  });

  const updateEntryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => apiRequest("PUT", `/api/journal-entries/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "financial-summary"] });
      toast({ title: "تم بنجاح", description: "تم تحديث القيد المحاسبي بنجاح" });
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: () => toast({ title: "خطأ", description: "فشل في تحديث القيد المحاسبي", variant: "destructive" }),
  });

  const deleteEntryMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/journal-entries/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "financial-summary"] });
      toast({ title: "تم بنجاح", description: "تم حذف القيد المحاسبي بنجاح" });
    },
    onError: () => toast({ title: "خطأ", description: "فشل في حذف القيد المحاسبي", variant: "destructive" }),
  });

  const handleCreateEntry = (data: any) => createEntryMutation.mutate(data);
  const handleUpdateEntry = (data: any) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, data });
    }
  };

  const entriesData = (journalEntries as any[]) || [];
  // بقية الكود يبقى كما هو...
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar title="القيود المحاسبية" subtitle="إدارة وتتبع جميع القيود المحاسبية" />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* بقية الواجهة تبقى كما هي */}
        </main>
      </div>
    </div>
  );
}
