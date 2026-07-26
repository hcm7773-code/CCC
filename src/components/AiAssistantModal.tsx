import React, { useState } from 'react';
import { Bot, Sparkles, Send, Utensils, AlertCircle } from 'lucide-react';
import { MenuItem } from '../types';

interface AiAssistantModalProps {
  menuItems: MenuItem[];
  onQuickAddRecommendation?: (dishName: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  menuItems,
  onQuickAddRecommendation,
}) => {
  const [preference, setPreference] = useState('');
  const [budget, setBudget] = useState('300');
  const [peopleCount, setPeopleCount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRequestAi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setRecommendationResult(null);

    try {
      const response = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPreference: preference || '好吃的熱銷招牌餐點',
          budget: budget ? Number(budget) : undefined,
          peopleCount: peopleCount ? Number(peopleCount) : 1,
          menuItems: menuItems.map((item) => ({
            name: item.name,
            category: item.category,
            price: item.price,
            description: item.description,
            tags: item.tags,
          })),
        }),
      });

      let data;
      if (response.ok) {
        data = await response.json();
        setRecommendationResult(data.recommendation);
      } else {
        // Fallback to client-side smart recommendation engine for static hosting (e.g. GitHub Pages)
        const budgetNum = budget ? Number(budget) : 300;
        const peopleNum = peopleCount ? Number(peopleCount) : 1;
        const prefLower = (preference || '').toLowerCase();

        // Pick items fitting budget and preferences
        const matchedItems = menuItems.filter(item => item.isAvailable);
        let selectedDishes: MenuItem[] = [];
        let currentTotal = 0;

        // Try to match category/tags
        const mainDishes = matchedItems.filter(i => i.category === 'mains' || i.category === 'noodles');
        const sideDishes = matchedItems.filter(i => i.category === 'sides');
        const drinks = matchedItems.filter(i => i.category === 'drinks');

        if (mainDishes.length > 0) {
          const main = mainDishes.find(i => prefLower && (i.name.toLowerCase().includes(prefLower) || i.description.toLowerCase().includes(prefLower))) || mainDishes[0];
          selectedDishes.push(main);
          currentTotal += main.price;
        }

        if (drinks.length > 0 && currentTotal + drinks[0].price <= budgetNum) {
          selectedDishes.push(drinks[0]);
          currentTotal += drinks[0].price;
        }

        if (sideDishes.length > 0 && currentTotal + sideDishes[0].price <= budgetNum) {
          selectedDishes.push(sideDishes[0]);
          currentTotal += sideDishes[0].price;
        }

        if (selectedDishes.length === 0) {
          selectedDishes = matchedItems.slice(0, 2);
          currentTotal = selectedDishes.reduce((a, b) => a + b.price, 0);
        }

        const fallbackText = `💡 【阿達師 GitHub Pages 靜態體驗專屬建議】\n\n根據您的需求（${peopleNum} 人用餐 / 預算約 NT$ ${budgetNum} / 偏好：「${preference || '精選美食'}」），推薦以下餐點：\n\n` +
          selectedDishes.map((d, idx) => `${idx + 1}. **${d.name}** - NT$ ${d.price}\n   └ ${d.description.slice(0, 40)}...`).join('\n\n') +
          `\n\n💰 **預估總金額：NT$ ${currentTotal}**\n\n✨ 祝您用餐愉快！如果有需要調整辣度或冰量，可在點餐時自由選擇選項哦！`;

        setRecommendationResult(fallbackText);
      }
    } catch (err: any) {
      console.error(err);
      // Fallback response for offline or CORS or 404 static hosting
      const budgetNum = budget ? Number(budget) : 300;
      const matched = menuItems.filter(i => i.price <= budgetNum && i.isAvailable).slice(0, 3);
      const fallbackText = `💡 【阿達師 智慧點餐建議】\n\n為您挑選了適合預算 NT$ ${budgetNum} 的人氣美味：\n\n` +
        matched.map((d, idx) => `${idx + 1}. **${d.name}** - NT$ ${d.price}\n   └ ${d.description}`).join('\n\n') +
        `\n\n✨ 請到選單加入購物車享用！`;
      setRecommendationResult(fallbackText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero Title */}
      <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-amber-50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-800/60">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>智能點餐大師 阿達師</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
            選擇困難症？讓 AI 為您推薦專屬美味組合！
          </h2>

          <p className="text-xs sm:text-sm text-amber-200/80 max-w-xl leading-relaxed">
            輸入您的預算、口味偏好（例如：想吃辣、想找素食、高蛋白質低卡、多人聚餐配菜組合），阿達師會為您搭配最佳餐點組合！
          </p>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-sm space-y-5">
        <form onSubmit={handleRequestAi} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1 md:col-span-1">
              <label className="font-bold text-xs text-stone-700">用餐預算上限 (NT$)</label>
              <input
                type="number"
                placeholder="例如：300"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold text-stone-800"
              />
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="font-bold text-xs text-stone-700">用餐人數</label>
              <select
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-bold text-stone-800"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} 人用餐
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 md:col-span-1">
              <label className="font-bold text-xs text-stone-700">快速選擇偏好</label>
              <div className="flex flex-wrap gap-1">
                {['招牌熱銷', '微辣好滋味', '清淡低卡', '飽足感十足', '奶茶甜點控'].map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setPreference(pref)}
                    className="text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-900 px-2 py-1 rounded-lg border border-amber-200"
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-xs text-stone-700">具體口味偏好或飲食限制</label>
            <input
              type="text"
              placeholder="例如：想吃牛肉、不要太油膩，順便配一杯微糖奶茶..."
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-sm text-stone-800 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold py-3.5 rounded-2xl shadow-md transition-all active:scale-98 disabled:opacity-60"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-amber-950 border-t-transparent rounded-full animate-spin" />
                <span>阿達師正在翻看菜單思考中...</span>
              </div>
            ) : (
              <>
                <Bot className="w-5 h-5" />
                <span>產生專屬點餐建議</span>
                <Send className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Result Card */}
      {recommendationResult && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center space-x-2 text-amber-950 border-b border-amber-200 pb-3">
            <Utensils className="w-5 h-5 text-amber-600" />
            <h3 className="font-extrabold text-base">阿達師為您推薦的夢幻組合：</h3>
          </div>

          <div className="whitespace-pre-wrap text-sm text-stone-800 leading-relaxed font-sans">
            {recommendationResult}
          </div>
        </div>
      )}
    </div>
  );
};
