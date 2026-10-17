import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { addCampaign, CampaignError, editCampaign, getCampaignStore } from "../lib/campaign-store";

test("campaign storage: defaults and complete owner workflow", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "nevdil-campaigns-"));
  process.env.CAMPAIGN_DATA_DIR = root;
  try {
    const initial = await getCampaignStore();
    assert.equal(initial.campaigns.length, 2);
    assert.equal(initial.revision, "initial");

    const added = await addCampaign({
      revision: initial.revision,
      badge: "KIŞ DÖNEMİ",
      title: "Kış Dönemi Ön Kayıt",
      description: "Yeni dönem için sınırlı kontenjanla ön kayıtlarımız açıldı.",
      programLabel: "Kış Dönemi Kaydı",
      active: false,
    });
    assert.equal(added.campaigns.length, 3);
    const created = added.campaigns.at(-1)!;
    assert.equal(created.active, false);

    await assert.rejects(
      () => addCampaign({ revision: initial.revision, badge: "ESKİ", title: "Eski sekme", description: "Eski revizyonla eklenemez.", programLabel: "Eski", active: true }),
      (error: unknown) => error instanceof CampaignError && error.status === 409,
    );

    const updated = await editCampaign({
      revision: added.revision, action: "update", id: created.id,
      badge: "KIŞ KURSU", title: "Kış Kursu Kayıtları",
      description: "Kış dönemi için güncellenen kayıt açıklaması.", programLabel: "Kış Kursu",
    });
    assert.equal(updated.campaigns.at(-1)?.programLabel, "Kış Kursu");

    const published = await editCampaign({ revision: updated.revision, action: "toggle", id: created.id, active: true });
    assert.equal(published.campaigns.at(-1)?.active, true);

    const reordered = await editCampaign({
      revision: published.revision, action: "reorder",
      ids: [created.id, ...published.campaigns.filter((item) => item.id !== created.id).map((item) => item.id)],
    });
    assert.equal(reordered.campaigns[0].id, created.id);

    const deleted = await editCampaign({ revision: reordered.revision, action: "delete", id: created.id });
    assert.equal(deleted.campaigns.length, 2);
    const persisted = JSON.parse(await readFile(path.join(root, "campaigns.json"), "utf8"));
    assert.equal(persisted.campaigns.length, 2);
  } finally {
    delete process.env.CAMPAIGN_DATA_DIR;
    await rm(root, { recursive: true, force: true });
  }
});

test("campaign storage rejects duplicate choices and malformed text", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "nevdil-campaigns-"));
  process.env.CAMPAIGN_DATA_DIR = root;
  try {
    const initial = await getCampaignStore();
    await assert.rejects(() => addCampaign({
      revision: initial.revision, badge: "TEST", title: "Test dönemi", description: "Geçerli açıklama",
      programLabel: initial.campaigns[0].programLabel.toLocaleLowerCase("tr-TR"), active: true,
    }), CampaignError);
    await assert.rejects(() => addCampaign({
      revision: initial.revision, badge: "TEST\nX", title: "Test dönemi", description: "Geçerli açıklama",
      programLabel: "Yeni program", active: true,
    }), CampaignError);
  } finally {
    delete process.env.CAMPAIGN_DATA_DIR;
    await rm(root, { recursive: true, force: true });
  }
});

