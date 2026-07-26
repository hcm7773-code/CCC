import React from 'react';
import { Search, Flame, Award, Leaf, Star } from 'lucide-react';
import { Category } from '../types';

interface MenuCategoryNavProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  selectedTagFilter: string;
  setSelectedTagFilter: (tag: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MenuCategoryNav: React.FC<MenuCategoryNavProps> = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedTagFilter,
  setSelectedTagFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const tags = [
    { id: 'all', name: '全部標籤' },
    { id: '店長推薦', name: '店長推薦', icon: Award },
    { id: '熱銷', name: '熱銷爆款', icon: Flame },
    { id: '招牌', name: '招牌必點', icon: Star },
    { id: '辣味', name: '辣味料理', icon: Flame },
    { id: '素食', name: '素食/蛋奶素', icon: Leaf },
  ];

  return (
    <div className="bg-amber-50/80 backdrop-blur-xs border-b border-amber-200/60 sticky top-16 z-30 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
        {/* Search & Tag Filter Line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
            <input
              type="text"
              placeholder="搜尋美味餐點、關鍵字..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-amber-200 text-sm text-stone-800 placeholder-stone-400 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs bg-stone-100 rounded-full w-4 h-4 flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {tags.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedTagFilter === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTagFilter(t.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-xs'
                      : 'bg-white text-stone-600 border-amber-200 hover:bg-amber-100/60 hover:text-amber-900'
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3 text-amber-500" />}
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center space-x-2 border ${
                  isSelected
                    ? 'bg-amber-500 text-amber-950 border-amber-500 shadow-sm font-bold scale-102'
                    : 'bg-stone-100 text-stone-700 border-transparent hover:bg-amber-100 hover:text-amber-900'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
