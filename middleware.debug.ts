/**
 * 🔍 DEBUG VERSION: 最小驗證方案
 * 
 * 用途：完全禁用所有 redirect，用於診斷 redirect 循環是否來自 middleware
 * 
 * 使用方法：
 * 1. 備份現有的 middleware.ts
 * 2. 將此文件重命名為 middleware.ts
 * 3. 部署到 Vercel
 * 4. 測試訪問 /, /login, /home
 * 5. 觀察：
 *    - 如果 redirect 循環消失 → 問題在 middleware
 *    - 如果 redirect 循環仍在 → 問題在 Layout/Page 層
 * 
 * 測試完成後，恢復原來的 middleware.ts
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 完全禁用所有 redirect，只記錄日誌
  console.log("[MIDDLEWARE DEBUG] Path:", pathname);
  console.log("[MIDDLEWARE DEBUG] URL:", request.url);
  
  // 直接允許通過，不做任何 redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};


