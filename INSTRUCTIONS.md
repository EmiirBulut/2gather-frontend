# 2gather — Frontend UI Redesign Instructions
# For use with Claude Code (claude-cli)
# Place at: frontend-repo/INSTRUCTIONS_UI.md
# Bu dosya mevcut INSTRUCTIONS.md'ye ek olarak uygulanır.
# Önce mevcut INSTRUCTIONS.md'yi, ardından bu dosyayı oku.

---

## Genel Tasarım Sistemi

Tüm sayfalara uygulanacak temel değişkenler ve prensipler. Kod yazmadan önce bu bölümü tam olarak oku.

### Renk Paleti (CSS Variables — globals.css güncellenmeli)

```css
/* Ana renkler */
--color-primary: #3D5A4C;
--color-primary-hover: #2E4438;
--color-primary-light: #EEF2EF;
--color-primary-muted: #6B8F7A;

/* Arkaplanlar */
--color-bg-page: #F5F3EE;
--color-bg-card: #FFFFFF;
--color-bg-sidebar: #FFFFFF;
--color-bg-input: #FFFFFF;
--color-bg-tag: #EFEFEC;
--color-bg-dark-card: #3D5A4C;

/* Metin */
--color-text-primary: #1A1A1A;
--color-text-secondary: #6B6B6B;
--color-text-muted: #9B9B9B;
--color-text-on-dark: #FFFFFF;
--color-text-on-dark-muted: #B8CBB8;

/* Durumlar */
--color-status-purchased: #3D5A4C;
--color-status-purchased-bg: #E8F0EA;
--color-status-pending: #8B8B8B;
--color-status-pending-bg: #F0F0F0;

/* Kenarlıklar */
--color-border: #E8E6E0;
--color-border-input: #D4D0C8;
--color-border-dashed: #C8C5BC;

/* Progress */
--color-progress-bg: #E0DDD6;
--color-progress-fill: #3D5A4C;

/* Role badge */
--color-badge-owner-bg: #3D5A4C;
--color-badge-owner-text: #FFFFFF;
--color-badge-editor-bg: #E8EDF0;
--color-badge-editor-text: #3D5A7A;
--color-badge-viewer-bg: #F0EFEB;
--color-badge-viewer-text: #6B6B6B;
```

### Tipografi

```css
--font-display: 'Bricolage Grotesque', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

Tüm h1/h2/h3 ve büyük rakamlar `--font-display`. Gövde, label, form `--font-body`.

### Layout

- Sidebar genişliği: 210px, sabit, beyaz
- İçerik arka planı: `--color-bg-page`
- Kart border-radius: 16px
- Buton border-radius: 10px
- Input border-radius: 8px
- Chip/badge border-radius: 20px (pill)

---

## Phase UI-1 — Global Styles & Font

### Step UI-1.1 — Google Fonts

`index.html` head'e ekle:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Step UI-1.2 — globals.css güncelleme

Mevcut CSS değişkenlerini yukarıdaki palete göre değiştir. Body stili:
```css
body {
  background-color: var(--color-bg-page);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}
