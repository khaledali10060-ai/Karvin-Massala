import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MessageCircle, 
  CheckCircle2,
  ArrowRight,
  Info
} from 'lucide-react';

interface ReservationData {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

const ReservationSystem: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState<ReservationData>({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.guests) {
      return;
    }

    setIsSubmitting(true);

    const message = `حجز جديد:
--------------------
الاسم: ${formData.name}
رقم الهاتف: ${formData.phone}

التاريخ: ${formData.date}
الوقت: ${formData.time}
عدد الأفراد: ${formData.guests}

ملاحظات: ${formData.notes || 'لا يوجد'}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/201203243503?text=${encodedMessage}`;

    // Show success animation then redirect
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRedirecting(true);
      
      setTimeout(() => {
        setIsSuccess(true);
        // Using window.location.href is more reliable than window.open in some environments
        // and less likely to be blocked by popup blockers when called after a delay.
        try {
          window.location.href = whatsappUrl;
        } catch (e) {
          console.error("Redirection failed", e);
          window.open(whatsappUrl, '_blank');
        }
        
        // Auto close after delay
        setTimeout(() => {
          onClose();
        }, 5000);
      }, 2500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/95 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="relative w-full max-w-2xl bg-ink border border-gold/30 rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(201,163,92,0.15)] will-change-transform"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b0d0d_0%,_transparent_70%)]" />
        </div>

        <AnimatePresence mode="wait">
          {isRedirecting ? (
            <motion.div 
              key="redirecting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-12 text-center flex flex-col items-center justify-center space-y-8 min-h-[500px] relative z-10"
            >
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-2 border-gold/20 border-t-gold rounded-full will-change-transform"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-2 border-gold/10 border-b-gold rounded-full will-change-transform"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageCircle size={40} className="text-gold animate-pulse" />
                </div>
              </div>
              
              <div className="space-y-4">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-serif text-white tracking-widest"
                >
                  جارٍ تحويلك إلى واتساب...
                </motion.h3>
                <p className="text-beige/60 font-light max-w-xs mx-auto">
                  نحن نجهز تفاصيل حجزك الملكي لتأكيدها مع فريق الاستقبال.
                </p>
              </div>

              <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-gold to-transparent"
                />
              </div>
            </motion.div>
          ) : isSuccess ? (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center flex flex-col items-center justify-center space-y-6 min-h-[500px] relative z-10"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-24 h-24 bg-gold rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(201,163,92,0.5)]"
              >
                <CheckCircle2 size={48} className="text-ink" />
              </motion.div>
              <div className="space-y-2">
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-serif text-white tracking-widest"
                >
                  تم إرسال طلب الحجز!
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-beige/60 font-light"
                >
                  شكراً لاختيارك كارفين ماسالا. سيتم التواصل معك قريباً لتأكيد الحجز.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="pt-4"
                >
                  <a 
                    href={`https://wa.me/201203243503?text=${encodeURIComponent(`حجز جديد:\n--------------------\nالاسم: ${formData.name}\nرقم الهاتف: ${formData.phone}\n\nالتاريخ: ${formData.date}\nالوقت: ${formData.time}\nعدد الأفراد: ${formData.guests}\n\nملاحظات: ${formData.notes || 'لا يوجد'}`)}`}
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
            <motion.div key="form" exit={{ opacity: 0, y: -20 }} className="flex flex-col h-full max-h-[90vh] relative z-10">
              {/* Header */}
              <div className="p-8 bg-burgundy/20 border-b border-gold/20 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gold/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <img 
                      src="https://i.postimg.cc/kGFwP47g/599946786-1155252650100970-534780702069780137-n-removebg-preview.png" 
                      alt="Logo" 
                      className="h-12 md:h-16 w-auto object-contain relative"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-gold tracking-widest mb-2">حجز طاولة</h2>
                    <p className="text-beige/60 font-light text-sm">استمتع بتجربة طعام ملكية في كارفين ماسالا</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose} 
                  className="p-2 hover:bg-white/5 rounded-full text-beige/40 transition-colors"
                >
                  <X size={28} />
                </motion.button>
              </div>

              {/* Form Body */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                        الاسم بالكامل *
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="أدخل اسمك"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all focus:bg-white/10"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                        رقم الهاتف *
                      </label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="01xxxxxxxxx"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all focus:bg-white/10"
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                        <Calendar size={12} /> التاريخ *
                      </label>
                      <input 
                        type="date" 
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark] focus:bg-white/10"
                      />
                    </div>

                    {/* Time */}
                    <div className="space-y-2">
                      <label className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                        <Clock size={12} /> الوقت *
                      </label>
                      <input 
                        type="time" 
                        name="time"
                        required
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark] focus:bg-white/10"
                      />
                    </div>

                    {/* Guests */}
                    <div className="space-y-2">
                      <label className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                        <Users size={12} /> عدد الأفراد *
                      </label>
                      <div className="relative">
                        <select 
                          name="guests"
                          required
                          value={formData.guests}
                          onChange={handleChange}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-gold/50 transition-all appearance-none focus:bg-white/10"
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <option key={n} value={n} className="bg-ink text-white">{n} {n === 1 ? 'فرد' : 'أفراد'}</option>
                          ))}
                          <option value="10+" className="bg-ink text-white">أكثر من 10</option>
                        </select>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gold/50">
                          <ArrowRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase">ملاحظات إضافية (اختياري)</label>
                    <textarea 
                      name="notes"
                      rows={3}
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="أي طلبات خاصة أو مناسبة معينة..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-beige/20 focus:outline-none focus:border-gold/50 transition-all resize-none focus:bg-white/10"
                    />
                  </div>

                  {/* Info Box */}
                  <div className="flex items-center gap-3 p-4 bg-gold/5 rounded-2xl border border-gold/10">
                    <Info className="text-gold shrink-0" size={20} />
                    <p className="text-beige/60 text-xs leading-relaxed">
                      سيتم إرسال تفاصيل حجزك عبر واتساب لتأكيد الموعد مع فريق الاستقبال.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <motion.button 
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gold hover:bg-white text-ink font-bold py-5 rounded-2xl transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(201,163,92,0.2)] disabled:opacity-50 group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
                    ) : (
                      <>
                        <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xl">احجز الآن</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ReservationSystem;
