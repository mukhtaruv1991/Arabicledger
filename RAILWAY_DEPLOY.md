# نشر المشروع على Railway - مجاني!

## الطريقة الأولى: مباشرة من Shell

### 1. تثبيت Railway CLI
```bash
npm install -g @railway/cli
```

### 2. تسجيل الدخول
```bash
railway login
```

### 3. إنشاء مشروع جديد
```bash
railway init
```

### 4. إضافة قاعدة البيانات
```bash
railway add postgresql
```

### 5. نشر المشروع
```bash
railway up
```

## الطريقة الثانية: من GitHub

### 1. ارفع المشروع لـ GitHub أولاً
```bash
git init
git add .
git commit -m "Arabic Accounting System"
git remote add origin https://github.com/YOUR_USERNAME/arabic-accounting-system.git
git push -u origin main
```

### 2. اربط Railway بـ GitHub
1. اذهب إلى [railway.app](https://railway.app)
2. اضغط "New Project"
3. اختر "Deploy from GitHub repo"
4. اختر repository الخاص بك

## إعداد متغيرات البيئة في Railway:

### في Railway Dashboard:
1. اختر مشروعك
2. اذهب لـ "Variables"
3. أضف المتغيرات التالية:

```
DATABASE_URL=postgresql://... (سيتم إنشاؤها تلقائياً)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NODE_ENV=production
PORT=5000
```

## الملفات المُحضرة للنشر:
✅ `railway.json` - إعدادات Railway
✅ `nixpacks.toml` - إعدادات البناء  
✅ `package.json` - معلومات المشروع
✅ `.env.example` - مثال متغيرات البيئة

## بعد النشر:
- ستحصل على رابط مثل: `https://your-app.railway.app`
- قاعدة البيانات ستعمل تلقائياً
- يمكنك ربط domain مخصص
- SSL certificate مجاني

## مشاكل محتملة وحلولها:

### مشكلة: Build failed
```bash
# تأكد من أن package.json يحتوي على:
"engines": {
  "node": ">=18.0.0"
}
```

### مشكلة: Database connection
- تأكد من أن DATABASE_URL صحيح
- تحقق من أن PostgreSQL service مُفعل

### مشكلة: Port binding
- Railway يستخدم PORT environment variable تلقائياً
- تأكد من أن الكود يستخدم `process.env.PORT`

## التكلفة:
- **Plan المجاني**: $5 شهرياً رصيد مجاني
- **كافي لمعظم التطبيقات الصغيرة**
- **قاعدة بيانات مجانية**: PostgreSQL مع 1GB تخزين

🚀 جاهز للنشر! استخدم الأوامر أعلاه في Shell