import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
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

  // For demo, using company ID 1
  const companyId = 1;

  const { data: journalEntries, isLoading } = useQuery({
    queryKey: ["/api/companies", companyId, "journal-entries"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مخول",
          description: "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  const { data: accounts } = useQuery({
    queryKey: ["/api/companies", companyId, "accounts"],
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غير مخول",
          description: "تم تسجيل خروجك. جاري تسجيل الدخول مرة أخرى...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  const createEntryMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/journal-entries", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "financial-summary"] });
      toast({
        title: "تم بنجاح",
        description: "تم إنشاء القيد المحاسبي بنجاح",
      });
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء القيد المحاسبي",
        variant: "destructive",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/journal-entries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "financial-summary"] });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث القيد المحاسبي بنجاح",
      });
      setIsDialogOpen(false);
      setEditingEntry(null);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث القيد المحاسبي",
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/journal-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "journal-entries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companies", companyId, "financial-summary"] });
      toast({
        title: "تم بنجاح",
        description: "تم حذف القيد المحاسبي بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في حذف القيد المحاسبي",
        variant: "destructive",
      });
    },
  });

  const handleCreateEntry = (data: any) => {
    createEntryMutation.mutate(data);
  };

  const handleUpdateEntry = (data: any) => {
    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, data });
    }
  };

  const filteredEntries = journalEntries?.filter((entry: any) => {
    return (
      entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.descriptionArabic.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar title="القيود المحاسبية" subtitle="إدارة وتتبع جميع القيود المحاسبية" />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Card>
            <CardContent className="p-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث في القيود..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 w-64"
                      data-testid="input-search-entries"
                    />
                  </div>
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-entry">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة قيد محاسبي
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingEntry ? "تعديل القيد المحاسبي" : "إضافة قيد محاسبي جديد"}
                      </DialogTitle>
                    </DialogHeader>
                    <JournalEntryForm
                      accounts={accounts || []}
                      onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
                      initialData={editingEntry}
                      isLoading={createEntryMutation.isPending || updateEntryMutation.isPending}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Journal Entries Table */}
              <div className="overflow-x-auto">
                <table className="w-full accounting-table">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-right py-3 px-4 font-medium text-gray-600">رقم القيد</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">التاريخ</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">الوصف</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">المرجع</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">إجمالي المدين</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">إجمالي الدائن</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">العمليات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div></td>
                          <td className="py-3 px-4"><div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div></td>
                        </tr>
                      ))
                    ) : filteredEntries && filteredEntries.length > 0 ? (
                      filteredEntries.map((entry: any) => (
                        <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50" data-testid={`entry-row-${entry.id}`}>
                          <td className="py-3 px-4 arabic-number font-mono" data-testid={`entry-number-${entry.id}`}>
                            {entry.entryNumber}
                          </td>
                          <td className="py-3 px-4 text-gray-600" data-testid={`entry-date-${entry.id}`}>
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 ml-2 text-gray-400" />
                              {new Date(entry.date).toLocaleDateString('ar-SA')}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium" data-testid={`entry-description-${entry.id}`}>
                            <div>
                              <p className="text-gray-900">{entry.descriptionArabic || entry.description}</p>
                              {entry.descriptionArabic && entry.description && (
                                <p className="text-sm text-gray-500">{entry.description}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600" data-testid={`entry-reference-${entry.id}`}>
                            {entry.reference || "-"}
                          </td>
                          <td className="py-3 px-4 font-bold arabic-number amount-positive" data-testid={`entry-debit-${entry.id}`}>
                            {Number(entry.totalDebit).toLocaleString('ar-SA')} ر.س
                          </td>
                          <td className="py-3 px-4 font-bold arabic-number amount-positive" data-testid={`entry-credit-${entry.id}`}>
                            {Number(entry.totalCredit).toLocaleString('ar-SA')} ر.س
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2 space-x-reverse">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // View entry details
                                  console.log("View entry:", entry);
                                }}
                                className="text-gray-600 hover:text-gray-700"
                                data-testid={`button-view-entry-${entry.id}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingEntry(entry);
                                  setIsDialogOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-700"
                                data-testid={`button-edit-entry-${entry.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm("هل أنت متأكد من حذف هذا القيد؟")) {
                                    deleteEntryMutation.mutate(entry.id);
                                  }
                                }}
                                className="text-red-600 hover:text-red-700"
                                data-testid={`button-delete-entry-${entry.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500" data-testid="empty-entries">
                          <div className="flex flex-col items-center">
                            <FileText className="w-12 h-12 text-gray-300 mb-4" />
                            <p>لا توجد قيود محاسبية</p>
                            <p className="text-sm mt-1">قم بإضافة قيد جديد للبدء</p>
                          </div>
                        </td>
                      </tr>
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
