#!/data/data/com.termux/files/usr/bin/bash

# 1. تحديد المسار الذي تعمل فيه
PROJECT_DIR=$(pwd)

# 2. تحديد اسم الملف النهائي في الذاكرة
OUTPUT_FILE="/storage/emulated/0/Download/clean_project_export.txt"

# 3. البدء بكتابة العنوان الرئيسي
echo "📦 ملفات مشروع نظيفة من: $PROJECT_DIR" > "$OUTPUT_FILE"
echo "==== تصدير يبدأ ====" >> "$OUTPUT_FILE"

# 4. العثور على الملفات المهمة فقط، وتجاهل الملفات والمجلدات غير الضرورية
find . -type f \
  \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.html" -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/dist/*" \
  ! -path "*/.git/*" \
  ! -path "*/.cache/*" \
  ! -path "*/.next/*" \
  ! -path "*/.expo/*" \
  ! -path "*/build/*" \
  ! -name "*.log" \
  ! -name "*.lock" \
  ! -name "*.zip" \
  ! -name "*.gz" \
  ! -name ".env" \
  ! -name ".env.*" \
  ! -name "README.md" \
  ! -name "LICENSE" \
  | sort | while read -r FILE; do
    echo -e "\n\n==== $FILE ====" >> "$OUTPUT_FILE"
    cat "$FILE" >> "$OUTPUT_FILE"
done

# 5. رسالة تأكيد
echo "✅ تم تصدير الملفات النظيفة إلى: $OUTPUT_FILE"
