import React, { useState } from 'react';
import { AgentSession } from '../types';
import {
  ShoppingCart,
  X,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  Building2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface MultiStoreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: AgentSession[];
  onClearSessions: () => void;
}

export const MultiStoreCheckoutModal: React.FC<MultiStoreCheckoutModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onClearSessions,
}) => {
  const [step, setStep] = useState<'review' | 'executing' | 'confirmed'>('review');
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [orderId, setOrderId] = useState<string>('');

  if (!isOpen) return null;

  const totalCost = sessions.reduce((sum, s) => sum + s.price, 0);
  const totalOriginal = sessions.reduce((sum, s) => sum + (s.originalPrice || s.price), 0);
  const totalSavings = totalOriginal - totalCost;

  const handleStartAutonomousPurchase = () => {
    setStep('executing');
    setExecutionLog(['Initializing MIA Multi-Store Purchase Agent...']);

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...prev,
        'Connecting to Decathlon Taiwan e-commerce cart session...',
      ]);
    }, 600);

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...prev,
        'Verifying SIMOND MT500 twinnable left zipper variant in stock...',
      ]);
    }, 1200);

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...prev,
        'Applying Decathlon Member 9% Limited Deal & Store Pickup pass...',
      ]);
    }, 1800);

    setTimeout(() => {
      setExecutionLog((prev) => [
        ...prev,
        'Simulating secure tokenized payment settlement...',
      ]);
    }, 2400);

    setTimeout(() => {
      const generatedOrderId = 'DEC-TW-' + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedOrderId);
      setExecutionLog((prev) => [
        ...prev,
        `✓ Order placed successfully! Confirmation ID: ${generatedOrderId}`,
      ]);
      setStep('confirmed');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                MIA Unified Purchase Hub
              </h3>
              <p className="text-[11px] text-stone-400">
                Direct cross-website checkout for collected camping gear
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {step === 'review' && (
            <>
              {/* Order Items List */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                  Items to Purchase ({sessions.length})
                </span>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl overflow-hidden">
                  {sessions.map((item) => (
                    <div key={item.id} className="p-3 bg-stone-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-stone-900">{item.name}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {item.storeName} • {item.specs.twinnable ? 'Twinnable Zip' : 'Standard'} • {item.stockStatus}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-stone-900">NT${item.price.toLocaleString()}</div>
                        {item.originalPrice && (
                          <div className="text-[10px] text-stone-400 line-through">
                            NT${item.originalPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery / Store Pickup Options */}
              <div>
                <span className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1.5">
                  Fulfillment Method
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setShippingMethod('pickup')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      shippingMethod === 'pickup'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      <span>Decathlon Store Pickup</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 mt-1 font-medium">
                      FREE • Ready in 2 Hours (Neihu Store)
                    </span>
                  </button>

                  <button
                    onClick={() => setShippingMethod('delivery')}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-colors ${
                      shippingMethod === 'delivery'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-stone-900">
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Express Home Delivery</span>
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1">
                      FREE over NT$1,000 • 24-48 hrs
                    </span>
                  </button>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>NT${totalOriginal.toLocaleString()}</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Limited Deal Savings:</span>
                    <span>-NT${totalSavings.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping:</span>
                  <span className="text-emerald-700 font-semibold">NT$0 (Free)</span>
                </div>
                <div className="flex justify-between text-sm font-black text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Total Amount:</span>
                  <span className="text-blue-700">NT${totalCost.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          {step === 'executing' && (
            <div className="py-8 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-sky-100 text-sky-600 flex items-center justify-center animate-spin">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900">
                  Autonomous Purchase Agent Running...
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Interacting with website checkout APIs and securing inventory
                </p>
              </div>

              <div className="p-3 bg-stone-900 text-stone-300 rounded-xl text-xs font-mono text-left space-y-1 max-h-48 overflow-y-auto">
                {executionLog.map((log, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <span className="text-emerald-400">›</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'confirmed' && (
            <div className="py-6 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-stone-900">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Decathlon Taiwan order confirmed. Your reservation is locked.
                </p>
                <div className="mt-3 inline-block bg-stone-100 text-stone-800 px-3 py-1 rounded-full text-xs font-mono font-bold">
                  Order #{orderId}
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-left text-xs space-y-1">
                <div className="font-bold text-emerald-900">Pickup Details:</div>
                <div className="text-emerald-800">
                  • Location: Decathlon Neihu Flagship Store (Taipei)
                </div>
                <div className="text-emerald-800">
                  • Twinnable Item: 10°C MT500 Trekking Sleeping Bag (Right Zip)
                </div>
                <div className="text-emerald-800">
                  • Pick-up PIN: 8492 (SMS & Email sent)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Shopping Agent Token</span>
          </div>

          <div>
            {step === 'review' && (
              <button
                onClick={handleStartAutonomousPurchase}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>Authorize Agent to Purchase</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 'confirmed' && (
              <button
                onClick={() => {
                  onClose();
                  setStep('review');
                }}
                className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-xl font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
