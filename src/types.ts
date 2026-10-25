export interface GamePackage {
  id: string;
  name: string;
  priceTaka: number;
  popular?: boolean;
  bonus?: string;
}

export interface GameItem {
  id: string;
  name: string;
  subtitle: string;
  short: string;
  mark: string;
  palette: 'game-fire' | 'game-pubg' | 'game-ml' | 'game-fc';
  index: string;
  image: string;
  playerPlaceholder: string;
  playerHint: string;
  packages: GamePackage[];
}

export interface CreateOrderRequest {
  game: string;
  packageName: string;
  playerId: string;
  contact?: string;
  paymentMethod?: 'bKash' | 'Nagad' | 'Rocket';
  transactionId?: string;
}

export interface OrderReceipt {
  id: string;
  game: string;
  packageName: string;
  playerId: string;
  contact?: string;
  amountTaka: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'VERIFYING' | 'PAID' | 'REFUNDED';
  paymentMethod?: 'bKash' | 'Nagad' | 'Rocket';
  transactionId?: string;
  senderNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  number: string;
  rawNumber: string;
  type: string;
  bgColor: string;
  textColor: string;
  note: string;
}
