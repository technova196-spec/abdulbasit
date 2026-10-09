import React, { useState } from 'react';
import {
  ArrowRight,
  Boxes,
  Car,
  ChevronRight,
  Clock,
  Compass,
  Gift,
  GraduationCap,
  Heart,
  Palette,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import { useShop } from '../context/ShopContext';

export const HomePage: React.FC = () => {
  const { products, categories, settings, formatPrice } = useShop();
  const navigate = useNavigate();

  const [selectedAge, setSelectedAge] = useState<string>('All');

  // Filtered lists for homepage sections
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
  const discountedToys = products
    .filter((p) => p.salePrice && p.price > p.salePrice)
    .slice(0, 8);
  const educationalToys = products
    .filter((p) => p.category === 'educational-toys' || p.category === 'stem-science-kits')
    .slice(0, 4);

  // Age group filtered toys
  const ageOptions = ['All', '0-2 Years', '3-5 Years', '6-8 Years', '8-14 Years'];
  const ageFilteredProducts = products.filter((p) => {
    if (selectedAge === 'All') return true;
    if (selectedAge === '0-2 Years') {
      return p.ageRecommendation.includes('0-') || p.ageRecommendation.includes('1-') || p.ageRecommendation.includes('All');
    }
    if (selectedAge === '3-5 Years') {
      return p.ageRecommendation.includes('3-') || p.ageRecommendation.includes('4-') || p.ageRecommendation.includes('2-');
    }
    if (selectedAge === '6-8 Years') {
      return p.ageRecommendation.includes('5-') || p.ageRecommendation.includes('6-') || p.ageRecommendation.includes('7-');
    }
    if (selectedAge === '8-14 Years') {
      return p.ageRecommendation.includes('8-') || p.ageRecommendation.includes('10+') || p.ageRecommendation.includes('7-');
    }
    return true;
  }).slice(0, 8);

  const categoryIcons: Record<string, React.ReactNode> = {
    'educational-toys': <GraduationCap size={24} />,
    'building-blocks': <Boxes size={24} />,
    'remote-control-cars': <Car size={24} />,
    'stem-science-kits': <Compass size={24} />,
    'arts-and-crafts': <Palette size={24} />,
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-auto max-w-7xl mt-4 sm:mt-6 shadow-xl">
        {/* Playful background decorative shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-wide shadow-xs border border-white/20">
              <Sparkles size={14} className="text-amber-200 animate-pulse" />
              <span>Pakistan’s #1 Destination for Fun & Learning</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Spark Imagination, <br />
              <span className="text-slate-900 drop-shadow-xs">Inspire Every Smile!</span>
            </h1>

            <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover top-rated educational puzzles, high-speed remote control racers, premium building blocks, and cuddly plush companions. Fast 2-4 day Cash on Delivery across Pakistan!
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                to="/shop"
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <span>Shop All Toys ({products.length})</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/category/educational-toys"
                className="px-6 py-3.5 bg-white/90 hover:bg-white text-amber-900 font-extrabold text-sm rounded-2xl shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                Educational Toys
              </Link>
              <Link
                to="/shop?filter=sale"
                className="px-4 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-2xl shadow-md transition-all duration-200 flex items-center gap-1.5"
              >
                <Zap size={14} />
                Special Offers
              </Link>
            </div>

            {/* Trust badges */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/20 text-center lg:text-left">
              <div>
                <span className="block text-xl sm:text-2xl font-black text-white">100% COD</span>
                <span className="text-[11px] text-white/80 font-medium">Pay At Doorstep</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-white">2-4 Days</span>
                <span className="text-[11px] text-white/80 font-medium">Speedy Delivery</span>
              </div>
              <div>
                <span className="block text-xl sm:text-2xl font-black text-white">4.9 ★</span>
                <span className="text-[11px] text-white/80 font-medium">Parent Approved</span>
              </div>
            </div>
          </div>

          {/* Hero visual grid / floating card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-white/20">
                <img
                  src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80"
                  alt="Kids playing with colorful toys"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating review card */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-white text-slate-800 p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 max-w-xs animate-bounce duration-1000">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">"Finest toys in Pakistan!"</p>
                  <span className="text-[10px] text-slate-400">Over 5,000+ happy kids</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore by Play Style
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>View All ({categories.length})</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.slug).length;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-xs hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col items-center text-center text-slate-800"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {count} Products
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 block mb-1">
              Most Loved
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Best Selling Toys
            </h2>
          </div>
          <Link
            to="/shop?filter=bestsellers"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>See More</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL FEATURE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left z-10">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white font-extrabold text-xs uppercase tracking-wider">
              Exclusive Family Offer
            </span>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Get 10% Off Your Entire Order!
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Use promo coupon code <strong className="bg-slate-900 px-2.5 py-1 rounded-lg text-amber-300 font-mono text-sm ml-1">TOY10</strong> at checkout on all orders above {formatPrice(1500)}. Plus free shipping over {formatPrice(settings.freeShippingThreshold)}!
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <span>Shop With Coupon Now</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-xs flex justify-center">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 text-center text-white">
              <Gift size={48} className="mx-auto mb-2 text-amber-200 animate-bounce" />
              <div className="font-extrabold text-sm">Nationwide Delivery</div>
              <div className="text-xs text-white/80 mt-1">Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Quetta & all 100+ cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY AGE RECOMMENDATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
            Age Guided Shopping
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Find the Perfect Gift by Age
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Developmentally tailored playthings matching each cognitive milestone.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {ageOptions.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  selectedAge === age
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:border-amber-200'
                }`}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {ageFilteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. SPECIAL OFFERS & DEALS */}
      {discountedToys.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 block mb-1 flex items-center gap-1">
                <Zap size={14} /> Flash Discounts
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Special Offers & Savings
              </h2>
            </div>
            <Link
              to="/shop?filter=sale"
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 group"
            >
              <span>View All Sale Toys</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {discountedToys.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 block mb-1">
              Fresh Toys
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              New Arrivals This Month
            </h2>
          </div>
          <Link
            to="/shop?filter=new"
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
          >
            <span>See All New</span>
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. FEATURED BRANDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100/70 rounded-3xl p-8 border border-slate-200/60">
          <div className="text-center mb-6">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Featured Trusted Toy Brands
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              We curate verified brands meeting international child safety standards.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {['MagnaCraft', 'SpeedVelocity', 'TinyCurious', 'WarmHug Co.', 'FutureGenius', 'CraftyKids', 'AeroGlide', 'MelodyStar'].map((brand) => (
              <button
                key={brand}
                onClick={() => navigate(`/shop?brand=${encodeURIComponent(brand)}`)}
                className="px-5 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all text-xs font-bold text-slate-700 hover:text-amber-600 cursor-pointer"
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
            Parent Approved
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved by Parents Across Pakistan
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The MagnaCraft magnetic tiles set kept my 5-year-old engaged for hours instead of staring at screens. The build quality is top tier and delivery reached Rawalpindi in just 48 hours!"
            </p>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Zainab Siddiqui</span>
              <span className="text-slate-400">Rawalpindi</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "Ordered the 4WD stunt RC car for my nephew's birthday. Cash on Delivery was seamless, the courier was courteous, and the rechargeable battery lasts surprisingly long. Highly recommended!"
            </p>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Hamza Tariq</span>
              <span className="text-slate-400">Lahore</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              "The BioExplorer microscope kit sparked an interest in biology for my daughter. Clear glass lenses, safe specimen slides, and fantastic packaging. WonderLand Toys is our favorite store now."
            </p>
            <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Dr. Madiha Asif</span>
              <span className="text-slate-400">Karachi</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ PREVIEW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xs space-y-6">
          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block mb-1">
              Got Questions?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4 divide-y divide-slate-100">
            <div className="pt-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                Do you offer Cash on Delivery (COD) across Pakistan?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Yes! We offer 100% Cash on Delivery in all cities, towns, and regions nationwide. You simply pay the delivery rider when your parcel arrives safely at your doorstep.
              </p>
            </div>

            <div className="pt-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                How many days does standard shipping take?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Orders in Lahore and Islamabad typically arrive in 2 business days. For Karachi, Faisalabad, Multan, and other major cities, delivery takes 2 to 4 business days.
              </p>
            </div>

            <div className="pt-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mb-1">
                What is your replacement or return policy?
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                We offer a hassle-free 7-day replacement warranty if any item arrives damaged, defective, or missing components. Contact us via WhatsApp or email for instant assistance.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/faqs"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline"
            >
              Read all FAQs & Delivery Information →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
