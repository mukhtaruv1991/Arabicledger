import { Express } from "express";

export function setupTelegramBot(app: Express) {
  // Telegram webhook endpoint
  app.post('/api/telegram/webhook', async (req, res) => {
    try {
      const update = req.body;
      
      if (update.message) {
        const message = update.message;
        const chatId = message.chat.id;
        const text = message.text;

        // Handle Arabic commands
        if (text) {
          await handleTelegramCommand(chatId, text);
        }
      }

      res.status(200).send('OK');
    } catch (error) {
      console.error('Telegram webhook error:', error);
      res.status(500).send('Error');
    }
  });

  // Set webhook endpoint
  app.post('/api/telegram/set-webhook', async (req, res) => {
    try {
      const { botToken, webhookUrl } = req.body;
      
      const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: webhookUrl,
        }),
      });

      const result = await response.json();
      res.json(result);
    } catch (error) {
      console.error('Set webhook error:', error);
      res.status(500).json({ message: 'Failed to set webhook' });
    }
  });
}

async function handleTelegramCommand(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;

  let responseText = '';

  // Arabic command handling
  if (text === '/start' || text === 'بداية') {
    responseText = `مرحباً بك في نظام المحاسبة الذكي! 🧮

الأوامر المتاحة:
📊 /الملخص - عرض الملخص المالي
💰 /الحسابات - عرض دليل الحسابات  
📝 /القيود - عرض آخر القيود المحاسبية
📈 /التقارير - عرض التقارير المالية
ℹ️ /المساعدة - عرض هذه الرسالة`;
  }
  else if (text === '/الملخص' || text === 'الملخص') {
    responseText = `📊 الملخص المالي:

💰 إجمالي الإيرادات: ٢٥٠,٠٠٠ ر.س
💸 إجمالي المصروفات: ١٨٠,٠٠٠ ر.س
📈 صافي الربح: ٧٠,٠٠٠ ر.س
🏢 عدد الحسابات: ١٢٤ حساب

آخر تحديث: ${new Date().toLocaleDateString('ar-SA')}`;
  }
  else if (text === '/الحسابات' || text === 'الحسابات') {
    responseText = `📋 دليل الحسابات الرئيسية:

🏦 ١١٠١ - النقدية في الصندوق
🏧 ١١٠٢ - البنك الأهلي  
📦 ١٢٠١ - المخزون
🏢 ١٣٠١ - الأصول الثابتة
💳 ٢١٠١ - حسابات دائنة
💰 ٤١٠١ - إيرادات المبيعات
💸 ٥١٠١ - مصروف الإيجار

للحصول على التفاصيل الكاملة، ادخل إلى النظام.`;
  }
  else if (text === '/القيود' || text === 'القيود') {
    responseText = `📝 آخر القيود المحاسبية:

🗓️ قيد رقم ٠٠١ - ٢٠٢٥/٠١/١٥
📄 وصف: إيراد من المبيعات
💰 مدين: ١٥,٠٠٠ ر.س | دائن: ١٥,٠٠٠ ر.س

🗓️ قيد رقم ٠٠٢ - ٢٠٢٥/٠١/١٤  
📄 وصف: مصروف الإيجار
💰 مدين: ٨,٠٠٠ ر.س | دائن: ٨,٠٠٠ ر.س

للمزيد من القيود، راجع النظام.`;
  }
  else if (text === '/التقارير' || text === 'التقارير') {
    responseText = `📈 التقارير المالية المتاحة:

📊 قائمة الدخل
📋 الميزانية العمومية  
💰 قائمة التدفقات النقدية
📈 تقرير الأرباح والخسائر
📊 تقرير الحسابات
📝 كشف حساب تفصيلي

للحصول على التقارير الكاملة، ادخل إلى النظام.`;
  }
  else if (text === '/المساعدة' || text === 'المساعدة' || text === '/help') {
    responseText = `ℹ️ مساعدة نظام المحاسبة الذكي:

🔧 الأوامر المتاحة:
• /الملخص - الملخص المالي
• /الحسابات - دليل الحسابات
• /القيود - آخر القيود
• /التقارير - التقارير المالية
• /المساعدة - هذه الرسالة

💡 نصائح:
- يمكنك كتابة الأوامر بدون الرمز /
- النظام يدعم اللغة العربية بالكامل
- للمزيد من التفاصيل، ادخل إلى النظام

📞 للدعم التقني: support@accounting.com`;
  }
  else {
    responseText = `عذراً، لم أفهم هذا الأمر. 🤔

الأوامر المتاحة:
📊 /الملخص
💰 /الحسابات  
📝 /القيود
📈 /التقارير
ℹ️ /المساعدة

أو اكتب "المساعدة" للحصول على المزيد من المعلومات.`;
  }

  // Send response
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: responseText,
      parse_mode: 'HTML',
    }),
  });
}
