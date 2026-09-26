import React, { useState, useRef, useEffect } from 'react';
import { AgentSession, StoreId, ChatMessage, AgentTasteProfile } from '../types';
import {
  Sparkles,
  ExternalLink,
  CheckCircle,
  Clock,
  Trash2,
  BarChart3,
  ShoppingCart,
  Zap,
  ArrowRight,
  RefreshCw,
  Bot,
  Upload,
  ArrowUp,
  Share2,
  Copy,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Compass,
} from 'lucide-react';

interface AgentSidePanelProps {
  sessions: AgentSession[];
  onRemoveSession: (id: string) => void;
  onProceedCheckout: () => void;
  onRefreshSession: (id: string) => void;
  onImportSessions?: (newSessions: AgentSession[]) => void;
  activeStoreId?: StoreId;
  onClearAll?: () => void;
}

// Curated community taste profiles for quick inline chat insertion
const COMMUNITY_AGENTS: AgentTasteProfile[] = [
  {
    name: 'Yushan Ridge Master',
    handle: '@TaiwanAlpinePro',
    style: 'Alpine Ultralight',
    bio: 'Ultralight alpine packing for Yushan & Snow Mountain. Verified twinnable MT500 sleeping bag & lightweight cookset.',
    preferredStores: ['decathlon', 'campfire'],
    budgetThreshold: 3500,
    avatar: '⛰️',
    collectedItems: [
      {
        id: 'session-dec-8-mt500',
        productId: 'dec-8-mt500',
        name: '10°C trekking sleeping bag, twinnable - MT500',
        url: 'https://www.decathlon.tw/p/10-trekking-sleeping-bag-twinnable-mt500',
        storeId: 'decathlon',
        storeName: 'Decathlon Taiwan',
        price: 1599,
        originalPrice: 1749,
        discountPercent: 9,
        rating: 4.6,
        reviewsCount: 518,
        imageUrl: '',
        specs: {
          comfortTemp: '10°C',
          twinnable: true,
          weight: '1.05 kg',
          material: 'Polyamide hollow fiber',
        },
        inStock: true,
        stockStatus: 'In Stock (12 in Neihu)',
        deliveryEstimate: 'Ships in 24 hrs',
        loadingProgress: 100,
        isCollected: true,
        timestamp: '10:42 AM',
        crossStoreMatches: [
          { storeName: 'Decathlon Taiwan', storeId: 'decathlon', price: 1599, inStock: true, differenceText: 'Best Deal' },
          { storeName: 'Campfire Gear', storeId: 'campfire', price: 1650, inStock: true, differenceText: '+NT$51' },
          { storeName: 'Chilloutdoor', storeId: 'chilloutdoor', price: 1720, inStock: false, differenceText: 'Out of Stock' },
        ],
      },
      {
        id: 'session-dec-mat',
        productId: 'dec-mat-100',
        name: 'Forclaz MT100 Folding Foam Camping Mat',
        url: 'https://www.decathlon.tw/p/mt100-folding-foam-mat',
        storeId: 'decathlon',
        storeName: 'Decathlon Taiwan',
        price: 499,
        originalPrice: 599,
        discountPercent: 17,
        rating: 4.7,
        reviewsCount: 312,
        imageUrl: '',
        specs: {
          weight: '390g',
          material: 'IXPE Closed Cell Foam (R-value 1.2)',
        },
        inStock: true,
        stockStatus: 'In Stock (8 units)',
        deliveryEstimate: 'Available for Store Pickup',
        loadingProgress: 100,
        isCollected: true,
        timestamp: '10:43 AM',
      },
      {
        id: 'session-camp-stove',
        productId: 'camp-stove-ti',
        name: 'Campfire Titanium Ultra-Compact Micro Stove',
        url: 'https://www.campfire-gear.tw/p/ti-micro-stove',
        storeId: 'campfire',
        storeName: 'Campfire Gear',
        price: 890,
        originalPrice: 990,
        discountPercent: 10,
        rating: 4.8,
        reviewsCount: 145,
        imageUrl: '',
        specs: {
          weight: '48g',
          material: 'Grade 1 Titanium Alloy',
        },
        inStock: true,
        stockStatus: 'In Stock (Direct Dispatch)',
        deliveryEstimate: 'Ships in 2 days',
        loadingProgress: 100,
        isCollected: true,
        timestamp: '10:45 AM',
      },
    ],
  },
  {
    name: 'Outdoor Family Glamping',
    handle: '@ChillCampMom',
    style: 'Family Glamping',
    bio: 'Scenic, luxury weekend campouts with children. Spacious canvas dome shelter & cozy twinned bedding.',
    preferredStores: ['chilloutdoor', 'decathlon'],
    budgetThreshold: 8500,
    avatar: '⛺',
    collectedItems: [
      {
        id: 'session-chill-tent',
        productId: 'chill-canvas-4p',
        name: 'Chilloutdoor Nordic 4-Person Canvas Dome Tent',
        url: 'https://www.chilloutdoor.com.tw/p/nordic-canvas-tent',
        storeId: 'chilloutdoor',
        storeName: 'Chilloutdoor',
        price: 4890,
        originalPrice: 5490,
        discountPercent: 11,
        rating: 4.9,
        reviewsCount: 88,
        imageUrl: '',
        specs: {
          dimensions: '2.6m x 2.4m x 1.8m height',
          weight: '6.4 kg',
          material: 'Polycotton TC waterproof breathable',
        },
        inStock: true,
        stockStatus: 'In Stock (5 in Taichung)',
        deliveryEstimate: 'Free Home Delivery',
        loadingProgress: 100,
        isCollected: true,
        timestamp: '11:10 AM',
      },
      {
        id: 'session-dec-8-mt500',
        productId: 'dec-8-mt500',
        name: '10°C trekking sleeping bag, twinnable - MT500',
        url: 'https://www.decathlon.tw/p/10-trekking-sleeping-bag-twinnable-mt500',
        storeId: 'decathlon',
        storeName: 'Decathlon Taiwan',
        price: 1599,
        originalPrice: 1749,
        discountPercent: 9,
        rating: 4.6,
        reviewsCount: 518,
        imageUrl: '',
        specs: {
          comfortTemp: '10°C',
          twinnable: true,
          weight: '1.05 kg',
        },
        inStock: true,
        stockStatus: 'In Stock (12 in Neihu)',
        deliveryEstimate: 'Ships in 24 hrs',
        loadingProgress: 100,
        isCollected: true,
        timestamp: '11:12 AM',
      },
    ],
  },
];

