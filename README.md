# نظام المحاسبة الذكي - Smart Accounting System

نظام محاسبة شامل باللغة العربية مع دعم بوت تلجرام وواجهة ويب متقدمة

A comprehensive Arabic accounting system with Telegram bot integration and advanced web interface.

## ✨ المميزات / Features

### 📊 المحاسبة الأساسية / Core Accounting
- **دليل الحسابات** - Chart of Accounts with hierarchical structure
- **القيود المحاسبية** - Journal Entries with double-entry bookkeeping
- **التقارير المالية** - Financial Reports (Income Statement, Balance Sheet, Trial Balance)
- **إدارة الشركات** - Multi-company management
- **إدارة المستخدمين** - User management with role-based access

### 🤖 تكامل تلجرام / Telegram Integration
- **بوت ذكي** - Smart bot with Arabic commands
- **أوامر محاسبية** - Accounting commands:
  - `/الملخص` - Financial summary
  - `/الحسابات` - Chart of accounts
  - `/القيود` - Journal entries
  - `/التقارير` - Financial reports
  - `/المساعدة` - Help system

### 🌐 واجهة الويب / Web Interface
- **تصميم عصري** - Modern RTL (Right-to-Left) design
- **متجاوب** - Responsive design for all devices
- **سهولة الاستخدام** - User-friendly Arabic interface
- **تقارير تفاعلية** - Interactive charts and reports

## 🚀 التشغيل السريع / Quick Start

### المتطلبات / Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Telegram Bot Token (optional)

### التثبيت / Installation

1. **نسخ المشروع / Clone the repository**
```bash
git clone https://github.com/your-username/arabic-accounting-system.git
cd arabic-accounting-system
```

2. **تثبيت التبعيات / Install dependencies**
```bash
npm install
```

3. **إعداد قاعدة البيانات / Database setup**
```bash
# Set your DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:password@localhost:5432/accounting"

# Push database schema
npm run db:push
```

4. **إعداد متغيرات البيئة / Environment variables**
```bash
# Create .env file
cp .env.example .env

# Add your configuration:
DATABASE_URL=your_database_url
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
PORT=5000
```

5. **تشغيل التطبيق / Start the application**
```bash
npm run dev
```

## 🤖 إعداد بوت تلجرام / Telegram Bot Setup

1. **إنشاء البوت / Create Bot**
   - Open Telegram and search for `@BotFather`
   - Send `/newbot` and follow instructions
   - Copy the bot token

2. **إعداد البوت / Configure Bot**
   - Add the token to your environment variables
   - Go to "إعدادات تلجرام" in the web interface
   - Set up webhook URL and activate the bot

3. **الأوامر المتاحة / Available Commands**
   - `/start` أو `بداية` - Welcome message
   - `/الملخص` - Financial summary
   - `/الحسابات` - Chart of accounts
   - `/القيود` - Recent journal entries
   - `/التقارير` - Financial reports
   - `/المساعدة` - Help and instructions

## 🏗️ البنية التقنية / Technical Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** with PostgreSQL
- **Replit Auth** for authentication
- **Telegram Bot API** integration

### Database
- **PostgreSQL** with comprehensive accounting schema
- **Drizzle migrations** for schema management
- **Multi-tenant** support for companies

## 📁 هيكل المشروع / Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
├── server/                # Backend Express application
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data access layer
│   ├── telegramBot.ts     # Telegram bot logic
│   └── replitAuth.ts      # Authentication setup
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── migrations/            # Database migrations
```

## 🚀 النشر / Deployment

### Replit Deployment
1. Fork this repository to your Replit account
2. Set environment variables in Replit Secrets
3. Click the "Deploy" button in Replit

### Manual Deployment
1. Build the application: `npm run build`
2. Set up PostgreSQL database
3. Configure environment variables
4. Deploy to your hosting service

## 🔧 التطوير / Development

### إضافة ميزات جديدة / Adding New Features
1. Define database schema in `shared/schema.ts`
2. Update storage interface in `server/storage.ts`
3. Add API routes in `server/routes.ts`
4. Create frontend components and pages

### تشغيل الاختبارات / Running Tests
```bash
npm test
```

## 📝 الترخيص / License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 المساهمة / Contributing

نرحب بمساهماتكم! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) للمزيد من المعلومات.

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for more information.

## 📞 الدعم / Support

- 📧 Email: support@accounting-system.com
- 💬 Telegram: [@accounting_support_bot](https://t.me/accounting_support_bot)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/arabic-accounting-system/issues)

## 📸 لقطات الشاشة / Screenshots

### لوحة التحكم / Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### دليل الحسابات / Chart of Accounts
![Chart of Accounts](docs/screenshots/chart-of-accounts.png)

### بوت تلجرام / Telegram Bot
![Telegram Bot](docs/screenshots/telegram-bot.png)

---

صُنع بـ ❤️ في السعودية | Made with ❤️ in Saudi Arabia