h1, h2, h3, .display {
  font-family: var(--font-display);
  font-weight: 700;
}
```

### Step UI-1.3 — Layout bileşenleri

`src/components/layout/` klasörü oluştur:

**`AppLayout.tsx`** — sidebar + içerik (proje sayfaları):
- Sol: `Sidebar` bileşeni (210px, sabit, beyaz)
- Sağ: `<main>` alanı, `background: var(--color-bg-page)`, `padding: 40px`

**`TopNavLayout.tsx`** — üst navbar + içerik (list selector):
- Üst: `TopNav` bileşeni
- Alt: `<main>` `max-width: 1100px`, `margin: auto`, `padding: 40px 24px`

**`AuthLayout.tsx`** — login/register için sarmalayıcı

**`Sidebar.tsx`** — Image 3/4/5/6/7/8'deki sol panel:
```
[Logo: "2gather" display font 18px bold + "Birlikte Planlayın" 11px muted]
[Nav: Dashboard / İtem Listesi / Raporlar / Üyeler]
[Alt: Settings]
[Alt: kullanıcı avatar 32px + isim 13px bold + rol 11px muted]
```
- Aktif nav item: `background: var(--color-primary-light)`, `color: var(--color-primary)`, border-radius 8px
- Hover: `background: var(--color-bg-tag)`
- Nav item: ikon (16px) + metin yan yana, padding 10px 12px

**`TopNav.tsx`** — Image 2'deki üst bar:
```
[Sol: "2gather" logo]
[Orta: Dashboard (aktif, underline) | İtem Listesi | Raporlar]
[Sağ: bildirim zili + kullanıcı avatar 40px]
```

**`Breadcrumb.tsx`** — Image 5/6 üst kısmı:
```ts
interface BreadcrumbItem { label: string; href?: string }
```
Ayraç `>`, son item düz metin, öncekiler link. 13px, muted.

**Checkpoint**: Sidebar ve TopNav render ediliyor. Aktif nav doğru. Breadcrumb çalışıyor.

---

## Phase UI-2 — Login Sayfası

Referans: Image 1

### Step UI-2.1 — İki sütun layout

`LoginPage.tsx` ve `LoginForm.tsx` güncelle. Wrapper: beyaz kart, `border-radius: 16px`, `max-width: 1100px`, `margin: auto`, `overflow: hidden`, iki sütun flex.

Sol sütun (%55): koyu yeşil overlay — `background: linear-gradient(to bottom, rgba(40,60,48,0.55), rgba(30,48,38,0.85)), url('/images/login-bg.jpg') center/cover`. Görsel yoksa `background: #3D5A4C`. Sol üst: beyaz logo. Sol alt: beyaz "Birlikte Planlayın" (display font 36px) + açıklama.

Sağ sütun (%45): beyaz, `padding: 48px`, form dikey ortada.

### Step UI-2.2 — Form alanları

```
[üst: "GİRİŞ PANELİ" — 11px, tracking-widest, muted]
[h1: "Hoş Geldiniz" — display font 32px]
[e-posta: label + input (border-bottom only)]
[şifre: label + input + göz toggle ikonu]
[Beni Hatırla checkbox | Şifremi Unuttum link]
[Giriş Yap butonu — tam genişlik, --color-primary bg]
[VEYA ayraç]
[Google ile devam et — beyaz bg, border, G ikonu]
[alt: "Hesabın yok mu? Kaydol."]
```

Input stili (tüm app için geçerli border-bottom pattern):
```css
.input-underline {
  border: none;
  border-bottom: 1.5px solid var(--color-border-input);
  background: transparent;
  width: 100%;
  padding: 10px 4px;
  font-size: 15px;
}
.input-underline:focus {
  outline: none;
  border-bottom-color: var(--color-primary);
}
```

Alt footer: "© 2024 2GATHER. TÜM HAKLARI SAKLIDIR." — 11px, muted, centered.

**Checkpoint**: Image 1 ile layout ve stiller eşleşiyor.

---

## Phase UI-3 — List Selector (Dashboard — Planlarım)

Referans: Image 2

### Step UI-3.1 — TopNavLayout kullan

`ListSelectorPage` `TopNavLayout` ile sarmalanmalı, `AppLayout` değil.

Sayfa içeriği `max-width: 1100px`, `margin: auto`:
```
[h1: "Hoş geldin, [isim]." — display font 36px]
[alt: "Birlikte planlamaya kaldığın yerden devam et." — muted]
```

İki kolon layout: sol %58, sağ %38 (gap 32px).

### Step UI-3.2 — Planlarım (sol)

"Planlarım" başlık + "2 AKTİF PROJE" sağda küçük metin.

