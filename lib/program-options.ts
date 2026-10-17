import { getCampaignStore } from "./campaign-store";

export const STANDARD_PROGRAMS = [
  "YDS Hazırlık Grubu",
  "İş İngilizcesi",
  "Junior Grubu (4–6 Yaş)",
  "İlkokul Grubu (1–4. Sınıf)",
  "Ortaokul Grubu (5–7. Sınıf)",
  "Lise Grubu (9–12. Sınıf)",
  "Henüz bilmiyorum",
] as const;

export async function isKnownProgram(program: string): Promise<boolean> {
  if ((STANDARD_PROGRAMS as readonly string[]).includes(program)) return true;
  try { return (await getCampaignStore()).campaigns.some((campaign) => campaign.programLabel === program); }
  catch { return false; }
}

