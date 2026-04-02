import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  X, 
  MessageCircle, 
  ChevronRight, 
  Trash2,
  ArrowRight,
  CheckCircle2,
  Info
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  category: string;
  tag?: 'popular' | 'chef';
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

// --- Menu Data ---
const MENU_DATA: MenuItem[] = [
  // 1. Soups
  { 
    id: 'soup-1', 
    category: 'الشوربات', 
    name: 'Mulligatawny Soup', 
    desc: 'شوربة العدس الهندية مع دجاج تندوري ونان', 
    price: 165
  },
  { 
    id: 'soup-2', 
    category: 'الشوربات', 
    name: 'Chicken Sweet Corn Soup', 
    desc: 'شوربة ذرة حلوة بالدجاج', 
    price: 150
  },
  { 
    id: 'soup-3', 
    category: 'الشوربات', 
    name: 'Creamy Mushroom Soup', 
    desc: 'شوربة كريمة المشروم', 
    price: 150
  },

  // 2. Appetizers
  { 
    id: 'app-1', 
    category: 'المقبلات', 
    name: 'Indian Samosa (3 pcs)', 
    desc: 'سمبوسة هندية محشوة بالبطاطس والبازلاء', 
    price: 188
  },
  { 
    id: 'app-2', 
    category: 'المقبلات', 
    name: 'Chicken Lollipop (5 pcs)', 
    desc: 'أجنحة دجاج متبلة ومقلية', 
    price: 188
  },
  { 
    id: 'app-3', 
    category: 'المقبلات', 
    name: 'Crispy Fried Shrimp', 
    desc: 'جمبري مقلي مقرمش', 
    price: 315
  },
  { 
    id: 'app-4', 
    category: 'المقبلات', 
    name: 'Cheese Garlic Bread', 
    desc: 'خبز بالثوم والجبنة', 
    price: 140
  },

  // 3. Salads
  { 
    id: 'salad-1', 
    category: 'السلطات', 
    name: 'Karvin Special Salad', 
    desc: 'سلطة كارفين المميزة', 
    price: 175
  },
  { 
    id: 'salad-2', 
    category: 'السلطات', 
    name: 'Caesar Salad', 
    desc: 'سلطة سيزر الكلاسيكية', 
    price: 160
  },
  { 
    id: 'salad-3', 
    category: 'السلطات', 
    name: 'Greek Salad', 
    desc: 'سلطة يونانية', 
    price: 160
  },

  // 4. Indian Main Course
  { 
    id: 'ind-main-1', 
    category: 'الأطباق الهندية الرئيسية', 
    name: 'Murgh Makhani (Butter Chicken)', 
    desc: 'دجاج تندوري في صوص الزبدة والكريمة', 
    price: 476, 
    tag: 'popular'
  },
  { 
    id: 'ind-main-2', 
    category: 'الأطباق الهندية الرئيسية', 
    name: 'Chicken Tikka Masala', 
    desc: 'مكعبات دجاج مشوية في صوص الملاي الحار', 
    price: 465
  },
  { 
    id: 'ind-main-3', 
    category: 'الأطباق الهندية الرئيسية', 
    name: 'Mutton Rogan Josh', 
    desc: 'لحم ضأن في صوص كاري أحمر', 
    price: 545, 
    tag: 'chef'
  },
  { 
    id: 'ind-main-4', 
    category: 'الأطباق الهندية الرئيسية', 
    name: 'Dal Makhani', 
    desc: 'عدس أسود بالكريمة والزبدة', 
    price: 286
  },
  { 
    id: 'ind-main-5', 
    category: 'الأطباق الهندية الرئيسية', 
    name: 'Palak Paneer', 
    desc: 'جبن كوتاج مع السبانخ', 
    price: 315
  },

  // 5. Biryani & Rice
  { 
    id: 'rice-1', 
    category: 'البرياني والأرز', 
    name: 'Chicken Biryani', 
    desc: 'أرز بسمتي مع دجاج متبل بالبهارات الهندية', 
    price: 436, 
    tag: 'popular'
  },
  { 
    id: 'rice-2', 
    category: 'البرياني والأرز', 
    name: 'Mutton Biryani', 
    desc: 'أرز بسمتي مع لحم ضأن مطهو ببطء', 
    price: 495
  },
  { 
    id: 'rice-3', 
    category: 'البرياني والأرز', 
    name: 'Vegetable Biryani', 
    desc: 'أرز بسمتي مع خضروات مشكلة وتوابل', 
    price: 320
  },
  { 
    id: 'rice-4', 
    category: 'البرياني والأرز', 
    name: 'Steamed Rice', 
    desc: 'أرز بسمتي مطهو على البخار', 
    price: 135
  },

  // 6. Tandoori & Grills
  { 
    id: 'grill-1', 
    category: 'التندوري والمشاوي', 
    name: 'Chicken Tikka', 
    desc: 'قطع دجاج متبلة ومشوية في التندور', 
    price: 415
  },
  { 
    id: 'grill-2', 
    category: 'التندوري والمشاوي', 
    name: 'Mutton Seekh Kabab', 
    desc: 'كباب لحم ضأن مفروم مع أعشاب وتوابل', 
    price: 510
  },
  { 
    id: 'grill-3', 
    category: 'التندوري والمشاوي', 
    name: 'Mixed Grill Platter', 
    desc: 'تشكيلة مختارة من المشاوي الهندية الشهيرة', 
    price: 570, 
    tag: 'popular'
  },

  // 7. International Main Course
  { 
    id: 'int-main-1', 
    category: 'الأطباق العالمية الرئيسية', 
    name: 'Chicken Fungi', 
    desc: 'دجاج بصلصة المشروم الكريمية', 
    price: 456
  },
  { 
    id: 'int-main-2', 
    category: 'الأطباق العالمية الرئيسية', 
    name: 'Grilled Salmon', 
    desc: 'فيليه سالمون مشوي مع خضروات موسمية', 
    price: 620, 
    tag: 'chef'
  },
  { 
    id: 'int-main-3', 
    category: 'الأطباق العالمية الرئيسية', 
    name: 'Beef Fillet', 
    desc: 'فيليه لحم بقري فاخر مطهو حسب اختيارك', 
    price: 650
  },

  // 8. Pasta
  { 
    id: 'pasta-1', 
    category: 'المكرونة', 
    name: 'Fettuccine Alfredo', 
    desc: 'مكرونة فوتشيني بصلصة الكريمة والبارميزان', 
    price: 260
  },
  { 
    id: 'pasta-2', 
    category: 'المكرونة', 
    name: 'Penne Arabiata', 
    desc: 'مكرونة بيني بصلصة الطماطم الحارة والريحان', 
    price: 210
  },

  // 9. House Breads
  { 
    id: 'bread-1', 
    category: 'خبز الدار', 
    name: 'Plain Naan', 
    desc: 'خبز هندي تقليدي سادة', 
    price: 114
  },
  { 
    id: 'bread-2', 
    category: 'خبز الدار', 
    name: 'Butter / Garlic Naan', 
    desc: 'خبز نان بالزبدة أو الثوم', 
    price: 125
  },
  { 
    id: 'bread-3', 
    category: 'خبز الدار', 
    name: 'Cheese Naan', 
    desc: 'خبز نان محشو بالجبنة', 
    price: 155
  },

  // 10. Desserts
  { 
    id: 'dessert-1', 
    category: 'الحلويات', 
    name: 'Gulab Jamun', 
    desc: 'كرات الحليب المقلية في شراب السكر والزعفران', 
    price: 135
  },
  { 
    id: 'dessert-2', 
    category: 'الحلويات', 
    name: 'Gajar Ka Halwa', 
    desc: 'حلوى الجزر التقليدية مع المكسرات والحليب', 
    price: 145
  },
  { 
    id: 'dessert-3', 
    category: 'الحلويات', 
    name: 'Chocolate Fondant', 
    desc: 'كيك الشوكولاتة الدافئ بقلب سائل', 
    price: 195
  },
];