Her liste kartı (beyaz, border-radius 16px, padding 24px, border):
```
[Üst: rol badge (SAHİP/EDİTÖR pill) + ⋯ menü sağda]
[Liste adı: bold 22px display]
[İki mini kutu yan yana:]
  [ÜYELER: avatar stack (28px daireler, -8px overlap)]
  [İLERLEME: "18/42 öğe"]
[TAMAMLANMA label + yüzde + progress bar (4px yüksek)]
```

Avatar stack: `position: relative`, her avatar `position: absolute`, `margin-left: -8px`.

Rol badge'leri: `SAHİP` → koyu yeşil; `EDİTÖR` → mavi tonlu.

"+ Yeni Plan Oluştur" kartı: `border: 1.5px dashed var(--color-border-dashed)`, `border-radius: 16px`, `padding: 40px`, içinde ortalı `+` daire ikonu + metin.

### Step UI-3.3 — Davet Edildiğim Planlar (sağ)

Başlık + açıklama. Davet kartı (beyaz, border, border-radius 16px):
```
[EDİTÖR badge (mavi)]
[liste adı: bold 20px]
[Sahibi avatar 24px + "Sahibi: [isim]"]
[2 satır: "5 üye" | "22/50 item"]
[İLERLEME + progress bar]
[PROJEYİ GÖRÜNTÜLE butonu: tam genişlik, background: var(--color-bg-tag), border]
```

Planlama ipucu kartı: görsel (teal/yeşil ev iç mekan fotosu veya placeholder) + beyaz metin kartı overlay. Küçük üst etiket "PLANLAMA İPUCU" + ipucu metni.

Sağ alt floating + butonu: 48px daire, `--color-primary` bg, `+` beyaz.

**Checkpoint**: Image 2 layout eşleşiyor. İki sütun, kart stilleri doğru.

---

## Phase UI-4 — Proje Dashboard

Referans: Image 3

