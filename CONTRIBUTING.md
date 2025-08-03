# دليل المساهمة / Contributing Guide

نرحب بمساهماتكم في تطوير نظام المحاسبة الذكي! / We welcome your contributions to the Smart Accounting System!

## 🤝 كيفية المساهمة / How to Contribute

### 1. Fork المشروع / Fork the Project
```bash
git clone https://github.com/your-username/arabic-accounting-system.git
cd arabic-accounting-system
```

### 2. إنشاء فرع جديد / Create a Feature Branch
```bash
git checkout -b feature/amazing-feature
# أو / or
git checkout -b bugfix/fix-issue
```

### 3. تثبيت التبعيات / Install Dependencies
```bash
npm install
```

### 4. إعداد البيئة التطويرية / Setup Development Environment
```bash
cp .env.example .env
# قم بتعديل المتغيرات حسب بيئتك / Edit variables for your environment
```

### 5. إجراء التغييرات / Make Your Changes
- اتبع معايير الكود المحددة / Follow the established code standards
- أضف اختبارات للميزات الجديدة / Add tests for new features
- تأكد من عمل جميع الاختبارات / Ensure all tests pass

### 6. اختبار التغييرات / Test Your Changes
```bash
npm run test
npm run build
npm run dev
```

### 7. إرسال Pull Request / Submit a Pull Request
```bash
git add .
git commit -m "feat: إضافة ميزة رائعة / Add amazing feature"
git push origin feature/amazing-feature
```

## 📋 معايير الكود / Code Standards

### TypeScript/JavaScript
- استخدم TypeScript لجميع الملفات الجديدة / Use TypeScript for all new files
- اتبع ESLint configuration المحددة / Follow the established ESLint configuration
- استخدم أسماء متغيرات واضحة / Use clear variable names
- أضف تعليقات للكود المعقد / Add comments for complex code

### React Components
- استخدم Functional Components مع Hooks / Use Functional Components with Hooks
- اتبع نمط تسمية PascalCase للمكونات / Follow PascalCase naming for components
- استخدم TypeScript interfaces للـ Props / Use TypeScript interfaces for Props

### CSS/Styling
- استخدم Tailwind CSS للتنسيق / Use Tailwind CSS for styling
- ادعم RTL (من اليمين لليسار) / Support RTL (Right-to-Left)
- تأكد من التجاوب مع جميع الشاشات / Ensure responsiveness

### Database
- استخدم Drizzle ORM للتعامل مع قاعدة البيانات / Use Drizzle ORM for database operations
- أضف migrations للتغييرات / Add migrations for schema changes
- اتبع معايير تسمية قاعدة البيانات / Follow database naming conventions

## 🐛 الإبلاغ عن الأخطاء / Reporting Bugs

### قبل الإبلاغ / Before Reporting
- تأكد من أن المشكلة لم يتم الإبلاغ عنها مسبقاً / Check if the issue hasn't been reported already
- تأكد من استخدام أحدث إصدار / Ensure you're using the latest version

### معلومات مطلوبة / Required Information
- **وصف المشكلة** / Issue Description
- **خطوات إعادة الإنتاج** / Steps to Reproduce
- **السلوك المتوقع** / Expected Behavior
- **السلوك الفعلي** / Actual Behavior
- **لقطات شاشة** / Screenshots (if applicable)
- **معلومات البيئة** / Environment Info:
  - نظام التشغيل / OS
  - إصدار المتصفح / Browser version
  - إصدار Node.js / Node.js version

## 💡 اقتراح ميزات جديدة / Suggesting Features

### قبل الاقتراح / Before Suggesting
- تحقق من خارطة الطريق / Check the roadmap
- ابحث في المشكلات المفتوحة / Search existing issues

### تنسيق الاقتراح / Suggestion Format
- **عنوان واضح** / Clear title
- **وصف المشكلة** / Problem description
- **الحل المقترح** / Proposed solution
- **البدائل المدروسة** / Alternatives considered
- **معلومات إضافية** / Additional context

## 🏗️ التطوير المحلي / Local Development

### تشغيل خادم التطوير / Start Development Server
```bash
npm run dev
```

### تشغيل قاعدة البيانات / Database Commands
```bash
# إنشاء migration جديد / Create new migration
npm run db:generate

# تطبيق migrations / Apply migrations  
npm run db:push

# عرض البيانات / View data
npm run db:studio
```

### إنشاء build للإنتاج / Production Build
```bash
npm run build
```

## 📚 الموارد المفيدة / Useful Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 📞 التواصل / Contact

- 💬 مناقشات GitHub / GitHub Discussions
- 📧 البريد الإلكتروني / Email: developers@accounting-system.com
- 🔗 تلجرام / Telegram: [@accounting_devs](https://t.me/accounting_devs)

## 📋 قائمة المراجعة / Checklist

قبل إرسال Pull Request تأكد من: / Before submitting a Pull Request, ensure:

- [ ] الكود يتبع معايير المشروع / Code follows project standards
- [ ] جميع الاختبارات تعمل / All tests pass
- [ ] التوثيق محدث / Documentation is updated
- [ ] لا توجد console.log في الكود / No console.log statements left
- [ ] التصميم متجاوب / Design is responsive
- [ ] يدعم RTL / Supports RTL
- [ ] متوافق مع المتصفحات الحديثة / Compatible with modern browsers

شكراً لمساهمتكم! 🙏 / Thank you for your contributions! 🙏