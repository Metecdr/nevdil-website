import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getGallery } from "@/lib/gallery-store";
import AdminShell from "@/components/AdminShell";
import GalleryManager from "@/components/GalleryManager";

export const metadata: Metadata = { title: "Fotoğraf Galerisi", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  if (!(await isAdminAuthenticated())) redirect("/nvd-panel/giris");
  // Fail visibly rather than presenting a corrupt/unreadable store as an empty gallery.
  const gallery = await getGallery();
  return <AdminShell active="gallery"><GalleryManager initial={gallery} /></AdminShell>;
}
