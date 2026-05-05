# Hesap Makinesi

Toplama ve çıkarma yapan basit React Native / Expo hesap makinesi uygulaması.

## Özellikler

- Toplama (+) ve çıkarma (−) işlemleri
- Ondalıklı sayı desteği
- İşaret değiştirme (±)
- Rakam silme (⌫)
- Karanlık tema

## Kurulum (Geliştirme)

```bash
npm install
npx expo start
```

## APK Oluşturma (EAS Build)

### 1. EAS CLI kur
```bash
npm install -g eas-cli
```

### 2. Expo hesabına giriş yap
```bash
eas login
```

### 3. Projeyi yapılandır
```bash
eas build:configure
```

### 4. APK derle (ücretsiz)
```bash
eas build --platform android --profile preview
```

Derleme tamamlandığında Expo panelinden APK'yı indirebilirsiniz.

## Expo Go ile Test

```bash
npx expo start
```
QR kodu Expo Go uygulamasıyla tara (Android/iOS).
