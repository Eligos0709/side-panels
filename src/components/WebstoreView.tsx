import React, { useState } from 'react';
import { ProductItem, StoreId } from '../types';
import { CATEGORIES, STORES } from '../data/mockStores';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Star,
  ShoppingBag,
  Sparkles,
  Check,
  Search,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';

interface WebstoreViewProps {
  storeId: StoreId;
  products: ProductItem[];
  highlightedItemIds: string[];
  onToggleHighlight: (product: ProductItem) => void;
  onSelectCategory?: (category: string) => void;
}

export const WebstoreView: React.FC<WebstoreViewProps> = ({
  storeId,
  products,
  highlightedItemIds,
  onToggleHighlight,
}) => {
  const store = STORES[storeId] || STORES.decathlon;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceFilter, setPriceFilter] = useState<string>('all');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState<boolean>(true);

  // Filter products based on search, category, brand, and price
  const filteredProducts = products.filter((item) => {
    if (selectedCategory !== 'All' && !item.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
      // Allow flexible match for categories like Sleeping Gear vs Tents
      if (!(selectedCategory === 'Sleeping Gear' && item.category === 'Sleeping Gear')) {
        return false;
      }
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchCategory) return false;
    }

    if (brandFilter !== 'all' && item.brand.toLowerCase() !== brandFilter.toLowerCase()) {
      return false;
    }

    if (priceFilter === 'under1000' && item.price >= 1000) return false;
    if (priceFilter === '1000to3000' && (item.price < 1000 || item.price > 3000)) return false;
    if (priceFilter === 'over3000' && item.price <= 3000) return false;

    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  return (
    <div className="flex-1 bg-white overflow-y-auto min-h-screen text-stone-900 pb-20 select-text">
      {/* Store Banner / Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 uppercase tracking-wider">
                {store.name} Outdoor Division
              </span>
              <span className="text-xs text-stone-400">•</span>
              <span className="text-xs text-sky-600 font-medium">Taiwan Flagship Store</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
              CAMPING
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {store.tagline}
            </p>
          </div>

          {/* Quick search input */}
          <div className="flex items-center gap-2 w-full md:w-72">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search camping gear..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Icons Row (Exact representation from screenshot) */}
        <div className="mt-4 pb-3 overflow-x-auto scrollbar-thin">
          <div className="flex items-center space-x-6 min-w-max py-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`flex flex-col items-center group cursor-pointer transition-all ${
                selectedCategory === 'All' ? 'opacity-100 font-bold scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-1.5 transition-colors ${
                selectedCategory === 'All' ? 'bg-sky-100 text-sky-700 shadow-sm ring-2 ring-sky-500' : 'bg-stone-100 group-hover:bg-stone-200'
              }`}>
                🌟
              </div>
              <span className="text-[11px] text-center max-w-[80px] leading-tight">
                All Camping
              </span>
            </button>

            {CATEGORIES.map((cat, idx) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex flex-col items-center group cursor-pointer transition-all ${
                    isSelected ? 'opacity-100 font-bold scale-105' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-1.5 transition-colors ${
                    isSelected ? 'bg-sky-100 text-sky-700 shadow-sm ring-2 ring-sky-500' : 'bg-stone-100 group-hover:bg-stone-200'
                  }`}>
                    {cat.icon}
                  </div>
                  <span className="text-[11px] text-center max-w-[85px] leading-tight text-stone-700">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subheader: Item count & Sort controls */}
        <div className="flex items-center justify-between py-3 border-y border-stone-200 text-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 font-bold text-stone-800 hover:text-stone-950 px-2 py-1 rounded hover:bg-stone-100"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {showFilters ? <ChevronUp className="w-3 h-3 text-stone-500" /> : <ChevronDown className="w-3 h-3 text-stone-500" />}
            </button>
            <span className="text-stone-400">|</span>
            <span className="font-semibold text-blue-800">
              {filteredProducts.length === products.length ? '1215' : filteredProducts.length} Products
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-stone-500 flex items-center gap-1">
              <span>⇅</span> Sort by
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-medium border-b border-stone-300 pb-0.5 focus:outline-none focus:border-stone-900 cursor-pointer"
            >
              <option value="featured">Featured / Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Active highlight helper banner */}
        <div className="my-3 px-3 py-2 bg-sky-50 border border-sky-200 rounded-lg flex items-center justify-between text-xs text-sky-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600 flex-shrink-0 animate-pulse" />
            <span>
              <strong>Website Agent Highlight Active:</strong> Click any product title or card to highlight in lite-blue and sync live data into the right companion panel session.
            </span>
          </div>
          <span className="text-[11px] font-mono bg-sky-200/80 px-2 py-0.5 rounded text-sky-900">
            {highlightedItemIds.length} item(s) highlighted
          </span>
        </div>

        {/* Main Content Layout: Left Filter Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-4">
          {/* Filters Column */}
          {showFilters && (
            <div className="lg:col-span-1 space-y-4 text-xs pr-2 border-r border-stone-100">
              <div className="font-bold text-stone-900 flex items-center justify-between pb-1 border-b border-stone-200">
                <span>Filter Options</span>
                {(priceFilter !== 'all' || brandFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setPriceFilter('all');
                      setBrandFilter('all');
                    }}
                    className="text-[10px] text-sky-600 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Price filter */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">
                  Price Range
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under1000', label: 'Under NT$1,000' },
                    { id: '1000to3000', label: 'NT$1,000 - NT$3,000' },
                    { id: 'over3000', label: 'Over NT$3,000' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 cursor-pointer text-stone-600 hover:text-stone-900">
                      <input
                        type="radio"
                        name="priceFilter"
                        checked={priceFilter === p.id}
                        onChange={() => setPriceFilter(p.id)}
                        className="text-sky-600 focus:ring-sky-500 rounded"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand filter */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1.5">
                  Brand
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Brands' },
                    { id: 'simond', label: 'SIMOND (Trekking Gear)' },
                    { id: 'quechua', label: 'QUECHUA (Camping)' },
                    { id: 'forclaz', label: 'FORCLAZ (Hiking)' },
                  ].map((b) => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer text-stone-600 hover:text-stone-900">
                      <input
                        type="radio"
                        name="brandFilter"
                        checked={brandFilter === b.id}
                        onChange={() => setBrandFilter(b.id)}
                        className="text-sky-600 focus:ring-sky-500 rounded"
                      />
                      <span>{b.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Product Nature */}
              <div className="pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-700 block mb-1">
                  Product Nature
                </span>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700">Trekking</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700">Glamping</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700">Twinnable Zip</span>
                  <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700">Fresh & Black</span>
                </div>
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className={showFilters ? 'lg:col-span-4' : 'lg:col-span-5'}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sortedProducts.map((product) => {
                const isHighlighted = highlightedItemIds.includes(product.id);

                // Promotional Banner style card (as shown in Decathlon screenshot)
                if (product.isBannerCard) {
                  return (
                    <div
                      key={product.id}
                      onClick={() => onToggleHighlight(product)}
                      className={`relative col-span-1 rounded-lg overflow-hidden border transition-all cursor-pointer group flex flex-col justify-between ${
                        isHighlighted
                          ? 'border-sky-400 ring-2 ring-sky-300 shadow-md bg-gradient-to-b from-sky-900 to-teal-900 text-white'
                          : 'border-stone-200 hover:border-stone-400 bg-gradient-to-b from-stone-800 to-stone-900 text-white shadow-sm'
                      }`}
                      style={{ minHeight: '280px' }}
                    >
                      <div className="p-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                          Decathlon Promo
                        </span>
                        <h3 className="font-bold text-sm mt-1 leading-snug">
                          {product.name}
                        </h3>
                        <p className="text-xl font-black text-amber-400 mt-2">
                          NT${product.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="relative flex-1 flex items-center justify-center p-2">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-32 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                      </div>

                      <div className="p-3 pt-0">
                        <button className="w-full py-1.5 px-3 bg-white/20 hover:bg-white/30 backdrop-blur-xs rounded text-xs font-semibold text-center text-white transition-colors">
                          {product.bannerCtaText || '立即選購 >'}
                        </button>
                      </div>

                      {/* Highlight indicator icon */}
                      {isHighlighted && (
                        <div className="absolute top-2 right-2 bg-sky-400 text-stone-900 p-1 rounded-full shadow">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                }

                // Standard Product Card (Identical layout to Decathlon Taiwan screenshot)
                return (
                  <div
                    key={product.id}
                    onClick={() => onToggleHighlight(product)}
                    className={`relative rounded-lg border bg-white p-2.5 transition-all flex flex-col justify-between cursor-pointer group hover:shadow-md ${
                      isHighlighted
                        ? 'border-sky-400 ring-2 ring-sky-300 shadow-sm'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Top Row: Badge or color indicator */}
                    <div className="flex items-start justify-between min-h-[20px] mb-1">
                      {product.badge ? (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            product.badge === 'Limited Deals'
                              ? 'bg-amber-100 text-amber-800'
                              : product.badge === 'Price Drop'
                              ? 'bg-blue-100 text-blue-800'
                              : product.badge === 'Sale'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {product.badge}
                        </span>
                      ) : (
                        <span />
                      )}

                      {/* Highlight indicator button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHighlight(product);
                        }}
                        title={isHighlighted ? 'Item recorded in Companion' : 'Click to highlight & record to agent'}
                        className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 transition-colors ${
                          isHighlighted
                            ? 'bg-sky-500 text-white font-bold'
                            : 'opacity-0 group-hover:opacity-100 bg-stone-100 hover:bg-sky-100 text-stone-600 hover:text-sky-700'
                        }`}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>{isHighlighted ? 'Collected' : 'Collect'}</span>
                      </button>
                    </div>

                    {/* Product Image */}
                    <div className="relative aspect-square flex items-center justify-center p-2 mb-2 bg-stone-50/50 rounded-md">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Color swatches mock */}
                    <div className="flex items-center space-x-1 mb-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white ring-1 ring-stone-200" />
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-400 border border-white ring-1 ring-stone-200" />
                    </div>

                    {/* Price Row: current price, original price, discount */}
                    <div className="flex items-baseline space-x-1.5 text-xs mb-1">
                      <span className="font-extrabold text-stone-900 text-sm">
                        NT${product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[11px] text-stone-400 line-through">
                          NT${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {product.discountPercent && (
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </div>

                    {/* Product Title - WITH LITE-BLUE HIGHLIGHT IF SELECTED */}
                    <div className="mb-2">
                      <h3
                        className={`text-xs leading-snug line-clamp-2 transition-all ${
                          isHighlighted
                            ? 'bg-[#bfe0fa] text-[#103459] font-semibold px-1 py-0.5 rounded shadow-xs ring-1 ring-sky-300'
                            : 'text-stone-800 font-normal group-hover:text-stone-950'
                        }`}
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-stone-500 uppercase mt-0.5 font-medium">
                        {product.brand}
                      </p>
                    </div>

                    {/* Bottom Row: Reviews + Cart */}
                    <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px] text-stone-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-stone-700">{product.rating}</span>
                        <span className="text-stone-400">({product.reviewsCount})</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleHighlight(product);
                        }}
                        title="Add to MIA Agent"
                        className="p-1 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
