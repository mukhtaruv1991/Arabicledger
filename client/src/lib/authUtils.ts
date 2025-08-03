// المحتوى الكامل لملف client/src/lib/authUtils.ts (محدّث)

// هذه الدالة تتحقق مما إذا كان الخطأ هو خطأ "غير مخول"
export function isUnauthorizedError(error: any): boolean {
  if (error && error.status === 401) {
    return true;
  }
  if (error instanceof Error) {
    return /^401:.*Unauthorized/.test(error.message);
  }
  return false;
}

// هذه دالة جديدة ومساعدة لإعادة توجيه المستخدم إلى صفحة تسجيل الدخول
export function redirectToLogin() {
  // نقوم بإعادة التوجيه إلى مسار الواجهة الأمامية /login
  window.location.href = '/login';
}
