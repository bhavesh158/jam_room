# JamRoom Mobile (React Native)

Android mobile client for JamRoom - Local Real-Time Voting Platform.

## Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio (for Android SDK)
- Java Development Kit (JDK) 17
- Android emulator or device

## Setup

```bash
# Install dependencies (already done)
npm install --legacy-peer-deps
```

## Running the App

### Android

**Option 1: Start Metro and run in one command**
```bash
npx react-native run-android
```

**Option 2: Run separately**
```bash
# Terminal 1: Start Metro bundler
npm start

# Terminal 2: Run on Android (make sure emulator/device is running)
npx react-native run-android
```

### Troubleshooting

**No Android device found:**
1. Start an Android emulator from Android Studio
2. Or connect a physical device with USB debugging enabled
3. Verify with: `adb devices`

**Build errors:**
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

## Usage

1. **Connect Screen**
   - Enter the server IP address (e.g., `192.168.1.50:3001`)
   - Tap "Connect"

2. **Poll Screen**
   - View active poll question
   - Select an option
   - Submit your vote
   - View live results

3. **Results Screen**
   - See vote counts and percentages
   - Real-time updates as others vote

## Features

- ✅ Connect to local JamRoom server
- ✅ Real-time vote updates via WebSocket
- ✅ Clean, intuitive UI matching web design
- ✅ Vote submission with confirmation
- ✅ Live results with bar visualization
- ✅ Connection status indicator

## Project Structure

```
mobile/
├── App.js                 # Main app component with SocketProvider
├── index.js               # Entry point
├── package.json
├── app.json
├── babel.config.js
├── metro.config.js
├── android/               # Android native project
├── ios/                   # iOS native project (optional)
└── src/
    ├── context/
    │   └── SocketContext.js    # Socket.IO context provider
    └── screens/
        ├── ConnectScreen.js    # Server connection screen
        ├── PollScreen.js       # Poll viewing and voting
        └── ResultsScreen.js    # Live results display
```

## Building APK

```bash
cd android
./gradlew assembleRelease
```

APK will be in: `android/app/build/outputs/apk/release/app-release.apk`

## Dependencies

- `react` - Core React library
- `react-native` - React Native framework
- `socket.io-client` - WebSocket client
- `@react-navigation/native` - Navigation
- `@react-navigation/stack` - Stack navigation
- `react-native-screens` - Native screens
- `react-native-safe-area-context` - Safe area handling
- `react-native-gesture-handler` - Gesture handling

---

**Part of JamRoom - Local Real-Time Voting Platform**
