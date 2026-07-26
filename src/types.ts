export type OrderType = 'dine-in' | 'takeout';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export type PaymentMethod = 'cash' | 'line_pay' | 'credit_card' | 'jko_pay';

export interface OptionChoice {
  id: string;
  name: string;
  priceExtra: number;
}

export interface OptionGroup {
  id: string;
  name: string;
  required: boolean;
  maxSelect?: number;
  choices: OptionChoice[];
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  tags?: string[]; // e.g. ['熱銷', '店長推薦', '素食', '微辣']
  isAvailable: boolean;
  optionGroups?: OptionGroup[];
}

export interface SelectedOption {
  groupId: string;
  groupName: string;
  choiceId: string;
  choiceName: string;
  priceExtra: number;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "A01", "T05"
  orderType: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  createdAt: string; // ISO string
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}
