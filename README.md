# Laser Deflector / Lazer Savunucu

> **Dual-Directional Neon Rhythm** — Çift Yönlü Neon Ritim Oyunu

[![Phaser 3](https://img.shields.io/badge/Phaser-3.70-blue)](https://phaser.io/)
[![Parcel](https://img.shields.io/badge/Parcel-2.12-7b5cff)](https://parceljs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🇹🇷 Türkçe

### Hakkında

**Lazer Savunucu**, ekranın ortasında konumlanan yatay bir bariyeri kontrol ettiğiniz, hızlı tempolu bir refleks ve ritim oyunudur. Yukarıdan ve aşağıdan gelen renkli lazer toplarını doğru renkteki bariyerle yakalayarak puan kazanın; yanlış eşleşmede can kaybedin. Skorunuz arttıkça oyun hızlanır, kombo zincirleri kurabilir ve **Ateş Modu (Fever Mode)** ile geçici bir güç patlaması yaşayabilirsiniz.

Oyun tamamen tarayıcıda çalışır; ilerlemeniz `localStorage` ile cihazınızda saklanır. Türkçe ve İngilizce dil desteği mevcuttur. Android cihazlar içinde uyumludur

### Oynanış

#### Temel Mekanik

| Öğe | Açıklama |
|-----|----------|
| **Bariyer** | Ekranın tam ortasında yatay bir çizgi. Dokunar veya tıklayarak **kırmızı ↔ mavi** arasında geçiş yap. |
| **Lazer topları** | Rastgele yukarıdan **veya** aşağıdan gelir; renkleri kırmızı veya mavi olabilir. |
| **Doğru eşleşme** | Kırmızı top → kırmızı bariyer, mavi top → mavi bariyer. Başarılı yakalama = +1 skor. |
| **Yanlış eşleşme** | Renk uyuşmazlığı = -1 can. Kombo sıfırlanır, top hızı başlangıç değerine döner. |
| **Can sistemi** | Varsayılan 3 can (yükseltmelerle en fazla 6). Can 0 olunca oyun biter. |

#### Kombo ve Ateş Modu

- Her başarılı yakalama kombo sayacını artırır.
- **15 kombo**'ya ulaşınca **Ateş Modu** başlar (5 saniye).
- Ateş Modu sırasında:
  - Tüm toplar otomatik olarak doğru sayılır (renk kontrolü yok).
  - Skor **2×** çarpanla artar.
  - Top hızı %25 artar, spawn aralığı kısalır.
  - Bariyer altın rengine döner; ekran titrer, kıvılcım efektleri oynar.
- Ateş Modu bitince kombo sıfırlanır ve aktif toplar temizlenir.

#### Zorluk Eğrisi

- Her **10 başarılı yakalamada** yeni bir seviye başlar; top spawn aralığı kısalır.
- Her başarılı yakalamada top hızı kalıcı olarak artar (hasar alınca sıfırlanır).
- Minimum spawn gecikmesi: 450 ms.

#### Düşen Kalpler (Can Toplama)

- Canınız maksimumun altındayken periyodik olarak kalp düşer.
- Kalbi yakalamak için bariyer rengini kalp rengiyle eşleştirin → +1 can.
- Yanlış renkte yakalarsanız ceza alırsınız (varsayılan -1; yükseltmelerle -2 veya -3).

#### Cevher Sistemi

Oyun sonunda kazandığınız cevherler:

```
Cevher = 3 (sabit bonus) + floor(Skor × çarpan)
```

Cevherler dükkanda harcanır. En yüksek skor kayıt altına alınır.

### Dükkan

Dört sekme bulunur:

| Sekme | İçerik |
|-------|--------|
| **Bariyer** | Görsel skin: Klasik, Kesikli, Çift Akım, Dalgalı |
| **İz** | Top izi efekti: Yok, Kıvılcım, Hayalet |
| **Tema** | Renk paleti: Siberpunk, Zehirli Çöl, Retro Sentez |
| **Yükseltme** | Kalıcı oyun içi güçlendirmeler |

#### Yükseltmeler

**Kolaylaştırıcı:**
- **Can Kapasitesi** — Maksimum can 3'ten 6'ya çıkar (3 seviye).
- **Cevher Bonusu** — Oyun sonu cevher çarpanını artırır (4 seviye).

**Zorlaştırıcı** *(dikkatli olun!)*:
- **Düşen Can Aralığı** — Kalpler daha seyrek düşer.
- **Renk Değiştiren Kalpler** — Kalpler düşerken renk değiştirir.
- **Yanlış Renk Cezası** — Yanlış kalp yakalama cezası artar.

### Kontroller

| Platform | Eylem |
|----------|-------|
| **Mobil** | Ekrana dokun → bariyer rengini değiştir |
| **Masaüstü** | Fare tıklaması → bariyer rengini değiştir |
| **Dil** | Ana menüde sağ alttaki 🌐 düğmesi (TR ↔ EN) |

### Teknoloji Yığını

- **[Phaser 3](https://phaser.io/)** — 2D oyun motoru (Arcade Physics)
- **[Parcel](https://parceljs.org/)** — Sıfır yapılandırmalı bundler
- **Vanilla JavaScript (ES Modules)** — Framework bağımlılığı yok
- **localStorage** — Kayıt verisi ve dil tercihi

### Proje Yapısı

```
laser-deflector/
├── index.html              # Giriş noktası
├── package.json
├── src/
│   ├── main.js             # Phaser yapılandırması ve sahne kaydı
│   ├── config.js           # Oyun sabitleri, fiyatlar, tema renkleri
│   ├── i18n.js             # Türkçe / İngilizce metinler
│   ├── storage.js          # localStorage kayıt yönetimi
│   ├── SceneTransition.js  # Sahne geçiş animasyonları
│   ├── gameobjects/
│   │   ├── Ball.js         # Lazer topu
│   │   ├── BallPool.js     # Top nesne havuzu (performans)
│   │   ├── Barrier.js      # Orta bariyer (4 skin)
│   │   ├── BackgroundGrid.js
│   │   └── HeartPickup.js  # Düşen kalp + havuz
│   └── scenes/
│       ├── BootScene.js    # Varlık yükleme, kayıt okuma
│       ├── MenuScene.js    # Ana menü
│       ├── GameScene.js    # Ana oyun döngüsü
│       ├── GameOverScene.js
│       └── ShopScene.js    # Dükkan
└── dist/                   # Üretim derlemesi (npm run build)
```

### Kurulum ve Çalıştırma

**Gereksinimler:** Node.js 18+

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusu (http://localhost:1234)
npm start

# Üretim derlemesi
npm run build
```

Derleme çıktısı `dist/` klasörüne yazılır; statik bir sunucuya veya GitHub Pages'e deploy edilebilir.


### Lisans

MIT License — ayrıntılar için [LICENSE](LICENSE) dosyasına bakın.

---

## 🇬🇧 English

### About

**Laser Deflector** is a fast-paced reflex and rhythm game where you control a horizontal barrier at the center of the screen. Catch colored laser balls coming from above **or** below by matching the barrier color — score points on success, lose health on mismatch. As your score grows, the game speeds up. Build combo chains and trigger **Fever Mode** for a temporary power surge.

The game runs entirely in the browser; progress is saved locally via `localStorage`. Turkish and English language support is included.

### Gameplay

#### Core Mechanics

| Element | Description |
|---------|-------------|
| **Barrier** | A horizontal line at the center of the screen. Tap or click to toggle between **red ↔ blue**. |
| **Laser balls** | Spawn randomly from the **top or bottom**; each ball is red or blue. |
| **Correct match** | Red ball → red barrier, blue ball → blue barrier. Success = +1 score. |
| **Wrong match** | Color mismatch = -1 health. Combo resets, ball speed returns to base. |
| **Health** | Default 3 HP (up to 6 with upgrades). Game over at 0 HP. |

#### Combo & Fever Mode

- Every successful catch increases the combo counter.
- At **15 combo**, **Fever Mode** activates for 5 seconds:
  - All balls count as correct automatically (no color check).
  - Score earns a **2×** multiplier.
  - Ball speed increases by 25%; spawn interval shortens.
  - Barrier turns gold; screen shakes with spark particle effects.
- When Fever ends, combo resets and active balls are cleared.

#### Difficulty Curve

- Every **10 successful catches** advances a level; ball spawn interval decreases.
- Each successful catch permanently increases ball speed (resets on damage).
- Minimum spawn delay: 450 ms.

#### Falling Hearts (Health Pickups)

- Hearts drop periodically when health is below maximum.
- Match the barrier color to the heart color → +1 HP.
- Wrong-color catch applies a penalty (default -1; upgrades can increase to -2 or -3).

#### Gem Economy

Gems earned after each run:

```
Gems = 3 (flat bonus) + floor(Score × multiplier)
```

Gems are spent in the shop. High score is tracked persistently.

### Shop

Four tabs:

| Tab | Contents |
|-----|----------|
| **Barrier** | Visual skins: Classic, Dashed, Twin Flow, Wave |
| **Trail** | Ball trail effects: None, Spark, Ghost |
| **Theme** | Color palettes: Cyberpunk, Toxic Wasteland, Retro Synthwave |
| **Upgrades** | Permanent in-game power-ups |

#### Upgrades

**Easier:**
- **Health Capacity** — Max HP from 3 up to 6 (3 levels).
- **Gem Bonus** — Increases end-of-run gem multiplier (4 levels).

**Harder** *(proceed with caution!)*:
- **Heart Drop Interval** — Hearts drop less frequently.
- **Color-Shifting Hearts** — Hearts change color while falling.
- **Wrong Color Penalty** — Wrong heart catch costs more HP.

### Controls

| Platform | Action |
|----------|--------|
| **Mobile** | Tap screen → toggle barrier color |
| **Desktop** | Mouse click → toggle barrier color |
| **Language** | 🌐 button at bottom-right of main menu (TR ↔ EN) |

### Tech Stack

- **[Phaser 3](https://phaser.io/)** — 2D game engine (Arcade Physics)
- **[Parcel](https://parceljs.org/)** — Zero-config bundler
- **Vanilla JavaScript (ES Modules)** — No framework dependency
- **localStorage** — Save data and language preference

### Project Structure

```
laser-deflector/
├── index.html              # Entry point
├── package.json
├── src/
│   ├── main.js             # Phaser config & scene registration
│   ├── config.js           # Game constants, prices, theme colors
│   ├── i18n.js             # Turkish / English strings
│   ├── storage.js          # localStorage save management
│   ├── SceneTransition.js  # Scene transition animations
│   ├── gameobjects/
│   │   ├── Ball.js         # Laser ball
│   │   ├── BallPool.js     # Ball object pool (performance)
│   │   ├── Barrier.js      # Center barrier (4 skins)
│   │   ├── BackgroundGrid.js
│   │   └── HeartPickup.js  # Falling heart + pool
│   └── scenes/
│       ├── BootScene.js    # Asset loading, save read
│       ├── MenuScene.js    # Main menu
│       ├── GameScene.js    # Core game loop
│       ├── GameOverScene.js
│       └── ShopScene.js    # Shop
└── dist/                   # Production build (npm run build)
```

### Setup & Running

**Requirements:** Node.js 18+

```bash
# Install dependencies
npm install

# Development server (http://localhost:1234)
npm start

# Production build
npm run build
```

Build output goes to `dist/` and can be deployed to any static host or GitHub Pages.

### License

MIT License — see [LICENSE](LICENSE) for details.

---

## Contributing / Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce bir issue açın.

Pull requests are welcome. For major changes, please open an issue first.
