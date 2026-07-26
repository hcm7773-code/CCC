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
    unitPrice: number
  ) => {
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
    setIsCartOpen(true);
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
    <div className="min-h-screen bg-amber-50/40 text-stone-900 font-sans flex flex-col selection:bg-amber-300 selection:text-amber-950">
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
      />

      {/* Main Tab Views */}
      <main className="flex-1 pb-16">
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
                <div className="bg-white rounded-3xl p-12 text-center text-stone-400 space-y-2 border border-amber-100 shadow-2xs">
                  <p className="font-bold text-base text-stone-700">找不到符合條件的美味餐點</p>
                  <p className="text-xs text-stone-400">請嘗試更換搜尋關鍵字或分類標籤。</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedTagFilter('all');
                      setSearchQuery('');
                    }}
                    className="mt-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg"
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
                      onSelect={(item) => setSelectedDishForCustom(item)}
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
    </div>
  );
}
