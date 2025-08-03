import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Calculator } from "lucide-react";

interface JournalEntryFormProps {
  accounts: any[];
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

interface JournalEntryDetail {
  accountId: number;
  debit: string;
  credit: string;
  description: string;
  descriptionArabic: string;
}

export default function JournalEntryForm({ accounts, onSubmit, initialData, isLoading }: JournalEntryFormProps) {
  const [formData, setFormData] = useState({
    entryNumber: initialData?.entryNumber || "",
    date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    description: initialData?.description || "",
    descriptionArabic: initialData?.descriptionArabic || "",
    reference: initialData?.reference || "",
    companyId: 1, // For demo, using company ID 1
  });

  const [details, setDetails] = useState<JournalEntryDetail[]>(
    initialData?.details?.map((detail: any) => ({
      accountId: detail.accountId,
      debit: detail.debit || "0",
      credit: detail.credit || "0",
      description: detail.description || "",
      descriptionArabic: detail.descriptionArabic || "",
    })) || [
      {
        accountId: 0,
        debit: "0",
        credit: "0",
        description: "",
        descriptionArabic: "",
      },
      {
        accountId: 0,
        debit: "0",
        credit: "0",
        description: "",
        descriptionArabic: "",
      },
    ]
  );

  // Generate entry number if not provided
  useEffect(() => {
    if (!initialData && !formData.entryNumber) {
      const entryNumber = `JE${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, entryNumber }));
    }
  }, [initialData, formData.entryNumber]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDetailChange = (index: number, field: keyof JournalEntryDetail, value: any) => {
    setDetails(prev => prev.map((detail, i) => 
      i === index ? { ...detail, [field]: value } : detail
    ));
  };

  const addDetail = () => {
    setDetails(prev => [...prev, {
      accountId: 0,
      debit: "0",
      credit: "0",
      description: "",
      descriptionArabic: "",
    }]);
  };

  const removeDetail = (index: number) => {
    if (details.length > 2) {
      setDetails(prev => prev.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const totalDebit = details.reduce((sum, detail) => sum + parseFloat(detail.debit || "0"), 0);
    const totalCredit = details.reduce((sum, detail) => sum + parseFloat(detail.credit || "0"), 0);
    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBalanced) {
      return;
    }

    // Filter out empty details
    const validDetails = details.filter(detail => 
      detail.accountId > 0 && (parseFloat(detail.debit || "0") > 0 || parseFloat(detail.credit || "0") > 0)
    );

    if (validDetails.length < 2) {
      return;
    }

    const data = {
      entry: formData,
      details: validDetails.map(detail => ({
        accountId: detail.accountId,
        debit: parseFloat(detail.debit || "0").toString(),
        credit: parseFloat(detail.credit || "0").toString(),
        description: detail.description,
        descriptionArabic: detail.descriptionArabic,
      })),
    };

    onSubmit(data);
  };

  const getAccountName = (accountId: number) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account ? (account.nameArabic || account.name) : "";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Entry Header */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="entryNumber">رقم القيد *</Label>
              <Input
                id="entryNumber"
                value={formData.entryNumber}
                onChange={(e) => handleInputChange("entryNumber", e.target.value)}
                placeholder="رقم القيد"
                required
                data-testid="input-entry-number"
              />
            </div>

            <div>
              <Label htmlFor="date">التاريخ *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
                data-testid="input-entry-date"
              />
            </div>

            <div>
              <Label htmlFor="reference">المرجع</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => handleInputChange("reference", e.target.value)}
                placeholder="رقم المرجع أو الوثيقة"
                data-testid="input-entry-reference"
              />
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <Label htmlFor="description">الوصف (إنجليزي) *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="وصف القيد المحاسبي"
                rows={2}
                required
                data-testid="textarea-entry-description"
              />
            </div>

            <div>
              <Label htmlFor="descriptionArabic">الوصف (عربي) *</Label>
              <Textarea
                id="descriptionArabic"
                value={formData.descriptionArabic}
                onChange={(e) => handleInputChange("descriptionArabic", e.target.value)}
                placeholder="وصف القيد المحاسبي بالعربية"
                rows={2}
                required
                data-testid="textarea-entry-description-arabic"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry Details */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">تفاصيل القيد</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDetail}
              data-testid="button-add-detail"
            >
              <Plus className="w-4 h-4 ml-2" />
              إضافة سطر
            </Button>
          </div>

          <div className="space-y-4">
            {details.map((detail, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg" data-testid={`detail-row-${index}`}>
                {/* Account Selection */}
                <div className="lg:col-span-4">
                  <Label htmlFor={`account-${index}`}>الحساب *</Label>
                  <Select
                    value={detail.accountId.toString()}
                    onValueChange={(value) => handleDetailChange(index, "accountId", parseInt(value))}
                    required
                  >
                    <SelectTrigger data-testid={`select-account-${index}`}>
                      <SelectValue placeholder="اختر الحساب" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.code} - {account.nameArabic || account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Debit Amount */}
                <div className="lg:col-span-2">
                  <Label htmlFor={`debit-${index}`}>مدين</Label>
                  <Input
                    id={`debit-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={detail.debit}
                    onChange={(e) => {
                      handleDetailChange(index, "debit", e.target.value);
                      // Clear credit if debit is entered
                      if (parseFloat(e.target.value || "0") > 0) {
                        handleDetailChange(index, "credit", "0");
                      }
                    }}
                    placeholder="0.00"
                    className="text-right"
                    data-testid={`input-debit-${index}`}
                  />
                </div>

                {/* Credit Amount */}
                <div className="lg:col-span-2">
                  <Label htmlFor={`credit-${index}`}>دائن</Label>
                  <Input
                    id={`credit-${index}`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={detail.credit}
                    onChange={(e) => {
                      handleDetailChange(index, "credit", e.target.value);
                      // Clear debit if credit is entered
                      if (parseFloat(e.target.value || "0") > 0) {
                        handleDetailChange(index, "debit", "0");
                      }
                    }}
                    placeholder="0.00"
                    className="text-right"
                    data-testid={`input-credit-${index}`}
                  />
                </div>

                {/* Description */}
                <div className="lg:col-span-3">
                  <Label htmlFor={`desc-${index}`}>الوصف</Label>
                  <Input
                    id={`desc-${index}`}
                    value={detail.descriptionArabic}
                    onChange={(e) => handleDetailChange(index, "descriptionArabic", e.target.value)}
                    placeholder="وصف السطر"
                    data-testid={`input-description-${index}`}
                  />
                </div>

                {/* Remove Button */}
                <div className="lg:col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeDetail(index)}
                    disabled={details.length <= 2}
                    className="text-red-600 hover:text-red-700"
                    data-testid={`button-remove-detail-${index}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">إجمالي المدين</p>
                <p className="text-lg font-bold arabic-number amount-positive" data-testid="total-debit">
                  {totalDebit.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">إجمالي الدائن</p>
                <p className="text-lg font-bold arabic-number amount-positive" data-testid="total-credit">
                  {totalCredit.toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">الفرق</p>
                <p className={`text-lg font-bold arabic-number ${isBalanced ? 'text-green-600' : 'text-red-600'}`} data-testid="balance-difference">
                  {Math.abs(totalDebit - totalCredit).toLocaleString('ar-SA', { minimumFractionDigits: 2 })} ر.س
                </p>
              </div>
            </div>
            
            {!isBalanced && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calculator className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800 font-medium">
                    تحذير: إجمالي المدين لا يساوي إجمالي الدائن. يجب أن يكون القيد متوازناً.
                  </p>
                </div>
              </div>
            )}
            
            {isBalanced && totalDebit > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-800 font-medium">
                    ✅ القيد متوازن ويمكن حفظه
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex space-x-2 space-x-reverse">
        <Button
          type="submit"
          disabled={isLoading || !isBalanced || totalDebit === 0}
          className="flex-1"
          data-testid="button-submit-entry"
        >
          {isLoading ? "جاري الحفظ..." : (initialData ? "تحديث القيد" : "حفظ القيد")}
        </Button>
      </div>
    </form>
  );
}
