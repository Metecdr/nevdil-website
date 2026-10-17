import { getRegistrations } from "@/lib/storage";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import RegistrationsClient from "@/components/RegistrationsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ön Kayıtlar",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) redirect("/nvd-panel/giris");
  const registrations = getRegistrations();
  return <AdminShell active="registrations">
    <h1 className="mb-2 text-3xl font-bold tracking-tight">Ön kayıt başvuruları</h1>
    <p className="mb-8 text-sm text-gray-400">Başvuruları inceleyin ve öğrencilerinizle iletişime geçin.</p>
    <RegistrationsClient registrations={registrations} />
  </AdminShell>;
}
