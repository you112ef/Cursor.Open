# Android Client

- Requires Android Studio (Giraffe+)
- Build debug APK:
  ```bash
  cd android
  ./gradlew assembleDebug
  ```
- The CI builds a debug APK artifact on every push (`.github/workflows/android.yml`).
- Default base URL points to emulator loopback: `http://10.0.2.2:8000`. Change it in the UI as needed.