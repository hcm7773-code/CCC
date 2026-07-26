import React from 'react';
import { Plus, Flame, Award, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect }) => {
  return (
    <div
      onClick={() => item.isAvailable && onSelect(item)}
      className={`group bg-white rounded-2xl overflow-hidden border border-amber-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between ${
        item.isAvailable
          ? 'cursor-pointer hover:-translate-y-1'
          : 'opacity-65 cursor-not-allowed bg-stone-50'
      }`}
    >
      <div>
        {/* Dish Image with Badge Overlay */}
        <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              !item.isAvailable ? 'grayscale' : ''
            }`}
            loading="lazy"
          />

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-base space-x-1">
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
        </div>

        {/* Content Details */}
        <div className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-amber-800 transition-colors">
              {item.name}
            </h3>
          </div>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Footer Price & Add Button */}
      <div className="px-4 pb-4 pt-1 flex items-center justify-between border-t border-stone-100">
        <div className="flex items-baseline space-x-1">
          <span className="text-xs text-amber-700 font-medium">NT$</span>
          <span className="text-xl font-extrabold text-stone-900">{item.price}</span>
        </div>

        {item.isAvailable ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs px-3 py-2 rounded-xl transition-all shadow-xs group-hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{item.optionGroups && item.optionGroups.length > 0 ? '客製化' : '加入'}</span>
          </button>
        ) : (
          <span className="text-xs text-stone-400 font-medium bg-stone-200 px-2.5 py-1 rounded-lg">
            暫不提供
          </span>
        )}
      </div>
    </div>
  );
};
