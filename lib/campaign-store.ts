import path from "node:path";
import { randomUUID } from "node:crypto";
import { atomicJson, readJson, withFileLock } from "./file-store";
import {
  INITIAL_CAMPAIGNS,
  MAX_BADGE_LENGTH,
  MAX_CAMPAIGNS,
  MAX_DESCRIPTION_LENGTH,
  MAX_PROGRAM_LENGTH,
  MAX_TITLE_LENGTH,
  type Campaign,
  type CampaignStore,
} from "./campaign-types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

export class CampaignError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function campaignDirectory() {
  return path.resolve(/* turbopackIgnore: true */ process.env.CAMPAIGN_DATA_DIR || path.join(process.cwd(), "data", "campaigns"));
}

const manifestPath = () => path.join(campaignDirectory(), "campaigns.json");
const initialStore = (): CampaignStore => ({
  version: 1,
  revision: "initial",
  campaigns: INITIAL_CAMPAIGNS.map((campaign) => ({ ...campaign })),
});

function validText(value: unknown, maximum: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maximum && !CONTROL_CHARACTERS.test(value);
}

export async function getCampaignStore(): Promise<CampaignStore> {
  const store = await readJson<CampaignStore>(manifestPath(), initialStore());
  const ids = new Set<string>();
  if (store.version !== 1 || typeof store.revision !== "string" || !Array.isArray(store.campaigns) ||
    store.campaigns.length > MAX_CAMPAIGNS || store.campaigns.some((campaign) => {
      if (!campaign || !UUID.test(campaign.id) || ids.has(campaign.id)) return true;
      ids.add(campaign.id);
      return !validText(campaign.badge, MAX_BADGE_LENGTH) || !validText(campaign.title, MAX_TITLE_LENGTH) ||
        !validText(campaign.description, MAX_DESCRIPTION_LENGTH) || !validText(campaign.programLabel, MAX_PROGRAM_LENGTH) ||
        typeof campaign.active !== "boolean" || typeof campaign.createdAt !== "string" || !Number.isFinite(Date.parse(campaign.createdAt));
    })) throw new Error("Invalid campaign manifest");
  return store;
}

export async function getPublicCampaigns(): Promise<Campaign[]> {
  try { return (await getCampaignStore()).campaigns.filter((campaign) => campaign.active); }
  catch (error) {
    console.error("[campaigns] Public campaigns could not be loaded:", error instanceof Error ? error.message : "unknown");
    return INITIAL_CAMPAIGNS.map((campaign) => ({ ...campaign }));
  }
}

function text(value: unknown, name: string, maximum: number): string {
  if (!validText(value, maximum)) throw new CampaignError(`${name} 1–${maximum} karakter olmalıdır.`);
  return value.trim().replace(/\s+/g, " ");
}

function assertRevision(input: unknown, current: string) {
  if (input !== current) throw new CampaignError("Kayıt dönemleri başka bir pencerede değişti. Liste yenilendi; işlemi tekrar deneyin.", 409);
}

async function save(store: CampaignStore, assertOwned: () => void): Promise<CampaignStore> {
  assertOwned();
  const next = { ...store, revision: randomUUID() };
  await atomicJson(manifestPath(), next);
  return next;
}

export async function addCampaign(command: unknown): Promise<CampaignStore> {
  if (!command || typeof command !== "object") throw new CampaignError("Geçersiz işlem.");
  const data = command as Record<string, unknown>;
  return withFileLock(campaignDirectory(), async (assertOwned) => {
    const store = await getCampaignStore();
    assertRevision(data.revision, store.revision);
    if (store.campaigns.length >= MAX_CAMPAIGNS) throw new CampaignError("En fazla 20 kayıt dönemi eklenebilir.", 409);
    const campaign: Campaign = {
      id: randomUUID(),
      badge: text(data.badge, "Kısa etiket", MAX_BADGE_LENGTH),
      title: text(data.title, "Başlık", MAX_TITLE_LENGTH),
      description: text(data.description, "Açıklama", MAX_DESCRIPTION_LENGTH),
      programLabel: text(data.programLabel, "Form seçeneği", MAX_PROGRAM_LENGTH),
      active: data.active === true,
      createdAt: new Date().toISOString(),
    };
    if (store.campaigns.some((item) => item.programLabel.toLocaleLowerCase("tr-TR") === campaign.programLabel.toLocaleLowerCase("tr-TR")))
      throw new CampaignError("Bu form seçeneği zaten mevcut.", 409);
    return save({ ...store, campaigns: [...store.campaigns, campaign] }, assertOwned);
  });
}

export async function editCampaign(command: unknown): Promise<CampaignStore> {
  if (!command || typeof command !== "object") throw new CampaignError("Geçersiz işlem.");
  const data = command as Record<string, unknown>;
  return withFileLock(campaignDirectory(), async (assertOwned) => {
    const store = await getCampaignStore();
    assertRevision(data.revision, store.revision);
    if (data.action === "reorder") {
      const ids = data.ids;
      if (!Array.isArray(ids) || ids.length !== store.campaigns.length || new Set(ids).size !== ids.length ||
        ids.some((id) => typeof id !== "string" || !store.campaigns.some((campaign) => campaign.id === id)))
        throw new CampaignError("Geçersiz dönem sırası.");
      return save({ ...store, campaigns: ids.map((id) => store.campaigns.find((campaign) => campaign.id === id)!) }, assertOwned);
    }
    const campaign = store.campaigns.find((item) => item.id === data.id);
    if (!campaign) throw new CampaignError("Kayıt dönemi bulunamadı.", 404);
    if (data.action === "update") {
      const programLabel = text(data.programLabel, "Form seçeneği", MAX_PROGRAM_LENGTH);
      if (store.campaigns.some((item) => item.id !== campaign.id && item.programLabel.toLocaleLowerCase("tr-TR") === programLabel.toLocaleLowerCase("tr-TR")))
        throw new CampaignError("Bu form seçeneği zaten mevcut.", 409);
      const updated: Campaign = {
        ...campaign,
        badge: text(data.badge, "Kısa etiket", MAX_BADGE_LENGTH),
        title: text(data.title, "Başlık", MAX_TITLE_LENGTH),
        description: text(data.description, "Açıklama", MAX_DESCRIPTION_LENGTH),
        programLabel,
      };
      return save({ ...store, campaigns: store.campaigns.map((item) => item.id === campaign.id ? updated : item) }, assertOwned);
    }
    if (data.action === "toggle") {
      if (typeof data.active !== "boolean") throw new CampaignError("Geçersiz yayın durumu.");
      return save({ ...store, campaigns: store.campaigns.map((item) => item.id === campaign.id ? { ...item, active: data.active as boolean } : item) }, assertOwned);
    }
    if (data.action === "delete") {
      return save({ ...store, campaigns: store.campaigns.filter((item) => item.id !== campaign.id) }, assertOwned);
    }
    throw new CampaignError("Geçersiz işlem.");
  });
}

