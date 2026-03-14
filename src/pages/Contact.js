import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2, Check, MessageSquare } from 'lucide-react';

function AnimatedSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-30px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digitsOnly });
      setError('');
      return;
    }

    setForm({ ...form, [name]: value });
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    if (form.phone && !/^\d{10}$/.test(form.phone)) { setError('Phone number must be exactly 10 digits.'); return; }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        phone: form.phone ? `1${form.phone}` : '',
      };
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Failed to send message.');
      setSubmitted(true);
    }
    catch (err) { setError(err.message || 'Failed to send message. Please try again.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen pt-20 relative">
      <div className="indian-mandala-tl" /><div className="indian-mandala-br" />

      {/* Hero */}
      <section className="py-20 bg-pattern bg-indian-paisley relative overflow-hidden bg-indian-arch">
        <div className="indian-vine-left" /><div className="indian-vine-right" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <AnimatedSection>
            <span className="text-amber-500 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider">Contact Us</span>
            <div className="section-divider !mx-0" />
            <h1 className="font-display text-5xl md:text-6xl font-bold text-neutral-900 dark:text-white mt-4 mb-4">Get in <span className="text-gold-gradient">Touch</span></h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl">Have a question, feedback, or just want to say hello? We'd love to hear from you.</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-16 bg-neutral-50 dark:bg-dark-950 bg-indian-jali relative overflow-hidden">
        <div className="indian-vine-left" /><div className="indian-vine-right" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: MapPin, title: 'Our Locations', lines: ['5507 Hazeldean Rd Unit C3-1, Stittsville, ON', '1111 Wellington St. W, Ottawa, ON'] },
                { icon: Phone, title: 'Phone', lines: ['Stittsville & Wellington branches', 'Contact us via email for quick support'] },
                { icon: Mail, title: 'Email', lines: ['contact@masakaliottawa.ca'] },
                { icon: Clock, title: 'Hours', lines: ['Open Daily: 11:30 AM - 10:00 PM', 'For both Ottawa branches'] },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <AnimatedSection key={item.title} delay={i * 0.1}>
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm dark:shadow-none">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-amber-500 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="text-neutral-900 dark:text-white font-semibold text-sm mb-1">{item.title}</h3>
                          {item.lines.map((line, j) => <p key={j} className="text-neutral-500 text-sm">{line}</p>)}
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <AnimatedSection delay={0.2}>
                {submitted ? (
                  <div className="bg-white dark:bg-neutral-900 border border-green-500/20 rounded-2xl p-10 text-center shadow-sm dark:shadow-none">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} className="text-green-500 dark:text-green-400" />
                    </div>
                    <h2 className="font-display text-3xl font-bold text-neutral-900 dark:text-white mb-4">Message Sent!</h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-8">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn-gold">Send Another Message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8 shadow-sm dark:shadow-none">
                    <div className="flex items-center gap-3 mb-8">
                      <MessageSquare size={24} className="text-amber-500 dark:text-amber-400" />
                      <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">Send Us a Message</h2>
                    </div>
                    {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 dark:text-red-400 text-sm">{error}</div>}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="block text-neutral-500 dark:text-neutral-400 text-sm mb-2">Full Name *</label><input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your name" className="input-dark" required /></div>
                      <div><label className="block text-neutral-500 dark:text-neutral-400 text-sm mb-2">Email Address *</label><input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" className="input-dark" required /></div>
                      <div><label className="block text-neutral-500 dark:text-neutral-400 text-sm mb-2">Phone</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="4373761995" className="input-dark" inputMode="numeric" pattern="[0-9]{10}" maxLength={10} minLength={10} /></div>
                      <div><label className="block text-neutral-500 dark:text-neutral-400 text-sm mb-2">Subject</label><select name="subject" value={form.subject} onChange={handleChange} className="select-dark"><option value="">Select a topic</option><option value="general">General Inquiry</option><option value="reservation">Reservation Help</option><option value="catering">Catering Inquiry</option><option value="feedback">Feedback</option><option value="partnership">Partnership</option><option value="other">Other</option></select></div>
                      <div className="md:col-span-2"><label className="block text-neutral-500 dark:text-neutral-400 text-sm mb-2">Message *</label><textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="How can we help you?" className="input-dark resize-none" required /></div>
                    </div>
                    <div className="mt-8"><button type="submit" disabled={submitting} className="btn-gold disabled:opacity-50">{submitting ? <><Loader2 size={18} className="mr-2 animate-spin" /> Sending...</> : <><Send size={18} className="mr-2" /> Send Message</>}</button></div>
                  </form>
                )}
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
