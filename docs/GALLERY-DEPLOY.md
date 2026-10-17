# Nev-Dil galeri yönetimi — yayın ve kullanım

Bu değişiklikler yalnızca Nev-Dil içindir. Otomatik commit, push veya VPS işlemi yapılmaz.
Köstebek deposu, dosyaları, veritabanı, PM2 süreçleri ve Nginx site tanımı bu adımların kapsamı dışındadır.

## Sahipler nasıl kullanacak?

1. `https://nevdil.com/nvd-panel/giris` adresine mevcut ortak yönetici hesabıyla girin.
2. **Fotoğraf galerisi** sekmesini açın.
3. JPG, PNG veya WebP seçin, açıklama yazın ve paylaşım iznini onaylayın.
4. **Fotoğrafı yayınla** düğmesine basın. Ana sayfayı yenileyen ziyaretçi fotoğrafı görür; build gerekmez.
5. Oklarla sıralayın. İlk fotoğraf büyük kapak fotoğrafıdır. Açıklamalar sonradan düzenlenebilir.
6. **Sil** ardından **Fotoğrafı sil** ile kaldırın. İndirilmiş üçüncü taraf kopyalarını silemezsiniz.

Sınırlar: dosya başına 8 MB, 20 megapiksel, en fazla 60 fotoğraf. Animasyon ve SVG kabul edilmez.
Dosyalar en fazla 1600 piksel WebP'ye dönüştürülür; EXIF/GPS bilgileri tutulmaz.
Bir dakikada en fazla 10 yükleme yapılabilir. Fotoğraflar yayınlandıktan sonra herkese açıktır.
Galeri boşsa ziyaretçiye boş kutular gösterilmez.

## Giriş ve güvenlik

- Mevcut `ADMIN_USER` ve `ADMIN_PASSWORD` kullanılmaya devam eder. Yeni bir hesap açmak gerekmez.
- Yeni oturum biçimi nedeniyle yayından sonra bir kez yeniden giriş gerekir.
- Oturum sunucuda da 12 saat sonra geçersiz olur. Şifre/kullanıcı adı değişince eski oturumlar geçersizleşir.
- Aynı istemciden 15 dakikalık pencerede 10 hatalı girişten sonra o istemcinin girişi geçici olarak engellenir. Başka sahipler kilitlenmez; restart sayacı sıfırlamaz.
- Sayfa, API ve kayıt silme işlemleri ayrıca yetki kontrolü yapar. Panel adresini bilmek yetki vermez.
- Fotoğraf değiştirme isteklerinde Origin kontrolü yapılır. Paneli `.env.local` içindeki `SITE_URL` adresinden açın (önerilen: `https://nevdil.com`).
- Yalnızca sahiplerle paylaşılmış uzun ve benzersiz bir şifre kullanın. Şifreyi repoya veya mesajlara yapıştırmayın.

## VPS adımları (sen çalıştıracaksın)

Önce yerelde değişiklikleri inceleyip kendi commit/push işlemini yap. `data/` ve `.env.local` Git'e eklenmemeli.

VPS'te yalnızca Nev-Dil klasörüne gir:

```bash
cd /var/www/nevdil-website
git status --short
```

Yerel değişiklik varsa ezme veya `reset --hard` kullanma; önce farkı incele. Çalışma ağacı uygunsa:

```bash
git pull --ff-only origin main
npm ci
mkdir -p data/gallery
chmod 700 data/gallery
npm run test:gallery
npm run build && pm2 restart nevdil-website --update-env
```

Beklenen: testler geçer, build hatasız tamamlanır ve yalnızca `nevdil-website` süreçleri yeniden başlar.
`npm ci` kilit dosyasını kullanır; `npm audit fix --force` çalıştırma. Node en az 20.9 gerekir; daha önce kullandığın 20.20.2 bu gereksinimi karşılar.
Next.js güvenlik düzeltmeleri için 16.4.2'ye yükseltildi. Aynı klasörde build/restart sırasında Nev-Dil'de kısa kesinti olabilir; boş bir zamanda uygula.

Mevcut `.env.local` değerlerini koru. Şu değerlerin dolu/doğru olduğundan emin ol:

```dotenv
SITE_URL=https://nevdil.com
ADMIN_USER=mevcut-kullanici-adin
ADMIN_PASSWORD=mevcut-guclu-sifren
```

Yukarıdakiler şablondur, mevcut değerlerin üzerine aynen yapıştırılmamalıdır. E-posta ayarlarını değiştirme.
Varsayılan fotoğraf dizini `/var/www/nevdil-website/data/gallery` olur. Normal kurulumda ek env gerekmez.
İsteğe bağlı `GALLERY_DATA_DIR` mutlak bir kalıcı dizine ayarlanabilir; uygulama kullanıcısının yazma izni olmalıdır.

## Nginx: sadece fotoğraf endpoint'inin yükleme sınırı

