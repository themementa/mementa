# 🔍 ERR_TOO_MANY_REDIRECTS 診斷報告

## Step 1: Middleware 生效檢查

### 找到的 Middleware 檔案：
- ✅ `middleware.ts` (根目錄)

### Next.js 會使用的檔案：
根據 Next.js 14 官方規則，Next.js 會使用 **根目錄的 `middleware.ts`**。

**結論：** ✅ 只有一個 middleware 檔案，位置正確。

---

## Step 2: Middleware 行為檢查

### 2.1 Redirect 檢查
**位置：** `middleware.ts` 第 132 行
```typescript
return NextResponse.redirect(loginUrl);
```
**行為：** 未登入用戶訪問受保護路由時，redirect 到 `/login`

### 2.2 依賴檢查
- ✅ **Cookies：** 有使用（第 91-117 行）
- ✅ **Supabase Auth Session：** 有使用 `createServerClient` 和 `auth.getUser()`（第 86-125 行）
- ❌ **createMiddlewareClient：** 沒有使用（使用的是 `createServerClient`）

### 2.3 循環條件分析

**發現的潛在循環場景：**

#### 🔴 循環場景 1：`app/page.tsx` 的自我循環
**檔案：** `app/page.tsx` 第 9-11 行
```typescript
if (user) {
  redirect("/");  // ❌ 重定向到自己，造成無限循環！
}
```

**循環流程：**
1. 已登入用戶訪問 `/`
2. `app/page.tsx` 檢查 → 已登入 → redirect 到 `/`
3. 再次觸發 `app/page.tsx` → 無限循環

**嚴重程度：** 🔴🔴🔴 極高（這是明確的循環）

---

#### 🟡 循環場景 2：Middleware + Layout 雙重檢查
**檔案組合：**
- `middleware.ts` 第 132 行：未登入 → redirect `/login`
- `app/(protected)/layout.tsx` 第 10 行：調用 `requireUser()`
- `lib/auth.ts` 第 21 行：`requireUser()` 未登入 → redirect `/login`

**潛在問題：**
- 如果 Supabase session cookie 有問題（例如過期但未清除）
- Middleware 可能讀到無效 session → 認為未登入 → redirect `/login`
- 但 Layout 層的 `requireUser()` 可能讀到不同狀態 → 造成不一致

**嚴重程度：** 🟡🟡 中等（取決於 session 狀態）

---

#### 🟢 循環場景 3：AuthLayout 的正常流程（非循環）
**檔案：** `app/(auth)/layout.tsx` 第 13-15 行
```typescript
if (user) {
  redirect("/home");
}
```

**流程：**
1. 已登入用戶訪問 `/login`
2. Middleware 允許通過（公共路由）
3. `AuthLayout` 檢查 → 已登入 → redirect `/home`
4. `/home` → Middleware 檢查 → 已登入 → 允許
5. `/home` → `ProtectedLayout` 調用 `requireUser()` → 已登入 → 允許

**結論：** ✅ 這是正常流程，不會造成循環

---

## Step 3: Supabase 自動 Redirect 檢查

### 3.1 使用的 Supabase 方法
- ✅ `createServerClient` (middleware.ts 第 86 行)
- ✅ `auth.getUser()` (middleware.ts 第 125 行)
- ❌ `createMiddlewareClient`：沒有使用
- ❌ `auth.getSession()`：沒有使用

### 3.2 Supabase Middleware 自動 Redirect
**結論：** ❌ 沒有使用 Supabase 的 middleware helper，所以不會有自動 redirect。

**但是：** 手動使用 `createServerClient` 在 middleware 中可能會有 cookie 同步問題。

---

## Step 4: 驗證用 Debug 方案

### 最小驗證方案

創建一個臨時的 `middleware.ts` 版本，完全禁用所有 redirect：

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 完全禁用所有 redirect，只允許通過
  // 用於診斷 redirect 是否來自 middleware
  console.log("[MIDDLEWARE DEBUG] Path:", request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

**測試步驟：**
1. 替換現有的 `middleware.ts` 為上述版本
2. 部署到 Vercel
3. 測試訪問 `/`, `/login`, `/home`
4. 觀察：
   - 如果 redirect 循環消失 → 問題在 middleware
   - 如果 redirect 循環仍在 → 問題在 Layout/Page 層

---

## 🎯 問題根源總結

### 最可能的問題來源（按嚴重程度排序）：

1. **🔴 極高：`app/page.tsx` 第 10 行**
   - `redirect("/")` 造成自我循環
   - **修復：** 改為 `redirect("/home")`

2. **🟡 中等：Middleware 與 Layout 的雙重認證檢查**
   - Middleware 已經檢查認證並 redirect
   - `ProtectedLayout` 又調用 `requireUser()` 再次檢查
   - 如果 session 狀態不一致，可能造成問題
   - **建議：** 移除 `ProtectedLayout` 中的 `requireUser()`，因為 middleware 已經處理

3. **🟢 低：Cookie 同步問題**
   - Middleware 中的 `createServerClient` cookie 處理可能不完整
   - 但這通常不會造成循環，只會造成認證失敗

---

## 📋 建議的修復優先順序

1. **立即修復：** `app/page.tsx` 的 `redirect("/")` → `redirect("/home")`
2. **考慮優化：** 移除 `ProtectedLayout` 中的 `requireUser()`（因為 middleware 已經處理）
3. **驗證：** 使用最小驗證方案確認問題來源


