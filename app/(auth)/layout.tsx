import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function AuthLayout({
  children
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  
  // 如果用戶已經登入，重定向到受保護的首頁
  if (user) {
    redirect("/home");
  }
  
  return <>{children}</>;
}