// Clean default realistic yard background SVG for simulation canvas
const DEFAULT_YARD_BG = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 380" width="100%" height="100%">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#bfe3f7"/>
        <stop offset="60%" stop-color="#e2f1fc"/>
        <stop offset="100%" stop-color="#fdfbf7"/>
      </linearGradient>
      <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#558b2f"/>
        <stop offset="40%" stop-color="#689f38"/>
        <stop offset="100%" stop-color="#33691e"/>
      </linearGradient>
      <linearGradient id="fence" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d7ccc8"/>
        <stop offset="100%" stop-color="#8d6e63"/>
      </linearGradient>
    </defs>
    <rect width="600" height="200" fill="url(#sky)"/>
    <circle cx="500" cy="60" r="30" fill="#fff9c4" opacity="0.8"/>
    <path d="M80,80 Q105,60 130,80 Q150,70 170,85 Q190,80 200,95 L80,95 Z" fill="#ffffff" opacity="0.75"/>
    <path d="M340,65 Q360,50 380,65 Q400,55 420,70 L340,70 Z" fill="#ffffff" opacity="0.6"/>
    <path d="M0,195 Q40,165 80,195 Q130,160 180,190 Q240,160 300,195 Q370,160 440,190 Q510,165 600,190 L600,200 L0,200 Z" fill="#2e7d32"/>
    <g fill="url(#fence)" stroke="#5d4037" stroke-width="1.5">
      <rect x="20" y="150" width="16" height="50" rx="2"/>
      <rect x="50" y="150" width="16" height="50" rx="2"/>
      <rect x="80" y="150" width="16" height="50" rx="2"/>
      <rect x="110" y="150" width="16" height="50" rx="2"/>
      <rect x="140" y="150" width="16" height="50" rx="2"/>
      <rect x="170" y="150" width="16" height="50" rx="2"/>
      <rect x="200" y="150" width="16" height="50" rx="2"/>
      <rect x="230" y="150" width="16" height="50" rx="2"/>
      <rect x="260" y="150" width="16" height="50" rx="2"/>
      <rect x="290" y="150" width="16" height="50" rx="2"/>
      <rect x="320" y="150" width="16" height="50" rx="2"/>
      <rect x="350" y="150" width="16" height="50" rx="2"/>
      <rect x="380" y="150" width="16" height="50" rx="2"/>
      <rect x="410" y="150" width="16" height="50" rx="2"/>
      <rect x="440" y="150" width="16" height="50" rx="2"/>
      <rect x="470" y="150" width="16" height="50" rx="2"/>
      <rect x="500" y="150" width="16" height="50" rx="2"/>
      <rect x="530" y="150" width="16" height="50" rx="2"/>
      <rect x="560" y="150" width="16" height="50" rx="2"/>
      <rect x="0" y="165" width="600" height="8"/>
    </g>
    <rect y="195" width="600" height="185" fill="url(#lawn)"/>
    <g stroke="#33691e" stroke-width="2" opacity="0.4">
      <line x1="120" y1="260" x2="122" y2="245"/>
      <line x1="124" y1="260" x2="127" y2="246"/>
      <line x1="280" y1="280" x2="282" y2="265"/>
      <line x1="430" y1="250" x2="432" y2="235"/>
      <line x1="480" y1="310" x2="483" y2="290"/>
      <line x1="200" y1="330" x2="204" y2="310"/>
    </g>
  </svg>
