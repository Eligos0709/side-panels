import React, { useState, useEffect, useRef } from 'react';
import { StoreId, ProductItem, AgentSession } from './types';
import {
  STORES,
  DECATHLON_PRODUCTS,
  CHILLOUTDOOR_PRODUCTS,
  CAMPFIRE_PRODUCTS,
} from './data/mockStores';
import { BrowserChrome } from './components/BrowserChrome';
import { WebstoreView } from './components/WebstoreView';
import { AgentSidePanel } from './components/AgentSidePanel';
import { MultiStoreCheckoutModal } from './components/MultiStoreCheckoutModal';

export default function App() {
  const [activeStoreId, setActiveStoreId] = useState<StoreId>('decathlon');
  const [highlightedItemIds, setHighlightedItemIds] = useState<string[]>([]);
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
  const [splitRatio, setSplitRatio] = useState<number>(73); // 73% web, 27% agent panel
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);

  // Initialize recorded sessions as empty (cleared)
  const [sessions, setSessions] = useState<AgentSession[]>([]);

  // Animate loading bar to simulate agent DOM extraction
  useEffect(() => {
    const timer = setInterval(() => {
      setSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.loadingProgress < 100) {
            const nextProgress = Math.min(100, session.loadingProgress + 8);
            return {
              ...session,
              loadingProgress: nextProgress,
              isCollected: nextProgress === 100,
            };
          }
          return session;
        })
      );
    }, 450);

    return () => clearInterval(timer);
  }, []);

  // Determine current products list based on active store
  const currentProducts =
    activeStoreId === 'decathlon'
      ? DECATHLON_PRODUCTS
      : activeStoreId === 'chilloutdoor'
      ? CHILLOUTDOOR_PRODUCTS
      : CAMPFIRE_PRODUCTS;

  // Current active browser URL
  const currentUrl = `https://${STORES[activeStoreId].domain}/camping`;

  // Toggle highlighting of an item
  const handleToggleHighlight = (product: ProductItem) => {
    const isAlreadyHighlighted = highlightedItemIds.includes(product.id);

    if (isAlreadyHighlighted) {
      // Un-highlight
      setHighlightedItemIds((prev) => prev.filter((id) => id !== product.id));
      setSessions((prev) => prev.filter((s) => s.productId !== product.id));
    } else {
      // Highlight in lite-blue on webpage
      setHighlightedItemIds((prev) => [...prev, product.id]);

      // Cross-store match lookup
      const crossMatches = [
        {
          storeName: 'Decathlon Taiwan',
          storeId: 'decathlon' as StoreId,
          price: product.price,
          inStock: true,
          differenceText: 'Lowest Price',
        },
        {
          storeName: 'Campfire Gear',
          storeId: 'campfire' as StoreId,
          price: Math.round(product.price * 1.04),
          inStock: true,
          differenceText: '+4%',
        },
        {
          storeName: 'Chilloutdoor',
          storeId: 'chilloutdoor' as StoreId,
          price: Math.round(product.price * 1.08),
          inStock: false,
          differenceText: 'Low Stock',
        },
      ];

      // Add to sessions with starting loading progress
      const newSession: AgentSession = {
        id: `session-${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        url: product.url,
        storeId: product.storeId,
        storeName: STORES[product.storeId]?.name || 'Retailer',
        price: product.price,
        originalPrice: product.originalPrice,
        discountPercent: product.discountPercent,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        imageUrl: product.imageUrl,
        specs: {
          comfortTemp: product.specs.comfortTemp,
          twinnable: product.specs.twinnable,
          weight: product.specs.weight,
        },
        inStock: product.inStock,
        stockStatus: product.inStock
          ? `In Stock (${product.stockCount || 8} available)`
          : 'Backorder',
        deliveryEstimate: product.deliveryTime || '2-3 days',
        loadingProgress: 15, // Starts loading
        isCollected: false,
        timestamp: new Date().toLocaleTimeString(),
        crossStoreMatches: crossMatches,
      };

      setSessions((prev) => [newSession, ...prev]);

      // Ensure companion panel is visible
      setIsSidePanelOpen(true);
    }
  };

  const handleRemoveSession = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setHighlightedItemIds((prev) => prev.filter((id) => id !== session.productId));
    }
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handleRefreshSession = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, loadingProgress: 20 } : s))
    );
  };

  const handleImportSessions = (newSessions: AgentSession[]) => {
    setSessions(newSessions);
    setHighlightedItemIds(newSessions.map((s) => s.productId));
  };

  const handleClearAll = () => {
    setSessions([]);
    setHighlightedItemIds([]);
  };

  // Draggable split divider handlers
  const containerRef = useRef<HTMLDivElement>(null);

  const startDragging = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newRatio = ((e.clientX - rect.left) / rect.width) * 100;
      if (newRatio >= 35 && newRatio <= 85) {
        setSplitRatio(newRatio);
      }
    };

    const onMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#1e1a18] overflow-hidden select-none font-sans">
      {/* Top Browser Window Chrome Header */}
      <BrowserChrome
        activeStoreId={activeStoreId}
        onSelectStore={setActiveStoreId}
        currentUrl={currentUrl}
        isSidePanelOpen={isSidePanelOpen}
        onToggleSidePanel={() => setIsSidePanelOpen(!isSidePanelOpen)}
        collectedCount={sessions.length}
      />

      {/* Main View Area: Split between Web Store & Companion Agent Side Panel */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Left: The Store Website Page */}
        <div
          style={{ width: isSidePanelOpen ? `${splitRatio}%` : '100%' }}
          className="h-full overflow-hidden flex flex-col transition-all duration-75"
        >
          <WebstoreView
            storeId={activeStoreId}
            products={currentProducts}
            highlightedItemIds={highlightedItemIds}
            onToggleHighlight={handleToggleHighlight}
          />
        </div>

        {/* Vertical Divider with '||' drag handle (Exact match to screenshot!) */}
        {isSidePanelOpen && (
          <div
            onMouseDown={startDragging}
            className={`w-3 relative flex items-center justify-center cursor-col-resize select-none transition-colors z-20 ${
              isDragging ? 'bg-[#487383]' : 'bg-stone-300 hover:bg-stone-400'
            }`}
            title="Drag to resize panel"
          >
            {/* The '||' handle symbol from screenshot */}
            <div className="w-4 h-8 bg-stone-700 text-stone-200 rounded-sm flex items-center justify-center text-[10px] font-mono tracking-tighter opacity-80 hover:opacity-100 shadow-xs">
              ||
            </div>
          </div>
        )}

        {/* Right: Companion Side Panel */}
        {isSidePanelOpen && (
          <div
            style={{ width: `${100 - splitRatio}%` }}
            className="h-full overflow-hidden bg-white shadow-xl transition-all duration-75"
          >
            <AgentSidePanel
              sessions={sessions}
              onRemoveSession={handleRemoveSession}
              onProceedCheckout={() => setIsCheckoutModalOpen(true)}
              onRefreshSession={handleRefreshSession}
              onImportSessions={handleImportSessions}
              onClearAll={handleClearAll}
              activeStoreId={activeStoreId}
            />
          </div>
        )}
      </div>

      {/* Multi-Store Autonomous Checkout Modal */}
      <MultiStoreCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        sessions={sessions}
        onClearSessions={() => {
          setSessions([]);
          setHighlightedItemIds([]);
        }}
      />
    </div>
  );
}
