import React, { useState } from 'react';
import { Store, Plus, Edit2, Trash2, CheckCircle2, TrendingUp, DollarSign, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import { MenuItem, Order, Category } from '../types';

interface AdminPanelProps {
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
  onToggleAvailability: (itemId: string) => void;
  onAddMenuItem: (newItem: MenuItem) => void;
  onDeleteMenuItem: (itemId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  menuItems,
  categories,
  orders,
  onToggleAvailability,
  onAddMenuItem,
  onDeleteMenuItem,
}) => {
  const [activeTab, setActiveTab] = useState<'menu' | 'analytics'>('menu');

  // Add Item Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[1]?.id || 'mains');
  const [price, setPrice] = useState('120');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [tagInput, setTagInput] = useState('熱銷,店長推薦');

  // Analytics calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed' || o.status === 'ready').length;

  // Item sales tally
  const salesMap: { [dishName: string]: { count: number; total: number } } = {};
  orders.forEach((o) => {
    o.items.forEach((item) => {
      const dishName = item.menuItem.name;
      if (!salesMap[dishName]) {
        salesMap[dishName] = { count: 0, total: 0 };
      }
      salesMap[dishName].count += item.quantity;
      salesMap[dishName].total += item.totalPrice;
    });
  });

  const sortedTopDishes = Object.entries(salesMap)
    .map(([dishName, data]) => ({ name: dishName, ...data }))
    .sort((a, b) => b.count - a.count);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const tagsArr = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name,
      category,
      price: Number(price) || 100,
      description: description || '新鮮烹調特製佳餚。',
      image:
        image ||
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      tags: tagsArr,
      isAvailable: true,
    };

    onAddMenuItem(newItem);
    setShowAddModal(false);
    setName('');
    setDescription('');
    setImage('');
    alert('成功新增菜單項目！');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 text-stone-100 p-5 rounded-2xl shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500 text-amber-950 rounded-xl font-bold">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">店家管理與營運分析</h2>
            <p className="text-xs text-stone-400">上下架菜單、新增品項與查看銷售數據</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center space-x-2 bg-stone-800 p-1.5 rounded-xl border border-stone-700 text-xs">
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'menu' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-300'
            }`}
          >
            菜單管理 ({menuItems.length}項)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              activeTab === 'analytics' ? 'bg-amber-500 text-stone-950 shadow-xs' : 'text-stone-300'
            }`}
          >
            營運數據報表
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-lg">品項列表與狀態</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>新增菜單項目</span>
            </button>
          </div>

          {/* Menu Table/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                  />
                  <div className="space-y-1 min-w-0">
                    <h4 className="font-bold text-stone-900 text-sm truncate">{item.name}</h4>
                    <span className="text-amber-800 font-extrabold text-sm block">
                      NT$ {item.price}
                    </span>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isAvailable
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {item.isAvailable ? '販售中' : '已停售/售完'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => onToggleAvailability(item.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      item.isAvailable
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                    }`}
                    title={item.isAvailable ? '設定為售完' : '恢復上架販售'}
                  >
                    {item.isAvailable ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`確定要刪除「${item.name}」嗎？`)) {
                        onDeleteMenuItem(item.id);
                      }
                    }}
                    className="p-2 rounded-xl text-xs text-red-600 hover:bg-red-50 transition-all"
                    title="刪除品項"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Analytics View */
        <div className="space-y-6">
          {/* Stat Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>營業總收入</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-stone-900">NT$ {totalRevenue}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>累計訂單總數</span>
                <ShoppingBag className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-extrabold text-stone-900">{totalOrdersCount} 筆</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>出餐完成率</span>
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-stone-900">
                {totalOrdersCount > 0
                  ? `${Math.round((completedOrdersCount / totalOrdersCount) * 100)}%`
                  : '0%'}
              </p>
            </div>
          </div>

          {/* Top Selling Items */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
            <h3 className="font-bold text-stone-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              <span>熱銷餐點排行榜</span>
            </h3>

            {sortedTopDishes.length === 0 ? (
              <p className="text-xs text-stone-400">尚無銷售統計資料。</p>
            ) : (
              <div className="space-y-3">
                {sortedTopDishes.slice(0, 5).map((dish, idx) => (
                  <div
                    key={dish.name}
                    className="flex items-center justify-between p-3 bg-stone-50 rounded-xl text-xs border border-stone-100"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full bg-amber-500 text-amber-950 font-black flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-stone-900 text-sm">{dish.name}</span>
                    </div>

                    <div className="text-right space-x-3">
                      <span className="font-bold text-stone-700">銷售 {dish.count} 份</span>
                      <span className="font-extrabold text-amber-900">小計 NT${dish.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for adding new menu item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-amber-100">
            <h3 className="font-bold text-lg text-stone-900 border-b border-stone-100 pb-2">
              新增菜單餐點
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700">餐點名稱*</label>
                <input
                  type="text"
                  required
                  placeholder="例如：特製照燒雞腿飯"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700">分類</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  >
                    {categories
                      .filter((c) => c.id !== 'all')
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700">價格 (NT$)*</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700">餐點簡介描述</label>
                <textarea
                  placeholder="寫些吸引人的口味簡介..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl h-16"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">圖片網址 (Unsplash 或圖片連結)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700">特色標籤 (用逗號隔開)</label>
                <input
                  type="text"
                  placeholder="店長推薦,熱銷,辣味"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-bold rounded-xl"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-amber-950 font-bold rounded-xl shadow-xs"
                >
                  確認新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
