# Cursor Open - Advanced AI Code Editor

<div align="center">
  <h3>🚀 نظام محرر الكود المتقدم مع الذكاء الاصطناعي</h3>
  <p>محرر كود متطور مع أدوات Cursor الشاملة ودعم متعدد المزودات للذكاء الاصطناعي</p>
  
  [![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge)](https://cursor-complete-tools-e512be8e.scout.site)
  [![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-blue?style=for-the-badge)](https://reactjs.org/)
</div>

## ✨ المميزات الرئيسية

### 🤖 نظام الذكاء الاصطناعي المتعدد
- **12+ مزود AI**: OpenAI, Anthropic, Google, Mistral, Cohere, Perplexity, xAI, Groq, DeepSeek, Together AI, Hugging Face, Fireworks, Ollama
- **إدارة API Keys آمنة**: تخزين محلي مشفر مع التحقق التلقائي
- **دعم Streaming**: محادثات فورية مع جميع المزودات
- **تكلفة وحدود واضحة**: عرض التكاليف والحدود لكل مزود

### 🛠️ أدوات Cursor الشاملة (15 أداة)

#### 🔍 أدوات البحث
- **Read File** (`@read`): قراءة محتويات الملفات
- **List Directory** (`@list`): عرض الملفات والمجلدات
- **Codebase Search** (`@codebase`): البحث في كامل المشروع
- **Grep** (`@grep`): بحث متقدم بالتعابير النمطية
- **Search Files** (`@search`): البحث عن الملفات بالاسم
- **Web Search** (`@web`): البحث في الإنترنت
- **Fetch Rules** (`@rules`): جلب قواعد البرمجة

#### ✏️ أدوات التحرير
- **Edit & Reapply** (`@edit`): تحرير وإعادة تطبيق التغييرات
- **Delete File** (`@delete`): حذف آمن مع نسخ احتياطية

#### ▶️ أدوات التشغيل
- **Terminal** (`@terminal`): تنفيذ أوامر النظام

#### 🔗 أدوات MCP
- **MCP Servers** (`@mcp`): إدارة خوادم Model Context Protocol

#### ⚙️ أدوات متقدمة
- **Auto-Apply** (`@apply`): تطبيق التعديلات تلقائياً
- **Auto-Run** (`@run`): تشغيل الكود والاختبارات
- **Guardrails** (`@guard`): حماية وأمان متقدم
- **Auto-Fix** (`@fix`): إصلاح الأخطاء تلقائياً

### 💻 واجهة المستخدم المتقدمة
- **تصميم متجاوب**: يعمل على جميع الأجهزة
- **وضع مظلم/فاتح**: تبديل سلس بين الأوضاع
- **لوحات قابلة للتخصيص**: Sidebar, Terminal, Chat, Tools
- **محرر كود متقدم**: مع syntax highlighting وتكامل TypeScript
- **إحصائيات فورية**: مراقبة الأداء والاستخدام

## 🚀 الاستخدام السريع

### تشغيل أدوات فردية
```
@read package.json
@list src/components
@terminal npm install
@fix all
```

### تشغيل أدوات متعددة (Batch)
```
@read package.json @list . @terminal npm --version @fix all
```

### استخدام الذكاء الاصطناعي
1. اختر المزود من القائمة العلوية
2. أدخل API Key الخاص بك
3. ابدأ المحادثة في لوحة Chat

## 🏗️ التقنيات المستخدمة

### Frontend Stack
- **React 19**: أحدث إصدار مع مميزات متقدمة
- **TypeScript**: لكتابة كود آمن ومنظم
- **Vite 6**: بيئة تطوير سريعة وحديثة
- **Tailwind CSS V4**: تصميم عصري ومتجاوب
- **ShadCN UI**: مكونات واجهة مستخدم متقدمة
- **Lucide Icons**: أيقونات حديثة وواضحة

### AI Integration
- **Provider Manager**: نظام إدارة مزودات مركزي
- **Streaming Support**: دعم الإجابات الفورية
- **Error Handling**: معالجة شاملة للأخطاء
- **Rate Limiting**: حماية من تجاوز الحدود

### Tools System
- **Tool Registry**: نظام تسجيل الأدوات المرن
- **Batch Execution**: تنفيذ أدوات متعددة
- **Result Caching**: تخزين مؤقت للنتائج
- **Progress Tracking**: تتبع تقدم العمليات

## 📁 هيكل المشروع

```
src/
├── components/           # React components
│   ├── ui/              # ShadCN UI components
│   ├── Layout.tsx       # Main layout
│   ├── Chat.tsx         # AI chat interface
│   ├── Editor.tsx       # Code editor
│   ├── Terminal.tsx     # Terminal emulator
│   ├── CursorToolsPanel.tsx  # Tools management
│   └── ...
├── contexts/            # React contexts
│   ├── AppContext.tsx   # App state management
│   ├── ProviderContext.tsx  # AI providers
│   └── ThemeContext.tsx # Theme management
├── services/            # Business logic
│   ├── ai/             # AI integration
│   │   ├── providers.ts # AI providers
│   │   ├── provider-manager.ts  # Provider management
│   │   └── aiService.ts # AI service layer
│   └── tools/          # Cursor tools
│       ├── cursorToolRegistry.ts  # Complete tools
│       └── toolRegistry.ts       # Legacy tools
└── ...
```

## 🔧 التطوير والنشر

### متطلبات النظام
- **Node.js**: 20.12.1 أو أحدث
- **Bun**: 1.2.19 أو أحدث (مُفضل)
- **npm/yarn**: كبديل لـ Bun

### التثبيت المحلي
```bash
# استنساخ المشروع
git clone <repository-url>
cd cursor-complete-tools

# تثبيت التبعيات
bun install
# أو
npm install

# تشغيل التطوير
bun run dev
# أو
npm run dev

# البناء للإنتاج
bun run build
# أو
npm run build
```

### متغيرات البيئة
```env
# إضافة API Keys في متغيرات البيئة (اختياري)
VITE_OPENAI_API_KEY=your_openai_key
VITE_ANTHROPIC_API_KEY=your_anthropic_key
VITE_GOOGLE_API_KEY=your_google_key
# ... المزيد حسب الحاجة
```

## 📚 الدليل والتوثيق

### ملفات التوثيق المتوفرة
- [`AI_INTEGRATION_GUIDE.md`](./AI_INTEGRATION_GUIDE.md): دليل تكامل الذكاء الاصطناعي
- [`CURSOR_TOOLS_GUIDE.md`](./CURSOR_TOOLS_GUIDE.md): دليل أدوات Cursor الشامل

### أمثلة للاستخدام

#### البحث في المشروع
```
@codebase "useState hook"
@grep "interface.*Props"
@search .tsx
```

#### إدارة الملفات
```
@read src/App.tsx
@list src/components
@edit src/utils.ts
```

#### تشغيل المهام
```
@terminal npm test
@run enable tests
@fix syntax errors
```

#### استخدام الذكاء الاصطناعي
```
Explain this code: @read src/complex-function.ts
Help me optimize: @codebase "performance issues"
```

## 🛡️ الأمان والحماية

### حماية البيانات
- **تشفير محلي**: جميع API Keys مشفرة محلياً
- **عدم تخزين خارجي**: لا تُرسل البيانات لخوادم خارجية
- **نسخ احتياطية**: إنشاء تلقائي للنسخ الاحتياطية

### Guardrails
- **مستويات حماية**: منخفض، متوسط، عالي
- **فحص الملفات**: منع الوصول للملفات الحساسة
- **حدود الاستخدام**: مراقبة وتقييد الاستخدام المفرط

## 🎯 خريطة الطريق

### الإصدارات القادمة
- [ ] تكامل Git متقدم
- [ ] دعم CI/CD pipelines
- [ ] إضافة مزيد من مزودات AI
- [ ] نظام plugins قابل للتوسيع
- [ ] تحسينات الأداء
- [ ] دعم العمل التعاوني

### التحسينات المخططة
- [ ] واجهة مرئية لـ Git operations
- [ ] محرر WYSIWYG للماركداون
- [ ] نظام themes قابل للتخصيص
- [ ] دعم multiple workspaces
- [ ] إحصائيات استخدام متقدمة

## 🤝 المساهمة

نرحب بجميع المساهمات! يرجى:

1. **Fork** المشروع
2. إنشاء **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** التغييرات (`git commit -m 'Add amazing feature'`)
4. **Push** للبranch (`git push origin feature/amazing-feature`)
5. فتح **Pull Request**

## 📄 الترخيص

هذا المشروع مُرخص تحت [MIT License](LICENSE).

## 🙏 شكر وتقدير

- **Cursor.com**: للإلهام والأدوات الرائعة
- **OpenAI, Anthropic, Google**: لمزودات الذكاء الاصطناعي
- **Vercel**: لمنصة ShadCN UI
- **Scout**: لمنصة التطوير والنشر

---

<div align="center">
  <p>بُني بـ ❤️ باستخدام Scout</p>
  <p>
    <a href="https://cursor-complete-tools-e512be8e.scout.site">🌐 عرض حي</a> •
    <a href="#-المميزات-الرئيسية">✨ المميزات</a> •
    <a href="#-الاستخدام-السريع">🚀 البدء السريع</a> •
    <a href="#-التوثيق">📚 التوثيق</a>
  </p>
</div>