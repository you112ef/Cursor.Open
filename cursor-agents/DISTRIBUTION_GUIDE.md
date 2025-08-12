# 📦 Distribution Guide for Cursor Agents

## نظرة عامة

تم إعداد Cursor Agents للتوزيع الاحترافي على جميع المنصات الرئيسية مع مثبتات كاملة وأيقونات مخصصة.

## 🛠️ متطلبات البناء

### متطلبات عامة
- **Node.js 18+** (مطلوب)
- **npm** أو **yarn** (مطلوب)
- **Git** (مطلوب)

### متطلبات كل منصة
- **Windows**: Windows 7+ (للبناء على Windows)
- **macOS**: macOS 10.13+ (للبناء على macOS)
- **Linux**: Ubuntu 18.04+، CentOS 7+، أو توزيعة مكافئة

## 🚀 طرق البناء

### 1. السكريبت التلقائي (الأسهل)

**Linux/macOS:**
```bash
./scripts/build-release.sh --all    # جميع المنصات
./scripts/build-release.sh --linux  # Linux فقط
./scripts/build-release.sh --mac    # macOS فقط
./scripts/build-release.sh --win    # Windows فقط
```

**Windows:**
```cmd
scripts\build-release.bat
scripts\build-release.bat --all
```

### 2. الأوامر المباشرة

```bash
# تثبيت التبعيات
npm install

# فحص الأنواع
npm run type-check

# البناء
npm run build

# التوزيع
npm run dist           # جميع المنصات
npm run dist:win       # Windows
npm run dist:mac       # macOS  
npm run dist:linux     # Linux
```

## 📁 الملفات المُولدة

بعد البناء، ستجد الملفات في مجلد `release/`:

### Windows
- `Cursor-Agents-1.0.0-win-x64.exe` - NSIS Installer
- `Cursor-Agents-1.0.0-win-ia32.exe` - NSIS Installer (32-bit)
- `Cursor-Agents-1.0.0-portable.exe` - Portable version
- `Cursor-Agents-1.0.0-win-x64.zip` - Archive version

### macOS
- `Cursor-Agents-1.0.0.dmg` - DMG installer
- `Cursor-Agents-1.0.0-mac-x64.zip` - Intel version
- `Cursor-Agents-1.0.0-mac-arm64.zip` - Apple Silicon version

### Linux
- `Cursor-Agents-1.0.0.AppImage` - AppImage (يعمل على جميع التوزيعات)
- `cursor-agents_1.0.0_amd64.deb` - Debian/Ubuntu package
- `Cursor-Agents-1.0.0.x86_64.rpm` - Red Hat/CentOS package
- `Cursor-Agents-1.0.0-linux-x64.tar.gz` - Archive version

## ⚙️ تخصيص البناء

### تحديد الإصدار
في `package.json`:
```json
{
  "version": "1.0.0"
}
```

### تخصيص الأيقونة
استبدل الملفات في `build/icons/`:
- `icon.png` - الأيقونة الرئيسية (512x512)
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon

### تخصيص معلومات التطبيق
في قسم `build` من `package.json`:
```json
{
  "build": {
    "appId": "com.cursoragents.app",
    "productName": "Cursor Agents",
    "copyright": "Copyright © 2025 Your Name"
  }
}
```

## 🔐 التوقيع الرقمي

### Windows Code Signing
```json
{
  "win": {
    "certificateFile": "path/to/cert.p12",
    "certificatePassword": "password",
    "signingHashAlgorithms": ["sha256"],
    "timestampServer": "http://timestamp.comodoca.com"
  }
}
```

### macOS Code Signing
```json
{
  "mac": {
    "identity": "Developer ID Application: Your Name",
    "hardenedRuntime": true,
    "gatekeeperAssess": false,
    "notarize": true
  }
}
```

## 📤 النشر التلقائي

### GitHub Releases
```bash
# إعداد GitHub token
export GH_TOKEN=your_github_token

# النشر
npm run dist -- --publish=always
```

### خيارات النشر الأخرى
- **S3**: Amazon S3 bucket
- **BinTray**: JFrog BinTray  
- **Generic**: أي خادم HTTP

## 🐛 حل مشاكل البناء

### مشكلة "Python not found"
```bash
npm config set python python3
# أو تثبيت build tools:
npm install --global windows-build-tools  # Windows
```

### مشكلة Node-gyp
```bash
npm install --global node-gyp
npm rebuild
```

### مشكلة صلاحيات macOS
```bash
sudo chown -R $(whoami) ~/.npm
```

### مشكلة "No such file or directory" - Linux
```bash
sudo apt-get install build-essential
sudo apt-get install rpm  # لبناء RPM packages
```

## 🎯 نصائح للإنتاج

1. **اختبار على جميع المنصات** قبل الإصدار
2. **فحص الحجم**: استخدم webpack-bundle-analyzer
3. **الأمان**: تفعيل code signing والـ notarization
4. **التحديثات**: تفعيل auto-updater
5. **التحليلات**: إضافة crash reporting

## 📊 أحجام الملفات التقريبية

- **Windows Installer**: ~100MB
- **macOS DMG**: ~100MB
- **Linux AppImage**: ~120MB
- **Portable versions**: ~150MB (غير مضغوطة)

## 🔄 التحديثات التلقائية

مُعد مسبقاً مع electron-updater:
```javascript
// في main process
import { autoUpdater } from 'electron-updater'

autoUpdater.checkForUpdatesAndNotify()
```

---

## ✅ جاهز للاستخدام!

جميع الإعدادات مُحددة بشكل احترافي. فقط شغّل السكريبت وستحصل على مثبتات جاهزة للتوزيع على جميع المنصات! 🎉