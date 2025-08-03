import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AccountFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export default function AccountForm({ onSubmit, initialData, isLoading }: AccountFormProps) {
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    name: initialData?.name || "",
    nameArabic: initialData?.nameArabic || "",
    type: initialData?.type || "",
    subType: initialData?.subType || "",
    parentId: initialData?.parentId || null,
    isParent: initialData?.isParent || false,
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const accountTypes = [
    { value: "assets", label: "أصول" },
    { value: "liabilities", label: "خصوم" },
    { value: "equity", label: "حقوق الملكية" },
    { value: "revenue", label: "إيرادات" },
    { value: "expenses", label: "مصروفات" },
  ];

  const subTypes = {
    assets: [
      { value: "current_assets", label: "أصول متداولة" },
      { value: "fixed_assets", label: "أصول ثابتة" },
      { value: "intangible_assets", label: "أصول غير ملموسة" },
    ],
    liabilities: [
      { value: "current_liabilities", label: "خصوم متداولة" },
      { value: "long_term_liabilities", label: "خصوم طويلة الأجل" },
    ],
    equity: [
      { value: "capital", label: "رأس المال" },
      { value: "retained_earnings", label: "الأرباح المحتجزة" },
    ],
    revenue: [
      { value: "operating_revenue", label: "إيرادات تشغيلية" },
      { value: "other_revenue", label: "إيرادات أخرى" },
    ],
    expenses: [
      { value: "operating_expenses", label: "مصروفات تشغيلية" },
      { value: "administrative_expenses", label: "مصروفات إدارية" },
      { value: "other_expenses", label: "مصروفات أخرى" },
    ],
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="code">رمز الحساب *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => handleInputChange("code", e.target.value)}
            placeholder="مثال: 1101"
            required
            data-testid="input-account-code"
          />
          <p className="text-xs text-gray-500 mt-1">رمز فريد للحساب</p>
        </div>

        <div>
          <Label htmlFor="name">اسم الحساب (إنجليزي) *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Cash in Hand"
            required
            data-testid="input-account-name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="nameArabic">اسم الحساب (عربي) *</Label>
        <Input
          id="nameArabic"
          value={formData.nameArabic}
          onChange={(e) => handleInputChange("nameArabic", e.target.value)}
          placeholder="النقدية في الصندوق"
          required
          data-testid="input-account-name-arabic"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">نوع الحساب *</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleInputChange("type", value)}
            required
          >
            <SelectTrigger data-testid="select-account-type">
              <SelectValue placeholder="اختر نوع الحساب" />
            </SelectTrigger>
            <SelectContent>
              {accountTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="subType">النوع الفرعي</Label>
          <Select
            value={formData.subType}
            onValueChange={(value) => handleInputChange("subType", value)}
            disabled={!formData.type}
          >
            <SelectTrigger data-testid="select-account-subtype">
              <SelectValue placeholder="اختر النوع الفرعي" />
            </SelectTrigger>
            <SelectContent>
              {formData.type && subTypes[formData.type as keyof typeof subTypes]?.map((subType) => (
                <SelectItem key={subType.value} value={subType.value}>
                  {subType.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between space-x-4 space-x-reverse">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Switch
            id="isParent"
            checked={formData.isParent}
            onCheckedChange={(checked) => handleInputChange("isParent", checked)}
            data-testid="switch-is-parent"
          />
          <Label htmlFor="isParent">حساب رئيسي</Label>
        </div>

        <div className="flex items-center space-x-2 space-x-reverse">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => handleInputChange("isActive", checked)}
            data-testid="switch-is-active"
          />
          <Label htmlFor="isActive">نشط</Label>
        </div>
      </div>

      <div className="flex space-x-2 space-x-reverse pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1"
          data-testid="button-submit-account"
        >
          {isLoading ? "جاري الحفظ..." : (initialData ? "تحديث" : "إضافة")}
        </Button>
      </div>
    </form>
  );
}
