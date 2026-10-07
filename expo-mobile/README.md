# Instagram Mobile App (Expo & EAS Build)

This directory contains the standalone React Native Expo mobile application, ready to upload and build directly on **expo.dev** or run in Expo Go.

## 🚀 How to Run and Upload to expo.dev

### 1. Install Expo CLI
```bash
npm install -g eas-cli expo-cli
```

### 2. Create the project locally
```bash
npx create-expo-app@latest instagram-mobile --template blank
cd instagram-mobile
```

### 3. Copy files
Copy `App.tsx`, `package.json`, and `app.json` from this folder into your new `instagram-mobile` directory.

### 4. Install dependencies
```bash
npx expo install @expo/vector-icons
```

### 5. Run the app on your phone
```bash
npx expo start
```
Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

### 6. Build the APK / IPA on expo.dev (EAS Build)
```bash
eas login
eas build:configure
eas build --platform android --profile preview
```
Your build will run in the cloud on **https://expo.dev** and provide a direct download link for your installable `.apk` file!
