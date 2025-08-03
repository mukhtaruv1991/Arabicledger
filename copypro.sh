#!/data/data/com.termux/files/usr/bin/bash

# 1. تحديد مسار مجلد المشروع الحالي
PROJECT_DIR=$(pwd)

# 2. تحديد مكان الحفظ في الذاكرة الخارجية
OUTPUT_FILE="/storage/emulated/0/Download/complete_project_dump.txt"

# 3. إعداد الملف
echo "📦 تجميع ملفات مشروع: $PROJECT_DIR" > "$OUTPUT_FILE"
echo "==== يبدأ التصدير ====" >> "$OUTPUT_FILE"

# 4. تمرير كل الملفات البرمجية مع الحفاظ على هيكلها
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.css" -o -name "*.html" \) | while read -r FILE; do
  echo -e "\n\n==== $FILE ====\n" >> "$OUTPUT_FILE"
  cat "$FILE" >> "$OUTPUT_FILE"
done

# 5. تأكيد
echo "✅ تم نسخ جميع الملفات البرمجية إلى: $OUTPUT_FILE"
