export type StoreId = 'decathlon' | 'chilloutdoor' | 'campfire';

export interface StoreInfo {
  id: StoreId;
  name: string;
  domain: string;
  tagline: string;
  bannerColor: string;
  accentColor: string;
  currency: string;
  logo: string;
}

export interface ProductItem {
  id: string;
  storeId: StoreId;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  badge?: 'Price Drop' | 'Sale' | 'Limited Deals' | 'Online Exclusive' | 'First Technical Price';
  category: string;
  imageUrl: string;
  url: string;
  inStock: boolean;
  stockCount?: number;
  deliveryTime: string;
  specs: {
    comfortTemp?: string;
    limitTemp?: string;
    weight?: string;
    twinnable?: boolean;
    dimensions?: string;
    material?: string;
    warranty?: string;
  };
  isBannerCard?: boolean;
  bannerCtaText?: string;
  highlightedByDefault?: boolean;
}

export interface AgentSession {
  id: string;
  productId: string;
  name: string;
  url: string;
  storeId: StoreId;
  storeName: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  specs: {
    comfortTemp?: string;
    twinnable?: boolean;
    weight?: string;
    material?: string;
    dimensions?: string;
    warranty?: string;
  };
  inStock: boolean;
  stockStatus: string;
  deliveryEstimate: string;
  loadingProgress: number; // 0 to 100
  isCollected: boolean;
  timestamp: string;
  crossStoreMatches?: {
    storeName: string;
    storeId: StoreId;
    price: number;
    inStock: boolean;
    differenceText: string;
  }[];
}

export interface AgentDemand {
  id: string;
  prompt: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  actionSummary?: string;
  comparisonInsight?: string;
  recommendation?: string;
  suggestedNextSteps?: string[];
  timestamp: string;
  agentSteps?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  poweredBy?: string;
}

export interface AgentTasteProfile {
  name: string;
  handle: string;
  style: 'Alpine Ultralight' | 'Family Glamping' | 'Bushcraft & Survival' | 'Decathlon Value Master';
  bio: string;
  preferredStores: StoreId[];
  budgetThreshold: number;
  avatar: string;
  collectedItems: AgentSession[];
}

