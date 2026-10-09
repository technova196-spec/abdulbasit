import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface FloatingWhatsAppProps {
  productContext?: {
    name: string;
    sku: string;
  };
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ productContext }) => {
  const { settings } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(
    productContext
      ? `Hi WonderLand Toys! I am interested in "${productContext.name}" (SKU: ${productContext.sku}). Is this currently available?`
      : 'Hi WonderLand Toys! I have a question regarding an order / toy availability.'
  );

  const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '923001234567';

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(message.trim());
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      {/* POPUP CHAT BOX */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="bg-emerald-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-base">
                <MessageCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">WonderLand Support</h4>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Typically replies within 15 mins
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg cursor-pointer"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-4 bg-emerald-50/40">
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-emerald-100 text-xs text-slate-700 leading-relaxed mb-3">
              Hello there! 👋 Need help picking the perfect toy for a child's age or checking delivery timing? Message us directly on WhatsApp!
            </div>

            <form onSubmit={handleSend} className="space-y-2">
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your question..."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500 bg-white resize-none"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Send size={14} />
                Start Chat on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-white rounded-full" />
        <MessageCircle size={22} className="shrink-0" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">
          {isOpen ? 'Close Chat' : 'Chat on WhatsApp'}
        </span>
      </button>
    </div>
  );
};
