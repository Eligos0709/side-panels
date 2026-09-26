import React from 'react';
import { StoreId } from '../types';
import { STORES } from '../data/mockStores';
import {
  Star,
  Sparkles,
  Languages,
  Layers,
  ShoppingBag,
  PanelRight,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Lock,
  ChevronDown,
} from 'lucide-react';

interface BrowserChromeProps {
  activeStoreId: StoreId;
  onSelectStore: (id: StoreId) => void;
  currentUrl: string;
  isSidePanelOpen: boolean;
  onToggleSidePanel: () => void;
  collectedCount: number;
}

const STORE_ICONS: Record<StoreId, string> = {
  chilloutdoor: '🌲',
  campfire: '🔥',
  decathlon: '⛺',
};

export const BrowserChrome: React.FC<BrowserChromeProps> = ({
  activeStoreId,
  onSelectStore,
  currentUrl,
  isSidePanelOpen,
  onToggleSidePanel,
  collectedCount,
}) => {
  const storeKeys: StoreId[] = ['chilloutdoor', 'campfire', 'decathlon'];

  return (
    <header className="bg-[#2a2421] text-gray-200 select-none border-b border-stone-800">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between px-3 pt-2">
        {/* Left: Store Tabs with Website Icons */}
        <div className="flex items-end space-x-1.5 overflow-x-auto scrollbar-none">
          {storeKeys.map((storeKey) => {
            const store = STORES[storeKey];
            const isActive = activeStoreId === storeKey;
            const icon = STORE_ICONS[storeKey];

            return (
              <button
                key={storeKey}
                onClick={() => onSelectStore(storeKey)}
                className={`relative px-4 sm:px-5 py-2 text-sm font-semibold transition-all rounded-t-xl flex items-center gap-2 border-t border-x ${
                  isActive
                    ? 'bg-white text-gray-900 border-white shadow-sm z-10 pb-2.5 font-bold'
                    : 'bg-[#3c3532] text-gray-300 hover:bg-[#48403d] border-[#4a423f]'
                }`}
              >
                <span className="text-sm leading-none" role="img" aria-label={store.name}>
                  {icon}
                </span>
                <span>{store.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Browser Chrome Extensions & Tools */}
        <div className="flex items-center space-x-2 text-gray-300 pb-1">
          <button
            title="Bookmark Page"
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-300 hover:text-amber-400"
          >
            <Star className="w-4 h-4" />
          </button>

          {/* Gemini AI Studio Sparkles */}
          <div
            title="MIA - Multi-page Items Assistant Powered by Gemini"
            className="p-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-md text-sky-300 border border-sky-400/30 flex items-center gap-1 text-xs px-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
            <span className="font-medium hidden sm:inline">MIA Agent</span>
          </div>

          <button
            title="Google Translate"
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Languages className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            title="Browser Extensions"
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
          </button>

          {/* Shopping Bag with items badge */}
          <div className="relative p-1.5 hover:bg-white/10 rounded-md transition-colors">
            <ShoppingBag className="w-4 h-4 text-pink-400" />
            {collectedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {collectedCount}
              </span>
            )}
          </div>

          {/* Side Panel Toggle Button (Highlighted in white to show active) */}
          <button
            onClick={onToggleSidePanel}
            title={isSidePanelOpen ? 'Collapse Agent Panel' : 'Expand Agent Panel'}
            className={`p-1.5 rounded-md transition-colors flex items-center gap-1.5 px-2.5 ${
              isSidePanelOpen
                ? 'bg-stone-200 text-stone-900 font-bold shadow-inner'
                : 'hover:bg-white/10 text-gray-300'
            }`}
          >
            <PanelRight className="w-4 h-4" />
            <span className="text-xs">Companion</span>
          </button>

          <button
            title="Secure Connection"
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </button>

          {/* User Profile Avatar */}
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ring-1 ring-white/30">
            JA
          </div>
        </div>
      </div>

      {/* URL Address Bar */}
      <div className="bg-[#362f2b] px-3 py-1.5 flex items-center space-x-2 text-xs border-t border-stone-700/60">
        <div className="flex items-center space-x-1 text-stone-400">
          <button className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 hover:text-white rounded hover:bg-white/5 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Omnibar Input */}
        <div className="flex-1 bg-[#231e1c] rounded-md px-3 py-1 flex items-center space-x-2 border border-stone-700 text-stone-300">
          <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          <span className="text-stone-400 font-mono select-all truncate">
            {currentUrl}
          </span>
          <span className="ml-auto text-[10px] bg-sky-900/60 text-sky-300 px-1.5 py-0.5 rounded border border-sky-700/50 flex-shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            Agent Scraper Active
          </span>
        </div>

        {/* Quick highlight tips */}
        <div className="hidden lg:flex items-center text-[11px] text-stone-400 space-x-1.5">
          <span>Click any product to highlight & sync to companion</span>
        </div>
      </div>
    </header>
  );
};