const CATEGORIES = [
  'الشوربات', 
  'المقبلات', 
  'السلطات', 
  'الأطباق الهندية الرئيسية', 
  'البرياني والأرز', 
  'التندوري والمشاوي', 
  'الأطباق العالمية الرئيسية', 
  'المكرونة', 
  'خبز الدار', 
  'الحلويات'
];

// --- Components ---

const OrnamentalDivider = () => (
  <div className="flex items-center justify-center gap-4 my-12 opacity-80">
    <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
    <div className="flex gap-2 items-center">
      <div className="w-1.5 h-1.5 rotate-45 bg-gold shadow-[0_0_10px_rgba(201,163,92,0.8)]"></div>
      <div className="w-3 h-3 rotate-45 border border-gold shadow-[0_0_15px_rgba(201,163,92,0.4)]"></div>
      <div className="w-1.5 h-1.5 rotate-45 bg-gold shadow-[0_0_10px_rgba(201,163,92,0.8)]"></div>
    </div>
    <div className="h-[1px] w-24 bg-gradient-to-l from-transparent via-gold to-transparent"></div>
  </div>
);

const GoldFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`relative p-1 group/frame ${className}`}>
    {/* Outer subtle glow */}
    <div className="absolute inset-0 bg-gold/5 blur-xl opacity-0 group-hover/frame:opacity-100 transition-opacity duration-300"></div>
    {/* Main Border */}
    <div className="absolute inset-0 border border-gold/20 group-hover/frame:border-gold/40 transition-colors duration-300 rounded-2xl"></div>
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold rounded-tl-2xl shadow-[0_0_15px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold rounded-tr-2xl shadow-[0_0_15px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold rounded-bl-2xl shadow-[0_0_15px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold rounded-br-2xl shadow-[0_0_15px_rgba(201,163,92,0.3)]"></div>
    
    <div className="bg-ink/90 rounded-2xl h-full overflow-hidden relative z-10">
      {children}
    </div>
  </div>
);

const FireEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
    <motion.div 
      animate={{ 
        scale: [1, 1.05, 1],
        opacity: [0.3, 0.5, 0.3],
        y: [0, -10, 0]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-20 left-0 right-0 h-64 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,100,0,0.4)_0%,_transparent_70%)] blur-3xl will-change-transform"
    />
  </div>
);