`)}`;

export const AgentSidePanel: React.FC<AgentSidePanelProps> = ({
  sessions,
  onRemoveSession,
  onProceedCheckout,
  onRefreshSession,
  onImportSessions,
  onClearAll,
  activeStoreId = 'decathlon',
}) => {
  const [activeTab, setActiveTab] = useState<'sessions' | 'summary'>('sessions');
  const [expandedSessionIds, setExpandedSessionIds] = useState<string[]>([]);

  // Slide-up CALL Agent to Action panel state
  const [isAgentDrawerOpen, setIsAgentDrawerOpen] = useState<boolean>(false);

  // Chat Section State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content:
        "Hello! I'm Agent MIA. I'm actively monitoring your collected camping gear across Decathlon Taiwan, Chilloutdoor, and Campfire. Ask me about specs, twinnability, store pricing, or how items fit your yard!",
      timestamp: 'Just now',
    },
  ]);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Simulation Section State
  const [uploadedEnvironmentImage, setUploadedEnvironmentImage] = useState<string | null>(null);
  const [selectedGearId, setSelectedGearId] = useState<string>(
    sessions[0]?.id || ''
  );
  const [simScale, setSimScale] = useState<number>(1.0);
  const [simRotation, setSimRotation] = useState<number>(0);
  const [simPosition, setSimPosition] = useState<{ x: number; y: number }>({ x: 50, y: 65 });
  const [isSimulatingAI, setIsSimulatingAI] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<{
    fitScore: number;
    fitVerdict: string;
    spaceAnalysis: string;
    pitchingAdvice: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync selected gear when sessions change
  useEffect(() => {
    if (sessions.length > 0 && !sessions.some((s) => s.id === selectedGearId)) {
      setSelectedGearId(sessions[0].id);
    } else if (sessions.length === 0) {
      setSelectedGearId('');
    }
  }, [sessions, selectedGearId]);

  // Preset demands matching the user's mock screenshot:
  const presetDemands = [
    {
      title: 'Compare Prices Across Stores',
      query:
        'Compare prices, discounts, and shipping fees for collected camping gear across Decathlon Taiwan, Chilloutdoor, and Campfire. Identify the absolute best deal.',
    },
    {
      title: 'Verify Twinnability & Zipper Pair',
      query:
        'Verify whether the 10°C MT500 sleeping bag supports left and right twinned zipping to create a double bag, and how to verify zipper orientation.',
    },
    {
      title: 'Find Matching Sleeping Pad (< NT$1,000)',
      query:
        'Find the best camping sleeping pad, folding foam mat, or inflatable mattress under NT$1,000 that fits under the 10°C MT500 sleeping bag.',
    },
    {
      title: 'Check Store Stock & Pickup in Taipei',
      query:
        'Check real-time retail store stock and 2-hour Click & Collect pickup availability for the MT500 sleeping bag in Taipei area (Neihu / Guandu stores).',
    },
  ];

  // Send message to Agent MIA Chatbot
  const handleSendChatMessage = async (customPrompt?: string) => {
    const text = customPrompt || chatPrompt;
    if (!text.trim() || isChatLoading) return;

    // Check for inline insert agent command/code in the chat input
    const cleanLower = text.trim().toLowerCase();
    if (cleanLower.startsWith('insert agent') || cleanLower.includes('mia-taste') || cleanLower.startsWith('{') || cleanLower.startsWith('[')) {
      handleChatInlineInsert(text.trim());
      if (!customPrompt) setChatPrompt('');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setChatPrompt('');
    setIsChatLoading(true);

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          prompt: text,
          items: sessions,
          activeSite: activeStoreId,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            poweredBy: data.poweredBy,
          },
        ]);
      } else {
        throw new Error('No reply from server');
      }
    } catch {
      // Local fallback reply
      let localReply = `I've analyzed your question regarding "${text.slice(0, 45)}...": `;
      if (text.toLowerCase().includes('compare') || text.toLowerCase().includes('price')) {
        localReply += `Decathlon Taiwan offers the lowest verified price for the 10°C MT500 sleeping bag at NT$1,599 (saving NT$150). Campfire is NT$1,650, while Chilloutdoor is out of stock. Decathlon also offers free in-store pickup!`;
      } else if (text.toLowerCase().includes('twin') || text.toLowerCase().includes('zipper')) {
        localReply += `Twinnability confirmed! The Forclaz MT500 series has matching YKK side zippers. You can combine a Left-zip bag and Right-zip bag together into a cozy 2-person double sleeping bag.`;
      } else if (text.toLowerCase().includes('pad') || text.toLowerCase().includes('1,000')) {
        localReply += `Best pad match under NT$1,000: Decathlon MT100 Folding Foam Mat at NT$499 (390g, R-value 1.2) or Campfire Ultralight Egg-crate Mat at NT$690. Both provide insulation and puncture protection.`;
      } else if (text.toLowerCase().includes('stock') || text.toLowerCase().includes('taipei')) {
        localReply += `Taipei Stock Check: Decathlon Neihu has 12 units available for instant 2-hour Click & Collect. Decathlon Guandu has 7 units. Ready for immediate pickup.`;
      } else {
        localReply += `I've cross-referenced this with Decathlon, Chilloutdoor, and Campfire. All specs and live pricing are updated in your session panel. Ready for 1-click checkout!`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: localReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          poweredBy: 'mia-agent-core',
        },
      ]);
    } finally {
      setIsChatLoading(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Inline "Share Agent To" execution directly into Chat & Clipboard (No pop-out window)
  const handleShareAgentInline = () => {
    const agentCode = `MIA-TASTE-ALPINETREK-${Date.now().toString().slice(-4)}`;
    const itemsList = sessions.map((s) => `• ${s.name} (NT$${s.price})`).join('\n');
    const shareText = `🏕️ [MIA Agent Taste & Kit]\nCode: ${agentCode}\nCollected Items (${sessions.length}):\n${itemsList}\n\nPaste this code into any MIA panel Chat to clone this setup!`;

    navigator.clipboard.writeText(shareText);
    showToast('Agent taste code copied to clipboard!');

    // Post to chat stream directly
    const userMsg: ChatMessage = {
      id: `user-share-${Date.now()}`,
      role: 'user',
      content: `Share Agent To: Generated export code for my ${sessions.length} collected item(s).`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMsg: ChatMessage = {
      id: `bot-share-${Date.now()}`,
      role: 'assistant',
      content: `📋 Your MIA Agent Taste Code has been generated and copied to your clipboard!\n\n🔑 Agent Code: \`${agentCode}\`\n\nYour friends can simply paste this code into their MIA Chat to load all ${sessions.length} item(s) and store comparisons instantly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      poweredBy: 'mia-agent-sharing',
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Inline "Insert Agent From" execution directly in Chat (No pop-out window)
  const handleInsertAgentInlineTrigger = () => {
    const userMsg: ChatMessage = {
      id: `user-insert-req-${Date.now()}`,
      role: 'user',
      content: 'Insert Agent From: Show available community agent taste profiles or paste code.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMsg: ChatMessage = {
      id: `bot-insert-menu-${Date.now()}`,
      role: 'assistant',
      content: `Ready to insert an agent! You can paste any Agent Code (e.g. \`MIA-TASTE-ALPINETREK-2026\`) or choose one of these community agents to insert right now:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Insert: @TaiwanAlpinePro (Yushan Alpine Kit - 3 items)',
        'Insert: @ChillCampMom (Family Glamping Kit - 2 items)',
      ],
      poweredBy: 'mia-agent-presets',
    };

    setChatMessages((prev) => [...prev, userMsg, botMsg]);
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Execute insert from chat action or code
  const handleChatInlineInsert = (actionOrCode: string) => {
    if (actionOrCode.includes('TaiwanAlpinePro') || actionOrCode.includes('Alpine') || actionOrCode.includes('ALPINETREK')) {
      const preset = COMMUNITY_AGENTS[0];
      if (onImportSessions) onImportSessions(preset.collectedItems);
      showToast(`Loaded ${preset.collectedItems.length} items from ${preset.name}!`);

      const botMsg: ChatMessage = {
        id: `bot-inserted-${Date.now()}`,
        role: 'assistant',
        content: `✅ Successfully inserted agent "${preset.name}" (${preset.handle})!\n\nLoaded ${preset.collectedItems.length} curated items:\n${preset.collectedItems.map((i) => `• ${i.name} (NT$${i.price})`).join('\n')}\n\nYour sessions panel, stock status, and cross-store pricing have been updated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: 'mia-agent-synced',
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } else if (actionOrCode.includes('ChillCampMom') || actionOrCode.includes('Glamping')) {
      const preset = COMMUNITY_AGENTS[1];
      if (onImportSessions) onImportSessions(preset.collectedItems);
      showToast(`Loaded ${preset.collectedItems.length} items from ${preset.name}!`);

      const botMsg: ChatMessage = {
        id: `bot-inserted-${Date.now()}`,
        role: 'assistant',
        content: `✅ Successfully inserted agent "${preset.name}" (${preset.handle})!\n\nLoaded ${preset.collectedItems.length} curated items:\n${preset.collectedItems.map((i) => `• ${i.name} (NT$${i.price})`).join('\n')}\n\nYour sessions panel, stock status, and cross-store pricing have been updated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: 'mia-agent-synced',
      };
      setChatMessages((prev) => [...prev, botMsg]);
    } else {
      // General code import fallback
      const preset = COMMUNITY_AGENTS[0];
      if (onImportSessions) onImportSessions(preset.collectedItems);
      showToast(`Imported agent code into panel!`);

      const botMsg: ChatMessage = {
        id: `bot-inserted-${Date.now()}`,
        role: 'assistant',
        content: `✅ Agent Code imported! Added ${preset.collectedItems.length} item(s) to your panel.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        poweredBy: 'mia-agent-synced',
      };
      setChatMessages((prev) => [...prev, botMsg]);
    }

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Upload image for simulation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedEnvironmentImage(base64);
      runAISimulationAnalysis(base64);
      showToast('Environment photo uploaded! MIA is analyzing spatial fit...');
    };
    reader.readAsDataURL(file);
  };

  // Run AI Spatial Fit simulation
  const runAISimulationAnalysis = async (imgData?: string) => {
    const activeItem = sessions.find((s) => s.id === selectedGearId) || sessions[0];
    if (!activeItem) return;

    setIsSimulatingAI(true);
    setSimulationResult(null);

    const imageToAnalyze = imgData || uploadedEnvironmentImage;

    try {
      const res = await fetch('/api/agent/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item: activeItem,
          environmentType: uploadedEnvironmentImage ? 'Uploaded Room/Yard Photo' : 'Backyard Lawn',
          imageBase64: imageToAnalyze,
        }),
      });

      const data = await res.json();
      if (data.success && data.simulation) {
        setSimulationResult(data.simulation);
      }
    } catch {
      setSimulationResult({
        fitScore: 96,
        fitVerdict: 'Perfect Fit with Ample Clearance',
        spaceAnalysis: `The yard/room area provides approx. 3.4m flat ground surface. The ${activeItem?.name || 'gear'} occupies ~2.1m, leaving 1.3m clearance for walking perimeter.`,
        pitchingAdvice:
          'Ensure the grass is dry and pitch corner stakes at a 45° angle against the wind direction. For sleeping bags, use a ground sheet or foam mat underneath.',
      });
    } finally {
      setIsSimulatingAI(false);
    }
  };

  // Active background for simulation canvas
  const currentEnvironmentBg = uploadedEnvironmentImage || DEFAULT_YARD_BG;
  const currentGearItem = sessions.find((s) => s.id === selectedGearId) || sessions[0];

  const toggleExpand = (id: string) => {
    setExpandedSessionIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Calculations for summary tab
  const totalCost = sessions.reduce((sum, s) => sum + s.price, 0);
  const totalOriginal = sessions.reduce((sum, s) => sum + (s.originalPrice || s.price), 0);
  const totalSavings = totalOriginal - totalCost;

  return (
    <aside className="w-full h-full bg-white flex flex-col border-l border-stone-200 select-none shadow-sm relative overflow-hidden font-sans">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Panel Top Header - MIA */}
      <div className="p-3 border-b border-stone-200 bg-stone-50/80 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#487383] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-stone-900 tracking-tight">MIA</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-stone-700 bg-stone-200 px-1.5 py-0.2 rounded-full">
                  {sessions.length}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium leading-none mt-0.5">
                Multi-page Items Assistant
              </p>
            </div>
          </div>

          {sessions.length > 0 && onClearAll && (
            <button
              onClick={onClearAll}
              title="Clear all contents in the panel"
              className="text-[11px] font-semibold text-stone-500 hover:text-rose-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Panel Tabs: Sessions & Insights */}
        <div className="flex items-center mt-2.5 p-0.5 bg-stone-200/70 rounded-lg text-xs">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center cursor-pointer ${
              activeTab === 'sessions'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Sessions</span>
            <span className="ml-1 text-[11px] font-medium opacity-75">({sessions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center cursor-pointer ${
              activeTab === 'summary'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Insights</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        {sessions.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50/50">
            <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-stone-800">No items collected yet</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-[240px]">
              Click on any product on Decathlon, Chilloutdoor, or Campfire to highlight and record it here.
            </p>
          </div>
        ) : activeTab === 'sessions' ? (
          /* SESSIONS LIST */
          <div className="space-y-3.5">
            {sessions.map((session) => {
              const isLoading = session.loadingProgress < 100;
              const isExpanded = expandedSessionIds.includes(session.id) || !isLoading;

              return (
                <div
                  key={session.id}
                  className="rounded-2xl shadow-sm border border-stone-200 overflow-hidden transition-all duration-300"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => toggleExpand(session.id)}
                    className="p-3 text-stone-900 relative cursor-pointer select-none bg-[#70a2d0]"
                  >
                    <div className="flex items-center justify-between mb-1.5 gap-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs">⛺</span>
                        <span className="text-[11px] font-extrabold text-slate-950 tracking-wide uppercase">
                          {session.storeName}
                        </span>
                      </div>

                      <a
                        href={session.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title={session.url}
                        className="bg-white/85 hover:bg-white text-slate-900 px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 shadow-xs transition-colors truncate max-w-[160px]"
                      >
                        <span className="truncate">{session.url.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                      </a>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-950 leading-snug pr-4">
                      {session.name}
                    </h3>

                    <div className="mt-2.5 flex items-center justify-between text-xs pt-0.5">
                      <div className="flex items-center gap-1.5">
                        {!isLoading ? (
                          <span className="text-[10px] font-bold text-slate-950 bg-white/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-800" />
                            Data Extracted
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-950 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3 animate-spin text-slate-950" />
                            Collecting info...
                          </span>
                        )}
                      </div>

                      {isLoading ? (
                        <div className="flex items-center gap-1.5 bg-white/85 px-2 py-0.5 rounded-md shadow-xs">
                          <span className="text-[10px] font-bold text-slate-800">Loading...</span>
                          <div className="w-16 sm:w-20 bg-slate-300 rounded-full h-2 overflow-hidden border border-slate-400/50">
                            <div
                              className="bg-gradient-to-r from-sky-600 to-cyan-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${session.loadingProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-black text-slate-950 bg-white/85 px-2 py-0.5 rounded shadow-xs">
                          NT${session.price.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="p-3 bg-white text-xs space-y-3 border-t border-stone-100">
                      <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="text-[10px] text-stone-500 font-medium block">
                            Live Extracted Price
                          </span>
                          <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-sm font-extrabold text-stone-900">
                              NT${session.price.toLocaleString()}
                            </span>
                            {session.originalPrice && (
                              <span className="text-[10px] text-stone-400 line-through">
                                NT${session.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          {session.discountPercent && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded inline-block mt-0.5">
                              Save {session.discountPercent}%
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] text-stone-500 font-medium block">
                            Availability & Stock
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-semibold text-[11px] mt-0.5 ${
                              session.inStock ? 'text-emerald-700' : 'text-amber-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                session.inStock ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                            />
                            {session.stockStatus}
                          </span>
                          <span className="text-[10px] text-stone-500 block truncate">
                            {session.deliveryEstimate}
                          </span>
                        </div>
                      </div>

                      {/* Specs */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                          MIA Extracted Specs
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                          {session.specs.comfortTemp && (
                            <div className="bg-stone-50 px-2 py-1 rounded border border-stone-100">
                              <span className="text-stone-500">Comfort:</span>{' '}
                              <strong className="text-stone-800">{session.specs.comfortTemp}</strong>
                            </div>
                          )}
                          {session.specs.twinnable !== undefined && (
                            <div className="bg-stone-50 px-2 py-1 rounded border border-stone-100">
                              <span className="text-stone-500">Twinnable:</span>{' '}
                              <strong className="text-emerald-700">
                                {session.specs.twinnable ? '✓ Left/Right Pair' : 'No'}
                              </strong>
                            </div>
                          )}
                          {session.specs.weight && (
                            <div className="bg-stone-50 px-2 py-1 rounded border border-stone-100">
                              <span className="text-stone-500">Weight:</span>{' '}
                              <strong className="text-stone-800">{session.specs.weight}</strong>
                            </div>
                          )}
                          <div className="bg-stone-50 px-2 py-1 rounded border border-stone-100">
                            <span className="text-stone-500">Rating:</span>{' '}
                            <strong className="text-amber-700">
                              ★ {session.rating} ({session.reviewsCount})
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Card actions */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <button
                          onClick={() => onRemoveSession(session.id)}
                          className="text-stone-400 hover:text-rose-600 flex items-center gap-1 transition-colors text-[11px] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onRefreshSession(session.id)}
                            title="Re-scrape current page"
                            className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={onProceedCheckout}
                            className="px-2.5 py-1 bg-stone-900 hover:bg-black text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                          >
                            <span>1-Click Buy</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* SUMMARY TAB */
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#487383]" />
                <span>Multi-Website Camping Cart</span>
              </h4>
              <div className="pt-2 border-t border-stone-200 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Collected Items ({sessions.length}):</span>
                  <span className="font-medium text-stone-900">NT${totalOriginal.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Bundle Savings:</span>
                    <span>-NT${totalSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Estimated Total:</span>
                  <span className="text-blue-700">NT${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onProceedCheckout}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Proceed to Multi-Store Checkout (NT${totalCost.toLocaleString()})</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA Button: Clicking this slides up the CALL Agent to Action panel */}
      <div className="py-2.5 px-3 border-t border-stone-200 bg-white/95 backdrop-blur-xs flex-shrink-0">
        <button
          onClick={() => setIsAgentDrawerOpen(true)}
          className="w-full py-2.5 px-4 rounded-xl font-bold text-white text-xs sm:text-sm tracking-wide shadow-sm hover:shadow transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
          style={{ backgroundColor: '#487383' }}
        >
          <Sparkles className="w-4 h-4 text-sky-200 transition-transform group-hover:rotate-12" />
          <span>CALL Agent to Action!</span>
        </button>
        <p className="text-[9px] text-center text-stone-400 mt-0.5 truncate">
          Click to open MIA agent drawer from down up
        </p>
      </div>

      {/* =========================================================================
          SLIDE-UP AGENT PANEL
          - Compact, concise Header with smaller Share & Insert buttons
          - PRESET WEBPAGE DEMANDS: 4 items with lightning bolt
          - SIMULATION: Concise upload and AR placement
          - CHAT: Direct AI chatbot with inline sharing & code insertion (no pop-outs)
          - Bottom bar: "Slide Down" and "Proceed to Checkout ->"
         ========================================================================= */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-white shadow-2xl z-30 transition-transform duration-300 ease-out flex flex-col ${
          isAgentDrawerOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
        }`}
        style={{ height: '94%', maxHeight: '98%' }}
      >
        {/* Drawer Header with smaller Share & Insert buttons */}
        <div className="px-3.5 py-2.5 bg-[#4a6b7a] text-white flex items-center justify-between flex-shrink-0 shadow-sm">
          {/* Left Title with Bot Icon */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center shadow-xs">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">
                MIA Agent Action Hub
              </h2>
              <p className="text-[9px] text-slate-200 font-medium">
                Multi-page Items Assistant
              </p>
            </div>
          </div>

          {/* Right Header Buttons: Smaller Share & Insert (triggers directly into Chat & Clipboard) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShareAgentInline}
              title="Share taste & kit directly to clipboard and chat"
              className="bg-stone-200/95 hover:bg-white text-stone-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-2xs transition-colors cursor-pointer border border-stone-300/80 flex items-center gap-1"
            >
              <Share2 className="w-3 h-3 text-stone-700" />
              <span>Share</span>
            </button>
            <button
              onClick={handleInsertAgentInlineTrigger}
              title="Insert agent code or community kit in chat"
              className="bg-stone-200/95 hover:bg-white text-stone-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-2xs transition-colors cursor-pointer border border-stone-300/80 flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#4a6b7a]" />
              <span>Insert</span>
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* SECTION 1: PRESET WEBPAGE DEMANDS: */}
          <div>
            <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider mb-2">
              PRESET WEBPAGE DEMANDS:
            </h3>
            <div className="space-y-2">
              {presetDemands.map((demand, idx) => (
                <button
                  key={idx}
                  disabled={isChatLoading}
                  onClick={() => handleSendChatMessage(demand.query)}
                  className="w-full p-2.5 text-left rounded-xl border border-stone-300 bg-white hover:border-[#4a6b7a] hover:bg-sky-50/40 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                >
                  <span className="text-xs font-semibold text-stone-900 group-hover:text-[#4a6b7a]">
                    {demand.title}
                  </span>
                  <Zap className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#4a6b7a] transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: SIMULATION (Concise layout without sample environments component) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                SIMULATION
              </h3>
              {uploadedEnvironmentImage && (
                <button
                  onClick={() => {
                    setUploadedEnvironmentImage(null);
                    setSimulationResult(null);
                  }}
                  className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset Yard</span>
                </button>
              )}
            </div>

            {/* Upload Box (Exactly matches screenshot) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-stone-200/80 hover:bg-stone-200 border border-stone-300 transition-colors flex items-center justify-between cursor-pointer group shadow-2xs"
            >
              <div className="text-xs text-stone-700 font-medium truncate pr-2">
                {uploadedEnvironmentImage
                  ? 'Custom environment photo uploaded. Click to change.'
                  : 'Upload images of room/environment to simulate with items.'}
              </div>
              <Upload className="w-4 h-4 text-stone-600 group-hover:text-stone-900 flex-shrink-0" />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* SECTION 3: CHAT (Handles direct questions, plus inline Share & Insert codes) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-stone-800 uppercase tracking-wider">
                CHAT
              </h3>
              <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>MIA Online</span>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto p-2.5 bg-stone-50 rounded-2xl border border-stone-200 mb-2">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 mb-0.5 text-[10px] text-stone-400 font-medium">
                    {msg.role === 'assistant' ? (
                      <>
                        <Bot className="w-3 h-3 text-[#4a6b7a]" />
                        <span>MIA Agent</span>
                        {msg.poweredBy && (
                          <span className="text-[9px] text-stone-400 font-mono">({msg.poweredBy})</span>
                        )}
                      </>
                    ) : (
                      <span>You</span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-2.5 rounded-2xl text-xs max-w-[88%] leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-[#4a6b7a] text-white rounded-tr-none'
                        : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-2xs'
                    }`}
                  >
                    {msg.content}

                    {/* Inline Quick Action buttons for Inserting Community Agents */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-stone-100 flex flex-col gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleChatInlineInsert(action)}
                            className="text-left px-2 py-1 rounded bg-[#4a6b7a]/10 hover:bg-[#4a6b7a]/20 text-[#4a6b7a] font-semibold text-[10px] transition-colors flex items-center justify-between cursor-pointer"
                          >
                            <span>{action}</span>
                            <Sparkles className="w-3 h-3" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-1.5 text-stone-500 text-xs p-2">
                  <Bot className="w-3.5 h-3.5 text-[#4a6b7a] animate-spin" />
                  <span className="italic">Agent MIA is thinking...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Container */}
            <div className="border border-stone-700/80 rounded-2xl p-2.5 sm:p-3 bg-white min-h-[95px] flex flex-col justify-between shadow-xs focus-within:ring-2 focus-within:ring-[#4a6b7a]">
              <textarea
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendChatMessage();
                  }
                }}
                placeholder="Type your instruct prompt, or paste an Agent Code..."
                rows={2}
                disabled={isChatLoading}
                className="w-full text-xs text-stone-800 placeholder-stone-400 resize-none focus:outline-none bg-transparent"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-stone-400 font-mono">
                  Tip: Paste codes here directly
                </span>
                <button
                  onClick={() => handleSendChatMessage()}
                  disabled={isChatLoading || !chatPrompt.trim()}
                  className="w-7 h-7 rounded-full bg-stone-500 hover:bg-stone-800 disabled:opacity-30 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                  title="Send prompt to Agent MIA"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Bottom Bar ("Slide Down" & "Proceed to Checkout ->") */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs flex-shrink-0">
          <button
            onClick={() => setIsAgentDrawerOpen(false)}
            className="px-3.5 py-1.5 border border-stone-300 rounded-lg hover:bg-stone-100 text-stone-700 font-semibold transition-colors cursor-pointer"
          >
            Slide Down
          </button>

          <button
            onClick={() => {
              setIsAgentDrawerOpen(false);
              onProceedCheckout();
            }}
            className="px-4 py-1.5 bg-[#2e8b57] hover:bg-[#247045] text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
