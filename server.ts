import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory persistent order storage
interface OrderRecord {
  id: string;
  game: string;
  packageName: string;
  playerId: string;
  contact?: string;
  amountTaka: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'VERIFYING' | 'PAID' | 'REFUNDED';
  paymentMethod?: string;
  transactionId?: string;
  senderNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

const initialOrders: OrderRecord[] = [
  {
    id: 'ff-8a92-bd',
    game: 'Free Fire',
    packageName: '210 Diamonds',
    playerId: '284719284',
    contact: '01712345678',
    amountTaka: 160,
    status: 'COMPLETED',
    paymentStatus: 'PAID',
    paymentMethod: 'bKash',
    transactionId: 'BLM7829104',
    senderNumber: '01712345678',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'pubg-5c12-bd',
    game: 'PUBG Mobile',
    packageName: '325 UC',
    playerId: '5192847291',
    contact: '01898765432',
    amountTaka: 590,
    status: 'PROCESSING',
    paymentStatus: 'PAID',
    paymentMethod: 'Nagad',
    transactionId: '9K28371948',
    senderNumber: '01898765432',
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString()
  }
];

const orders: Map<string, OrderRecord> = new Map(initialOrders.map(o => [o.id, o]));

// Catalog endpoint (compatible with Replit format)
app.get('/api/catalog', (_req, res) => {
  res.json({
    games: [
      {
        name: 'Free Fire',
        subtitle: 'Diamonds',
        packages: [
          { name: '100 Diamonds', priceTaka: 80 },
          { name: '210 Diamonds', priceTaka: 160 },
          { name: '530 Diamonds', priceTaka: 390 },
          { name: '1080 Diamonds', priceTaka: 780 },
          { name: 'Weekly Membership', priceTaka: 190 },
          { name: 'Monthly Membership', priceTaka: 950 }
        ]
      },
      {
        name: 'PUBG Mobile',
        subtitle: 'UC Top-Up',
        packages: [
          { name: '60 UC', priceTaka: 120 },
          { name: '325 UC', priceTaka: 590 },
          { name: '660 UC', priceTaka: 1150 },
          { name: '1800 UC', priceTaka: 2950 }
        ]
      },
      {
        name: 'Mobile Legends',
        subtitle: 'Diamonds',
        packages: [
          { name: '86 Diamonds', priceTaka: 140 },
          { name: '172 Diamonds', priceTaka: 275 },
          { name: '257 Diamonds', priceTaka: 410 },
          { name: '706 Diamonds', priceTaka: 1050 }
        ]
      },
      {
        name: 'FC Mobile',
        subtitle: 'Game Packs',
        packages: [
          { name: 'Starter Pack', priceTaka: 120 },
          { name: 'Value Pack', priceTaka: 250 },
          { name: 'Pro Pack', priceTaka: 500 },
          { name: 'Mega Pack', priceTaka: 950 }
        ]
      }
    ]
  });
});

// Price lookup helper
function getPriceForPackage(game: string, packageName: string): number {
  const priceMap: Record<string, Record<string, number>> = {
    'Free Fire': {
      '100 Diamonds': 80,
      '210 Diamonds': 160,
      '530 Diamonds': 390,
      '1080 Diamonds': 780,
      'Weekly Membership': 190,
      'Monthly Membership': 950
    },
    'PUBG Mobile': {
      '60 UC': 120,
      '325 UC': 590,
      '660 UC': 1150,
      '1800 UC': 2950
    },
    'Mobile Legends': {
      '86 Diamonds': 140,
      '172 Diamonds': 275,
      '257 Diamonds': 410,
      '706 Diamonds': 1050
    },
    'FC Mobile': {
      'Starter Pack': 120,
      'Value Pack': 250,
      'Pro Pack': 500,
      'Mega Pack': 950
    }
  };

  return priceMap[game]?.[packageName] ?? 100;
}

// Create order
app.post('/api/orders', (req, res) => {
  const { game, packageName, playerId, contact, paymentMethod, transactionId } = req.body;

  if (!game || !packageName || !playerId) {
    return res.status(400).json({ error: 'Missing required fields (game, packageName, playerId)' });
  }

  const id = crypto.randomUUID();
  const amountTaka = getPriceForPackage(game, packageName);

  const order: OrderRecord = {
    id,
    game,
    packageName,
    playerId: String(playerId).trim(),
    contact: contact ? String(contact).trim() : undefined,
    amountTaka,
    status: 'PENDING',
    paymentStatus: transactionId ? 'VERIFYING' : 'UNPAID',
    paymentMethod: paymentMethod || undefined,
    transactionId: transactionId ? String(transactionId).trim() : undefined,
    createdAt: new Date().toISOString()
  };

  orders.set(id, order);

  return res.status(201).json(order);
});

// Get all orders (with optional filtering)
app.get('/api/orders', (req, res) => {
  const { query } = req.query;
  const list = Array.from(orders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (query && typeof query === 'string') {
    const q = query.toLowerCase().trim();
    const filtered = list.filter(
      o =>
        o.id.toLowerCase().includes(q) ||
        o.playerId.toLowerCase().includes(q) ||
        (o.contact && o.contact.includes(q)) ||
        o.game.toLowerCase().includes(q) ||
        (o.transactionId && o.transactionId.toLowerCase().includes(q))
    );
    return res.json({ orders: filtered });
  }

  return res.json({ orders: list });
});

// Get single order by ID
app.get('/api/orders/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  return res.json(order);
});

// Submit payment / TrxID for an order
app.post('/api/orders/:id/pay', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { paymentMethod, transactionId, senderNumber } = req.body;
  if (!transactionId) {
    return res.status(400).json({ error: 'Transaction ID is required' });
  }

  order.paymentMethod = paymentMethod || order.paymentMethod || 'bKash';
  order.transactionId = String(transactionId).trim();
  if (senderNumber) order.senderNumber = String(senderNumber).trim();
  order.paymentStatus = 'VERIFYING';
  order.status = 'PROCESSING';
  order.updatedAt = new Date().toISOString();

  orders.set(order.id, order);
  return res.json(order);
});

// Update order status (Admin)
app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status, paymentStatus } = req.body;
  if (status) order.status = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();

  orders.set(order.id, order);
  return res.json(order);
});

// Delete order (Admin cleanup)
app.delete('/api/orders/:id', (req, res) => {
  if (orders.delete(req.params.id)) {
    return res.json({ success: true });
  }
  return res.status(404).json({ error: 'Order not found' });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TopUp Zone BD server running on port ${PORT}`);
  });
}

startServer();
