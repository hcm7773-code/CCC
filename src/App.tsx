import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MenuCategoryNav } from './components/MenuCategoryNav';
import { MenuItemCard } from './components/MenuItemCard';
import { DishCustomModal } from './components/DishCustomModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { KitchenDashboard } from './components/KitchenDashboard';
import { AdminPanel } from './components/AdminPanel';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LateNightParticles } from './components/LateNightParticles';
import { LiveReviewsMarquee } from './components/LiveReviewsMarquee';
import { FlyingCartAnimation, FlyingParticle } from './components/FlyingCartAnimation';

import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_ORDERS,
} from './data/initialData';
import {
  MenuItem,
  CartItem,
  Order,
  OrderType,
  OrderStatus,
  PaymentMethod,
  SelectedOption,
} from './types';
import { playOrderAlertSound } from './utils/sound';

export default function App() {
  const [activeTab, setActiveTab] = useState<'customer' | 'kitchen' | 'admin' | 'ai'>('customer');
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [tableNumber, setTableNumber] = useState('1');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Late Night Bistro mode state
  const [isLateNightMode, setIsLateNightMode] = useState<boolean>(() => {
    return localStorage.getItem('app_late_night_mode') === 'true';
  });

  // Parabolic flying particles state
  const [flyingParticles, setFlyingParticles] = useState<FlyingParticle[]>([]);

  const triggerFlyAnimation = (e: React.MouseEvent | HTMLElement | undefined, image?: string) => {
    let startX = window.innerWidth / 2;
    let startY = window.innerHeight / 2;

    if (e && 'clientX' in e) {
      startX = e.clientX;
      startY = e.clientY;
    } else if (e && 'getBoundingClientRect' in e) {
      const rect = (e as HTMLElement).getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
    }

    const cartBtn = document.getElementById('cart-trigger-btn');
    let endX = window.innerWidth - 60;
    let endY = 30;

    if (cartBtn) {
      const cartRect = cartBtn.getBoundingClientRect();
      endX = cartRect.left + cartRect.width / 2;
      endY = cartRect.top + cartRect.height / 2;
    }

    const particle: FlyingParticle = {
      id: Math.random().toString(36).substring(2, 9),
      startX,
      startY,
      endX,
      endY,
      image,
      startTime: Date.now(),
    };

    setFlyingParticles((prev) => [...prev, particle]);

    setTimeout(() => {
      if (cartBtn) {
        cartBtn.classList.add('animate-bounce');
        setTimeout(() => {
          cartBtn.classList.remove('animate-bounce');
        }, 500);
      }
    }, 650);
  };

  useEffect(() => {
    localStorage.setItem('app_late_night_mode', String(isLateNightMode));
  }, [isLateNightMode]);

  // Persistent state initialized from localStorage
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('app_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('app_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('app_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Modals
  const [selectedDishForCustom, setSelectedDishForCustom] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderTrackerOpen, setIsOrderTrackerOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('app_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('app_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('app_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart actions
  const handleAddToCart = (
    item: MenuItem,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions: string,
    unitPrice: number,
    e?: React.MouseEvent
  ) => {
    triggerFlyAnimation(e, item.image);

    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: CartItem = {
      cartItemId,
      menuItem: item,
      quantity,
      selectedOptions,
      specialInstructions,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCartItems((prev) => [...prev, newItem]);
  };

  const handleSelectDish = (item: MenuItem, e?: React.MouseEvent) => {
    if (item.optionGroups && item.optionGroups.length > 0) {
      setSelectedDishForCustom(item);
    } else {
      handleAddToCart(item, 1, [], '', item.price, e);
    }
  };

  const handleUpdateCartQuantity = (cartItemId: string, newQty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQty, totalPrice: item.unitPrice * newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Order submission
  const handleSubmitOrder = (
    customerName: string,
    customerPhone: string,
    paymentMethod: PaymentMethod,
    notes: string
  ) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
    const orderNumPrefix = orderType === 'dine-in' ? `A` : `T`;
    const orderNumRandom = Math.floor(Math.random() * 90 + 10); // e.g. A05, T22

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `${orderNumPrefix}${orderNumRandom}`,
      orderType,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      customerName: orderType === 'takeout' ? customerName : undefined,
      customerPhone: orderType === 'takeout' ? customerPhone : undefined,
      items: cartItems,
      subtotal,
      discount: 0,
      totalAmount: subtotal,
      status: 'pending',
      paymentMethod,
      isPaid: true,
      createdAt: new Date().toISOString(),
      notes,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setIsOrderTrackerOpen(true);
    playOrderAlertSound();
  };

  // Kitchen order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Admin menu management
  const handleToggleAvailability = (itemId: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItems((prev) => [newItem, ...prev]);
  };

  const handleDeleteMenuItem = (itemId: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Filter menu items for customer view
  const filteredMenuItems = menuItems.filter((item) => {
    // Category check
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    // Tag check
    if (selectedTagFilter !== 'all') {
      if (!item.tags || !item.tags.includes(selectedTagFilter)) {
        return false;
      }
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  const cartTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const activeOrdersCount = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;

  return (
    <div className={`min-h-screen font-sans flex flex-col transition-colors duration-700 relative ${
      isLateNightMode
        ? 'bg-stone-950 text-amber-50 selection:bg-amber-400 selection:text-stone-950'
        : 'bg-amber-50/40 text-stone-900 selection:bg-amber-300 selection:text-amber-950'
    }`}>
      {/* Ambient Floating Particle Effect in Late Night Bistro Mode */}
      {isLateNightMode && <LateNightParticles />}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orderType={orderType}
        setOrderType={setOrderType}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        activeOrdersCount={activeOrdersCount}
        onOpenOrderTracker={() => setIsOrderTrackerOpen(true)}
        isLateNightMode={isLateNightMode}
        setIsLateNightMode={setIsLateNightMode}
      />

      {/* Main Tab Views */}
      <main className="flex-1 pb-24 z-10">
        {activeTab === 'customer' && (
          <div>
            {/* Menu Category & Filter Bar */}
            <MenuCategoryNav
              categories={INITIAL_CATEGORIES}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedTagFilter={selectedTagFilter}
              setSelectedTagFilter={setSelectedTagFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            {/* Menu Items Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {filteredMenuItems.length === 0 ? (
                <div className={`rounded-3xl p-12 text-center space-y-2 border shadow-2xs ${
                  isLateNightMode
                    ? 'bg-stone-900/80 border-amber-500/20 text-amber-200/60'
                    : 'bg-white border-amber-100 text-stone-400'
                }`}>
                  <p className={`font-bold text-base ${isLateNightMode ? 'text-amber-100' : 'text-stone-700'}`}>
                    找不到符合條件的美味餐點
                  </p>
                  <p className="text-xs">請嘗試更換搜尋關鍵字或分類標籤。</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedTagFilter('all');
                      setSearchQuery('');
                    }}
                    className={`mt-2 text-xs font-bold px-3 py-1.5 rounded-lg ${
                      isLateNightMode
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'text-amber-800 bg-amber-100'
                    }`}
                  >
                    重置所有篩選
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredMenuItems.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onSelect={(item, e) => handleSelectDish(item, e)}
                      isLateNightMode={isLateNightMode}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <AiAssistantModal menuItems={menuItems} />
        )}

        {activeTab === 'kitchen' && (
          <KitchenDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            menuItems={menuItems}
            categories={INITIAL_CATEGORIES}
            orders={orders}
            onToggleAvailability={handleToggleAvailability}
            onAddMenuItem={handleAddMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
          />
        )}
      </main>

      {/* Item Customization Modal */}
      <DishCustomModal
        item={selectedDishForCustom}
        onClose={() => setSelectedDishForCustom(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        orderType={orderType}
        setOrderType={setOrderType}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Customer Active Orders Progress Tracker */}
      {isOrderTrackerOpen && (
        <OrderTrackerModal
          orders={orders}
          onClose={() => setIsOrderTrackerOpen(false)}
          onNewOrder={() => {
            setIsOrderTrackerOpen(false);
            setActiveTab('customer');
          }}
        />
      )}

      {/* Live Customer Feedback Marquee Ticker */}
      <LiveReviewsMarquee isLateNightMode={isLateNightMode} />

      {/* Flying Parabolic Cart Animation */}
      <FlyingCartAnimation
        particles={flyingParticles}
        onParticleComplete={(id) =>
          setFlyingParticles((prev) => prev.filter((p) => p.id !== id))
        }
      />
    </div>
  );
}
