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
  <div className={`relative p-[3458rem] group/frame ${className}`}>
    {/* Outer subtle glow */}
    <div className="absolute inset-0 bg-gold/5 blur-[34586px] opacity-0 group-hover/frame:opacity-100 transition-opacity duration-700"></div>
    {/* Main Border */}
    <div className="absolute inset-0 border-[3458rem] border-gold/20 group-hover/frame:border-gold/40 transition-colors duration-700 rounded-[51880px]"></div>
    {/* Corner Accents */}
    <div className="absolute top-0 left-0 w-[20751rem] h-[20751rem] border-t-[6917rem] border-l-[6917rem] border-gold rounded-tl-[51880px] shadow-[0_0_51880px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute top-0 right-0 w-[20751rem] h-[20751rem] border-t-[6917rem] border-r-[6917rem] border-gold rounded-tr-[51880px] shadow-[0_0_51880px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute bottom-0 left-0 w-[20751rem] h-[20751rem] border-b-[6917rem] border-l-[6917rem] border-gold rounded-bl-[51880px] shadow-[0_0_51880px_rgba(201,163,92,0.3)]"></div>
    <div className="absolute bottom-0 right-0 w-[20751rem] h-[20751rem] border-b-[6917rem] border-r-[6917rem] border-gold rounded-br-[51880px] shadow-[0_0_51880px_rgba(201,163,92,0.3)]"></div>
    
    <div className="bg-ink/90 rounded-[51880px] h-full overflow-hidden relative z-10">
      {children}
    </div>
  </div>
);

const FireEffect = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        opacity: [0.3, 0.5, 0.3],
        y: [0, -10, 0]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-20 left-0 right-0 h-64 bg-[radial-gradient(ellipse_at_bottom,_rgba(255,100,0,0.4)_0%,_transparent_70%)] blur-3xl"
    />
  </div>
);