`ListDetailPage` → `AppLayout` (sidebar'lı).

### Step UI-4.1 — Başlık alanı

```
["PROJE DURUMU" — 11px muted tracking]
[h1: proje adı — display font 48px, line-height 1]
["Birlikte Planlayın" — 14px muted]
[Sağ: "Genel İlerleme %43" + progress bar (tam genişlik, 6px yüksek)]
```

### Step UI-4.2 — Finansal Özet + Bekleyen Talepler (yan yana)

Sol kart (beyaz, %55):
```
["FİNANSAL ÖZET" — 11px muted]
["Tahmini Toplam Bütçe" — display 22px] [sağda: yeşil kare ikon]
["Toplam Hedef" muted label]
[büyük rakam: display font 40px]
[iç beyaz kart: "Harcanan Tutar" + kırmızı rakam + alt çizgi]
```

Sağ kart (beyaz, %45):
```
["Bekleyen Talepler" + kırmızı "3 Yeni" pill badge]
[liste — her satır: ikon daire + isim+açıklama + "İncele" butonu]
```
Satır ayırıcı: `border-bottom: 1px solid var(--color-border)`.

### Step UI-4.3 — Proje Özeti grid

3 sütun grid, kategori kartları (beyaz, border-radius 16px, padding 20px):
```
[üst: renkli ikon kare (40px, border-radius 10px) + "%65 Tamam" sağda]
[Oda adı: bold 16px display]
[açıklama: 13px muted]
[alt: avatar stack]
```

Oda ikon arka plan renkleri:
- Salon: `#E8F0EA`
- Yatak Odası: `#E8EDF5`
- Mutfak: `#F5E8E8`
- Banyo: `#E8F5F0`
- Çocuk Odası: `#F5F0E8`
- Genel: `#F0F0EE`

"Yeni Kalem Ekle" floating butonu: `position: fixed`, `bottom: 32px`, `right: 32px`, `--color-primary` bg, beyaz, `border-radius: 12px`, `padding: 14px 20px`, `+ Yeni Kalem Ekle` metni.

**Checkpoint**: Image 3 ile eşleşiyor. Finansal kart, bekleyen talepler, kategori grid doğru.

---

## Phase UI-5 — İtem Listesi

Referans: Image 4

### Step UI-5.1 — Başlık ve filtreler

```
[breadcrumb]
["EV KURULUM LİSTESİ" — 11px muted tracking]
[h1: "İtem Listesi" — display font 48px] [sağ: "+ İtem Ekle" butonu koyu yeşil]
```

Kategori filtre chip'leri (scroll yatay, `gap: 8px`):
- Seçili: `background: var(--color-primary)`, beyaz metin
- Seçisiz: beyaz bg, `border: 1px solid var(--color-border)`, muted metin
- `border-radius: 20px`, `padding: 6px 16px`, `font-size: 14px`

### Step UI-5.2 — Kart grid

Her kategori için başlık satırı: `[Kategori adı bold 22px display] [sağda: "4 İtem" muted]`

3 sütun grid, `gap: 16px`. Her item kartı (`border-radius: 16px`, `overflow: hidden`, beyaz):

**Üst — görsel alan** (`height: 180px`):
- `imageUrl` varsa: `<img src={url} style="width:100%;height:100%;object-fit:cover">`
- Yoksa: `background: var(--color-bg-tag)` + kategori ikonu ortalı
- Sol üst köşe: küçük ikon kare (40px, `background: rgba(0,0,0,0.4)`, `border-radius: 8px`)

**Alt — bilgi alanı** (padding 16px):
```
[ürün adı bold 15px | durum badge sağda]
[kategori: MUTED 11px tracking]
[ince çizgi]
[seçenek ikonu + "X Seçenek" | fiyat bold sağda]
```

Durum badge:
- SATIN ALINDI: `background: var(--color-status-purchased-bg)`, `color: var(--color-status-purchased)`
- BEKLİYOR: `background: var(--color-status-pending-bg)`, `color: var(--color-status-pending)`

"Yeni İtem Ekle" son kart: `border: 1.5px dashed var(--color-border-dashed)`, içinde ortalı `+` gri daire (48px) + "Yeni İtem Ekle" metin.

Floating sepet butonu: `position: fixed`, `bottom: 32px`, `right: 32px`, 56px daire, `--color-primary` bg.

**Checkpoint**: Image 4 ile eşleşiyor. Grid kart layout, görsel alan, badge renkler doğru.

---

## Phase UI-6 — İtem Detay Sayfası

Referans: Image 5

**Önemli**: Bu sayfa artık modal değil, tam sayfa. Route: `/lists/:listId/items/:itemId`

`ItemDetailModal.tsx` → `ItemDetailPage.tsx` olarak yeniden yaz. Modal kodu kaldır.

### Step UI-6.1 — Sayfa yapısı

AppLayout içinde, iki sütun:
- Sol geniş alan: görsel + seçenek listesi
- Sağ panel (`width: 280px`, `flex-shrink: 0`): meta bilgi + teknik detaylar

**Sol — başlık:**
```
[breadcrumb: Yeni Evimiz > İtem Listesi > Salon > L Koltuk Takımı]
["SALON" — 11px muted tracking]
[h1: ürün adı — display font 48px]
```

**Sol — görsel:**
`border-radius: 16px`, `overflow: hidden`, `max-height: 380px`. Sol alt köşe tag'leri: "MOBİLYA", "ÖNCELİKLİ" — `background: rgba(255,255,255,0.9)`, gri metin, pill, `position: absolute`, `bottom: 16px`, `left: 16px`.

**Sol — seçenekler:**
"Seçenekler" başlık (bold 20px). Her seçenek yatay kart (beyaz, border, border-radius 12px, padding 16px):
```
[görsel 64x64px border-radius 8px]
[sağda: başlık bold 15px | açıklama muted 13px | fiyat bold + link muted]
[en sağda: "Seç" butonu veya durum]
```
Satın alınmış seçenek: `background: var(--color-bg-tag)`, "SATIN ALINDI" badge üst sağ, "Faturalandırıldı" koyu yeşil buton.

### Step UI-6.2 — Sağ panel kartları

**Seçenekler meta kartı** (beyaz, border, border-radius 16px, padding 20px):
```
["Seçenekler" + "3 Kayıt" pill sağda]
["+ Seçenek Ekle" buton — tam genişlik, --color-primary]
[---]
[Durum: Tamamlandı]
[Son Güncelleme: 2 saat önce]
[Atanan: Sahibi + avatar]
```

**Teknik Detaylar kartı** (beyaz, border, border-radius 16px):
```
["TEKNİK DETAYLAR" — 11px muted tracking]
[2 kutu yan yana: her biri muted label + değer bold]
[Malzeme: tek kutu tam genişlik]
```
Bu alanlar `brand` → Malzeme, `model` → Model/Seri, `color` → Renk olarak gösterilir. Label isimleri item tipine göre değişebilir, şimdilik sabit "TEKNİK DETAYLAR".

**Planlama Notu kartı** (`background: var(--color-bg-dark-card)`, beyaz metin, border-radius 16px, padding 20px):
```
[ℹ ikonu + "Planlama Notu" — beyaz bold]
[not metni — var(--color-text-on-dark-muted)]
```
`Item`'a `planningNote: string | null` tipi ekle. Backend'de bu alan yoksa şimdilik `notes` alanından al.

**Sidebar alt:** kullanıcı avatar (40px) + isim bold + rol muted.

**Checkpoint**: Image 5 ile eşleşiyor. Modal yok, tam sayfa. Sağ panel 3 kart.

---

## Phase UI-7 — Yeni İtem Ekle Sayfası

Referans: Image 6

Route: `/lists/:listId/items/new` → `NewItemPage.tsx`

### Step UI-7.1 — Layout

AppLayout. Breadcrumb üstte. Başlık:
```
[h1: "Yeni İtem Ekle" — display font 40px]
[açıklama: muted]
```

İki sütun: sol %65 (form), sağ %35 (görsel upload).

### Step UI-7.2 — Form

```
["İTEM ADI" label — 11px muted tracking]
[input — border-bottom stili, placeholder]

["KATEGORİ" label]
[chip'ler: Salon | Mutfak | Yatak Odası | Banyo]
["+ Yeni Ekle" chip — border dashed, muted]
```

Seçili kategori chip: `background: var(--color-primary)`, beyaz.

Alt bölüm (gri kart: `background: var(--color-bg-tag)`, `border-radius: 16px`, `padding: 24px`):
```
[🛍 "Satın Alma Seçeneği (Opsiyonel)" başlık — bold 16px]
[iki kolon: MAĞAZA / LİNK input-underline | TAHMİNİ FİYAT input-underline + ₺ ikonu sağda]
```

### Step UI-7.3 — Görsel upload alanı

Sağ sütun: `border: 1.5px dashed var(--color-border-dashed)`, `border-radius: 16px`, `aspect-ratio: 1`, `cursor: pointer`:
- Kamera ikonu gri 32px + "Görsel Ekle (Opsiyonel)" metin
- Tıklanınca `<input type="file" accept="image/*">` tetikler
- Görsel seçilince preview göster

### Step UI-7.4 — Aksiyon barı

```
[← İptal — link, muted] [boşluk] [Kaydet ✓ — koyu yeşil buton]
```

Sayfa altı watermark: `position: absolute`, `bottom: 24px`, `left: 40px`:
```
PROJECT REF: [listAdı]_2024
DOCUMENT NO: F1-[sıra]
```
`color: var(--color-text-muted)`, `font-size: 11px`, `letter-spacing: 0.1em`.

**Checkpoint**: Image 6 ile eşleşiyor. Upload alanı, kategori chip'leri, alt bölüm doğru.

---

## Phase UI-8 — Raporlar Sayfası

Referans: Image 7

### Step UI-8.1 — Başlık

```
["ANALİZ & GÖRÜNÜM" — 11px muted tracking]
[h1: "Raporlar" — display font 64px]
[açıklama metni]
[sağ: "Dışa Aktar" (border buton) + "Paylaş" (--color-primary buton)]
```

### Step UI-8.2 — Finansal Özet + Hazırlık Durumu

İki kart yan yana:

Sol (beyaz, border-radius 16px, padding 28px):
```
["Finansal Özet" — bold 20px]
[3 kolon: TOPLAM BÜTÇE | HARCANAN | KALAN LİMİT]
[her biri: muted label 11px + büyük rakam display font]
["Bütçe Kullanımı" + yüzde + progress bar tam genişlik]
```

Sağ (`background: var(--color-bg-dark-card)`, border-radius 16px, padding 28px, beyaz metin):
```
[ev ikonu beyaz 32px]
["Hazırlık Durumu" — display font 28px beyaz]
[açıklama — muted beyaz]
[büyük rakam: "74%" — display font 64px beyaz]
["TAMAMLANMA ORANI" — 11px muted beyaz tracking]
```

### Step UI-8.3 — Kategori ilerleme

4 sütun grid, her kart (beyaz, border-radius 12px, padding 16px):
```
[Oda adı bold + yüzde sağda]
[SegmentedProgressBar bileşeni]
[alt: "X/Y İTEM ALINDI" muted]
```

`SegmentedProgressBar` bileşeni oluştur (`src/components/ui/SegmentedProgressBar.tsx`):
```ts
interface Props { total: number; completed: number }
```
Her segment: `width = (100% - (total-1)*2px) / total`, yükseklik 6px, border-radius 3px. Tamamlanan: `var(--color-progress-fill)`, diğer: `var(--color-progress-bg)`. Segmentler arası 2px gap.

### Step UI-8.4 — İtem tablosu

```
["İtem Listesi & Durum" başlık]
[legend: ● Satın Alındı ○ Bekliyor]
```

Tablo (tam genişlik):
- Kolonlar: GÖRSEL | İTEM ADI | KATEGORİ | TAHMİNİ FİYAT | DURUM
- Görsel: 48x48px, border-radius 8px, object-fit cover
- Kategori: pill badge (`var(--color-bg-tag)`, muted metin)
- Durum: ikon + metin

Sayfa footer:
```
[sol: — DESIGN FOR COLLECTIVE PLANNING]
[sağ: 2gather Reports v2.4 — 2024]
```
`color: var(--color-text-muted)`, `font-size: 12px`, `letter-spacing: 0.15em`. `margin-top: 64px`.

**Checkpoint**: Image 7 ile eşleşiyor. Koyu kart, segmentli progress, tablo footer doğru.

---

## Phase UI-9 — Üyeler Sayfası

Referans: Image 8

### Step UI-9.1 — Başlık

```
["YENİ EVİMİZ" — 11px muted tracking]
[h1: "Üyeler" — display font 44px]
[açıklama metni]
```

### Step UI-9.2 — Aktif Üyeler + Bekleyen Davetler (sol)

"Aktif Üyeler" section başlığı bold 18px.

Her üye satırı (beyaz kart, border-radius 12px, padding 16px 20px, margin-bottom 8px):
```
[avatar 48px (fotoğraf veya initials daire)]
[isim bold 15px | e-posta muted 13px]
[sağ: rol badge pill]
```

Initials daire: ismin baş harfleri, `background: var(--color-bg-tag)`, `color: var(--color-text-secondary)`, font-weight 500.

Rol badge stilleri:
- SAHİP: `background: var(--color-badge-owner-bg)`, `color: var(--color-badge-owner-text)`
- EDİTÖR: `background: var(--color-badge-editor-bg)`, `color: var(--color-badge-editor-text)`
- İZLEYİCİ: `background: var(--color-badge-viewer-bg)`, `color: var(--color-badge-viewer-text)`

"Bekleyen Davetler" section (muted başlık):
Her satır: zarf ikonu gri daire 40px + e-posta bold + "X gün önce gönderildi" muted + rol badge + `✕` buton.

### Step UI-9.3 — Davet paneli (sağ)

`width: 280px`, `flex-shrink: 0`. Beyaz kart, border-radius 16px, padding 24px:
```
["Yeni Davet Et" bold 18px]
[açıklama muted]
[---]
["E-POSTA ADRESİ" 11px muted tracking]
[input — border-bottom stili]
["ROL SEÇİN" 11px muted tracking]
[toggle butonlar: EDİTÖR | İZLEYİCİ]
[rol açıklaması: "Editörler içerik ekleyebilir... İzleyiciler..."]
["Davet Et >" buton tam genişlik --color-primary]
```

Toggle butonlar: iki buton yan yana, seçili: `--color-primary` bg beyaz metin, seçisiz: beyaz bg border.

Uyarı kartı (`background: #FDE8E8`, border-radius 12px, padding 16px):
```
[ℹ ikonu + "Ekip Yönetimi" bold]
[bilgi metni]
```

**Checkpoint**: Image 8 ile eşleşiyor. Sol liste + sağ panel. Badge renkler doğru.

---

## Phase UI-10 — Route Güncellemeleri

### Step UI-10.1 — Yeni route'lar

`router/routes.ts`'e ekle:
```ts
ITEM_DETAIL: '/lists/:listId/items/:itemId',
NEW_ITEM: '/lists/:listId/items/new',
```

`router/index.tsx`'e ekle:
- `/lists/:listId/items/:itemId` → `ProtectedRoute` → lazy `ItemDetailPage`
- `/lists/:listId/items/new` → `ProtectedRoute` → lazy `NewItemPage`

### Step UI-10.2 — Modal kaldırma

`ItemDetailModal.tsx` silinir. `ListDetailPage`'deki item kartına tıklama `navigate(ROUTES.ITEM_DETAIL)` ile tam sayfaya yönlendirir.

`ItemListPage`'deki "+ İtem Ekle" butonu `ROUTES.NEW_ITEM`'a navigate eder.

### Step UI-10.3 — Layout atamaları

Her sayfa doğru layout içinde:
- `LoginPage`, `RegisterPage`, `InviteAcceptPage` → `AuthLayout`
- `ListSelectorPage` → `TopNavLayout`
- Diğer tüm proje sayfaları → `AppLayout`

**Checkpoint**: Tüm route'lar çalışıyor. Modal yok, tam sayfa geçişler var. Her layout doğru sayfada.

---

## Genel Kurallar (UI için)

1. Tüm renkleri CSS değişkenleriyle yaz, hardcode hex kullanma bileşen içinde.
2. `font-family: var(--font-display)` sadece başlıklar. Gövde hep `var(--font-body)`.
3. Tüm fiyatları `formatPrice()` ile formatla.
4. Görsel alanlar `<img>` tag ile, `alt` attribute zorunlu.
5. Her phase sonunda `npm run build` — sıfır TypeScript hatası.
6. `usePermission` hook'unu edit/delete kontrolleri için kullan.
7. Modal'dan sayfaya taşınan bileşenlerde eski modal kodunu temizle.
8. `ListSelectorPage` TopNavLayout, diğerleri AppLayout.
9. Mail gönderimi için frontend'de hiçbir Resend bağımlılığı ekleme — tüm mail işlemi backend'de.

---

## Bug Fixes

### BF-1 — List Selector: sahip olunan planlar "Davet Edildiğim" altında görünüyor (2026-04-23)

**Sorun:** `ListSummaryDto` frontend tipi `ownerId: string` olarak tanımlıydı ama backend bu alanı göndermiyordu; backend `currentUserRole: number` (0=Owner, 1=Editor, 2=Viewer) gönderiyordu. `ListSelectorPage.tsx` `l.ownerId === user.id` karşılaştırması yaptığından `ownerId` her zaman `undefined` kalıyor, tüm listeler "davet edildi" sepetine düşüyordu.

**Değişen dosyalar:**
- `src/features/lists/types/index.ts` — `ListSummaryDto`'dan `ownerId` kaldırıldı, `currentUserRole: number` ve backend'in gönderdiği diğer alanlar eklendi (`totalItemCount`, `purchasedItemCount`, `pendingItemCount`, `completionPercentage`, `members`)
- `src/pages/ListSelectorPage.tsx` — filtre `l.currentUserRole === 0` ile güncellendi
- `src/hooks/usePermission.ts` — lists cache fallback da `currentUserRole === 0` kullanacak şekilde güncellendi; Editor rolü (1) için `canEdit: true` eklendi

### BF-2 — List Selector: farklı kullanıcı girişinde önceki kullanıcının listeleri anlık görünüyor (2026-04-23)

**Sorun:** TanStack Query cache logout sırasında temizlenmiyordu. A kullanıcısının listeleri cache'te kalıyor, B kullanıcısı giriş yapınca `staleTime` süresi dolmamışsa bu cache anlık olarak render ediliyordu.

**Değişen dosyalar:**
- `src/lib/queryClient.ts` — `QueryClient` instance'ı `main.tsx`'den bu dosyaya taşındı (böylece `api.ts` de import edebilir)
- `src/main.tsx` — local `QueryClient` kaldırıldı, `@/lib/queryClient` import'u eklendi
- `src/services/api.ts` — `clearSession()` fonksiyonuna `queryClient.clear()` eklendi; 401 veya logout sırasında tüm cache temizleniyor

### BF-3 — NewItemPage: `price !== ''` TypeScript karşılaştırma hatası (2026-04-23)

**Sorun:** `z.coerce.number()` ile tanımlanan `price` alanı TypeScript'te `number` olarak çözümleniyor, `data.price !== ''` karşılaştırması tip hatası üretiyordu.

**Değişen dosyalar:**
- `src/pages/NewItemPage.tsx` — karşılaştırma `!!data.price` ile basitleştirildi

### BF-4 — InviteMemberModal: eski hook API'sine uyumsuzluk (2026-04-23)

**Sorun:** `useInviteMember()` hook'u artık `listId: string` argümanı gerektiriyor ama modal argümansız çağırıyordu. Modal hiçbir yerde kullanılmıyor (dead code), ancak TypeScript build hatasına yol açıyordu.

**Değişen dosyalar:**
- `src/features/members/components/InviteMemberModal.tsx` — `useInviteMember(listId)` ve `mutate(data)` olarak güncellendi

### BF-5 — ListCard: item sayısı, tamamlanma yüzdesi ve progress bar hardcode placeholder gösteriyordu (2026-04-23)

**Sorun:** `ListCard.tsx` içinde `— öğe`, `—%`, `width: '0%'` sabit değerleri kullanılıyordu. Backend `totalItemCount`, `purchasedItemCount`, `completionPercentage`, `members[]` alanlarını doğru döndürüyordu ama bileşen bunları hiç kullanmıyordu. Avatar stack'i de `String.fromCharCode` ile sahte harfler üretiyordu.

**Değişen dosyalar:**
- `src/features/lists/components/ListCard.tsx` — `purchasedItemCount/totalItemCount öğe`, `%completionPercentage`, progress bar genişliği ve avatar initials gerçek DTO alanlarından okunacak şekilde güncellendi. Rol badge'i de `currentUserRole`'dan dinamik üretiliyor.
