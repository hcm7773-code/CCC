import React, { useState } from 'react';
import { X, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { MenuItem, SelectedOption } from '../types';

interface DishCustomModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (
    item: MenuItem,
    quantity: number,
    selectedOptions: SelectedOption[],
    specialInstructions: string,
    unitPrice: number,
    e?: React.MouseEvent
  ) => void;
}

export const DishCustomModal: React.FC<DishCustomModalProps> = ({
  item,
  onClose,
  onAddToCart,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Default selections map
  const [selectedMap, setSelectedMap] = useState<{ [groupId: string]: SelectedOption[] }>(() => {
    const initial: { [groupId: string]: SelectedOption[] } = {};
    if (item.optionGroups) {
      item.optionGroups.forEach((group) => {
        if (group.required && group.choices.length > 0) {
          // Select first option by default for required groups
          initial[group.id] = [
            {
              groupId: group.id,
              groupName: group.name,
              choiceId: group.choices[0].id,
              choiceName: group.choices[0].name,
              priceExtra: group.choices[0].priceExtra,
            },
          ];
        } else {
          initial[group.id] = [];
        }
      });
    }
    return initial;
  });

  // Calculate unit price with options
  let optionsExtra = 0;
  (Object.values(selectedMap) as SelectedOption[][]).forEach((options) => {
    options.forEach((opt) => {
      optionsExtra += opt.priceExtra;
    });
  });

  const unitPrice = item.price + optionsExtra;
  const totalPrice = unitPrice * quantity;

  const handleSelectOption = (
    groupId: string,
    groupName: string,
    choiceId: string,
    choiceName: string,
    priceExtra: number,
    required: boolean,
    maxSelect?: number
  ) => {
    setSelectedMap((prev) => {
      const currentList = prev[groupId] || [];

      if (required) {
        // Single choice replacement
        return {
          ...prev,
          [groupId]: [
            {
              groupId,
              groupName,
              choiceId,
              choiceName,
              priceExtra,
            },
          ],
        };
      } else {
        // Multi-choice toggle or maxSelect check
        const exists = currentList.some((c) => c.choiceId === choiceId);
        if (exists) {
          return {
            ...prev,
            [groupId]: currentList.filter((c) => c.choiceId !== choiceId),
          };
        } else {
          if (maxSelect && currentList.length >= maxSelect) {
            return prev;
          }
          return {
            ...prev,
            [groupId]: [
              ...currentList,
              {
                groupId,
                groupName,
                choiceId,
                choiceName,
                priceExtra,
              },
            ],
          };
        }
      }
    });
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    // Validate required groups
    if (item.optionGroups) {
      for (const group of item.optionGroups) {
        if (group.required && (!selectedMap[group.id] || selectedMap[group.id].length === 0)) {
          alert(`請選擇「${group.name}」`);
          return;
        }
      }
    }

    const allOptions: SelectedOption[] = [];
    (Object.values(selectedMap) as SelectedOption[][]).forEach((list) => {
      allOptions.push(...list);
    });

    onAddToCart(item, quantity, allOptions, specialInstructions, unitPrice, e);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-amber-100">
        {/* Header Photo */}
        <div className="relative h-48 bg-stone-200">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-stone-900/60 hover:bg-stone-900 text-white rounded-full p-2 backdrop-blur-md transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dish Info */}
        <div className="p-5 border-b border-stone-100 space-y-1">
          <h2 className="text-xl font-bold text-stone-900">{item.name}</h2>
          <p className="text-xs text-stone-500 leading-relaxed">{item.description}</p>
          <div className="pt-2 flex items-baseline space-x-1">
            <span className="text-sm font-semibold text-amber-700">單價 NT$</span>
            <span className="text-2xl font-extrabold text-stone-900">{unitPrice}</span>
            {optionsExtra > 0 && (
              <span className="text-xs text-amber-600 ml-2"> (含加購 +${optionsExtra})</span>
            )}
          </div>
        </div>

        {/* Options List Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {item.optionGroups &&
            item.optionGroups.map((group) => {
              const currentSelections = selectedMap[group.id] || [];

              return (
                <div key={group.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                      <span>{group.name}</span>
                      {group.required && (
                        <span className="text-[10px] bg-red-100 text-red-600 font-extrabold px-1.5 py-0.5 rounded">
                          必填
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-stone-400">
                      {group.required
                        ? '單選'
                        : group.maxSelect
                        ? `可複選 (最多 ${group.maxSelect} 項)`
                        : '可複選'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {group.choices.map((choice) => {
                      const isSelected = currentSelections.some((c) => c.choiceId === choice.id);

                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() =>
                            handleSelectOption(
                              group.id,
                              group.name,
                              choice.id,
                              choice.name,
                              choice.priceExtra,
                              group.required,
                              group.maxSelect
                            )
                          }
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs text-left transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-2xs'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected
                                  ? 'border-amber-600 bg-amber-500 text-amber-950'
                                  : 'border-stone-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span>{choice.name}</span>
                          </div>

                          {choice.priceExtra > 0 && (
                            <span className="text-amber-700 font-semibold">+${choice.priceExtra}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

          {/* Special Instructions Note */}
          <div className="space-y-1.5">
            <label className="font-bold text-sm text-stone-800">特殊備註 (選填)</label>
            <input
              type="text"
              placeholder="例：醬少、飯分離、不要蔥蒜..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Quantity & Action */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-2xl border border-stone-200 shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-extrabold text-stone-900 text-base w-6 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={(e) => handleSubmit(e)}
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold py-3 rounded-2xl shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>加入購物車 NT${totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
