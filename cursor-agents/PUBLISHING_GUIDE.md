# دليل نشر Cursor Agents على متاجر التطبيقات

## 🏪 متاجر التطبيقات المتاحة

### 1. Microsoft Store (Windows) 🪟

#### المتطلبات:
- **حساب مطور Microsoft** ($19 لمرة واحدة)
- **شهادة توقيع رقمي** (اختيارية لكن مستحسنة)
- **التطبيق مبني كـ MSIX package**

#### خطوات النشر:

##### أ. إعداد MSIX Package
```bash
# تثبيت electron-builder-msix
npm install --save-dev electron-builder-msix

# تحديث package.json
```

أضف إلى `package.json`:
```json
{
  "build": {
    "win": {
      "target": [
        {
          "target": "msix",
          "arch": ["x64", "arm64"]
        }
      ]
    },
    "msix": {
      "displayName": "Cursor Agents",
      "publisher": "CN=yousef shtiwe",
      "publisherDisplayName": "yousef shtiwe",
      "identityName": "yousef-shtiwe.CursorAgents",
      "backgroundColor": "#1e293b",
      "languages": ["en-US", "ar-SA"]
    }
  }
}
```

##### ب. بناء MSIX Package
```bash
npm run build
npm run dist:win
```

##### ج. تحميل على Microsoft Store
1. سجل في [Partner Center](https://partner.microsoft.com/)
2. أنشئ تطبيق جديد
3. املأ بيانات التطبيق:
   - الاسم: "Cursor Agents"
   - الوصف: "AI-powered code editor"
   - الفئة: "Developer tools"
4. ارفع ملف `.msix`
5. اختبر التطبيق
6. أرسل للمراجعة

---

### 2. Mac App Store (macOS) 🍎

#### المتطلبات:
- **Apple Developer Account** ($99/سنة)
- **Mac للتطوير والبناء**
- **Xcode مثبت**
- **App Store Connect access**

#### خطوات النشر:

##### أ. إعداد التوقيع
```bash
# إنشاء شهادات في keychain
# Certificate: "3rd Party Mac Developer Application"
# Certificate: "3rd Party Mac Developer Installer"
```

##### ب. تحديث package.json
```json
{
  "build": {
    "mac": {
      "category": "public.app-category.developer-tools",
      "provisioningProfile": "embedded.provisionprofile",
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "target": [
        {
          "target": "mas",
          "arch": ["x64", "arm64"]
        }
      ]
    },
    "mas": {
      "entitlements": "build/entitlements.mas.plist",
      "entitlementsInherit": "build/entitlements.mas.inherit.plist",
      "hardenedRuntime": false
    }
  }
}
```

##### ج. إنشاء Entitlements Files
`build/entitlements.mas.plist`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.app-sandbox</key>
    <true/>
    <key>com.apple.security.files.user-selected.read-write</key>
    <true/>
    <key>com.apple.security.network.client</key>
    <true/>
</dict>
</plist>
```

##### د. البناء والرفع
```bash
npm run dist:mac
# استخدم Application Loader أو Transporter لرفع .pkg
```

---

### 3. Snap Store (Linux) 🐧

#### المتطلبات:
- **حساب Ubuntu Developer** (مجاني)
- **Snapcraft tools**

#### خطوات النشر:

##### أ. إنشاء snapcraft.yaml
```yaml
name: cursor-agents
version: '1.0.0'
summary: AI-powered code editor
description: |
  A modern, AI-powered code editor inspired by Cursor, built with Electron, React, and TypeScript.

grade: stable
confinement: strict
base: core20

apps:
  cursor-agents:
    command: cursor-agents
    extensions: [gnome-3-38]
    plugs:
      - home
      - network
      - desktop

parts:
  cursor-agents:
    plugin: npm
    source: .
    npm-node-version: "18.17.0"
    build-packages:
      - build-essential
      - libnss3-dev
    stage-packages:
      - libnss3
      - libxss1
      - libgconf-2-4
      - libxrandr2
      - libasound2
      - libpangocairo-1.0-0
      - libatk1.0-0
      - libcairo-gobject2
      - libgtk-3-0
      - libgdk-pixbuf2.0-0
```

##### ب. بناء ونشر Snap
```bash
snapcraft
snapcraft upload cursor-agents_1.0.0_amd64.snap --release=stable
```

---

### 4. GitHub Releases 🐙

#### إعداد Auto-Release مع GitHub Actions

`.github/workflows/release.yml`:
```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ${{ matrix.os }}
    
    strategy:
      matrix:
        os: [macos-latest, ubuntu-latest, windows-latest]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build and release
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      run: |
        npm run build
        npm run dist
        
    - name: Upload artifacts
      uses: actions/upload-artifact@v3
      with:
        name: ${{ matrix.os }}-build
        path: release/
```

---

### 5. Chocolatey (Windows Package Manager) 🍫

#### إنشاء Chocolatey Package

`tools/chocolateyinstall.ps1`:
```powershell
$ErrorActionPreference = 'Stop'
$url64 = 'https://github.com/yousef-shtiwe/cursor-agents/releases/download/v1.0.0/Cursor-Agents-1.0.0-win-x64.exe'

$packageArgs = @{
  packageName   = 'cursor-agents'
  unzipLocation = $toolsDir
  fileType      = 'exe'
  url64bit      = $url64
  checksum64    = 'SHA256_CHECKSUM_HERE'
  checksumType64= 'sha256'
  silentArgs    = '/S'
  validExitCodes= @(0)
}

Install-ChocolateyPackage @packageArgs
```

---

## 📋 قائمة مراجعة النشر

### قبل النشر:
- [ ] **اختبار شامل** على جميع المنصات
- [ ] **إعداد الأيقونات** بجميع الأحجام المطلوبة
- [ ] **كتابة وصف التطبيق** بعدة لغات
- [ ] **تحضير لقطات الشاشة** والفيديوهات
- [ ] **مراجعة سياسة الخصوصية**
- [ ] **إعداد صفحة الدعم الفني**

### أثناء النشر:
- [ ] **رفع الملفات** على كل متجر
- [ ] **ملء البيانات الوصفية**
- [ ] **تحديد السعر** (مجاني/مدفوع)
- [ ] **اختيار الفئات المناسبة**
- [ ] **إرسال للمراجعة**

### بعد النشر:
- [ ] **مراقبة التقييمات** والتعليقات
- [ ] **الرد على الاستفسارات**
- [ ] **إصدار تحديثات دورية**
- [ ] **التسويق والترويج**

---

## 💰 تكاليف النشر

| المتجر | التكلفة السنوية | مدة المراجعة |
|--------|-----------------|---------------|
| Microsoft Store | $19 (لمرة واحدة) | 1-3 أيام |
| Mac App Store | $99 | 1-7 أيام |
| Snap Store | مجاني | فوري |
| GitHub Releases | مجاني | فوري |
| Chocolatey | مجاني | 1-2 أيام |

---

## 🚀 نصائح للنجاح

1. **ابدأ بـ GitHub Releases** للتوزيع المباشر
2. **جهز لقطات شاشة احترافية** للتطبيق
3. **اكتب وصف جذاب** يوضح مميزات التطبيق
4. **استجب بسرعة** لتعليقات المستخدمين
5. **أصدر تحديثات منتظمة** لتحسين التطبيق

**تطبيقك جاهز للوصول لملايين المستخدمين! 🌟**