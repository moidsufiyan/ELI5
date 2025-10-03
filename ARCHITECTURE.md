# 🏗️ ELI5 AI Simplifier - Architecture Documentation

## 📋 **Overview**

This is a **full-stack web application** for simplifying complex text using Google Gemini AI, with Wikipedia context integration.

---

## 🎯 **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
│                    (http://localhost:3000)                  │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               Next.js Frontend (React)                      │
│  ┌───────────────────────────────────────────────────┐    │
│  │  SimplificationForm Component                     │    │
│  │  - Form validation (Zod)                          │    │
│  │  - UI state management (React hooks)              │    │
│  │  - Calls FastAPI backend                          │    │
│  └───────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ POST /api/simplify
                            │ { text, level, use_wiki, topic }
                            ▼
┌─────────────────────────────────────────────────────────────┐
│            Python FastAPI Backend                           │
│                (http://localhost:8000)                      │
│  ┌───────────────────────────────────────────────────┐    │
│  │  /api/simplify Endpoint                           │    │
│  │  1. Validate request (Pydantic)                   │    │
│  │  2. Fetch Wikipedia summary (optional)            │    │
│  │  3. Build AI prompt with context                  │    │
│  │  4. Call Google Gemini AI                         │    │
│  │  5. Clean and format response                     │    │
│  │  6. Return JSON result                            │    │
│  └───────────────────────────────────────────────────┘    │
└─────────┬─────────────────────────────────┬─────────────────┘
          │                                 │
          │ Wikipedia API                   │ Google Gemini API
          ▼                                 ▼
┌──────────────────────┐         ┌──────────────────────────┐
│  Wikipedia REST API  │         │  Google GenAI Service    │
│  (en.wikipedia.org)  │         │  (generativelanguage...) │
└──────────────────────┘         └──────────────────────────┘
```

---

## 🔧 **Technology Stack**

### **Backend (Python)**
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | FastAPI 0.115.5 | Modern async web framework |
| AI Client | google-genai 0.2.2 | Google Gemini AI integration |
| HTTP Client | httpx 0.28.1 | Async Wikipedia API calls |
| Validation | Pydantic 2.10.3 | Request/response validation |
| Server | uvicorn 0.32.1 | ASGI server |
| Config | python-dotenv 1.0.1 | Environment variables |

### **Frontend (JavaScript/TypeScript)**
| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | Next.js 14 | React framework |
| Language | TypeScript 5.6 | Type safety |
| Styling | Tailwind CSS 3.4 | Utility-first CSS |
| Forms | React Hook Form 7.53 | Form state management |
| Validation | Zod 3.23 | Schema validation |
| Icons | Lucide React 0.453 | Icon library |

---

## 📁 **Project Structure**

```
ELI5/
├── backend/                      # Python FastAPI Backend
│   ├── main.py                   # FastAPI application
│   ├── requirements.txt          # Python dependencies
│   ├── .env                      # Environment variables
│   └── venv/                     # Python virtual environment
│
├── src/                          # Next.js Frontend Source
│   ├── components/
│   │   └── SimplificationForm.tsx  # Main form component
│   ├── pages/
│   │   ├── index.tsx             # Home page
│   │   └── _app.tsx              # App wrapper
│   ├── lib/
│   │   └── utils.ts              # Utility functions
│   └── styles/
│       └── globals.css           # Global styles
│
├── public/                       # Static assets
├── node_modules/                 # Node.js dependencies
├── .next/                        # Next.js build output
│
├── start-dev.ps1                 # Development startup script
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind configuration
├── next.config.js                # Next.js configuration
│
├── README.md                     # Main documentation
├── QUICKSTART.md                 # Quick start guide
└── ARCHITECTURE.md               # This file
```

---

## 🔄 **Request Flow**

### **Complete Request Lifecycle**

1. **User Input**
   - User enters text in form
   - Selects complexity level (ELI5/ELI15/Normal)
   - Clicks "Simplify with AI"

2. **Frontend Validation**
   - Zod schema validates input
   - Checks minimum 10 characters
   - Checks maximum 5000 characters

3. **API Request**
   ```typescript
   POST http://localhost:8000/api/simplify
   Content-Type: application/json
   {
     "text": "Explain quantum mechanics",
     "level": "ELI5",
     "use_wiki": true,
     "topic": "quantum mechanics"
   }
   ```

4. **Backend Processing**
   ```python
   # Validate with Pydantic
   request = TextRequest(...)
   
   # Fetch Wikipedia (if enabled)
   wiki_info = await get_wikipedia_summary(topic)
   
   # Build AI prompt with context
   prompt = generate_prompt(text, level, wiki_info)
   
   # Call Gemini AI
   response = client.models.generate_content(
       model="gemini-2.5-flash",
       contents=prompt
   )
   
   # Clean and return
   cleaned = clean_text(response.text)
   return {"simplified_text": cleaned, ...}
   ```

5. **Response Handling**
   - Frontend receives JSON response
   - Calculates word count and reading time
   - Displays result with formatting
   - Enables copy and text-to-speech

---

## 🔐 **Security & Configuration**

### **Environment Variables**
- Stored in `backend/.env`
- Never committed to git (.gitignore)
- Required: `GEMINI_API_KEY`

### **CORS Configuration**
- Backend allows all origins (`"*"`)
- Configured in FastAPI middleware
- Suitable for development
- **Restrict in production!**

### **API Rate Limits**
- Depends on your Gemini API tier
- Free tier: typically 60 requests/minute
- Handle with proper error messages

---

## 🚀 **Development Workflow**

### **Starting Development**
```powershell
.\start-dev.ps1
```
This automatically:
1. Checks Python/Node.js installation
2. Creates Python venv if needed
3. Installs dependencies
4. Starts backend (port 8000)
5. Starts frontend (port 3000)

### **Manual Development**
**Terminal 1 (Backend):**
```bash
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 📊 **API Endpoints**

### **POST /api/simplify**
Main simplification endpoint

**Request Schema:**
```typescript
{
  text: string      // Required, 1-5000 chars
  level: string     // "ELI5" | "ELI15" | "normal"
  use_wiki: boolean // Enable Wikipedia context
  topic: string     // Wikipedia search term
}
```

**Response Schema:**
```typescript
{
  simplified_text: string    // AI-generated explanation
  used_wiki: boolean        // Whether Wikipedia was used
  wiki_title: string | null // Wikipedia article title
}
```

### **GET /api/wiki/{topic}**
Test Wikipedia integration

### **GET /api/health**
Health check endpoint

### **GET /docs**
Auto-generated FastAPI documentation

---

## 🎨 **Frontend Components**

### **SimplificationForm Component**
Main interactive form component with:
- Text input with character counter
- Complexity level selector (3 options)
- Submit button with loading state
- Result display area
- Copy-to-clipboard button
- Text-to-speech button
- Word count and reading time

### **Utility Functions**
- `cn()` - Classname merging (clsx + tailwind-merge)
- `complexityLevels` - Complexity configuration
- Speech synthesis integration
- Clipboard API integration

---

## 🔮 **Future Enhancements**

Potential improvements:
- [ ] User authentication
- [ ] Save/load history
- [ ] Multiple AI models support
- [ ] Custom complexity levels
- [ ] Export to PDF/Markdown
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Mobile app (React Native)

---

## 📞 **API Integration Details**

### **Google Gemini AI**
- Model: `gemini-2.5-flash`
- Endpoint: Google's GenerativeLanguage API
- Authentication: API key
- Response: Streaming text

### **Wikipedia REST API**
- Endpoint: `https://en.wikipedia.org/api/rest_v1/page/summary/{topic}`
- No authentication required
- Returns: Title, summary, images
- Rate limit: 200 req/sec

---

**Last Updated:** December 2024  
**Version:** 1.0.0