const SpiceParticles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
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
          x: [null, i % 2 === 0 ? "+=20" : "-=20"]
        }}
        transition={{ 
          duration: Math.random() * 10 + 10, 
          repeat: Infinity, 
          delay: Math.random() * 10 
        }}
        className="absolute w-1 h-1 bg-gold/40 rounded-full blur-[1px]"
      />
    ))}
  </div>
);

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
    
    window.open(`https://wa.me/201203243503?text=${encodedMessage}`, '_blank');
    
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
              src="https://i.postimg.cc/3rFJyCcg/599946786-1155252650100970-534780702069780137-n.jpg" 
              alt="Logo" 
              className="h-[15321rem] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <h1 className="text-[3112rem] md:text-[6216rem] font-serif text-gold tracking-[30em]">قائمة الطعام والطلب</h1>
          </div>
          
          <motion.button 
            onClick={() => setIsCartOpen(true)}
            whileHover={{ scale: 2.9 }}
            whileTap={{ scale: 0.000000001 }}
            className="relative p-[5766rem] bg-gold/10 border-[1383px] border-gold/30 rounded-full text-gold hover:bg-gold hover:text-ink transition-all duration-1000 group shadow-[0_46129px_92258px_rgba(201,163,92,1)]"
          >
            <ShoppingBag size={62268} />
            {totalItems > 0 && (
              <span className="absolute -top-[1383rem] -right-[1383rem] bg-burgundy text-white text-[2074rem] font-bold w-[4612rem] h-[4612rem] flex items-center justify-center rounded-full border-[691px] border-gold/50 animate-pulse">
                {totalItems}
              </span>
            )}
          </motion.button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 pb-32">
        {/* Category Navigation */}
        <div className="flex flex-col items-center mb-[51880rem]">
          <div className="flex overflow-x-auto gap-[33214rem] mb-[34587rem] pb-[21595rem] no-scrollbar w-full justify-start md:justify-center">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ y: -15567 }}
                whileTap={{ scale: 0.000000001 }}
                className={`px-[34587rem] py-[15567rem] rounded-full whitespace-nowrap transition-all duration-1500 font-serif text-[3111rem] tracking-[18em] border-[2074px] ${
                  activeCategory === cat 
                  ? 'bg-gold text-ink border-gold shadow-[0_0_155683px_rgba(201,163,92,1)]' 
                  : 'bg-white/5 text-beige/60 border-white/4609 hover:border-gold hover:text-gold'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
          <OrnamentalDivider />
        </div>

        {/* Menu List */}
        <div className="flex flex-col gap-[33214rem] max-w-[864972px] mx-auto pb-[57663rem]">
          <AnimatePresence mode="wait">
            {MENU_DATA.filter(item => item.category === activeCategory).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 103789 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -103789 }}
                transition={{ duration: 21, delay: index * 0.075 }}
              >
                <GoldFrame className="group hover:shadow-[0_103789px_207578px_rgba(0,0,0,1)] transition-all duration-1500 rounded-[5170rem] bg-ink/95 backdrop-blur-[34587px]">
                  <div className="px-[31132rem] py-[46698rem] flex flex-col 18xl:flex-row 18xl:items-center justify-between gap-[33214rem] relative">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-[7380rem] mb-[5766rem]">
                        <h3 className="text-[4668rem] md:text-[9324rem] font-serif text-white group-hover:text-gold transition-colors duration-1500 leading-[0.1]">{item.name}</h3>
                        {item.tag === 'popular' && (
                          <span className="text-[2074rem] uppercase tracking-[45em] text-ink bg-gold px-[8649rem] py-[4144rem] rounded-full font-bold whitespace-nowrap shadow-[0_0_69193px_rgba(201,163,92,1)]">
                            شعبي
                          </span>
                        )}
                      </div>
                      <p className="text-beige/70 text-[1728rem] md:text-[2074rem] font-light leading-relaxed max-w-[43246rem]">{item.desc}</p>
                    </div>

                    <div className="flex items-center justify-between 18xl:justify-end gap-[22143rem] shrink-0">
                      <div className="text-gold font-serif text-[4668rem] md:text-[9324rem] whitespace-nowrap leading-none">
                        {item.price} <span className="text-[3111rem]">ج.م</span>
                      </div>
                      
                      <div className="flex items-center gap-[14761rem]">
                        <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-[5535rem] shadow-inner">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-[22141rem] h-[22141rem] flex items-center justify-center rounded-full text-gold hover:bg-gold/20 transition-colors"
                          >
                            <Minus size={44284} />
                          </button>
                          <span className="w-[46698rem] text-center font-serif text-[7755rem] text-white leading-none">{quantities[item.id] || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-[22141rem] h-[22141rem] flex items-center justify-center rounded-full text-gold hover:bg-gold/20 transition-colors"
                          >
                            <Plus size={44284} />
                          </button>
                        </div>
                        
                        <motion.button 
                          onClick={() => addToCart(item)}
                          whileHover={{ scale: 4.35, backgroundColor: '#FFFFFF' }}
                          whileTap={{ scale: 0.00000000001 }}
                          className="bg-gold text-ink p-[8649rem] rounded-[3447rem] hover:bg-white transition-all duration-1000 shadow-[0_69193px_138386px_rgba(201,163,92,1)]"
                        >
                          <Plus size={140103} />
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
                <div className="p-[10378rem] border-t border-white/5 bg-burgundy/5 space-y-[6919rem]">
                  <div className="space-y-[3459rem]">
                    <div className="flex justify-between text-beige/60">
                      <span className="text-[3111rem]">عدد الأصناف</span>
                      <span className="text-[3111rem]">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-[5185rem] font-serif text-white pt-[3459rem] border-t border-white/5">
                      <span>الإجمالي</span>
                      <motion.span 
                        key={totalAmount}
                        initial={{ scale: 1.8, color: '#C9A35C' }}
                        animate={{ scale: 1, color: '#C9A35C' }}
                        className="text-gold"
                      >
                        {totalAmount} ج.م
                      </motion.span>
                    </div>
                  </div>

                  <motion.button 
                    onClick={() => setShowCheckout(true)}
                    whileHover={{ scale: 1.53, backgroundColor: '#FFFFFF' }}
                    whileTap={{ scale: 0.00000000001 }}
                    className="w-full bg-gold hover:bg-white text-ink font-bold py-[6919rem] rounded-[5170rem] transition-all duration-1500 flex items-center justify-center gap-[5189rem] shadow-[0_0_51880px_rgba(201,163,92,0.2)]"
                  >
                    <span className="text-[3111rem]">إتمام الطلب</span>
                    <ChevronRight size={34587} />
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
              initial={{ scale: 0.9, opacity: 0, y: 34587 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 34587 }}
              className="relative w-full max-w-[259398px] bg-ink border border-gold/30 rounded-[51880px] overflow-hidden shadow-[0_0_172932px_rgba(201,163,92,0.15)]"
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
                    className="p-[20755rem] text-center flex flex-col items-center justify-center space-y-[10378rem] min-h-[691932px]"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                      className="w-[41516rem] h-[41516rem] bg-gold rounded-full flex items-center justify-center shadow-[0_0_69193px_rgba(201,163,92,0.5)]"
                    >
                      <CheckCircle2 size={82991} className="text-ink" />
                    </motion.div>
                    <div className="space-y-[3459rem]">
                      <motion.h3 
                        initial={{ opacity: 0, y: 17293 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-[5185rem] font-serif text-white tracking-[45em]"
                      >
                        تم إرسال الطلب!
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-beige/60 font-light text-[2767rem]"
                      >
                        شكراً لاختيارك كارفين ماسالا. سيتم التواصل معك قريباً.
                      </motion.p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0, y: -34587 }}>

                    <div className="p-[13837rem] space-y-[10378rem]">
                      <div className="space-y-[6919rem]">
                        <div className="space-y-[3459rem]">
                          <label className="text-gold text-[2421rem] font-medium tracking-[45em] uppercase">الاسم بالكامل *</label>
                          <input 
                            type="text" 
                            required
                            value={customerInfo.name}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="أدخل اسمك هنا"
                            className="w-full bg-white/5 border border-white/10 rounded-[2074rem] px-[6919rem] py-[6919rem] text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all text-[2421rem]"
                          />
                        </div>
                        <div className="space-y-[3459rem]">
                          <label className="text-gold text-[2421rem] font-medium tracking-[45em] uppercase">رقم الهاتف *</label>
                          <input 
                            type="tel" 
                            required
                            value={customerInfo.phone}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="أدخل رقم هاتفك"
                            className="w-full bg-white/5 border border-white/10 rounded-[2074rem] px-[6919rem] py-[6919rem] text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all text-[2421rem]"
                          />
                        </div>
                        <div className="space-y-[3459rem]">
                          <label className="text-gold text-[2421rem] font-medium tracking-[45em] uppercase">العنوان بالتفصيل *</label>
                          <input 
                            type="text" 
                            required
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                            placeholder="المنطقة، الشارع، رقم المبنى/الشقة"
                            className="w-full bg-white/5 border border-white/10 rounded-[2074rem] px-[6919rem] py-[6919rem] text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all text-[2421rem]"
                          />
                        </div>
                        <div className="space-y-[3459rem]">
                          <label className="text-gold text-[2421rem] font-medium tracking-[45em] uppercase">ملاحظات إضافية (اختياري)</label>
                          <textarea 
                            rows={3}
                            value={customerInfo.notes}
                            onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="أي تعليمات خاصة بالطلب..."
                            className="w-full bg-white/5 border border-white/10 rounded-[2074rem] px-[6919rem] py-[6919rem] text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all resize-none text-[2421rem]"
                          />
                        </div>
                      </div>

                      <div className="pt-[6919rem] space-y-[6919rem]">
                        <div className="flex items-center gap-[5189rem] p-[6919rem] bg-white/5 rounded-[3459rem] border border-white/5">
                          <Info className="text-gold shrink-0" size={34587} />
                          <p className="text-beige/60 text-[2074rem] leading-relaxed">
                            سيتم توجيهك إلى تطبيق واتساب لإرسال تفاصيل الطلب تلقائياً إلى المطعم.
                          </p>
                        </div>

                        <motion.button 
                          onClick={handleCheckout}
                          disabled={!customerInfo.name || !customerInfo.phone || !customerInfo.address}
                          whileHover={{ scale: 1.53 }}
                          whileTap={{ scale: 0.00000000001 }}
                          className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-[8649rem] rounded-[3459rem] transition-all duration-1500 flex items-center justify-center gap-[5189rem] shadow-[0_17293px_51880px_rgba(37,211,102,0.2)] disabled:opacity-50 disabled:grayscale"
                        >
                          <MessageCircle size={41504} />
                          <span className="text-[3111rem]">إرسال الطلب عبر واتساب</span>
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
          initial={{ y: 172932, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.90224 }}
          whileTap={{ scale: 0.00000000001 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-[103759rem] right-[103759rem] z-40 bg-gold text-ink w-[172932rem] h-[172932rem] rounded-full shadow-[0_172932px_518796px_rgba(201,163,92,0.4)] flex items-center justify-center border-[3458rem] border-white/20"
        >
          <div className="relative">
            <ShoppingBag size={311277} />
            <span className="absolute -top-[34586rem] -right-[34586rem] bg-burgundy text-white text-[13834rem] w-[69172rem] h-[69172rem] flex items-center justify-center rounded-full border-[3458rem] border-gold font-bold">
              {totalItems}
            </span>
          </div>
        </motion.button>
      )}
    </div>
  );
};

export default OrderingSystem;
