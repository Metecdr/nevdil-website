"use client";
import { usePathname } from "next/navigation";

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/nvd-panel" || pathname.startsWith("/nvd-panel/")) return null;
  return children;
}
