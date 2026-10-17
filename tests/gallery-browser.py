"""Local production UI/API smoke test. Never submits registrations or sends email.
Run against an isolated server started with the environment described in docs/GALLERY-DEPLOY.md.
"""
import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = "http://127.0.0.1:4317"
ROOT = Path(__file__).resolve().parent.parent
RESULTS = ROOT / "data" / "gallery-test-results"
RESULTS.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, channel="chrome")
    anonymous = browser.new_context()
    # Keep tests local and avoid sending test page views to production Analytics.
    anonymous.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE + "/") else route.abort())
    for method in ["GET", "POST", "PATCH"]:
        result = anonymous.request.fetch(BASE + "/api/owner/gallery", method=method)
        assert result.status == 401, (method, result.status)
        result = anonymous.request.fetch(BASE + "/api/owner/campaigns", method=method)
        assert result.status == 401, (method, result.status)
    result = anonymous.request.get(BASE + "/api/owner/gallery", headers={"x-middleware-subrequest": "proxy:proxy:proxy:proxy:proxy"})
    assert result.status == 401
    page = anonymous.new_page()
    page.goto(BASE + "/nvd-panel/galeri")
    expect(page).to_have_url(BASE + "/nvd-panel/giris")
    page.get_by_label("Kullanıcı Adı").fill(os.environ["ADMIN_USER"])
    page.get_by_label("Şifre", exact=True).fill("incorrect-password")
    page.get_by_role("button", name="Giriş Yap", exact=True).click()
    expect(page.get_by_text("Kullanıcı adı veya şifre hatalı.")).to_be_visible()
    page.get_by_label("Şifre", exact=True).fill(os.environ["ADMIN_PASSWORD"])
    page.get_by_role("button", name="Giriş Yap", exact=True).click()
    expect(page).to_have_url(BASE + "/nvd-panel", timeout=20000)
    cookies = anonymous.cookies()
    session = next(c for c in cookies if c["name"] == "nevdil_admin")
    auth = {"Cookie": f"nevdil_admin={session['value']}"}
    assert session["httpOnly"] and session["secure"] and session["sameSite"] == "Strict"

    page.get_by_role("link", name="Kayıt dönemleri", exact=True).click()
    expect(page.get_by_role("heading", name="Kayıt dönemleri", exact=True)).to_be_visible()
    add_campaign = page.locator("aside")
    add_campaign.get_by_label("Kısa etiket", exact=True).fill("KIŞ DÖNEMİ")
    add_campaign.get_by_label("Kart başlığı", exact=True).fill("Kış Dönemi Ön Kayıt")
    add_campaign.get_by_label("Kısa açıklama", exact=True).fill("Kış dönemi için sınırlı kontenjanla kayıtlarımız açıldı.")
    add_campaign.get_by_label("Formdaki seçenek adı", exact=True).fill("Kış Dönemi Kaydı")
    add_campaign.get_by_role("button", name="Dönemi ekle", exact=True).click()
    expect(page.get_by_role("status")).to_contain_text("Yeni kayıt dönemi eklendi")
    campaign_card = page.locator('input[name="title"]').last.locator("xpath=ancestor::article")
    expect(campaign_card.get_by_label("Kart başlığı", exact=True)).to_have_value("Kış Dönemi Ön Kayıt")
    expect(campaign_card).to_have_count(1)

    campaign_public = anonymous.new_page()
    campaign_public.goto(BASE)
    expect(campaign_public.get_by_text("Kış Dönemi Ön Kayıt", exact=True)).to_be_visible()
    campaign_public.goto(BASE + "/on-kayit?program=K%C4%B1%C5%9F%20D%C3%B6nemi%20Kayd%C4%B1")
    expect(campaign_public.get_by_label("Başvurmak İstediğiniz Program")).to_have_value("Kış Dönemi Kaydı")

    campaign_card.get_by_label("Kart başlığı", exact=True).fill("Kış Kursu Kayıtları")
    campaign_card.get_by_role("button", name="Metinleri kaydet", exact=True).click()
    expect(page.get_by_role("status")).to_contain_text("Dönem bilgileri güncellendi")
    campaign_card = page.locator('input[name="title"]').last.locator("xpath=ancestor::article")
    expect(campaign_card.get_by_label("Kart başlığı", exact=True)).to_have_value("Kış Kursu Kayıtları")
    campaign_card.get_by_role("button", name="Yayından kaldır", exact=True).click()
    expect(page.get_by_role("status")).to_contain_text("Dönem yayından kaldırıldı")
    campaign_public.goto(BASE)
    expect(campaign_public.get_by_text("Kış Kursu Kayıtları", exact=True)).to_have_count(0)
    campaign_card.get_by_role("button", name="Kalıcı sil", exact=True).click()
    expect(page.get_by_role("dialog", name="Kayıt dönemi kalıcı silinsin mi?")).to_be_visible()
    page.get_by_role("dialog", name="Kayıt dönemi kalıcı silinsin mi?").get_by_role("button", name="Kalıcı sil", exact=True).click()
    expect(page.get_by_role("dialog", name="Kayıt dönemi kalıcı silinsin mi?")).not_to_be_visible()
    expect(page.get_by_role("article")).to_have_count(2)
    campaign_public.close()

    page.get_by_role("link", name="Fotoğraf galerisi", exact=True).click()
    expect(page.get_by_role("heading", name="Fotoğraf galerisi")).to_be_visible()
    # Next keeps framework connections alive; wait for the actual panel content instead.
    expect(page.get_by_text("İlk kareyle başlayın")).to_be_visible()
    page.screenshot(path=str(RESULTS / "desktop-empty.png"), full_page=True)

    for headers in [{}, {"Origin": "https://attacker.invalid"}]:
        response = anonymous.request.patch(BASE + "/api/owner/gallery", data={"action": "delete"}, headers={**auth, **headers})
        assert response.status == 403, (headers, response.status, response.text())
    invalid = anonymous.request.post(BASE + "/api/owner/gallery", headers={**auth, "Origin": BASE}, multipart={
        "photo": {"name": "pretend.png", "mimeType": "image/png", "buffer": b"<svg />"},
        "caption": "Invalid photo", "consent": "yes",
    })
    assert invalid.status == 400

    for caption in ["Yerel test: sınıf etkinliği", "Yerel test: konuşma atölyesi"]:
        page.get_by_label("Fotoğraf", exact=True).set_input_files(str(ROOT / "public" / "logo.png"))
        page.get_by_label("Kısa açıklama").fill(caption)
        page.get_by_role("checkbox").check()
        page.get_by_role("button", name="Fotoğrafı yayınla", exact=True).click()
        expect(page.get_by_role("status")).to_contain_text("Fotoğraf yayınlandı", timeout=20000)
    cards = page.get_by_role("article")
    expect(cards).to_have_count(2)
    first_id = anonymous.request.get(BASE + "/api/owner/gallery", headers=auth).json()["photos"][0]["id"]
    page.get_by_role("button", name="2. fotoğrafı öne al", exact=True).click()
    expect(page.get_by_role("status")).to_contain_text("sırası güncellendi")
    expect(cards.first.get_by_label("Fotoğraf açıklaması")).to_have_value("Yerel test: konuşma atölyesi")
    cards.first.get_by_label("Fotoğraf açıklaması").fill("Güncellenen test açıklaması")
    cards.first.get_by_role("button", name="Açıklamayı kaydet").click()
    expect(page.get_by_role("status")).to_contain_text("Açıklama güncellendi")
    page.screenshot(path=str(RESULTS / "desktop-gallery.png"), full_page=True)

    page.set_viewport_size({"width": 390, "height": 844})
    page.screenshot(path=str(RESULTS / "mobile-gallery.png"), full_page=True)
    assert page.evaluate("document.documentElement.scrollWidth <= window.innerWidth"), "Mobile horizontal overflow"
    public_context = browser.new_context(viewport={"width": 390, "height": 844})
    public_context.route("**/*", lambda route: route.continue_() if route.request.url.startswith(BASE + "/") else route.abort())
    public = public_context.new_page()
    public.goto(BASE)
    expect(public.locator("#galeri figure")).to_have_count(2)
    expect(public.locator("#galeri figcaption").first).to_have_text("Güncellenen test açıklaması")
    public.locator("#galeri").scroll_into_view_if_needed()
    public.locator("#galeri").screenshot(path=str(RESULTS / "public-mobile.png"))
    assert public.locator("#galeri img").first.evaluate("el => el.complete && el.naturalWidth > 0")
    assert public.evaluate("document.documentElement.scrollWidth <= window.innerWidth")
    response = anonymous.request.get(BASE + "/api/gallery/" + first_id)
    assert response.status == 200 and response.headers["content-type"] == "image/webp"

    ids = [photo["id"] for photo in anonymous.request.get(BASE + "/api/owner/gallery", headers=auth).json()["photos"]]
    for index in range(2):
        cards.first.get_by_role("button", name="Sil", exact=True).click()
        expect(page.get_by_role("dialog")).to_be_visible()
        page.get_by_role("button", name="Fotoğrafı sil", exact=True).click()
        expect(page.get_by_role("dialog")).not_to_be_visible(timeout=10000)
        expect(cards).to_have_count(1 - index)
    for photo_id in ids:
        assert anonymous.request.get(BASE + "/api/gallery/" + photo_id).status == 404
    public.reload()
    expect(public.locator("#galeri")).to_have_count(1)
    expect(public.get_by_text("Yeni kareler çok yakında")).to_be_visible()
    page.get_by_role("button", name="Çıkış yap", exact=True).click()
    expect(page).to_have_url(BASE + "/nvd-panel/giris")
    assert anonymous.request.get(BASE + "/api/owner/gallery").status == 401
    browser.close()
print(json.dumps({"result": "passed", "checks": "login, authorization, campaign CRUD and publishing, CSRF, upload, reorder, caption, public gallery, mobile, delete, logout", "screenshots": str(RESULTS)}, ensure_ascii=False))
