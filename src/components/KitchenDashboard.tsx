import React, { useState } from 'react';
import { ChefHat, Clock, CheckCircle2, AlertCircle, Volume2, ArrowRight } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { playOrderAlertSound } from '../utils/sound';

interface KitchenDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const KitchenDashboard: React.FC<KitchenDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const [statusFilter, setStatusFilter] = useState<'active' | 'completed' | 'all'>('active');

  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const filteredOrders =
    statusFilter === 'active'
      ? activeOrders
      : statusFilter === 'completed'
      ? completedOrders
      : orders;

  const handleStatusAdvance = (order: Order) => {
    let nextStatus: OrderStatus = 'preparing';
    if (order.status === 'pending') nextStatus = 'preparing';
    else if (order.status === 'preparing') nextStatus = 'ready';
    else if (order.status === 'ready') nextStatus = 'completed';

    playOrderAlertSound();
    onUpdateOrderStatus(order.id, nextStatus);
  };

  const getElapsedTimeText = (isoString: string) => {
    const mins = Math.floor((Date.now() - new Date(isoString).getTime()) / 60000);
    if (mins < 1) return '剛剛下單';
    return `${mins} 分鐘前`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-950 text-amber-50 p-5 rounded-2xl shadow-md border border-amber-900">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500 text-amber-950 rounded-xl font-bold">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-100 flex items-center gap-2">
              廚房即時接單與出餐看板
              <span className="text-xs bg-amber-500/20 text-amber-300 font-normal px-2 py-0.5 rounded-full border border-amber-500/30">
                即時連線中
              </span>
            </h2>
            <p className="text-xs text-amber-300/80">請依序製作並更新訂單狀態</p>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-2 bg-amber-900/60 p-1.5 rounded-xl border border-amber-800/60 text-xs">
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'active'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'text-amber-200 hover:text-amber-100'
            }`}
          >
            製作中/待處理 ({activeOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'completed'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'text-amber-200 hover:text-amber-100'
            }`}
          >
            已完成 ({completedOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-amber-500 text-amber-950 shadow-xs'
                : 'text-amber-200 hover:text-amber-100'
            }`}
          >
            全部訂單 ({orders.length})
          </button>
          <button
            onClick={() => playOrderAlertSound()}
            className="p-1.5 bg-amber-800 hover:bg-amber-700 text-amber-200 rounded-lg ml-2"
            title="測試提示音"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-stone-400 space-y-3 border border-amber-100">
          <CheckCircle2 className="w-12 h-12 mx-auto text-emerald-500" />
          <h3 className="text-lg font-bold text-stone-700">目前沒有相關訂單</h3>
          <p className="text-xs text-stone-400">當顧客下單時，即時訂單卡片將會自動顯示於此。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOrders.map((ord) => {
            const isPending = ord.status === 'pending';
            const isPreparing = ord.status === 'preparing';
            const isReady = ord.status === 'ready';

            return (
              <div
                key={ord.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm flex flex-col justify-between ${
                  isPending
                    ? 'border-red-400 ring-2 ring-red-200'
                    : isPreparing
                    ? 'border-amber-400 ring-2 ring-amber-200'
                    : isReady
                    ? 'border-emerald-400'
                    : 'border-stone-200 opacity-75'
                }`}
              >
                {/* Header */}
                <div
                  className={`p-3.5 flex items-center justify-between text-xs font-bold ${
                    isPending
                      ? 'bg-red-500 text-white'
                      : isPreparing
                      ? 'bg-amber-500 text-amber-950'
                      : isReady
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-extrabold px-2 py-0.5 bg-black/20 rounded">
                      #{ord.orderNumber}
                    </span>
                    <span>
                      {ord.orderType === 'dine-in' ? `[內用] 桌號 ${ord.tableNumber}` : `[外帶自取]`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{getElapsedTimeText(ord.createdAt)}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1">
                  {/* Notes if any */}
                  {ord.notes && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>全單備註：{ord.notes}</span>
                    </div>
                  )}

                  {/* Customer Contact for Takeout */}
                  {ord.orderType === 'takeout' && (ord.customerName || ord.customerPhone) && (
                    <div className="text-xs text-stone-600 bg-stone-50 p-2 rounded-lg border border-stone-200">
                      顧客：{ord.customerName || '未留姓名'} ({ord.customerPhone || '無電話'})
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-stone-50 border border-stone-200/80 rounded-xl p-2.5 space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-sm text-stone-900">
                          <span>{item.menuItem.name}</span>
                          <span className="text-amber-800 text-base font-black bg-amber-100 px-2 py-0.5 rounded-md">
                            x{item.quantity}
                          </span>
                        </div>

                        {/* Selected Options */}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <div className="flex flex-wrap gap-1 text-[11px]">
                            {item.selectedOptions.map((opt) => (
                              <span
                                key={opt.choiceId}
                                className="bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.5 rounded"
                              >
                                {opt.choiceName}
                              </span>
                            ))}
                          </div>
                        )}

                        {item.specialInstructions && (
                          <p className="text-[11px] text-red-600 font-bold italic">
                            備註：{item.specialInstructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action Button */}
                <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="text-xs text-stone-500">
                    <div>金額: NT${ord.totalAmount}</div>
                    <div className="text-[10px] text-stone-400">({ord.paymentMethod.toUpperCase()})</div>
                  </div>

                  {ord.status !== 'completed' && ord.status !== 'cancelled' ? (
                    <button
                      onClick={() => handleStatusAdvance(ord)}
                      className={`flex items-center space-x-1.5 font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-xs transition-all active:scale-95 ${
                        isPending
                          ? 'bg-amber-500 hover:bg-amber-400 text-amber-950'
                          : isPreparing
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <span>
                        {isPending
                          ? '開始製作'
                          : isPreparing
                          ? '完成出餐'
                          : '結案/完成'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      已完成
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
