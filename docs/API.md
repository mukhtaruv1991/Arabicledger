# API Documentation / توثيق API

## 📝 نظرة عامة / Overview

يوفر نظام المحاسبة الذكي API شامل لإدارة العمليات المحاسبية وتكامل بوت تلجرام.

The Smart Accounting System provides a comprehensive API for managing accounting operations and Telegram bot integration.

## 🔐 المصادقة / Authentication

يستخدم النظام مصادقة Replit للتحكم في الوصول.

```typescript
// مثال على طلب مصادق
const response = await fetch('/api/companies', {
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  }
});
```

## 📊 شركات / Companies API

### `GET /api/companies`
احصل على قائمة الشركات للمستخدم الحالي

**Response:**
```json
[
  {
    "id": 1,
    "name": "شركة المثال",
    "nameArabic": "شركة المثال للتجارة",
    "taxNumber": "123456789",
    "address": "الرياض، السعودية",
    "phone": "+966501234567",
    "email": "info@example.com",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00Z"
  }
]
```

### `POST /api/companies`
إنشاء شركة جديدة

**Request Body:**
```json
{
  "name": "شركة جديدة",
  "nameArabic": "شركة جديدة للتجارة",
  "taxNumber": "987654321",
  "address": "جدة، السعودية",
  "phone": "+966507654321",
  "email": "contact@newcompany.com"
}
```

### `PUT /api/companies/:id`
تحديث بيانات شركة

### `DELETE /api/companies/:id`
حذف شركة

## 📋 دليل الحسابات / Chart of Accounts API

### `GET /api/companies/:companyId/accounts`
احصل على دليل الحسابات للشركة

**Response:**
```json
[
  {
    "id": 1,
    "code": "1101",
    "name": "Cash in Hand",
    "nameArabic": "النقدية في الصندوق",
    "type": "assets",
    "subType": "current_assets",
    "level": 1,
    "isParent": false,
    "isActive": true
  }
]
```

### `POST /api/companies/:companyId/accounts`
إنشاء حساب جديد

**Request Body:**
```json
{
  "code": "1102",
  "name": "Bank Account",
  "nameArabic": "حساب البنك",
  "type": "assets",
  "subType": "current_assets",
  "level": 1,
  "isParent": false
}
```

## 📝 القيود المحاسبية / Journal Entries API

### `GET /api/companies/:companyId/journal-entries`
احصل على القيود المحاسبية

**Query Parameters:**
- `limit`: عدد النتائج (افتراضي: 50)

**Response:**
```json
[
  {
    "id": 1,
    "entryNumber": "JE-001",
    "date": "2025-01-15",
    "description": "Sales revenue",
    "descriptionArabic": "إيراد المبيعات",
    "totalDebit": "15000.00",
    "totalCredit": "15000.00",
    "details": [
      {
        "accountId": 1,
        "debit": "15000.00",
        "credit": "0.00",
        "description": "Cash received",
        "account": {
          "code": "1101",
          "nameArabic": "النقدية في الصندوق"
        }
      }
    ]
  }
]
```

### `POST /api/companies/:companyId/journal-entries`
إنشاء قيد محاسبي جديد

**Request Body:**
```json
{
  "entryNumber": "JE-002",
  "date": "2025-01-16",
  "description": "Office rent",
  "descriptionArabic": "إيجار المكتب",
  "reference": "INV-001",
  "details": [
    {
      "accountId": 5,
      "debit": "8000.00",
      "credit": "0.00",
      "description": "Rent expense"
    },
    {
      "accountId": 1,
      "debit": "0.00",
      "credit": "8000.00",
      "description": "Cash payment"
    }
  ]
}
```

## 📈 التقارير المالية / Financial Reports API

### `GET /api/companies/:companyId/financial-summary`
احصل على الملخص المالي

**Response:**
```json
{
  "totalRevenue": 250000,
  "totalExpenses": 180000,
  "netProfit": 70000,
  "totalAccounts": 124
}
```

### `GET /api/companies/:companyId/account-balances`
احصل على أرصدة الحسابات

**Response:**
```json
[
  {
    "accountId": 1,
    "debitBalance": "25000.00",
    "creditBalance": "0.00",
    "netBalance": "25000.00",
    "lastUpdated": "2025-01-16T10:30:00Z"
  }
]
```

## 🤖 تلجرام بوت / Telegram Bot API

### `POST /api/telegram/webhook`
نقطة النهاية لاستقبال تحديثات تلجرام

**Request Body:**
```json
{
  "update_id": 123456,
  "message": {
    "message_id": 789,
    "chat": {
      "id": 123456789,
      "type": "private"
    },
    "text": "/الملخص"
  }
}
```

### `POST /api/telegram/set-webhook`
تعيين webhook للبوت

**Request Body:**
```json
{
  "botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
  "webhookUrl": "https://yourapp.com/api/telegram/webhook"
}
```

### `GET /api/companies/:companyId/telegram-settings`
احصل على إعدادات تلجرام للشركة

### `POST /api/companies/:companyId/telegram-settings`
حفظ إعدادات تلجرام

**Request Body:**
```json
{
  "botToken": "123456789:ABCdefGHIjklMNOpqrsTUVwxyz",
  "webhookUrl": "https://yourapp.com/api/telegram/webhook",
  "isActive": true,
  "allowedUsers": "user1,user2,user3"
}
```

## 🔍 أوامر البوت / Bot Commands

### الأوامر الأساسية / Basic Commands

| الأمر | الوصف | Example Response |
|-------|---------|------------------|
| `/start` أو `بداية` | رسالة الترحيب | قائمة الأوامر المتاحة |
| `/الملخص` أو `الملخص` | الملخص المالي | إجمالي الإيرادات والمصروفات |
| `/الحسابات` أو `الحسابات` | دليل الحسابات | قائمة الحسابات الرئيسية |
| `/القيود` أو `القيود` | آخر القيود | آخر 5 قيود محاسبية |
| `/التقارير` أو `التقارير` | التقارير المالية | قائمة التقارير المتاحة |
| `/المساعدة` أو `المساعدة` | المساعدة | تعليمات الاستخدام |

## 🚨 أكواد الخطأ / Error Codes

| كود الخطأ | الوصف | الحل |
|-----------|---------|------|
| 401 | غير مصرح | تحقق من المصادقة |
| 403 | ممنوع | تحقق من الصلاحيات |
| 404 | غير موجود | تحقق من صحة المعرف |
| 422 | بيانات غير صحيحة | تحقق من البيانات المرسلة |
| 500 | خطأ في الخادم | تحقق من السجلات |

## 📋 أمثلة الاستخدام / Usage Examples

### JavaScript/TypeScript
```typescript
// إنشاء قيد محاسبي
const createJournalEntry = async (companyId: number, entryData: any) => {
  const response = await fetch(`/api/companies/${companyId}/journal-entries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entryData)
  });
  
  if (!response.ok) {
    throw new Error('فشل في إنشاء القيد');
  }
  
  return response.json();
};
```

### cURL
```bash
# احصل على الشركات
curl -X GET "https://yourapp.com/api/companies" \
  -H "Authorization: Bearer your-token"

# إنشاء حساب جديد
curl -X POST "https://yourapp.com/api/companies/1/accounts" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "1103",
    "name": "Petty Cash",
    "nameArabic": "النقدية الصغيرة",
    "type": "assets"
  }'
```

## 🔗 روابط مفيدة / Useful Links

- [Authentication Guide](AUTH.md)
- [Database Schema](SCHEMA.md)
- [Telegram Bot Setup](TELEGRAM.md)
- [Deployment Guide](DEPLOYMENT.md)