import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Ticket, 
  ChevronLeft, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Info,
  Sliders,
  Upload,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import myBackgroundVideo from './bg-video.mp4'; 


import bkashLogoImg from './assets/bkash.png';
import rocketLogoImg from './assets/rocket.png';
import nagadLogoImg from './assets/nagad.png';


const bkashLogo: string = bkashLogoImg;
const rocketLogo: string = rocketLogoImg;
const nagadLogo: string = nagadLogoImg;

// --- Types & Constants ---

interface EventData {
  id: string;
  title: string;
  desc: string;
  date: string;
  time: string;
  venue: string;
  isPopular?: boolean;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string;
}

interface Booking {
  ticketId: string;
  name: string;
  phone: string;
  email: string;
  event: EventData;
  tier: TicketTier;
  quantity: number;
  totalAmount: number;
  paymentMethod: 'bKash' | 'Rocket' | 'Nagad';
  senderNumber: string;
  transactionId: string;
  paymentDetails: string;
  bookedAt: string;
}

const EVENTS: EventData[] = [
  {
    id: 'metro-to-retro',
    title: 'Metro to Retro Carnival 2.0',
    desc: 'A nostalgic musical journey and cultural carnival hosted by BGI_COMMUNITY. Experience the evolution of sound.',
    date: 'Dec 18, 2026',
    time: '6:30 PM',
    venue: 'Announced on FB Page',
    isPopular: true
  }
];

const TICKET_TIERS: TicketTier[] = [
  {
    id: 'general',
    name: 'General',
    price: 500,
    perks: 'Standard entry. Open seating.'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 1500,
    perks: 'Priority entry. Welcome drink included.'
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 3500,
    perks: 'Front row zone. Lounge access. Exclusive meet & greet.'
  }
];

const MOOD_VIDEOS = [
  {
    id: 'custom-bg',
    name: 'Cinematic Backdrop (bg-video.mp4)',
    url: myBackgroundVideo 
  }
];

// Fixed Merchant Numbers for Sending Money
const MERCHANT_NUMBERS = {
  bKash: '01550000638',
  Rocket: '01305137294',
  Nagad: '01967917088'
};

function GoldenParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      speedX: number;
      speedY: number;
      opacity: number;
      pulseSpeed: number;
      angle: number;
    }> = [];

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = window.devicePixelRatio || 1;
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      initParticles(width, height);
    };

    const initParticles = (w: number, h: number) => {
      const colors = [
        'rgba(212, 175, 55, ',   
        'rgba(255, 215, 0, ',    
        'rgba(197, 160, 48, ',   
        'rgba(184, 134, 11, ',   
        'rgba(159, 126, 30, ',   
      ];
      
      const count = Math.min(80, Math.floor((w * h) / 20000)); 
      particles = [];
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 2.8 + 0.4; 
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          speedX: (Math.random() - 0.5) * 0.08, 
          speedY: -Math.random() * 0.12 - 0.03,  
          opacity: Math.random() * 0.4 + 0.1,    
          pulseSpeed: Math.random() * 0.003 + 0.001,
          angle: Math.random() * Math.PI * 2
        });
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        p.x += p.speedX;
        p.y += p.speedY;

        p.angle += p.pulseSpeed;
        p.x += Math.sin(p.angle) * 0.08;

        if (p.y < -15) {
          p.y = h + 15;
          p.x = Math.random() * w;
        }
        if (p.x < -15) {
          p.x = w + 15;
        } else if (p.x > w + 15) {
          p.x = -15;
        }

        const currentOpacity = p.opacity + Math.sin(p.angle * 2) * 0.06;
        const clampedOpacity = Math.max(0.02, Math.min(currentOpacity, 0.5));

        ctx.beginPath();
        const outerGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
        outerGrad.addColorStop(0, `${p.color}${clampedOpacity})`);
        outerGrad.addColorStop(0.35, `${p.color}${clampedOpacity * 0.35})`);
        outerGrad.addColorStop(1, `${p.color}0)`);
        
        ctx.fillStyle = outerGrad;
        ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
        ctx.fill();

        if (p.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${clampedOpacity * 0.85})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    handleResize();
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'tickets' | 'contact' | 'booking-wizard'>('home');
  const [selectedVideo, setSelectedVideo] = useState(MOOD_VIDEOS[0]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [bgBrightness, setBgBrightness] = useState(0.45);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const stored = localStorage.getItem('bgi_bookings');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [step, setStep] = useState<number>(1);
  const [selectedEvent, setSelectedEvent] = useState<EventData>(EVENTS[0]);
  const [selectedTier, setSelectedTier] = useState<TicketTier>(TICKET_TIERS[0]);
  const [ticketQty, setTicketQty] = useState<number>(1);
  
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Rocket' | 'Nagad'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [lastFinishedBooking, setLastFinishedBooking] = useState<Booking | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fontAudioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('bgi_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const playSynthesizerSound = (type: 'chirp' | 'success' | 'click' | 'reverb') => {
    if (!soundEnabled) return;
    try {
      if (!fontAudioCtxRef.current) {
        fontAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = fontAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'click') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'chirp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'success') {
        const tones = [523.25, 659.25, 783.99, 1046.5]; 
        tones.forEach((freq, idx) => {
          const singleOsc = ctx.createOscillator();
          const singleGain = ctx.createGain();
          singleOsc.connect(singleGain);
          singleGain.connect(ctx.destination);
          singleOsc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          singleGain.gain.setValueAtTime(0.05, ctx.currentTime + idx * 0.1);
          singleGain.gain.linearRampToValueAtTime(0, ctx.currentTime + idx * 0.1 + 0.3);
          singleOsc.start(ctx.currentTime + idx * 0.1);
          singleOsc.stop(ctx.currentTime + idx * 0.1 + 0.3);
        });
      } else if (type === 'reverb') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Sound generation could not initialize: ", e);
    }
  };

  const validateStep1 = () => {
    if (!regName.trim()) {
      showToast("Please provide your full name for registration.");
      return false;
    }
    if (!regPhone.trim() || regPhone.length < 8) {
      showToast("Please enter a valid phone number.");
      return false;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      showToast("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      playSynthesizerSound('click');
      setStep(2);
    } else if (step === 2) {
      playSynthesizerSound('click');
      setStep(3); 
    } else if (step === 3) {
      if (!senderNumber.trim() || senderNumber.length < 11) {
        showToast(`Please enter your valid 11-digit ${paymentMethod} number.`);
        return;
      }
      if (!transactionId.trim()) {
        showToast(`Please complete your ${paymentMethod} transfer first and input the Transaction ID.`);
        return;
      }
      completeReservationFlow();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      playSynthesizerSound('click');
      setStep(step - 1);
    } else {
      setActiveTab('home');
    }
  };

  const completeReservationFlow = async () => {
    const totalAmount = selectedTier.price * ticketQty;
    const ticketId = `BGI-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newBooking: Booking = {
      ticketId,
      name: regName,
      phone: regPhone,
      email: regEmail,
      event: selectedEvent,
      tier: selectedTier,
      quantity: ticketQty,
      totalAmount,
      paymentMethod,
      senderNumber: senderNumber.trim(),
      transactionId: transactionId.trim(),
      paymentDetails: `${paymentMethod} Account`,
      bookedAt: new Date().toLocaleString()
    };

    setBookings(prev => [newBooking, ...prev]);
    try {
      await addDoc(collection(db, "bookings"), {
        ticketId,
        name: regName,
        phone: regPhone,
        senderNumber: senderNumber.trim(),
        email: regEmail,
        transactionId: transactionId.trim(),
        paymentMethod,
        totalAmount,
        bookedAt: new Date().toISOString()
      });
    } catch (e) { console.error(e); }
    setLastFinishedBooking(newBooking);
    setStep(4); 
    triggerCelebration();
    playSynthesizerSound('success');
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#ffffff', '#22c55e', '#1e3a8a', '#eab308']
      });
    } catch (e) {
      console.log(e);
    }
  };

  const resetBookingForm = () => {
    setStep(1);
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setTicketQty(1);
    setSenderNumber('');
    setTransactionId('');
    setLastFinishedBooking(null);
  };

  const startBookingWithPreset = (ev: EventData) => {
    setSelectedEvent(ev);
    resetBookingForm();
    setActiveTab('booking-wizard');
    playSynthesizerSound('chirp');
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans overflow-x-hidden selection:bg-brand-gold selection:text-slate-950 bg-slate-950">
      
      {/* Background Video Wrapper */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
        <video
          key={selectedVideo.id}
          className="w-full h-full object-cover transition-all duration-[1500ms] scale-[1.01]"
          style={{ filter: `brightness(${bgBrightness}) contrast(1.08) saturate(0.9)` }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={selectedVideo.url} type="video/mp4" />
        </video>

        <GoldenParticlesCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-transparent pointer-events-none z-[3]"></div>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-transparent backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => { setActiveTab('home'); playSynthesizerSound('click'); }} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            {/* গোল করা লোগো (Rounded Logo) */}
            <img 
              src="/bgi-logo.png" 
              alt="BGI_LOGO" 
              className="w-10 h-10 object-cover rounded-full border border-white/10 shadow-md group-hover:scale-105 transition-transform" 
            />
            
            <span className="text-xl tracking-[0.18em] font-serif font-bold text-white group-hover:text-brand-gold transition-colors">
              BGI_COMMUNITY
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-10 text-xs tracking-[0.25em] uppercase text-slate-300 font-serif">
            <button 
              onClick={() => { setActiveTab('home'); playSynthesizerSound('click'); }}
              className={`hover:text-brand-gold transition-colors relative py-1 duration-300 ${activeTab === 'home' || activeTab === 'booking-wizard' ? 'text-brand-gold font-bold' : ''}`}
            >
              Home
              {(activeTab === 'home' || activeTab === 'booking-wizard') && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
              )}
            </button>
            <button 
              onClick={() => { setActiveTab('tickets'); playSynthesizerSound('click'); }}
              className={`hover:text-brand-gold transition-colors relative py-1 duration-300 ${activeTab === 'tickets' ? 'text-brand-gold font-bold' : ''}`}
            >
              My Tickets
              {activeTab === 'tickets' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
              )}
            </button>
            <button 
              onClick={() => { setActiveTab('contact'); playSynthesizerSound('click'); }}
              className={`hover:text-brand-gold transition-colors relative py-1 duration-300 ${activeTab === 'contact' ? 'text-brand-gold font-bold' : ''}`}
            >
              Contact
              {activeTab === 'contact' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-brand-gold rounded-full shadow-[0_0_8px_rgba(212,175,55,0.8)] animate-pulse" />
              )}
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { startBookingWithPreset(EVENTS[0]); }}
              className="glass-pill px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest text-white hover:text-brand-gold transition-all duration-300 active:scale-95"
            >
              Book Ticket
            </button>
          </div>
        </div>
      </header>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm">
          <div className="p-4 rounded-xl flex items-start space-x-3 shadow-2xl bg-slate-900 border border-amber-500/30 text-slate-200">
            <Info className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-white">System Note</p>
              <p className="text-xs text-slate-300">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 z-10 w-full max-w-7xl mx-auto relative">

        {/* --- Home Landing Page View --- */}
        {activeTab === 'home' && (
          <div className="w-full flex flex-col items-center py-10 md:py-20 text-center select-none animate-fade-in">
            <div className="space-y-6 max-w-3xl mb-12 mt-4">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-light text-white tracking-normal leading-[1.1]">
                Where <span className="italic font-normal font-serif">dreams</span> rise <span className="block italic sm:inline">through the</span> <span className="font-semibold text-brand-gold">silence.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-lg md:text-xl font-sans font-light tracking-wide max-w-xl mx-auto leading-relaxed md:pt-4">
                Get ready for a next-level experience! We're hosting our biggest gathering yet. Tickets are on sale now—don't miss out, grab yours today!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <button 
                onClick={() => { startBookingWithPreset(EVENTS[0]); }}
                className="group relative px-10 py-4 rounded-full bg-slate-950/40 border border-brand-gold hover:bg-brand-gold hover:text-slate-950 overflow-hidden transition-all duration-500 active:scale-95 shadow-[0_0_25px_rgba(212,175,55,0.15)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)]"
              >
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-[25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
                <span className="relative text-brand-gold text-xs sm:text-sm tracking-[0.25em] font-serif uppercase font-bold group-hover:text-slate-950 transition-colors flex items-center justify-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-brand-gold group-hover:text-slate-950 transition-colors shrink-0 animate-pulse" />
                  <span>RESERVE YOUR PASS</span>
                  <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1.5 transition-transform" />
                </span>
              </button>

              <button 
                onClick={() => { setActiveTab('tickets'); playSynthesizerSound('click'); }}
                className="px-6 py-3 rounded-full hover:bg-white/5 text-sm tracking-widest text-slate-300 transition-colors"
              >
                View Existing Reservations
              </button>
            </div>
          </div>
        )}

        {/* --- Contact View --- */}
        {activeTab === 'contact' && (
          <div className="w-full max-w-xl glass-panel p-8 rounded-3xl my-10 backdrop-blur-2xl animate-fade-in">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-brand-gold tracking-wider uppercase mb-8"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back home</span>
            </button>

            <h2 className="text-2xl md:text-4xl font-serif text-white mb-2">Connect With Us</h2>
            <form onSubmit={(e) => { e.preventDefault(); showToast("Message delivered safely to the BGI Organizers!"); playSynthesizerSound('success'); }} className="space-y-4 font-sans text-left">
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">Full Name</label>
                <input required type="text" placeholder="Attendee name" className="w-full px-4 py-3 glass-input text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">Email Coordinates</label>
                <input required type="email" placeholder="example@bgi.com" className="w-full px-4 py-3 glass-input text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block mb-1">Message</label>
                <textarea required rows={4} placeholder="Type your message here..." className="w-full px-4 py-3 glass-input text-sm resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 rounded-xl bg-brand-gold text-slate-950 font-bold uppercase tracking-widest text-xs hover:bg-yellow-400 transition-colors">
                Send Message
              </button>
            </form>
          </div>
        )}

        {/* --- My Tickets View --- */}
        {activeTab === 'tickets' && (
          <div className="w-full max-w-4xl text-left my-8 select-none animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-brand-gold">COMMUNITY PORTAL</span>
                <h2 className="text-3xl md:text-5xl font-serif text-white">Your Reserved Tickets</h2>
              </div>
              <button 
                onClick={() => { startBookingWithPreset(EVENTS[0]); }}
                className="px-5 py-3 rounded-full bg-brand-gold hover:bg-yellow-400 text-slate-950 font-bold uppercase tracking-widest text-xs flex items-center space-x-2 self-start"
              >
                <span>Reserve Another Pass</span>
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center justify-center space-y-6">
                <Ticket className="w-12 h-12 text-slate-500 animate-pulse" />
                <p className="text-xl font-serif text-slate-300">No active reservations found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {bookings.map(b => (
                  <div key={b.ticketId} className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-brand-gold">
                    <div className="flex items-start justify-between pb-4 border-b border-white/5">
                      <div>
                        <h4 className="text-lg font-serif font-bold text-white">{b.event.title}</h4>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-brand-gold/10 text-brand-gold px-2 py-0.5 rounded-md">
                        {b.tier.name}
                      </span>
                    </div>

                    <div className="py-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Attendee:</span>
                        <span className="text-slate-200 font-medium">{b.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Quantity:</span>
                        <span className="text-slate-200 font-medium">{b.quantity} Ticket(s)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Paid Via:</span>
                        <span className="text-brand-gold font-medium">{b.paymentMethod} ({b.senderNumber})</span>
                      </div>
                    </div>

                    {/* Cancel Spot বাটনটি এখান থেকে পুরোপুরি রিমুভ করা হয়েছে */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="text-xl font-serif text-brand-gold font-bold">৳{b.totalAmount}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Booking Wizard Flow --- */}
        {activeTab === 'booking-wizard' && (
          <div className="w-full max-w-2xl select-none animate-fade-in">
            <div className="text-center mb-6">
              <span className="text-[10px] tracking-[0.25em] uppercase font-mono text-slate-400 block mb-1">
                BGI Community Secure Gateway
              </span>
              <h2 className="text-3xl md:text-5xl font-serif text-white tracking-wide">
                Ticket Reservation
              </h2>
            </div>

            <div className="glass-panel p-6 sm:p-10 rounded-3xl relative overflow-hidden backdrop-blur-2xl">
              {step <= 3 && (
                <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                  {[1, 2, 3].map((sId) => (
                    <div key={sId} className="flex items-center space-x-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                        step === sId ? 'bg-brand-gold text-slate-950 shadow-md' : 'bg-white/5 text-slate-500'
                      }`}>
                        {sId}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 1: Event & Details */}
              {step === 1 && (
                <div className="space-y-6 text-left animate-fade-in">
                  <h3 className="text-xl font-serif text-white">Select Event & Details</h3>
                  <div className="grid gap-3">
                    {EVENTS.map(ev => (
                      <div
                        key={ev.id}
                        className="p-4 rounded-xl border bg-brand-gold/10 border-brand-gold"
                      >
                        <h4 className="text-sm font-semibold text-white">{ev.title}</h4>
                        <p className="text-xs text-slate-400 mt-1">{ev.desc}</p>
                        <div className="flex gap-4 mt-3 text-[11px] text-brand-gold font-mono">
                          <span>📅 {ev.date}</span>
                          <span>⏰ {ev.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 pt-4">
                    <input value={regName} onChange={e => setRegName(e.target.value)} type="text" placeholder="Full Name" className="w-full px-4 py-3 glass-input text-sm" />
                    <input value={regPhone} onChange={e => setRegPhone(e.target.value)} type="tel" placeholder="Phone Number" className="w-full px-4 py-3 glass-input text-sm" />
                    <input value={regEmail} onChange={e => setRegEmail(e.target.value)} type="email" placeholder="Email Coordinates" className="w-full px-4 py-3 glass-input text-sm" />
                  </div>
                </div>
              )}

              {/* Step 2: Tier & Quantity Selection */}
              {step === 2 && (
                <div className="space-y-6 text-left animate-fade-in">
                  <h3 className="text-xl font-serif text-white">Select Ticket Tier</h3>
                  {TICKET_TIERS.map(tier => (
                    <div
                      key={tier.id}
                      onClick={() => { setSelectedTier(tier); playSynthesizerSound('click'); }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        selectedTier.id === tier.id ? 'bg-brand-gold/10 border-brand-gold' : 'bg-white/3 border-white/5'
                      }`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-lg font-serif text-white">{tier.name}</h4>
                          <p className="text-xs text-slate-400 mt-1">{tier.perks}</p>
                        </div>
                        <span className="text-xl text-brand-gold font-bold">৳{tier.price}</span>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 glass-panel rounded-xl flex justify-between items-center">
                    <span className="text-xs text-slate-300">Quantity (Max 8)</span>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => ticketQty > 1 && setTicketQty(ticketQty - 1)} className="px-3 py-1 bg-white/5 rounded">-</button>
                      <span className="font-mono text-white">{ticketQty}</span>
                      <button onClick={() => ticketQty < 8 && setTicketQty(ticketQty + 1)} className="px-3 py-1 bg-white/5 rounded">+</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Secure Confirmation & Checkout */}
              {step === 3 && (
                <div className="space-y-6 text-left animate-fade-in">
                  <h3 className="text-xl font-serif text-white">Secure Confirmation</h3>
                  <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-2 text-xs">
                    <p><span className="text-slate-400">Event:</span> {selectedEvent.title}</p>
                    <p><span className="text-slate-400">Category:</span> {selectedTier.name}</p>
                    <p><span className="text-slate-400">Quantity:</span> {ticketQty} pass(es)</p>
                    <p className="text-sm font-bold text-brand-gold pt-1">Total Amount: ৳{selectedTier.price * ticketQty}</p>
                  </div>

                  {/* 📱 3 MFS Payment Buttons */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* bKash Button */}
                    <button 
                      type="button"
                      onClick={() => { setPaymentMethod('bKash'); playSynthesizerSound('click'); }} 
                      className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center relative ${
                        paymentMethod === 'bKash' 
                          ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.15)]' 
                          : 'border-white/5 bg-white/3 hover:border-white/10'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white border border-white/10 shadow-inner">
                        {bkashLogo ? (
                          <img src={bkashLogo} alt="bKash" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-pink-600 flex items-center justify-center text-[11px] font-black text-white font-sans">bK</div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-200">bKash</span>
                    </button>

                    {/* Rocket Button */}
                    <button 
                      type="button"
                      onClick={() => { setPaymentMethod('Rocket'); playSynthesizerSound('click'); }} 
                      className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center relative ${
                        paymentMethod === 'Rocket' 
                          ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                          : 'border-white/5 bg-white/3 hover:border-white/10'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white border border-white/10 shadow-inner">
                        {rocketLogo ? (
                          <img src={rocketLogo} alt="Rocket" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-purple-700 flex items-center justify-center text-[10px] font-bold text-purple-200 font-sans">🚀</div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-200">Rocket</span>
                    </button>

                    {/* Nagad Button */}
                    <button 
                      type="button"
                      onClick={() => { setPaymentMethod('Nagad'); playSynthesizerSound('click'); }} 
                      className={`p-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all text-center relative ${
                        paymentMethod === 'Nagad' 
                          ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                          : 'border-white/5 bg-white/3 hover:border-white/10'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white border border-white/10 shadow-inner">
                        {nagadLogo ? (
                          <img src={nagadLogo} alt="Nagad" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-[11px] font-black text-white font-serif italic">N</div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-200">Nagad</span>
                    </button>
                  </div>

                  {/* ⚡ Fixed Send Money Instructions (Dynamically updates based on selection) */}
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 animate-fade-in text-xs font-sans space-y-1">
                    <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase block">
                      Payment Instruction
                    </span>
                    <p className="text-slate-200 font-medium">
                      Please Send Money <span className="text-brand-gold font-bold">৳{selectedTier.price * ticketQty}</span> to this {paymentMethod} number:
                    </p>
                    <p className="text-base font-mono font-bold text-white tracking-wider pt-0.5">
                      {MERCHANT_NUMBERS[paymentMethod]}
                    </p>
                  </div>

                  {/* Dynamic MFS Account Number Input */}
                  <div className="space-y-2 pt-1 animate-fade-in">
                    <label className="text-xs font-mono tracking-wider uppercase text-slate-400 block">
                      ENTER YOUR {paymentMethod.toUpperCase()} NUMBER
                    </label>
                    <input 
                      value={senderNumber} 
                      onChange={e => setSenderNumber(e.target.value)} 
                      type="tel" 
                      placeholder={`e.g. 01XXXXXXXXX (${paymentMethod} Number)`} 
                      className="w-full px-4 py-3.5 glass-input text-xs font-mono tracking-widest text-white placeholder:text-slate-600 focus:border-brand-gold/50 focus:outline-none" 
                    />
                  </div>

                  {/* Transaction ID Input */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-mono tracking-wider uppercase text-slate-400 block">
                      ENTER {paymentMethod.toUpperCase()} TRANSACTION ID (TRXID)
                    </label>
                    <input 
                      value={transactionId} 
                      onChange={e => setTransactionId(e.target.value)} 
                      type="text" 
                      placeholder="e.g. 9XK2A8B1C" 
                      className="w-full px-4 py-3.5 glass-input text-xs font-mono tracking-widest text-white placeholder:text-slate-600 focus:border-brand-gold/50 focus:outline-none" 
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Success Ticket Output */}
              {step === 4 && lastFinishedBooking && (
                <div className="text-center py-6 animate-slide-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-serif text-white">Reservation Confirmed</h3>
                  <div className="mt-4 p-4 bg-slate-950/80 rounded-xl max-w-sm mx-auto text-left space-y-2 text-xs font-mono">
                    <p className="text-center text-brand-gold text-sm font-bold">{lastFinishedBooking.ticketId}</p>
                    <p><span className="text-slate-500">Name:</span> {lastFinishedBooking.name}</p>
                    <p><span className="text-slate-500">Tier:</span> {lastFinishedBooking.tier.name}</p>
                    <p><span className="text-slate-500">Quantity:</span> {lastFinishedBooking.quantity}</p>
                    <p><span className="text-slate-500">Method:</span> {lastFinishedBooking.paymentMethod}</p>
                    <p><span className="text-slate-500">Number:</span> {lastFinishedBooking.senderNumber}</p>
                    <p><span className="text-slate-500">TrxID:</span> {lastFinishedBooking.transactionId}</p>
                    <p><span className="text-slate-500">Total Paid:</span> ৳{lastFinishedBooking.totalAmount}</p>
                  </div>
                  <button onClick={() => setActiveTab('home')} className="mt-6 px-6 py-2 rounded-full bg-brand-gold text-slate-950 font-bold text-xs uppercase">Return Home</button>
                </div>
              )}

              {/* Wizard Control Action Triggers */}
              {step <= 3 && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                  <button type="button" onClick={handlePrevStep} className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button type="button" onClick={handleNextStep} className="px-8 py-3 rounded-full bg-brand-gold hover:bg-yellow-400 text-slate-950 text-xs tracking-widest uppercase font-bold transition-all">
                    <span>{step === 3 ? 'Complete Flow' : 'Continue'}</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="z-10 py-8 px-6 bg-transparent border-t border-white/5 text-center sm:text-left mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © 2026 <span className="text-brand-gold font-semibold font-serif">BGI_COMMUNITY</span>. All rights secured.
          </p>
        </div>
      </footer>

    </div>
  );
}