const SpiceParticles = () => {
  const [particleCount, setParticleCount] = useState(15);
  
  useEffect(() => {
    if (window.innerWidth < 768) setParticleCount(6);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(particleCount)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, "-=100"],
            opacity: [0, 0.4, 0],
            x: [null, i % 2 === 0 ? "+=15" : "-=15"]
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            delay: Math.random() * 10 
          }}
          className="absolute w-1 h-1 bg-gold/40 rounded-full blur-[1px] will-change-transform"
        />
      ))}
    </div>
  );
};

const OrderingSystem: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', phone: '', address: '', notes: '' });
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isOrderSent, setIsOrderSent] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Initialize quantities
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    MENU_DATA.forEach(item => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
  }, []);

  const totalAmount = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const addToCart = (item: MenuItem) => {
    const qty = quantities[item.id] || 1;
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      }
      return [...prev, { ...item, quantity: qty }];
    });
    
    // Reset quantity selector for this item
    setQuantities(prev => ({ ...prev, [item.id]: 1 }));
    
    // Show feedback or open cart
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleCheckout = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('يرجى إدخال الاسم ورقم الهاتف والعنوان');
      return;
    }

    setIsRedirecting(true);

    const orderDetails = cart.map(item => `- ${item.name} ×${item.quantity} = ${item.price * item.quantity} EGP`).join('\n');
    const message = `طلب جديد من الموقع:
--------------------
الاسم: ${customerInfo.name}
رقم الهاتف: ${customerInfo.phone}
العنوان: ${customerInfo.address}

الطلبات:
${orderDetails}

الإجمالي: ${totalAmount} EGP

ملاحظات: ${customerInfo.notes || 'لا يوجد'}`;

    const encodedMessage = encodeURIComponent(message);
    
    // Wait for 2.5 seconds to show the premium loading experience
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const whatsappUrl = `https://wa.me/201203243503?text=${encodedMessage}`;
    
    try {
      window.location.href = whatsappUrl;
    } catch (e) {
      console.error("Redirection failed", e);
      window.open(whatsappUrl, '_blank');
    }
    
    setIsRedirecting(false);
    setIsOrderSent(true);
    
    // Auto close and reset after delay
    setTimeout(() => {
      setShowCheckout(false);
      setIsCartOpen(false);
      setCart([]);
      setIsOrderSent(false);
      setCustomerInfo({ name: '', phone: '', address: '', notes: '' });
      if (onClose) onClose();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-ink text-beige font-sans selection:bg-gold selection:text-ink overflow-x-hidden relative">
      {/* Cinematic Background Layers */}
      <div className="fixed inset-0 z-[-2] bg-ink"></div>
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_#0a0a0a_100%)] opacity-60"></div>
      <div className="fixed inset-0 z-[-1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')` }}></div>
      <FireEffect />
      <SpiceParticles />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-ink/80 backdrop-blur-xl border-b border-white/5 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onClose && (
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gold">
                <ArrowRight size={24} />
              </button>
            )}
            <img 
              src="https://i.postimg.cc/kGFwP47g/599946786-1155252650100970-534780702069780137-n-removebg-preview.png" 
              alt="Logo" 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-2xl md:text-4xl font-serif text-gold tracking-widest">قائمة الطعام والطلب</h1>
          </div>
          
          <motion.button 
            onClick={() => setIsCartOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-3 bg-gold/10 border border-gold/30 rounded-full text-gold hover:bg-gold hover:text-ink transition-all duration-300 group shadow-[0_0_20px_rgba(201,163,92,0.2)]"
          >
            <ShoppingBag size={24} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-burgundy text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border border-gold/50 animate-pulse">
                {totalItems}
              </span>
            )}
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
        {/* Category Navigation */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex overflow-x-auto gap-4 mb-8 pb-4 no-scrollbar w-full justify-start md:justify-center">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full whitespace-nowrap transition-all duration-300 font-serif text-lg tracking-wider border ${
                  activeCategory === cat 
                  ? 'bg-gold text-ink border-gold shadow-[0_0_20px_rgba(201,163,92,0.4)]' 
                  : 'bg-white/5 text-beige/60 border-white/10 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          <OrnamentalDivider />
        </div>

        {/* Menu List */}
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-16">
          <AnimatePresence mode="wait">
            {MENU_DATA.filter(item => item.category === activeCategory).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <GoldFrame className="group hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-2xl bg-ink/95 backdrop-blur-md">
                  <div className="px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-2xl md:text-3xl font-serif text-white group-hover:text-gold transition-colors duration-300">{item.name}</h3>
                        {item.tag === 'popular' && (
                          <span className="text-[10px] uppercase tracking-widest text-ink bg-gold px-2 py-0.5 rounded-full font-bold whitespace-nowrap shadow-[0_0_10px_rgba(201,163,92,0.5)]">
                            شعبي
                          </span>
                        )}
                      </div>
                      <p className="text-beige/70 text-sm md:text-base font-light leading-relaxed max-w-xl">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 shrink-0">
                      <div className="text-gold font-serif text-2xl md:text-3xl whitespace-nowrap">
                        {item.price} <span className="text-lg">ج.م</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-1 shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gold hover:bg-gold/20 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-serif text-xl text-white">{quantities[item.id] || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gold hover:bg-gold/20 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <motion.button 
                          onClick={() => addToCart(item)}
                          whileHover={{ scale: 1.1, backgroundColor: '#FFFFFF' }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-gold text-ink p-3 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_5px_15px_rgba(201,163,92,0.3)]"
                        >
                          <Plus size={20} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </GoldFrame>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Cart Sidebar Overlay */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-ink/80 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[320px] bg-ink border-l border-gold/20 z-50 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-burgundy/10">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="text-gold" />
                  <h2 className="text-2xl font-serif text-white tracking-widest">طلباتك</h2>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-beige/60">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                    <ShoppingBag size={64} className="text-gold/20" />
                    <p className="text-xl font-serif">سلة الطلبات فارغة</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-gold border-b border-gold/30 pb-1 hover:text-white hover:border-white transition-all"
                    >
                      ابدأ باختيار أطباقك المفضلة
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-beige/40 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="text-gold font-serif text-sm mb-3">{item.price} ج.م</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-0.5">
                            <motion.button 
                              onClick={() => updateCartItemQuantity(item.id, -1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gold/20 text-gold transition-colors"
                            >
                              <Minus size={12} />
                            </motion.button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <motion.button 
                              onClick={() => updateCartItemQuantity(item.id, 1)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gold/20 text-gold transition-colors"
                            >
                              <Plus size={12} />
                            </motion.button>
                          </div>
                          <div className="text-white/80 font-serif">{item.price * item.quantity} ج.م</div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-burgundy/5 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-beige/60">
                      <span className="text-sm">عدد الأصناف</span>
                      <span className="text-sm">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-xl font-serif text-white pt-2 border-t border-white/5">
                      <span>الإجمالي</span>
                      <motion.span 
                        key={totalAmount}
                        initial={{ scale: 1.2, color: '#C9A35C' }}
                        animate={{ scale: 1, color: '#C9A35C' }}
                        className="text-gold"
                      >
                        {totalAmount} ج.م
                      </motion.span>
                    </div>
                  </div>

                  <motion.button 
                    onClick={() => setShowCheckout(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gold hover:bg-white text-ink font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(201,163,92,0.2)]"
                  >
                    <span>إتمام الطلب</span>
                    <ChevronRight size={20} />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isOrderSent && setShowCheckout(false)}
              className="absolute inset-0 bg-ink/95 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-ink border border-gold/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(201,163,92,0.15)]"
            >
              <AnimatePresence mode="wait">
                {isRedirecting ? (
                  <motion.div 
                    key="redirecting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 text-center flex flex-col items-center justify-center space-y-8 min-h-[400px]"
                  >
                    <div className="relative w-24 h-24">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-4 border-gold/20 border-t-gold rounded-full"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <MessageCircle size={32} className="text-gold" />
                      </motion.div>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl font-serif text-white tracking-widest">جارٍ تحويلك إلى واتساب لإتمام الطلب...</h3>
                      <p className="text-beige/40 text-sm font-light">يرجى الانتظار لحظة بينما نقوم بتجهيز طلبك</p>
                    </div>
                    <div className="w-full max-w-xs h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2.5, ease: "easeInOut" }}
                        className="h-full bg-gold shadow-[0_0_10px_rgba(201,163,92,0.5)]"
                      />
                    </div>
                  </motion.div>
                ) : isOrderSent ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[400px]"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                      className="w-20 h-20 bg-gold rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(201,163,92,0.5)]"
                    >
                      <CheckCircle2 size={40} className="text-ink" />
                    </motion.div>
                    <div className="space-y-2">
                      <motion.h3 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-serif text-white tracking-widest"
                      >
                        تم إرسال الطلب!
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-beige/60 font-light"
                      >
                        شكراً لاختيارك كارفين ماسالا. سيتم التواصل معك قريباً.
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4"
                      >
                        <a 
                          href={`https://wa.me/201203243503?text=${encodeURIComponent(`طلب جديد من الموقع:\n--------------------\nالاسم: ${customerInfo.name}\nرقم الهاتف: ${customerInfo.phone}\nالعنوان: ${customerInfo.address}\n\nالطلبات:\n${cart.map(item => `- ${item.name} ×${item.quantity} = ${item.price * item.quantity} EGP`).join('\n')}\n\nالإجمالي: ${totalAmount} EGP\n\nملاحظات: ${customerInfo.notes || 'لا يوجد'}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-gold border border-gold/30 px-6 py-2 rounded-full hover:bg-gold hover:text-ink transition-all text-sm"
                        >
                          <MessageCircle size={16} />
                          إذا لم يتم تحويلك تلقائياً، اضغط هنا
                        </a>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                    <div className="p-8 border-b border-white/5 bg-burgundy/10 flex items-center justify-between">
                      <h3 className="text-2xl font-serif text-white tracking-widest">بيانات التوصيل</h3>
                      <button onClick={() => setShowCheckout(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-beige/40">
                        <X size={20} />
                      </button>
                    </div>

                    <div className="p-8 space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-gold text-xs font-medium tracking-widest uppercase">الاسم بالكامل *</label>
                          <input 
                            type="text" 
                            required
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="أدخل اسمك هنا"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-gold text-xs font-medium tracking-widest uppercase">رقم الهاتف *</label>
                          <input 
                            type="tel" 
                            required
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="أدخل رقم هاتفك"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-gold text-xs font-medium tracking-widest uppercase">العنوان بالتفصيل *</label>
                          <input 
                            type="text" 
                            required
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="المنطقة، الشارع، رقم المبنى/الشقة"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-gold text-xs font-medium tracking-widest uppercase">ملاحظات إضافية (اختياري)</label>
                          <textarea 
                            rows={3}
                            value={customerInfo.notes}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="أي تعليمات خاصة بالطلب..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                          <Info className="text-gold shrink-0" size={20} />
                          <p className="text-beige/60 text-xs leading-relaxed">
                            سيتم توجيهك إلى تطبيق واتساب لإرسال تفاصيل الطلب تلقائياً إلى المطعم.
                          </p>
                        </div>

                        <motion.button 
                          onClick={handleCheckout}
                          disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(37,211,102,0.2)] disabled:opacity-50 disabled:grayscale"
                        >
                          <MessageCircle size={20} />
                          <span>إرسال الطلب عبر واتساب</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {cart.length > 0 && !isCartOpen && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gold text-ink w-16 h-16 rounded-full shadow-[0_10px_30px_rgba(201,163,92,0.4)] flex items-center justify-center border-2 border-white/20"
        >
          <div className="relative">
            <ShoppingBag size={28} />
            <span className="absolute -top-2 -right-2 bg-burgundy text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-gold font-bold">
              {totalItems}
            </span>
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default OrderingSystem;
