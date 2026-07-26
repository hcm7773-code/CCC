import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, CreditCard, Banknote, Smartphone, Utensils, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, OrderType, PaymentMethod } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (tbl: string) => void;
  onSubmitOrder: (
    customerName: string,
    customerPhone: string,
    paymentMethod: PaymentMethod,
    notes: string
  ) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  orderType,
  setOrderType,
  tableNumber,
  setTableNumber,
  onSubmitOrder,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('line_pay');
  const [orderNotes, setOrderNotes] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) return;

    if (orderType === 'takeout' && !customerPhone) {
      alert('外帶請輸入聯絡電話，以便餐點做好時通知！');
      return;
    }

    // Fire celebratory confetti canon explosion!
    try {
      // Main burst
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ef4444', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
      });

      // Secondary side cannons
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
        });
      }, 200);
    } catch (err) {
      console.error('Confetti trigger error:', err);
    }

    onSubmitOrder(customerName, customerPhone, paymentMethod, orderNotes);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-amber-100">
        {/* Drawer Header */}
        <div className="p-4 bg-amber-950 text-amber-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg text-amber-100">購物車餐點</h2>
            <span className="text-xs bg-amber-800 text-amber-200 px-2 py-0.5 rounded-full font-medium">
              {cartItems.length} 項
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {cartItems.length > 0 && (
              <button
                onClick={onClearCart}
                className="text-xs text-amber-300 hover:text-red-300 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-amber-300 hover:text-amber-100 rounded-lg hover:bg-amber-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cart Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-3">
              <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-amber-300">
                <Utensils className="w-10 h-10" />
              </div>
              <p className="font-bold text-stone-700 text-base">購物車空空如也</p>
              <p className="text-xs text-stone-400 max-w-xs">
                快去探索我們精心準備的美味餐點，將喜歡的美食加入吧！
              </p>
            </div>
          ) : (
            <>
              {/* Order Items List */}
              <div className="space-y-3 divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-stone-900">{item.menuItem.name}</h4>
                        <div className="text-[11px] text-stone-500 space-y-0.5">
                          {item.selectedOptions.map((opt) => (
                            <span
                              key={opt.choiceId}
                              className="inline-block bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px] mr-1 mb-0.5"
                            >
                              {opt.choiceName}
                              {opt.priceExtra > 0 ? ` (+$${opt.priceExtra})` : ''}
                            </span>
                          ))}
                        </div>
                        {item.specialInstructions && (
                          <p className="text-[10px] text-amber-700 italic">
                            註：{item.specialInstructions}
                          </p>
                        )}
                      </div>

                      <span className="font-bold text-sm text-stone-900">
                        ${item.totalPrice}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-stone-400">單價 ${item.unitPrice}</span>

                      <div className="flex items-center space-x-2 bg-stone-100 px-2 py-1 rounded-lg">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? onUpdateQuantity(item.cartItemId, item.quantity - 1)
                              : onRemoveItem(item.cartItemId)
                          }
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-stone-900 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                          className="text-stone-500 hover:text-stone-900"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-stone-200" />

              {/* Order Info Form */}
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-stone-900">用餐資訊</h3>

                {/* Dine-in vs Takeout Switcher */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setOrderType('dine-in')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      orderType === 'dine-in'
                        ? 'bg-amber-500 text-amber-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    內用 (有桌號)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('takeout')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      orderType === 'takeout'
                        ? 'bg-amber-500 text-amber-950 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    外帶自取
                  </button>
                </div>

                {orderType === 'dine-in' ? (
                  <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                    <span className="font-bold text-amber-900">選擇桌號：</span>
                    <select
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="bg-white border border-amber-300 rounded-lg px-3 py-1 font-bold text-stone-800"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((t) => (
                        <option key={t} value={t.toString()}>
                          {t} 號桌
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="訂購人姓名 (選填)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                    <input
                      type="tel"
                      placeholder="聯絡電話 (必填)*"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div className="space-y-1.5">
                  <label className="font-bold text-xs text-stone-800">付款方式</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'line_pay', name: 'LINE Pay', icon: Smartphone, bg: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
                      { id: 'cash', name: '現金付款', icon: Banknote, bg: 'bg-amber-50 text-amber-800 border-amber-300' },
                      { id: 'credit_card', name: '信用卡', icon: CreditCard, bg: 'bg-blue-50 text-blue-800 border-blue-300' },
                      { id: 'jko_pay', name: '街口支付', icon: Smartphone, bg: 'bg-rose-50 text-rose-800 border-rose-300' },
                    ].map((p) => {
                      const Icon = p.icon;
                      const isSelected = paymentMethod === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPaymentMethod(p.id as PaymentMethod)}
                          className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                            isSelected
                              ? `${p.bg} shadow-xs ring-2 ring-amber-500/50`
                              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{p.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional Order Notes */}
                <div className="space-y-1">
                  <label className="font-bold text-xs text-stone-800">全單備註</label>
                  <input
                    type="text"
                    placeholder="例：不要發票、需要收據..."
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
            <div className="flex items-center justify-between text-stone-900">
              <span className="text-sm font-semibold text-stone-600">小計總額</span>
              <span className="text-2xl font-extrabold text-amber-900">NT$ {subtotal}</span>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold py-3.5 rounded-2xl shadow-lg transition-all active:scale-98"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>確認送出訂單 (${subtotal})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
