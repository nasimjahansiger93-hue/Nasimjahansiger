import React, { useState, useEffect, useMemo } from 'react';
import { GAMES_CATALOG } from './data/catalog';
import { GameItem, GamePackage, OrderReceipt } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { GameList } from './components/GameList';
import { PackageGrid } from './components/PackageGrid';
import { CheckoutColumn } from './components/CheckoutColumn';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { PaymentGuideModal } from './components/PaymentGuideModal';
import { AdminOrdersModal } from './components/AdminOrdersModal';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'topupzone_bd_orders';

export default function App() {
  const games = GAMES_CATALOG;
  const [selectedGameId, setSelectedGameId] = useState<string>(games[0].id);
  const selectedGame = useMemo(
    () => games.find((g) => g.id === selectedGameId) || games[0],
    [games, selectedGameId]
  );

  const [selectedPackageName, setSelectedPackageName] = useState<string>(
    selectedGame.packages[1]?.name || selectedGame.packages[0]?.name || ''
  );

  const selectedPackage = useMemo(
    () => selectedGame.packages.find((p) => p.name === selectedPackageName) || null,
    [selectedGame, selectedPackageName]
  );

  const [activeReceipt, setActiveReceipt] = useState<OrderReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Orders list state (synced with API & localStorage)
  const [orders, setOrders] = useState<OrderReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Modals state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentTargetOrder, setPaymentTargetOrder] = useState<OrderReceipt | null>(null);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackerInitialId, setTrackerInitialId] = useState('');
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Fetch initial orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders && Array.isArray(data.orders)) {
          setOrders(data.orders);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.orders));
        }
      }
    } catch (e) {
      console.warn('Could not fetch backend orders, using local storage cache', e);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // When game changes, default to a package
  const handleSelectGame = (game: GameItem) => {
    setSelectedGameId(game.id);
    setSelectedPackageName(game.packages[0]?.name || '');
    setActiveReceipt(null);
  };

  const handleSelectPackage = (pkg: GamePackage) => {
    setSelectedPackageName(pkg.name);
  };

  // Submit new order
  const handleSubmitOrder = async (info: { playerId: string; contact?: string }): Promise<OrderReceipt | null> => {
    if (!selectedPackage) return null;
    setIsSubmitting(true);

    try {
      let createdOrder: OrderReceipt;

      const payload = {
        game: selectedGame.name,
        packageName: selectedPackage.name,
        playerId: info.playerId,
        contact: info.contact
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          createdOrder = await res.json();
        } else {
          throw new Error('Server returned non-200');
        }
      } catch {
        // Fallback local order creation if backend fetch fails
        createdOrder = {
          id: `bd-${Math.random().toString(36).substring(2, 8)}-${Date.now().toString(36).slice(-4)}`,
          game: selectedGame.name,
          packageName: selectedPackage.name,
          playerId: info.playerId,
          contact: info.contact,
          amountTaka: selectedPackage.priceTaka,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          createdAt: new Date().toISOString()
        };
      }

      // Update state & storage
      setActiveReceipt(createdOrder);
      setOrders((prev) => {
        const updated = [createdOrder, ...prev.filter((o) => o.id !== createdOrder.id)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return createdOrder;
    } catch (err) {
      console.error('Order creation error:', err);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit payment / TrxID
  const handleSubmitPayment = async (
    orderId: string,
    data: { paymentMethod: string; transactionId: string; senderNumber?: string }
  ): Promise<boolean> => {
    try {
      let updated: OrderReceipt | null = null;
      try {
        const res = await fetch(`/api/orders/${orderId}/pay`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          updated = await res.json();
        }
      } catch {
        // Local fallback
      }

      setOrders((prev) => {
        const next = prev.map((ord) => {
          if (ord.id === orderId) {
            return (
              updated || {
                ...ord,
                paymentMethod: data.paymentMethod as any,
                transactionId: data.transactionId,
                senderNumber: data.senderNumber,
                paymentStatus: 'VERIFYING' as const,
                status: 'PROCESSING' as const,
                updatedAt: new Date().toISOString()
              }
            );
          }
          return ord;
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      if (activeReceipt && activeReceipt.id === orderId) {
        setActiveReceipt((curr) =>
          curr
            ? {
                ...curr,
                paymentMethod: data.paymentMethod as any,
                transactionId: data.transactionId,
                paymentStatus: 'VERIFYING',
                status: 'PROCESSING'
              }
            : null
        );
      }

      return true;
    } catch (e) {
      console.error('Error submitting payment:', e);
      return false;
    }
  };

  // Update order status (Admin)
  const handleUpdateStatus = async (
    orderId: string,
    status: OrderReceipt['status'],
    paymentStatus: OrderReceipt['paymentStatus']
  ) => {
    try {
      fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus })
      }).catch(() => {});

      setOrders((prev) => {
        const next = prev.map((ord) =>
          ord.id === orderId ? { ...ord, status, paymentStatus, updatedAt: new Date().toISOString() } : ord
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });

      if (activeReceipt && activeReceipt.id === orderId) {
        setActiveReceipt((curr) => (curr ? { ...curr, status, paymentStatus } : null));
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const handleOpenPayment = (receipt: OrderReceipt) => {
    setPaymentTargetOrder(receipt);
    setIsPaymentModalOpen(true);
  };

  const handleTrackReceipt = (receipt: OrderReceipt) => {
    setTrackerInitialId(receipt.id);
    setIsTrackerModalOpen(true);
  };

  return (
    <div className="page-grain min-h-[100dvh] flex flex-col justify-between">
      <div>
        <Header
          onOpenTracker={() => {
            setTrackerInitialId('');
            setIsTrackerModalOpen(true);
          }}
          onOpenPaymentGuide={() => setIsGuideModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          ordersCount={orders.length}
        />

        <main className="shell main-shell">
          <Hero />

          <section id="games" className="order-layout" aria-label="গেম নির্বাচন ও অর্ডার">
            {/* Catalog Column (Left) */}
            <div className="catalog-column">
              <div className="section-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line"></span> আপনার গেম
                  </div>
                  <h2>কোথায় খেলছেন?</h2>
                </div>
                <span className="section-count font-mono">
                  ০{games.length} / GAMES
                </span>
              </div>

              <GameList
                games={games}
                selectedGameId={selectedGameId}
                onSelectGame={handleSelectGame}
              />

              <PackageGrid
                game={selectedGame}
                selectedPackageName={selectedPackageName}
                onSelectPackage={handleSelectPackage}
              />
            </div>

            {/* Checkout Column (Right) */}
            <CheckoutColumn
              game={selectedGame}
              selectedPackage={selectedPackage}
              onSubmitOrder={handleSubmitOrder}
              isSubmitting={isSubmitting}
              activeReceipt={activeReceipt}
              onDismissReceipt={() => setActiveReceipt(null)}
              onOpenPaymentForReceipt={handleOpenPayment}
              onTrackReceipt={handleTrackReceipt}
            />
          </section>
        </main>
      </div>

      <Footer
        onOpenTracker={() => {
          setTrackerInitialId('');
          setIsTrackerModalOpen(true);
        }}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        order={paymentTargetOrder}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmitPayment={handleSubmitPayment}
      />

      <OrderTrackerModal
        isOpen={isTrackerModalOpen}
        initialOrderId={trackerInitialId}
        allOrders={orders}
        onClose={() => setIsTrackerModalOpen(false)}
        onPayForOrder={handleOpenPayment}
      />

      <PaymentGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <AdminOrdersModal
        isOpen={isAdminModalOpen}
        orders={orders}
        onClose={() => setIsAdminModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onRefresh={fetchOrders}
      />
    </div>
  );
}
