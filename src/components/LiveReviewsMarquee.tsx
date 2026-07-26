import React from 'react';
import { Flame, Star, Sparkles, MessageCircle, Heart, Utensils } from 'lucide-react';

interface LiveReviewsMarqueeProps {
  isLateNightMode?: boolean;
}

const TICKER_ITEMS = [
  {
    id: '1',
    icon: Flame,
    color: 'text-rose-500',
    title: '熱銷爆款',
    content: '『極品招牌雙拼便當』肉質外酥內嫩，特製秘醬太過癮了！',
    user: '忠實饕客 小張',
    time: '2 分鐘前',
  },
  {
    id: '2',
    icon: Star,
    color: 'text-amber-400',
    title: '五星好評',
    content: '『阿達師牛肉麵』湯頭濃郁香醇，牛肉給得超大方！',
    user: '內用 3 號桌',
    time: '5 分鐘前',
  },
  {
    id: '3',
    icon: Sparkles,
    color: 'text-amber-300',
    title: '最新下單',
    content: '外帶顧客剛剛訂購了『黑金珍珠奶茶 + 酥炸雞腿排』',
    user: '外帶自取',
    time: '剛剛',
  },
  {
    id: '4',
    icon: Heart,
    color: 'text-rose-400',
    title: '顧客熱播',
    content: '智慧點餐介面順暢無比，深夜食堂模式氣氛感滿分！',
    user: '台北陳小姐',
    time: '8 分鐘前',
  },
  {
    id: '5',
    icon: Utensils,
    color: 'text-emerald-400',
    title: '特調推爆',
    content: '『古早味冬瓜檸檬』甘甜爽口，搭配便當簡直絕配！',
    user: '內用 7 號桌',
    time: '12 分鐘前',
  },
];

export const LiveReviewsMarquee: React.FC<LiveReviewsMarqueeProps> = ({ isLateNightMode }) => {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-30 border-t backdrop-blur-md transition-colors duration-500 overflow-hidden select-none ${
        isLateNightMode
          ? 'bg-stone-950/90 text-amber-100 border-amber-500/30 shadow-[0_-4px_20px_rgba(245,158,11,0.15)]'
          : 'bg-amber-950/95 text-amber-100 border-amber-900/60 shadow-lg'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center h-10 px-2 sm:px-4 text-xs font-medium">
        {/* Left Badge */}
        <div className="flex items-center space-x-1.5 shrink-0 px-2 sm:px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mr-2 sm:mr-4 font-bold">
          <MessageCircle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="whitespace-nowrap text-[11px] sm:text-xs">顧客動態熱播</span>
        </div>

        {/* Scrolling Ticker Track */}
        <div className="flex-1 overflow-hidden relative group">
          <div className="flex space-x-8 animate-marquee whitespace-nowrap group-hover:[animation-play-state:paused]">
            {/* Repeat list twice for seamless looping */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center space-x-2 shrink-0 py-1 px-2 rounded-lg hover:bg-amber-900/40 transition-colors"
                >
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className="font-bold text-amber-300 text-[11px]">{item.title}</span>
                  <span className="text-amber-100/90 text-[11px] sm:text-xs">{item.content}</span>
                  <span className="text-amber-400/60 text-[10px] bg-amber-900/50 px-1.5 py-0.5 rounded">
                    {item.user} · {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
