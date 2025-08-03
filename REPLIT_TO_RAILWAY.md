# رفع الملفات من Replit إلى Railway

## الطريقة الأولى: تحميل مباشر من Replit

### 1. تحميل الملفات من Replit:
1. **انقر على أيقونة الملفات** (Files) في الجانب الأيسر
2. **انقر بالزر الأيمن على المجلد الرئيسي**
3. **اختر "Download as zip"**
4. **سيتم تحميل ملف مضغوط** يحتوي على كامل المشروع

### 2. رفع إلى Railway:
1. **اذهب إلى** [railway.app](https://railway.app)
2. **اضغط "New Project"**
3. **اختر "Empty Project"** 
4. **ارفع الملف المضغوط** أو استخدم Git

## الطريقة الثانية: استخدام Git

### في Shell في Replit:
```bash
# تهيئة Git
git init
git add .
git commit -m "Arabic Accounting System"

# إنشاء repo على GitHub
git remote add origin https://github.com/USERNAME/arabic-accounting-system.git
git push -u origin main
```

### في Railway:
1. **اختر "Deploy from GitHub"**
2. **اختر repository الذي أنشأته**
3. **Railway سيبدأ النشر تلقائياً**

## الطريقة الثالثة: Railway CLI

### في Shell في Replit:
```bash
# تسجيل دخول Railway (سيفتح متصفح)
railway login

# إنشاء مشروع جديد
railway init

# رفع المشروع
railway up
```

## إعداد قاعدة البيانات:

### في Railway Dashboard:
1. **اضغط "Add Service"**
2. **اختر "PostgreSQL"**
3. **سيتم إنشاء قاعدة البيانات تلقائياً**

### إعداد متغيرات البيئة:
```
DATABASE_URL=(سيتم إنشاؤها تلقائياً من PostgreSQL)
TELEGRAM_BOT_TOKEN=your_bot_token_here
NODE_ENV=production
PORT=5000
```

## نصائح مهمة:

### ملفات يجب حذفها قبل الرفع:
- `node_modules/` (تم استثناؤها في .gitignore)
- `.env` (استخدم .env.example)
- أي ملفات محلية خاصة

### ملفات مهمة للنشر:
✅ `package.json` - معلومات المشروع
✅ `railway.json` - إعدادات Railway  
✅ `nixpacks.toml` - إعدادات البناء
✅ جميع ملفات الكود

## بعد النشر:

### اختبار التطبيق:
1. **افتح الرابط** الذي سيعطيك إياه Railway
2. **تأكد من عمل** واجهة الويب
3. **اختبر بوت تلجرام** إذا كان مُعداً

### ربط Domain مخصص (اختياري):
1. في Railway Dashboard
2. اذهب لـ "Settings"  
3. أضف Domain مخصص

🚀 **المشروع جاهز للنشر بأي من هذه الطرق!**