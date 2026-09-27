# MIA (Multi-page Items Assistant)

> **Autonomous AI Web Companion Agent for Cross-Store Outdoor & Camping Gear Shopping**

MIA is an AI-empowered web shopping companion designed to solve the friction of fragmented e-commerce browsing. When shopping for outdoor and camping equipment, buyers frequently juggle multiple tabs across different retailers—such as **Decathlon Taiwan**, **Chilloutdoor**, and **Campfire Gear**—trying to compare prices, check localized stock, verify technical compatibility (such as twinnable sleeping bag zippers), and calculate total cart costs.

MIA bridges the gap between passive web browsing and active agent assistance by embedding directly alongside the web store as an interactive side panel. Users can highlight items on any webpage, automatically extract structured product specifications, compare real-time pricing across retailers, simulate gear fit in their own yard using multimodal vision, and execute a unified multi-store checkout.

---

## 🌟 The Core Value Proposition

### 1. Eliminating Tab Fatigue & Price Disparities
Rather than manually switching between retailers and copying product specifications into notes, MIA acts as an autonomous shopping agent. Clicking on any item on the simulated storefront instantly extracts:
- Real-time extracted price vs. original MSRP
- Direct retailer comparison showing the lowest available deal and price deltas (e.g., Decathlon -NT$150 savings vs. Campfire +NT$51)
- Stock availability and localized fulfillment (e.g., 2-hour Click & Collect in Taipei Neihu/Guandu stores)

### 2. Deep Technical Gear Compatibility Verification
Outdoor equipment often requires precise compatibility:
- **Twinnable Sleeping Bags**: Verifying whether a sleeping bag (such as the MT500 10°C) supports Left/Right zip twinning to create a double sleeping bag.
- **Mat & Pad Pairing**: Finding folding foam mats (such as the Forclaz MT100) or self-inflating pads that match dimensions and stay within budget (e.g., under NT$1,000).

### 3. Spatial Fit Simulation (Multimodal AI)
Outdoor gear (tents, tarps, sleeping systems) occupies physical space that is hard to visualize on e-commerce pages. MIA provides an integrated AI Spatial Fit Simulator:
- Upload a photo of your backyard, living room, or campsite lawn.
- Gemini 3.8 Flash multimodal vision analyzes surface area, ground conditions, and walking clearance.
- Returns a numerical Fit Score (0–100), clearance verdict, staking advice, and an interactive placement preview.

### 4. Autonomous Unified Multi-Store Checkout
Instead of going through checkout flows on three separate websites, MIA bundles collected items into a single unified cart, displays aggregate savings, and automates merchant order placement in one modal.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **Interactive Multi-Store Browser** | Switch seamlessly between Decathlon Taiwan (`decathlon.tw`), Chilloutdoor (`chilloutdoor.com.tw`), and Campfire Gear (`campfire-gear.tw`) within a browser-like frame. |
| **One-Click Highlight & Scraping** | Click any product card on the store page to highlight it in cyan and trigger an animated DOM extraction progress bar in MIA's companion panel. |
| **Draggable Split-View Divider** | Drag the `\|\|` divider to dynamically adjust the ratio between the web store view and MIA's companion panel (from 35% to 85% width). |
| **Cross-Store Price Matrix** | Each collected card displays live price differences, stock status, and savings compared to competing retailers. |
| **Panel Management & Clear All** | Expand/collapse item details, re-scrape individual items with `RefreshCw`, delete items with `Trash2`, or wipe all collected items with the dedicated `Clear all` header button. |
| **Action Hub ("CALL Agent to Action!")** | A bottom drawer that slides up with high-frequency agent actions: Preset Demands, Spatial Simulation, and Direct AI Chat. |
| **Preset Webpage Demands** | One-tap AI prompts: Compare Prices, Verify Twinnability & Zippers, Find Matching Sleeping Pads, and Check Taipei Store Stock. |
| **Multimodal Spatial Try-On** | Upload real environment photos for Gemini-powered spatial fit analysis, pitching tips, and perimeter safety clearances. |
| **AI Gear Expert Chatbot** | Conversational agent powered by Gemini 3.8 Flash, grounded with the active store context, current taste profile, and collected items. |
| **Community Agent Sharing & Code Import** | Share your curated gear kit directly to your clipboard or import community agent profiles (e.g. `@TaiwanAlpinePro` Yushan Ultralight pack). |
| **Multi-Store Checkout Modal** | Groups items by retailer, applies coupon codes, selects Click & Collect vs. delivery, and simulates 1-click execution. |

