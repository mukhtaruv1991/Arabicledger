# 1. تحديد الملفات التي سيتم نسخها
FILES_TO_COPY=(
  "package.json"
  "railway.json"
  "server/index.ts"
  "server/routes.ts"
  "server/localAuth.ts"
  "client/src/App.tsx"
  "client/src/hooks/useAuth.ts"
)

# 2. تحديد مكان حفظ الملف النهائي في الذاكرة الخارجية
OUTPUT_PATH="/storage/emulated/0/Download/project_files.txt"

# 3. إنشاء الملف وكتابة عنوان البداية
echo "==== ملفات المشروع الأساسية ====" > "$OUTPUT_PATH"

# 4. تجميع محتوى الملفات
for FILE in "${FILES_TO_COPY[@]}"; do
  echo -e "\n\n==== $FILE ====" >> "$OUTPUT_PATH"
  cat "$FILE" >> "$OUTPUT_PATH"
done

# 5. تأكيد
echo "✅ تم إنشاء الملف ونسخه إلى: $OUTPUT_PATH"
