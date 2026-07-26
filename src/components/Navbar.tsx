import React from 'react';
import { ShoppingBag, Utensils, ChefHat, Store, Bot, Clock, Sparkles, Moon, Sun } from 'lucide-react';
import { OrderType } from '../types';

interface NavbarProps {
  activeTab: 'customer' | 'kitchen' | 'admin' | 'ai';
  setActiveTab: (tab: 'customer' | 'kitchen' | 'admin' | 'ai') => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  activeOrdersCount: number;
  onOpenOrderTracker: () => void;
  isLateNightMode: boolean;
  setIsLateNightMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  orderType,
  setOrderType,
  tableNumber,
  setTableNumber,
  cartCount,
  cartTotal,
  onOpenCart,
  activeOrdersCount,
  onOpenOrderTracker,
  isLateNightMode,
  setIsLateNightMode,
}) => {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md transition-all duration-500 shadow-md ${
      isLateNightMode
        ? 'bg-stone-950/95 text-amber-100 border-b border-amber-500/40 shadow-[0_4px_20px_rgba(245,158,11,0.15)]'
        : 'bg-amber-950/95 text-amber-50 border-b border-amber-900/40'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('customer')}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-all ${
              isLateNightMode
                ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 text-stone-950 shadow-amber-500/40 ring-1 ring-amber-300'
                : 'bg-gradient-to-tr from-amber-500 to-amber-400 text-amber-950 shadow-amber-500/20'
            }`}>
              <Utensils className="w-5 h-5 text-amber-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-amber-100 flex items-center gap-2">
                饗食智點{' '}
                <span className={`text-xs px-2 py-0.5 rounded-full font-normal border transition-all ${
                  isLateNightMode
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {isLateNightMode ? '✨ 深夜食堂模式' : '智慧點餐'}
                </span>
              </h1>
              <p className="text-xs text-amber-300/80 hidden sm:block">
                {isLateNightMode ? '微光巡夜，極致奢華金屬饗宴' : '極致順暢的現代餐飲體驗'}
              </p>
            </div>
          </div>

          {/* Center: Mode Switching Tabs */}
          <div className={`hidden md:flex items-center p-1 rounded-xl border transition-all ${
            isLateNightMode
              ? 'bg-stone-900/90 border-amber-500/30'
              : 'bg-amber-900/60 border-amber-800/50'
          }`}>
            <button
              id="tab-customer-btn"
              onClick={() => setActiveTab('customer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'customer'
                  ? 'bg-amber-500 text-amber-950 font-bold shadow-sm'
                  : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/40'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>顧客點餐</span>
            </button>

            <button
              id="tab-ai-btn"
              onClick={() => setActiveTab('ai')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-amber-500 text-amber-950 font-bold shadow-sm'
                  : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/40'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI 食神推薦</span>
            </button>

            <button
              id="tab-kitchen-btn"
              onClick={() => setActiveTab('kitchen')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'kitchen'
                  ? 'bg-amber-500 text-amber-950 font-bold shadow-sm'
                  : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/40'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>廚房接單</span>
            </button>

            <button
              id="tab-admin-btn"
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-amber-950 font-bold shadow-sm'
                  : 'text-amber-200 hover:text-amber-100 hover:bg-amber-800/40'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>店家管理</span>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Top Right: Late Night Bistro Toggle */}
            <button
              id="late-night-toggle-btn"
              onClick={() => setIsLateNightMode(!isLateNightMode)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 shadow-md active:scale-95 border cursor-pointer ${
                isLateNightMode
                  ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-stone-950 border-amber-200 shadow-[0_0_18px_rgba(245,158,11,0.5)] ring-2 ring-amber-400/50'
                  : 'bg-amber-900/60 hover:bg-amber-800/80 text-amber-200 border-amber-700/60'
              }`}
              title={isLateNightMode ? '切換為日間一般模式' : '開啟深夜食堂（奢華金屬玻璃主題）'}
            >
              {isLateNightMode ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-950 animate-spin" style={{ animationDuration: '6s' }} />
                  <span className="font-extrabold text-amber-950">深夜食堂</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline font-bold">深夜食堂</span>
                </>
              )}
            </button>

            {activeTab === 'customer' && (
              <>
                {/* Dine-in vs Takeout Switcher */}
                <div className="flex items-center bg-amber-900/50 p-1 rounded-lg border border-amber-800/40 text-xs sm:text-sm">
                  <button
                    onClick={() => setOrderType('dine-in')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      orderType === 'dine-in'
                        ? 'bg-amber-100 text-amber-950 shadow-xs'
                        : 'text-amber-300 hover:text-amber-100'
                    }`}
                  >
                    內用
                  </button>
                  <button
                    onClick={() => setOrderType('takeout')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      orderType === 'takeout'
                        ? 'bg-amber-100 text-amber-950 shadow-xs'
                        : 'text-amber-300 hover:text-amber-100'
                    }`}
                  >
                    外帶
                  </button>
                </div>

                {orderType === 'dine-in' && (
                  <div className="flex items-center space-x-1 text-xs bg-amber-900/60 px-2.5 py-1.5 rounded-lg border border-amber-800/40">
                    <span className="text-amber-300 font-medium">桌號</span>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="bg-amber-950 text-amber-100 font-bold rounded focus:outline-hidden px-1 py-0.5 border border-amber-700/60 cursor-pointer"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((t) => (
                        <option key={t} value={t.toString()}>
                          {t} 號桌
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* My Active Orders Button */}
                {activeOrdersCount > 0 && (
                  <button
                    onClick={onOpenOrderTracker}
                    className="flex items-center space-x-1 bg-amber-800/80 hover:bg-amber-800 text-amber-100 text-xs px-2.5 py-1.5 rounded-lg border border-amber-700 transition-all"
                    title="查看已下單餐點狀態"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="hidden sm:inline">我的訂單</span>
                    <span className="bg-amber-500 text-amber-950 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {activeOrdersCount}
                    </span>
                  </button>
                )}

                {/* Cart Floating Button */}
                <button
                  id="cart-trigger-btn"
                  onClick={onOpenCart}
                  className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center animate-bounce">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-extrabold hidden sm:inline">
                    ${cartTotal}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-amber-900/40 text-xs">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'customer' ? 'text-amber-400 font-bold' : 'text-amber-300/70'
            }`}
          >
            <Utensils className="w-4 h-4 mb-0.5" />
            <span>點餐</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'ai' ? 'text-amber-400 font-bold' : 'text-amber-300/70'
            }`}
          >
            <Bot className="w-4 h-4 mb-0.5" />
            <span>AI推薦</span>
          </button>
          <button
            onClick={() => setActiveTab('kitchen')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'kitchen' ? 'text-amber-400 font-bold' : 'text-amber-300/70'
            }`}
          >
            <ChefHat className="w-4 h-4 mb-0.5" />
            <span>廚房</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-3 rounded-lg ${
              activeTab === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-300/70'
            }`}
          >
            <Store className="w-4 h-4 mb-0.5" />
            <span>管理</span>
          </button>
        </div>
      </div>
    </header>
  );
};
