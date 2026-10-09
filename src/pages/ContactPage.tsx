import React, { useState } from 'react';
import { Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ContactPage: React.FC = () => {
  const { settings, addToast } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Product Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      addToast('Please fill in your name and inquiry message.', 'warning');
      return;
    }
    setSubmitted(true);
    addToast('Thank you! Your message has been received. Our team will contact you shortly.', 'success');
  };

  const cleanPhone = settings.whatsappNumber ? settings.whatsappNumber.replace(/[^0-9]/g, '') : '923001234567';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold uppercase tracking-wider">
          We're Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch With Us
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Have a question about an order, toy age appropriateness, or delivery status? Reach out anytime!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact info cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">Direct Contact</h3>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <strong className="block text-slate-800 font-bold mb-0.5">Headquarters & Showroom</strong>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <strong className="block text-slate-800 font-bold mb-0.5">Customer Support Hotline</strong>
                  <span>{settings.phone} (Mon - Sat, 10am - 8pm)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <strong className="block text-slate-800 font-bold mb-0.5">Email Support</strong>
                  <span>{settings.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Banner */}
          <div className="bg-emerald-600 text-white p-6 rounded-3xl shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <MessageCircle size={24} />
              <h4 className="text-base font-extrabold">Instant WhatsApp Chat</h4>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Prefer chatting on WhatsApp? Chat with our toy concierge directly for recommendations and parcel tracking updates.
            </p>
            <a
              href={`https://wa.me/${cleanPhone}?text=Hi%20WonderLand%20Toys!%20I%20have%20an%20inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition-colors shadow-xs"
            >
              <MessageCircle size={16} />
              <span>Launch WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles size={32} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Message Received!</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. One of our toy specialists will respond to your inquiry via phone or email promptly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-base font-black text-slate-900">Send an Inquiry</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Ali"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="0300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. farhan@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden cursor-pointer"
                  >
                    <option value="Product Inquiry">Product Information & Age Suitability</option>
                    <option value="Order Tracking">Tracking Existing Order</option>
                    <option value="Returns & Replacement">Replacement or Return Request</option>
                    <option value="Wholesale & Bulk">Bulk Birthday Gifts / School Order</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 text-xs text-slate-900 outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
