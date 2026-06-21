# ANLATI Mobil Uygulama

> Premium sosyal hikâye platformu — Flutter Android uygulaması

---

## Proje Yapısı

```
anlati.app/
├── lib/
│   ├── main.dart                    # Giriş noktası
│   ├── app.dart                     # MaterialApp + Router
│   ├── core/
│   │   ├── theme/                   # Renkler, yazı tipleri, tema
│   │   ├── constants/               # Sabitler, route isimleri
│   │   ├── router/                  # GoRouter yapılandırması
│   │   └── services/                # Supabase servisi
│   ├── shared/
│   │   ├── models/                  # StoryModel, ProfileModel, CommentModel
│   │   └── widgets/                 # Paylaşılan bileşenler
│   └── features/
│       ├── auth/                    # Splash, Onboarding, Giriş, Kayıt
│       ├── home/                    # Ana feed
│       ├── stories/                 # Hikâye detay
│       ├── write/                   # Hikâye yaz
│       ├── explore/                 # Keşfet & Arama
│       ├── profile/                 # Profil & Düzenleme
│       ├── notifications/           # Bildirimler
│       └── settings/                # Ayarlar
├── android/                         # Android native yapılandırma
├── assets/                          # Görseller, ikonlar
├── pubspec.yaml                     # Bağımlılıklar
├── .env                             # Ortam değişkenleri (git'te yok)
└── .env.example                     # Örnek ortam dosyası
```

---

## Kurulum

### 1. Flutter SDK

Flutter 3.22+ ve Dart 3.3+ gereklidir.

```bash
flutter --version
```

### 2. Bağımlılıkları yükle

```bash
cd anlati.app
flutter pub get
```

### 3. Ortam değişkenlerini ayarla

`.env.example` dosyasını kopyala ve `.env` adıyla kaydet:

```bash
cp .env.example .env
```

`.env` dosyasını düzenle:

```
SUPABASE_URL=https://gwhxvuuqycnepuwnalbc.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> **Not:** Aynı Supabase projesi web uygulamasıyla paylaşılır.

---

## Çalıştırma

### Geliştirme modu

```bash
flutter run
```

### Belirli cihazda çalıştır

```bash
# Bağlı cihazları listele
flutter devices

# Belirli cihazda çalıştır
flutter run -d <device_id>
```

---

## Build

### Debug APK

```bash
flutter build apk --debug
```

### Release APK

```bash
flutter build apk --release
```

APK dosyası: `build/app/outputs/flutter-apk/app-release.apk`

### App Bundle (Google Play)

```bash
flutter build appbundle --release
```

Bundle dosyası: `build/app/outputs/bundle/release/app-release.aab`

---

## Supabase Bağlantısı

Bu uygulama web projesiyle **aynı Supabase projesini** kullanır.

### Kullanılan tablolar

| Tablo       | Açıklama                     |
|-------------|------------------------------|
| `profiles`  | Kullanıcı profilleri         |
| `stories`   | Hikâyeler                    |
| `comments`  | Yorumlar                     |
| `likes`     | Beğeniler                    |
| `bookmarks` | Kaydedilen hikâyeler         |

### RLS Politikaları

- Yalnızca kendi hikâyelerini düzenleyebilirsin.
- Anonim gönderiler kullanıcı kimliğini gizler.
- Servis role anahtarı hiçbir zaman uygulamaya eklenmez.

---

## Google Play için Hazırlık

### İmzalama (Release)

```bash
# Anahtar deposu oluştur
keytool -genkey -v -keystore android/app/anlati-release.jks \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -alias anlati

# android/key.properties oluştur (git'te YOK)
storePassword=sifren
keyPassword=sifren
keyAlias=anlati
storeFile=anlati-release.jks
```

`android/app/build.gradle` dosyasında signingConfigs bloğunu güncelle.

### Gerekli izinler (AndroidManifest.xml)

- `INTERNET` — Supabase API
- `READ_MEDIA_IMAGES` — Galeri erişimi
- `CAMERA` — Kamera erişimi

---

## Teknik Detaylar

| Özellik             | Teknoloji                        |
|---------------------|----------------------------------|
| Framework           | Flutter 3.22+                    |
| Dil                 | Dart 3.3+                        |
| State Management    | Flutter Riverpod                 |
| Navigation          | GoRouter                         |
| Backend             | Supabase Flutter                 |
| Secure Storage      | flutter_secure_storage           |
| HTTP Cache          | cached_network_image             |
| Fonts               | Google Fonts (Inter, Manrope)    |
| Loading             | shimmer                          |
| Platform            | Android (iOS hazır)              |

---

## Paket Adı

```
com.mkdigitalsystems.anlati
```

---

## Lisans

Tüm hakları saklıdır — MK Digital Systems
