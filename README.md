# Wapi Mobile Native CLI

A production-oriented React Native CLI Android admin app for:

- real-time inbox chat
- campaigns
- contacts
- invoices, quotations, sales
- WhatsApp account management
- subscription status and in-app purchase flow
- push notifications with background delivery
- in-app notification center and foreground banners

## Included architecture

- React Native CLI project
- FCM push via `@react-native-firebase/messaging`
- local display and Android channels via `@notifee/react-native`
- React Query data layer
- socket.io real-time event bridge
- native subscription purchase service using `react-native-iap`
- backend integration examples for device-token registration and Google Play purchase verification

## Quick start

1. Install dependencies

```bash
npm install
```

2. Android Firebase setup

- create a Firebase Android app with package name `com.wapimobilenative`
- download `google-services.json`
- place it at `android/app/google-services.json`

3. Update runtime defaults in `src/config/runtime.ts`

- `apiBaseUrl`
- `socketBaseUrl`
- `storageBaseUrl`

4. Run Android

```bash
npm run android
```

## Push notification flow

The app expects your backend to:

- save each device FCM token
- send high-priority FCM payloads for chat, campaign, billing, and system events
- include routing metadata in `data.type`, `data.contactId`, `data.whatsappPhoneNumberId`, etc.

Example payload shape is included in:
- `backend-integration/push-payloads.example.json`

## Subscription flow

`SubscriptionScreen` supports:

- showing active subscription from your backend
- reading plans from `/plan/active`
- launching Google Play purchase for plans that include:
  - `android_product_id`
  - optional `android_offer_token`
- verifying completed purchases through:
  - `POST /mobile/subscription/google/verify`

Example backend files are included in:
- `backend-integration/mobile-device.routes.example.js`
- `backend-integration/google-play.routes.example.js`

## Important notes

- This project is Android-first.
- Foreground instant sync is handled by Socket.IO.
- Background and terminated-state alerts rely on FCM high-priority push delivery.
- `Active Desk Mode` shows an ongoing notification during working hours; it is optional and should only be used when an operator explicitly enables it.

## Main screens

- Home
- Inbox
- Chat Thread
- Contacts
- Campaigns
- CRM Hub
- WhatsApp Accounts
- Subscription
- Notifications
- Settings

## Default configuration preloaded

The starter project is preconfigured with these defaults:

- Web app: `https://app.zoomnearby.com/`
- API base URL: `https://api.zoomnearby.com/api`
- Socket base URL: `https://api.zoomnearby.com`
- Storage base URL: `https://api.zoomnearby.com`

You can still change them later from the in-app Settings screen.
# mkt-wapi