Eski 1 MB sınırı büyük fotoğraflarda 413 hatası verir. **Tüm Nginx dosyasını repodaki örnekle değiştirme.**
Mevcut SSL ve diğer sitelerin ayarlarını koruyarak yalnızca Nev-Dil'in HTTPS `server` bloğuna yeni bir `location` ekle.

Önce sadece Nev-Dil tanımını yedekle ve aç:

```bash
sudo cp -a /etc/nginx/sites-available/nevdil-website /etc/nginx/sites-available/nevdil-website.before-gallery
sudo nano /etc/nginx/sites-available/nevdil-website
```

`server_name nevdil.com ...` ve `listen 443 ssl` içeren bloğun içine, diğer `location` bloklarının yanına
`nginx/nevdil-gallery.location.conf` dosyasındaki **tek location bloğunu** ekle. Mevcut `location /` bloğunun içine ekleme.
Aynı endpoint için zaten bir location varsa ikinci kopyasını oluşturma; var olanı incele.

```nginx
location = /api/owner/gallery {
    client_max_body_size 9M;
    client_body_timeout 30s;
    proxy_read_timeout 60s;
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

Ardından:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

`syntax is ok` ve `test is successful` görülmeli. Test başarısızsa reload çalışmaz; hata düzeltilmeden restart yapma.
Reload ortak Nginx servisinin yapılandırmayı yeniden okumasıdır; bu yüzden sadece Nev-Dil dosyasındaki farkı kontrol et.
Köstebek site tanımında hiçbir değişiklik yapma. SSL sertifikalarını yeniden oluşturmak gerekmez.

## Kalıcılık ve yedekler

- `data/gallery/gallery.json`: sıralama ve açıklamalar.
- `data/gallery/<rastgele-id>.webp`: fotoğraflar.
- `data/gallery/auth/`: yalnızca giriş deneme sayacı; fotoğraf API'sinden erişilemez.
- `data/gallery-backups/`: en son 7 tam galeri yedeği; her biri manifest + fotoğraflar içerir.
- Mevcut `scripts/backup-registrations.sh` artık galeri yedeğini de alır. Kayıt yedeklerinin 30 günlük saklama davranışı korunur.
- Galeri yedeği başarısız olursa kayıt yedeği yine denenir ve komut hata koduyla çıkar.

Manuel doğrulama:

```bash
cd /var/www/nevdil-website
bash scripts/backup-registrations.sh
ls -la data/gallery-backups/
```

Fotoğraf henüz yüklenmediyse “Galeri henüz yok; yedek atlandı” normaldir.
Mevcut cron zaten bu script'i çalıştırıyorsa yeni cron ekleme; Köstebek satırlarına dokunma.
Cron'un kullandığı Node yolunu ve log dosyasına yazma iznini kontrol et. Elle başarı, gece cron'un da çalıştığını tek başına kanıtlamaz.
Bu yedekler aynı VPS'tedir: sunucu/disk kaybına karşı ayrıca dışarıya yedek alınmalıdır.
Yedekler depolama tüketir; 7 dolu galeri yedeği en fazla yaklaşık 840 MB fotoğraf alanı kullanabilir.

Geri yükleme gerekiyorsa sadece `nevdil-website` durdurularak seçilen yedeğin `gallery.json` ve `.webp` dosyaları birlikte geri konur;
çalışan panelin üzerine kısmi kopyalama yapılmaz. `data/` klasörünü deploy sırasında silme.

## Yayın sonrası kısa kontrol

1. Gizli pencerede `/nvd-panel/galeri` giriş ekranına yönlendirmeli.
2. Oturumsuz `/api/owner/gallery` isteği `401` dönmeli.
3. Giriş yap, izni olan bir fotoğrafı açıklamasıyla yükle; mümkünse 1 MB üzerindeki bir görselle Nginx sınırını da doğrula.
4. Ana sayfada fotoğrafı kontrol et; sırasını ve açıklamasını değiştir.
5. Test fotoğrafını panelden sil; ana sayfayı yenilediğinde kaybolmalı.
6. Ön kayıt listesinin açıldığını doğrula; bu testler gerçek ön kayıt göndermez, e-posta tetiklemez.

## Yerel testler

```bash
npm run test:gallery
npm run lint
npm run build
```

`tests/gallery-browser.py`, Chrome ve Python Playwright ile üretim build'ine karşı gerçek tarayıcı akışını doğrular.
`python tests/run-gallery-browser.py` bu test için ayrı geçici klasör/hesap oluşturur, yerel sunucuyu başlatır ve test bitince kapatır.
Yalnızca `127.0.0.1:4317` için yazılmıştır. Test sunucusuna ayrı `GALLERY_DATA_DIR`, geçici `ADMIN_USER`/`ADMIN_PASSWORD`
ve `SITE_URL=http://127.0.0.1:4317` verilmeli; gerçek galeri veya üretim sunucusu üzerinde çalıştırılmamalıdır.
