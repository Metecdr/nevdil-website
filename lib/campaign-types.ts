export const MAX_CAMPAIGNS = 20;
export const MAX_BADGE_LENGTH = 30;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 320;
export const MAX_PROGRAM_LENGTH = 100;

export type Campaign = {
  id: string;
  badge: string;
  title: string;
  description: string;
  programLabel: string;
  active: boolean;
  createdAt: string;
};

export type CampaignStore = {
  version: 1;
  revision: string;
  campaigns: Campaign[];
};

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "a8a9e3d8-b78d-4c3a-9fe5-2a09d7ca4b11",
    badge: "YAZ KURSU",
    title: "Yaz Kursu Ön Kayıt",
    description: "Haziran–Ağustos yaz dönemi kontenjanı dolmadan yerinizi ayırtın. Sınırlı sayıda yer!",
    programLabel: "Yaz Kursu (Haziran–Ağustos)",
    active: true,
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "5acb962f-487a-4f84-9f77-b3ec4cf039d3",
    badge: "YENİ DÖNEM",
    title: "Güz Dönemi Kayıtları",
    description: "Eylül başlangıçlı yeni dönem için ön kayıtlarımız açıktır. Erken kayıt avantajından yararlanın.",
    programLabel: "Güz Dönemi Kaydı",
    active: true,
    createdAt: "2026-01-01T00:00:01.000Z",
  },
];

