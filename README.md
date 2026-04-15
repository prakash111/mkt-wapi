## Codemagic release build setup

This repository includes `codemagic.yaml` with workflow `android-release` that:

- validates required secure environment variables
- restores the Android signing keystore from base64
- restores `google-services.json` from base64
- installs dependencies using `npm ci` (or `npm install` if lockfile is absent), then runs `lint` and `typecheck`
- builds release AAB using `./gradlew bundleRelease`

Required Codemagic environment variables:

- `CM_KEYSTORE_B64` (base64 of your release keystore file)
- `CM_KEYSTORE_PASSWORD`
- `CM_KEY_ALIAS`
- `CM_KEY_PASSWORD`
- `CM_GOOGLE_SERVICES_JSON_B64` (base64 of `google-services.json`)

The Android release signing config is read from these environment variables in `android/app/build.gradle`.