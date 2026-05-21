import type { Metadata } from "next";
import { QueryProvider } from "@/app/providers/query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "KCS Credit Report",
  description: "개인 신용평가 리포트 조회 서비스"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
