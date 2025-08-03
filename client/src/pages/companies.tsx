import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
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

  // Handle errors with useEffect
  useEffect(() => {
    if (error && isUnauthorizedError(error)) {
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
  }, [error, toast]);

  const createCompanyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/companies", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "تم بنجاح",
        description: "تم إنشاء الشركة بنجاح",
      });
      setIsDialogOpen(false);
      setEditingCompany(null);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الشركة",
        variant: "destructive",
      });
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/companies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث الشركة بنجاح",
      });
      setIsDialogOpen(false);
      setEditingCompany(null);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في تحديث الشركة",
        variant: "destructive",
      });
    },
  });

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/companies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companies"] });
      toast({
        title: "تم بنجاح",
        description: "تم حذف الشركة بنجاح",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: "فشل في حذف الشركة",
        variant: "destructive",
      });
    },
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

  const companiesData = companies || [];
  
  const filteredCompanies = companiesData.filter((company: any) => {
    return (
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.nameArabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.taxNumber && company.taxNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <TopBar title="إدارة الشركات" subtitle="إدارة وتتبع الشركات المختلفة" />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Card>
            <CardContent className="p-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث في الشركات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 w-64"
                    data-testid="input-search-companies"
                  />
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-company">
                      <Plus className="w-4 h-4 ml-2" />
                      إضافة شركة جديدة
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCompany ? "تعديل الشركة" : "إضافة شركة جديدة"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">اسم الشركة (بالإنجليزية)</Label>
                          <Input
                            id="name"
                            name="name"
                            defaultValue={editingCompany?.name || ""}
                            required
                            data-testid="input-company-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nameArabic">اسم الشركة (بالعربية)</Label>
                          <Input
                            id="nameArabic"
                            name="nameArabic"
                            defaultValue={editingCompany?.nameArabic || ""}
                            required
                            data-testid="input-company-name-arabic"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                          <Input
                            id="taxNumber"
                            name="taxNumber"
                            defaultValue={editingCompany?.taxNumber || ""}
                            data-testid="input-tax-number"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">رقم الهاتف</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={editingCompany?.phone || ""}
                            data-testid="input-phone"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">البريد الإلكتروني</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          defaultValue={editingCompany?.email || ""}
                          data-testid="input-email"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="address">العنوان (بالإنجليزية)</Label>
                        <Textarea
                          id="address"
                          name="address"
                          defaultValue={editingCompany?.address || ""}
                          rows={3}
                          data-testid="textarea-address"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="addressArabic">العنوان (بالعربية)</Label>
                        <Textarea
                          id="addressArabic"
                          name="addressArabic"
                          defaultValue={editingCompany?.addressArabic || ""}
                          rows={3}
                          data-testid="textarea-address-arabic"
                        />
                      </div>
                      
                      <div className="flex space-x-2 space-x-reverse pt-4">
                        <Button
                          type="submit"
                          disabled={createCompanyMutation.isPending || updateCompanyMutation.isPending}
                          data-testid="button-save-company"
                        >
                          {editingCompany ? "تحديث" : "إضافة"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDialogOpen(false);
                            setEditingCompany(null);
                          }}
                          data-testid="button-cancel"
                        >
                          إلغاء
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Companies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="flex space-x-2 space-x-reverse">
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredCompanies && filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company: any) => (
                    <Card key={company.id} className="card-hover transition-all duration-200" data-testid={`company-card-${company.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900" data-testid={`company-name-${company.id}`}>
                                {company.nameArabic || company.name}
                              </h3>
                              {company.nameArabic && company.name && (
                                <p className="text-sm text-gray-500">{company.name}</p>
                              )}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            company.isActive ? 'status-active' : 'status-inactive'
                          }`} data-testid={`company-status-${company.id}`}>
                            {company.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          {company.taxNumber && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Hash className="w-4 h-4 ml-2" />
                              <span>الرقم الضريبي: {company.taxNumber}</span>
                            </div>
                          )}
                          {company.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="w-4 h-4 ml-2" />
                              <span>{company.phone}</span>
                            </div>
                          )}
                          {company.email && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-4 h-4 ml-2" />
                              <span>{company.email}</span>
                            </div>
                          )}
                          {(company.addressArabic || company.address) && (
                            <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="w-4 h-4 ml-2 mt-0.5" />
                              <span>{company.addressArabic || company.address}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2 space-x-reverse">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCompany(company);
                              setIsDialogOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-700"
                            data-testid={`button-edit-company-${company.id}`}
                          >
                            <Edit className="w-4 h-4 ml-1" />
                            تعديل
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm("هل أنت متأكد من حذف هذه الشركة؟")) {
                                deleteCompanyMutation.mutate(company.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-700"
                            data-testid={`button-delete-company-${company.id}`}
                          >
                            <Trash2 className="w-4 h-4 ml-1" />
                            حذف
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 text-gray-500" data-testid="empty-companies">
                    <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">لا توجد شركات</p>
                    <p className="text-sm mt-1">قم بإضافة شركة جديدة للبدء</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
