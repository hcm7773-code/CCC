import React from 'react';
import { X, Clock, CheckCircle2, ChefHat, Utensils, AlertCircle } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackerModalProps {
  orders: Order[];
  onClose: () => void;
  onNewOrder: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  orders,
  onClose,
  onNewOrder,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-amber-100">
        {/* Header */}
        <div className="p-4 bg-amber-950 text-amber-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-lg text-amber-100">我的訂單狀態</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-300 hover:text-amber-100 rounded-lg hover:bg-amber-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {orders.length === 0 ? (
            <div className="text-center py-10 text-stone-400 space-y-3">
              <AlertCircle className="w-12 h-12 mx-auto text-amber-300" />
              <p className="font-bold text-stone-600">尚無進行中的訂單</p>
              <button
                onClick={onNewOrder}
                className="bg-amber-500 text-amber-950 font-bold px-4 py-2 rounded-xl text-xs"
              >
                前往點餐
              </button>
            </div>
          ) : (
            orders.map((ord) => {
              const statusSteps = [
                { key: 'pending', label: '已收到訂單', icon: Clock },
                { key: 'preparing', label: '廚房製作中', icon: ChefHat },
                { key: 'ready', label: ord.orderType === 'dine-in' ? '餐點準備好了/出餐' : '請至櫃檯取餐', icon: Utensils },
                { key: 'completed', label: '已完成', icon: CheckCircle2 },
              ];

              const currentStepIndex = statusSteps.findIndex((s) => s.key === ord.status);

              return (
                <div
                  key={ord.id}
                  className="bg-stone-50 border border-amber-200/70 rounded-2xl p-4 space-y-4 shadow-2xs"
                >
                  {/* Order Top Bar */}
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-amber-800 text-amber-50 text-xs font-extrabold px-2 py-0.5 rounded-md">
                          單號 #{ord.orderNumber}
                        </span>
                        <span className="text-xs font-semibold text-stone-600">
                          {ord.orderType === 'dine-in' ? `桌號 ${ord.tableNumber} 號` : '外帶自取'}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-0.5">
                        {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-extrabold text-stone-900">
                        NT$ {ord.totalAmount}
                      </span>
                      <p className="text-[10px] text-emerald-600 font-bold">
                        {ord.isPaid ? '已付款' : '未付款'}
                      </p>
                    </div>
                  </div>

                  {/* Status Progress Stepper */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      {statusSteps.map((step, idx) => {
                        const Icon = step.icon;
                        const isDone = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step.key} className="flex flex-col items-center flex-1 text-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all ${
                                isCurrent
                                  ? 'bg-amber-500 text-amber-950 font-bold ring-4 ring-amber-200 animate-pulse'
                                  : isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-200 text-stone-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span
                              className={`text-[10px] ${
                                isCurrent
                                  ? 'font-bold text-amber-900'
                                  : isDone
                                  ? 'font-medium text-stone-700'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Item Summary */}
                  <div className="bg-white rounded-xl p-3 text-xs space-y-1.5 border border-stone-200">
                    <p className="font-bold text-stone-800 border-b border-stone-100 pb-1">餐點內容：</p>
                    {ord.items.map((item) => (
                      <div key={item.cartItemId} className="flex items-center justify-between text-stone-700">
                        <span>
                          {item.menuItem.name} x {item.quantity}
                        </span>
                        <span className="text-stone-500">${item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
          <button
            onClick={onNewOrder}
            className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold py-2.5 rounded-xl text-sm transition-all"
          >
            + 繼續點選其他餐點
          </button>
        </div>
      </div>
    </div>
  );
};
