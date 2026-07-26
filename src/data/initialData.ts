import { Category, MenuItem, Order } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'all', name: '全部餐點', icon: 'Utensils' },
  { id: 'mains', name: '經典主餐', icon: 'Drumstick' },
  { id: 'noodles', name: '麵食湯品', icon: 'Soup' },
  { id: 'sides', name: '人氣小吃', icon: 'Popcorn' },
  { id: 'drinks', name: '特調飲品', icon: 'Coffee' },
  { id: 'desserts', name: '精緻甜點', icon: 'IceCream' },
];

export const COMMON_OPTION_GROUPS = {
  SPICE_LEVEL: {
    id: 'spice',
    name: '辣度選擇',
    required: true,
    choices: [
      { id: 's0', name: '不辣', priceExtra: 0 },
      { id: 's1', name: '微辣', priceExtra: 0 },
      { id: 's2', name: '小辣', priceExtra: 0 },
      { id: 's3', name: '中辣', priceExtra: 0 },
      { id: 's4', name: '大辣', priceExtra: 0 },
    ],
  },
  RICE_OPTION: {
    id: 'rice',
    name: '主食升級',
    required: false,
    choices: [
      { id: 'r0', name: '正常白飯', priceExtra: 0 },
      { id: 'r1', name: '飯少', priceExtra: 0 },
      { id: 'r2', name: '加飯 (大碗)', priceExtra: 15 },
      { id: 'r3', name: '換健康藜麥飯', priceExtra: 20 },
    ],
  },
  DRINK_SUGAR: {
    id: 'sugar',
    name: '甜度調整',
    required: true,
    choices: [
      { id: 'g0', name: '無糖 (0%)', priceExtra: 0 },
      { id: 'g1', name: '微糖 (30%)', priceExtra: 0 },
      { id: 'g2', name: '半糖 (50%)', priceExtra: 0 },
      { id: 'g3', name: '少糖 (70%)', priceExtra: 0 },
      { id: 'g4', name: '正常糖 (100%)', priceExtra: 0 },
    ],
  },
  DRINK_ICE: {
    id: 'ice',
    name: '冰量調整',
    required: true,
    choices: [
      { id: 'i0', name: '去冰', priceExtra: 0 },
      { id: 'i1', name: '微冰', priceExtra: 0 },
      { id: 'i2', name: '少冰', priceExtra: 0 },
      { id: 'i3', name: '正常冰', priceExtra: 0 },
      { id: 'i4', name: '熱飲', priceExtra: 0 },
    ],
  },
  ADD_TOPPINGS: {
    id: 'toppings',
    name: '美味加購',
    required: false,
    maxSelect: 3,
    choices: [
      { id: 't1', name: '黃金溏心蛋', priceExtra: 25 },
      { id: 't2', name: '香濃起司片', priceExtra: 20 },
      { id: 't3', name: '手作泡菜', priceExtra: 30 },
      { id: 't4', name: '特製香辣醬', priceExtra: 10 },
    ],
  },
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: '秘製台式紅燒牛肉麵',
    category: 'noodles',
    price: 220,
    description: '嚴選紐西蘭牛腱肉，搭配獨門八角桂皮慢火熬煮8小時高湯，肉質軟嫩入味，附手工Q彈粗麵。',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    tags: ['店長推薦', '熱銷', '招牌'],
    isAvailable: true,
    optionGroups: [
      COMMON_OPTION_GROUPS.SPICE_LEVEL,
      {
        id: 'noodle_type',
        name: '麵條選擇',
        required: true,
        choices: [
          { id: 'nt1', name: '家常手工粗麵', priceExtra: 0 },
          { id: 'nt2', name: '細拉麵', priceExtra: 0 },
          { id: 'nt3', name: '冬粉', priceExtra: 0 },
        ],
      },
      COMMON_OPTION_GROUPS.ADD_TOPPINGS,
    ],
  },
  {
    id: 'm2',
    name: '招牌黃金酥炸雞排便當',
    category: 'mains',
    price: 150,
    description: '特選溫體雞胸肉特調醬汁醃漬，外皮金黃酥脆多汁，附當日三樣時令蔬菜與溏心蛋。',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
    tags: ['熱銷', '超值'],
    isAvailable: true,
    optionGroups: [
      COMMON_OPTION_GROUPS.RICE_OPTION,
      COMMON_OPTION_GROUPS.SPICE_LEVEL,
      COMMON_OPTION_GROUPS.ADD_TOPPINGS,
    ],
  },
  {
    id: 'm3',
    name: '日式厚切豬排咖哩飯',
    category: 'mains',
    price: 180,
    description: '熟成里肌肉酥炸至外酥內嫩，淋上濃郁日式甘口咖哩醬與馬鈴薯紅蘿蔔，香氣四溢。',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80',
    tags: ['店長推薦'],
    isAvailable: true,
    optionGroups: [
      COMMON_OPTION_GROUPS.RICE_OPTION,
      COMMON_OPTION_GROUPS.SPICE_LEVEL,
      COMMON_OPTION_GROUPS.ADD_TOPPINGS,
    ],
  },
  {
    id: 'm4',
    name: '川味老幹媽麻婆豆腐燴飯',
    category: 'mains',
    price: 135,
    description: '四川大紅袍花椒與大頭菜爆香，搭配滑嫩嫩豆腐與台灣豬絞肉，麻辣鮮香超級下飯！',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    tags: ['辣味'],
    isAvailable: true,
    optionGroups: [
      COMMON_OPTION_GROUPS.RICE_OPTION,
      COMMON_OPTION_GROUPS.SPICE_LEVEL,
      COMMON_OPTION_GROUPS.ADD_TOPPINGS,
    ],
  },
  {
    id: 'm5',
    name: '五目舒肥雞胸彩虹沙拉',
    category: 'mains',
    price: 160,
    description: '低溫舒肥嫩雞胸肉搭配蘿蔓生菜、紫高麗、烤南瓜、毛豆與堅果，健康無負擔的輕食選擇。',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    tags: ['健康輕食', '低卡'],
    isAvailable: true,
    optionGroups: [
      {
        id: 'sauce',
        name: '醬料選擇',
        required: true,
        choices: [
          { id: 'sc1', name: '日式和風胡麻醬', priceExtra: 0 },
          { id: 'sc2', name: '義式凱薩醬', priceExtra: 0 },
          { id: 'sc3', name: '特調巴薩米克油醋', priceExtra: 0 },
        ],
      },
    ],
  },
  {
    id: 'm6',
    name: '鮮蝦紅油炒手 (8顆)',
    category: 'sides',
    price: 110,
    description: '皮薄餡滿，內裹完整鮮甜白蝦與溫體豬肉，搭配獨家酸辣紅油與花生碎，香氣十足。',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    tags: ['人氣小吃', '辣味'],
    isAvailable: true,
    optionGroups: [COMMON_OPTION_GROUPS.SPICE_LEVEL],
  },
  {
    id: 'm7',
    name: '夜市黃金地瓜球 (12顆)',
    category: 'sides',
    price: 60,
    description: '外酥內Q、香甜彈牙，使用台農57號黃金地瓜新鮮製作，純素可用。',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    tags: ['蛋奶素', '點心'],
    isAvailable: true,
  },
  {
    id: 'm8',
    name: '黑糖珍珠鮮奶茶',
    category: 'drinks',
    price: 75,
    description: '手工慢火燉煮古早味黑糖珍珠，搭配小農鮮乳與特選阿薩姆紅茶，濃厚順口。',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
    tags: ['人氣飲料', '甜點級'],
    isAvailable: true,
    optionGroups: [
      COMMON_OPTION_GROUPS.DRINK_ICE,
      COMMON_OPTION_GROUPS.DRINK_SUGAR,
    ],
  },
  {
    id: 'm9',
    name: '鮮榨香檸高山青茶',
    category: 'drinks',
    price: 60,
    description: '屏東新鮮榨取檸檬汁搭配南投高山冷萃青茶，回甘解膩，夏日最佳消暑選擇。',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    tags: ['清爽解膩'],
    isAvailable: true,
    optionGroups: [
      COMMON_OPTION_GROUPS.DRINK_ICE,
      COMMON_OPTION_GROUPS.DRINK_SUGAR,
    ],
  },
  {
    id: 'm10',
    name: '古早味手工芋圓豆花',
    category: 'desserts',
    price: 65,
    description: '綿密濃郁非基改黃豆豆花，佐九份手工九份芋圓、地瓜圓與古早味炒糖水。',
    image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=800&q=80',
    tags: ['傳統美味', '全素'],
    isAvailable: true,
    optionGroups: [
      {
        id: 'dessert_temp',
        name: '冷熱選擇',
        required: true,
        choices: [
          { id: 'dt1', name: '碎冰黑糖水', priceExtra: 0 },
          { id: 'dt2', name: '溫熱薑汁黑糖', priceExtra: 0 },
        ],
      },
    ],
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'A01',
    orderType: 'dine-in',
    tableNumber: '3',
    subtotal: 440,
    discount: 0,
    totalAmount: 440,
    status: 'preparing',
    paymentMethod: 'line_pay',
    isPaid: true,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      {
        cartItemId: 'item-1',
        menuItem: INITIAL_MENU_ITEMS[0], // 紅燒牛肉麵
        quantity: 2,
        selectedOptions: [
          { groupId: 'spice', groupName: '辣度選擇', choiceId: 's2', choiceName: '小辣', priceExtra: 0 },
          { groupId: 'noodle_type', groupName: '麵條選擇', choiceId: 'nt1', choiceName: '家常手工粗麵', priceExtra: 0 },
        ],
        unitPrice: 220,
        totalPrice: 440,
      },
    ],
    notes: '餐點去蔥，謝謝！',
  },
  {
    id: 'ord-102',
    orderNumber: 'T02',
    orderType: 'takeout',
    customerName: '陳小姐',
    customerPhone: '0912-345-678',
    subtotal: 225,
    discount: 0,
    totalAmount: 225,
    status: 'pending',
    paymentMethod: 'cash',
    isPaid: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      {
        cartItemId: 'item-2',
        menuItem: INITIAL_MENU_ITEMS[1], // 雞排便當
        quantity: 1,
        selectedOptions: [
          { groupId: 'rice', groupName: '主食升級', choiceId: 'r0', choiceName: '正常白飯', priceExtra: 0 },
          { groupId: 'spice', groupName: '辣度選擇', choiceId: 's1', choiceName: '微辣', priceExtra: 0 },
        ],
        unitPrice: 150,
        totalPrice: 150,
      },
      {
        cartItemId: 'item-3',
        menuItem: INITIAL_MENU_ITEMS[7], // 珍珠鮮奶茶
        quantity: 1,
        selectedOptions: [
          { groupId: 'ice', groupName: '冰量調整', choiceId: 'i1', choiceName: '微冰', priceExtra: 0 },
          { groupId: 'sugar', groupName: '甜度調整', choiceId: 'g1', choiceName: '微糖 (30%)', priceExtra: 0 },
        ],
        unitPrice: 75,
        totalPrice: 75,
      },
    ],
  },
  {
    id: 'ord-100',
    orderNumber: 'A02',
    orderType: 'dine-in',
    tableNumber: '5',
    subtotal: 315,
    discount: 0,
    totalAmount: 315,
    status: 'ready',
    paymentMethod: 'credit_card',
    isPaid: true,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    items: [
      {
        cartItemId: 'item-4',
        menuItem: INITIAL_MENU_ITEMS[2], // 咖哩飯
        quantity: 1,
        selectedOptions: [
          { groupId: 'rice', groupName: '主食升級', choiceId: 'r3', choiceName: '換健康藜麥飯', priceExtra: 20 },
          { groupId: 'spice', groupName: '辣度選擇', choiceId: 's0', choiceName: '不辣', priceExtra: 0 },
        ],
        unitPrice: 200,
        totalPrice: 200,
      },
      {
        cartItemId: 'item-5',
        menuItem: INITIAL_MENU_ITEMS[5], // 紅油炒手
        quantity: 1,
        selectedOptions: [
          { groupId: 'spice', groupName: '辣度選擇', choiceId: 's2', choiceName: '小辣', priceExtra: 0 },
        ],
        unitPrice: 110,
        totalPrice: 115,
      },
    ],
  },
];
