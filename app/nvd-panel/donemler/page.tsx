import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getCampaignStore } from "@/lib/campaign-store";
import AdminShell from "@/components/AdminShell";
import CampaignManager from "@/components/CampaignManager";

export const metadata: Metadata = { title: "Kayıt Dönemleri", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  if (!(await isAdminAuthenticated())) redirect("/nvd-panel/giris");
  const campaigns = await getCampaignStore();
  return <AdminShell active="campaigns"><CampaignManager initial={campaigns} /></AdminShell>;
}

