# CampusConnect Mobile

React Native + Expo client for CampusConnect.

## Run on a phone for free

1. Install Node.js LTS and Expo Go on your Android/iOS phone.
2. From this directory run `npm install`.
3. Set the API URL before starting. On a physical phone, `localhost` means the phone itself, so use your computer's LAN IP, for example:

```bash
# Windows PowerShell
$env:EXPO_PUBLIC_API_URL="http://192.168.1.20:5000/api"
npx expo start
```

On macOS/Linux:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.20:5000/api npx expo start
```

4. Scan the QR code with Expo Go. Your phone and computer must be on the same Wi-Fi network.

For an Android emulator use `http://10.0.2.2:5000/api` instead.

## Backend first

The Express API must be running and connected to Supabase PostgreSQL before the mobile app can load events or authenticate.