---

## 🛠️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Window                        │
├──────────────────────────────┬──────────────────────────────┤
│      Web Store View          │     MIA Companion Panel      │
│  (Decathlon / Chilloutdoor / │  - Collected Sessions Cards  │
│          Campfire)           │  - Cross-Store Price Matrix  │
│  - Highlight & Extract Layer │  - Resizable Split Divider   │
│  - Real Camping Catalog      │  - Slide-up Action Drawer    │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               └───────────────┬──────────────┘
                               │ Client Actions / REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Full-Stack Express Server                   │
│                       (server.ts)                           │
│  - POST /api/agent/chat     (Gemini 3.8 Flash Chat)         │
│  - POST /api/agent/simulate (Gemini Multimodal Vision)      │
│  - POST /api/agent/action   (Autonomous Action Executor)    │
│  - Vite Middleware Integration (Dev & Production)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Google GenAI SDK (@google/genai)            │
│  - Model: gemini-3.8-flash                                  │
│  - Grounded with Store Context & Extracted Item Metadata    │
└─────────────────────────────────────────────────────────────┘
```

- **Frontend Framework**: React 19 with TypeScript.
- **Styling**: Tailwind CSS v4 with modern flexbox and transition styling.
- **Icons & UI**: `lucide-react` for streamlined UI controls and indicators.
- **Backend & API Proxy**: Express 4 server (`server.ts`) hosting secure server-side AI proxy routes.
- **AI Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash` for high-speed conversational responses, structured action synthesis, and multimodal image analysis.

---

## 📖 How to Use

### Step 1: Browse Stores & Collect Items
1. Use the top browser tabs to switch between **Decathlon**, **Chilloutdoor**, and **Campfire Gear**.
2. Click any product card on the store page.
3. The selected item will highlight in cyan, and MIA's side panel will open and animate data extraction.
4. Review the extracted specifications, including weight, materials, temperature ratings, and cross-store pricing.

### Step 2: Compare Deals & Manage Items
- Click the card header to expand or collapse details.
- Review the **Cross-Store Comparison** box to see which store offers the best price or has stock available.
- Use the **Refresh** button on any card to simulate re-scraping the current page.
- Remove individual items with **Remove**, or click **Clear all** in the panel header to wipe all items and start fresh.

### Step 3: Trigger Agent Actions
1. Click the **"CALL Agent to Action!"** button at the bottom of the companion panel.
2. Under **PRESET WEBPAGE DEMANDS**, click any prompt (e.g., *"Compare Prices Across Stores"* or *"Verify Twinnability & Zipper Pair"*).
3. MIA analyzes your collected items and replies with formatted recommendations in the chat stream.

### Step 4: Simulate Fit in Your Environment
1. In the Action Hub, locate the **SIMULATION** section.
2. Click **Upload images of room/environment** and select a photo of your campsite, lawn, or room.
3. MIA analyzes the image using Gemini 3.8 Flash vision and returns a **Fit Score**, clearance analysis, and pitching recommendations.

### Step 5: Share Kits or Import Community Agents
- Click the **Share** button in the Action Hub header to copy your gear list and taste code to your clipboard and chat.
- Click **Insert** or type `insert agent @TaiwanAlpinePro` into the chat input to instantly load a verified ultralight packing list into your panel.

### Step 6: Multi-Store Unified Checkout
1. Switch to the **Insights** tab in the side panel to view total original price, bundle savings, and estimated checkout total.
2. Click **Proceed to Multi-Store Checkout**.
3. In the modal, review your items grouped by merchant, select delivery or Click & Collect, and click **Authorize 1-Click Purchase Across Stores**.

---

## ⚙️ Environment Configuration

The application requires a Gemini API key for live AI capabilities:

```env
# GEMINI_API_KEY: Required for Gemini AI API calls (Chat, Simulation, Actions).
# AI Studio automatically injects this at runtime from user secrets.
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# APP_URL: The hosting URL of the applet.
APP_URL="http://localhost:3000"
```

*Note: If no API key is provided, MIA automatically runs in intelligent offline fallback mode with pre-calibrated gear data and spatial estimations.*

---

## 💻 Development & Build Scripts

- **Start Dev Server**: `npm run dev` (runs `tsx server.ts` on port 3000)
- **Compile & Typecheck**: `npm run build`
- **Lint**: `npm run lint`
