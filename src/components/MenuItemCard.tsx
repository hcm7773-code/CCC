import React from 'react';
import { Plus, Flame, Award, AlertCircle, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem, e?: React.MouseEvent) => void;
  isLateNightMode?: boolean;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect, isLateNightMode }) => {
  return (
    <div
      onClick={(e) => item.isAvailable && onSelect(item, e)}
      className={`group rounded-2xl overflow-hidden transition-all duration-500 flex flex-col justify-between relative ${
        isLateNightMode
          ? 'bg-stone-900/80 backdrop-blur-md border border-amber-500/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)]'
          : 'bg-white border border-amber-100 shadow-xs hover:shadow-md'
      } ${
        item.isAvailable
          ? 'cursor-pointer hover:-translate-y-1.5'
          : 'opacity-65 cursor-not-allowed bg-stone-50/50'
      }`}
    >
      {/* Late night shimmer ambient glow overlay */}
      {isLateNightMode && (
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-400/25 transition-all duration-700" />
      )}

      <div>
        {/* Dish Image with Badge Overlay */}
        <div className="relative h-44 w-full bg-stone-950 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 ${
              !item.isAvailable ? 'grayscale' : ''
            }`}
            loading="lazy"
          />

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-base space-x-1">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <span>今日已售完</span>
            </div>
          )}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && item.isAvailable && (
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 ${
                    tag === '店長推薦' || tag === '招牌'
                      ? 'bg-amber-500 text-amber-950'
                      : tag === '熱銷' || tag === '辣味'
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {(tag === '店長推薦' || tag === '招牌') && <Award className="w-3 h-3" />}
                  {(tag === '熱銷' || tag === '辣味') && <Flame className="w-3 h-3" />}
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Late Night Metallic Sparkle Badge */}
          {isLateNightMode && item.isAvailable && (
            <div className="absolute bottom-2 right-2 bg-stone-950/80 backdrop-blur-md text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>奢華盛宴</span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-bold text-base leading-snug transition-colors ${
              isLateNightMode ? 'text-amber-100 group-hover:text-amber-300' : 'text-stone-900 group-hover:text-amber-800'
            }`}>
              {item.name}
            </h3>
          </div>

          <p className={`text-xs line-clamp-2 leading-relaxed ${
            isLateNightMode ? 'text-amber-200/70' : 'text-stone-500'
          }`}>
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className={`px-4 pb-4 pt-2 flex items-center justify-between border-t ${
        isLateNightMode ? 'border-amber-900/40' : 'border-stone-100'
      }`}>
        <div className="flex items-baseline space-x-1">
          <span className={`text-xs font-medium ${isLateNightMode ? 'text-amber-400/80' : 'text-amber-700'}`}>NT$</span>
          <span className={`text-xl font-extrabold ${isLateNightMode ? 'text-amber-300' : 'text-stone-900'}`}>{item.price}</span>
        </div>

        {item.isAvailable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item, e);
            }}
            className={`flex items-center space-x-1 font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-xs group-hover:scale-105 active:scale-95 cursor-pointer ${
              isLateNightMode
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-amber-500 hover:bg-amber-400 text-amber-950'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{item.optionGroups && item.optionGroups.length > 0 ? '客製化' : '加入'}</span>
          </button>
        ) : (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
            isLateNightMode ? 'text-stone-500 bg-stone-800' : 'text-stone-400 bg-stone-200'
          }`}>
            暫不提供
          </span>
        )}
      </div>
    </div>
  );
};

