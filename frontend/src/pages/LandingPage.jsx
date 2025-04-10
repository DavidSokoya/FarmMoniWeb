import React from 'react';
import { ArrowRight, TrendingUp, Wallet, Sprout, ArrowUpRight, UserPlus, Search, Landmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/ui/Button';

const LandingPage = () => {

  // Function to smoothly scroll to "How it Works" section
  const scrollDown = () => {
    document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden font-inter">
      {/* Navbar handles its own scrolling logic */}
      <Navbar />
      
      {/* ================= 1. HERO SECTION (2-Sided) ================= */}
      <section id="hero" className="pt-36 pb-20 lg:pt-44 lg:pb-32 px-6 relative overflow-hidden">
        
        {/* Background decoration blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[500px] h-[500px] bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* LEFT SIDE: Copy & CTA */}
          <div>
             <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4">
                <Sprout size={16} /> NOW OPEN: 2026 Palm Oil Storage Fund
             </div>
             
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-[1.1]">
              Build Real Wealth with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-700 to-green-500">
                Digital Agriculture.
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
              Stop letting inflation erode your savings. Co-invest in vetted, high-yield farm projects and export trades from the comfort of your home.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-base shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 hover:-translate-y-1 transition-all">
                  Start Investing Now
                </Button>
              </Link>
              
              <button 
                onClick={scrollDown}
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-primary-500 hover:text-primary-600 transition-all flex items-center justify-center gap-2"
              >
                How it Works <ArrowRight size={18} />
              </button>
            </div>

            {/* TRUSTED BY (African/Nigerian Avatars) */}
            <div className="mt-12 flex items-center gap-4 text-sm text-gray-500 font-medium">
              <div className="flex -space-x-2">
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=100&h=100" alt="Investor" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=100&h=100" alt="Investor" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=100&h=100" alt="Investor" />
                <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1522512115668-c09775d6f424?auto=format&fit=crop&w=100&h=100" alt="Investor" />
              </div>
              <p>Trusted by <span className="text-gray-900 font-bold">12,000+</span> modern investors.</p>
            </div>
          </div>

          {/* RIGHT SIDE: Visual Composition */}
          <div className="relative lg:ml-10 hidden lg:block">
            {/* Main Hero Image Frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-gray-200/50 border-4 border-white z-10 h-[500px]">
                 <img 
                   src="/hero-image.jpg"
                   alt="Modern farming" 
                   className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            {/* Floating Card 1 (ROI) */}
            <div className="absolute -top-12 -right-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-white/20 z-20 animate-bounce-slow">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <TrendingUp size={20} />
                </div>
                <span className="text-sm font-bold text-gray-600">Average Returns</span>
              </div>
              <p className="text-3xl font-extrabold text-gray-900">30.5% <span className="text-sm font-medium text-green-600">/ cycle</span></p>
            </div>

             {/* Floating Card 2 (Payout) */}
             <div className="absolute -bottom-10 -left-12 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-white/20 z-20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary-600 text-white rounded-full">
                  <Wallet size={24} />
                </div>
                 <div>
                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Payout</p>
                   <p className="text-xl font-bold text-gray-900">₦ 450,200.00</p>
                   <p className="text-xs text-gray-400 mt-1">To David O.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. TRUST BADGE SECTION ================= */}
      <section className="bg-gray-50 py-12 border-y border-gray-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-8">Secured and regulated by top institutions</p>
            <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
               {/* Replace with actual partner logos if you have them */}
               <h3 className="text-2xl font-bold text-gray-400">Leadway Assurance</h3>
               <h3 className="text-2xl font-bold text-gray-400">Paystack</h3>
               <h3 className="text-2xl font-bold text-gray-400">Securities & Exchange</h3>
            </div>
         </div>
      </section>

      {/* ================= 3. HOW IT WORKS (Interactive) ================= */}
      <section className="py-24 px-6 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto">
           <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Simple steps to grow your money.</h2>
             <p className="text-lg text-gray-500">We've simplified agricultural investment into a seamless digital experience.</p>
           </div>

           <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Visible only on Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-1 bg-gray-100 rounded-full -z-0">
                  <div className="w-full h-full bg-gradient-to-r from-primary-100 via-primary-200 to-primary-100 opacity-50"></div>
              </div>

              <StepCard 
                icon={UserPlus}
                number="01"
                title="Create Account"
                desc="Sign up in 2 minutes. Secure your profile and fund your wallet instantly via bank transfer."
              />
              <StepCard 
                icon={Search}
                number="02"
                title="Select Fund"
                desc="Choose vetted opportunities. Palm Oil Storage for stability or Cashew Export for speed."
              />
              <StepCard 
                icon={Landmark}
                number="03"
                title="Get Paid"
                desc="At maturity, your capital plus interest is paid automatically to your wallet. Withdraw anytime."
              />
           </div>
        </div>
      </section>

       {/* ================= 4. FEATURED OPPORTUNITY (Palm Oil) ================= */}
       <section className="py-24 px-6 bg-gray-900 relative overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-20">
             <img src="/palmoil.jpg" className="w-full h-full object-cover" alt="Palm Oil background" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/50"></div>

          <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
             <div>
               <span className="text-orange-400 font-bold tracking-wider uppercase mb-4 block">Featured Opportunity</span>
               <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">Palm Oil Storage Fund</h2>
               <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                 The logic is simple: We buy high-grade Palm Oil during peak production season (cheap), store it in insured warehouses, and sell during the off-peak scarcity period (expensive).
               </p>

               <div className="grid grid-cols-3 gap-8 mb-10">
                  <div>
                     <p className="text-gray-400 text-sm mb-1">Target ROI</p>
                     <p className="text-3xl font-bold text-orange-400">35%</p>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-1">Duration</p>
                     <p className="text-3xl font-bold text-white">9 Mo.</p>
                  </div>
                  <div>
                     <p className="text-gray-400 text-sm mb-1">Unit Price</p>
                     <p className="text-3xl font-bold text-white">₦50k</p>
                  </div>
               </div>
               
               <Link to="/marketplace">
                 <Button size="lg" className="px-8 bg-orange-600 hover:bg-orange-700 border-orange-600">Invest in Oil <ArrowUpRight className="ml-2"/> </Button>
               </Link>
             </div>

             {/* Right Visual */}
             <div className="hidden lg:block relative">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-3xl rotate-3 hover:rotate-0 transition-all duration-500">
                    <img src="/palmoil.jpg" alt="Red Palm Oil Fruit" className="rounded-2xl shadow-2xl" />
                 </div>
             </div>
          </div>
       </section>

      {/* ================= 5. FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="/farmmoni-logo.png" 
                  alt="FarmMoni Logo" 
                  className="h-10 w-auto object-contain" 
                />
                <span className="text-xl font-bold text-gray-900">Farm<span className="text-primary-600">Moni</span></span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                FarmMoni is a technology platform that connects investors with agricultural opportunities. We are not a bank. Investments are subject to market risks.
              </p>
           </div>
           
           <div>
             <h4 className="font-bold text-gray-900 mb-6">Company</h4>
             <ul className="space-y-4 text-gray-500 font-medium">
               <li><Link to="#" className="hover:text-primary-600 transition-colors">About Us</Link></li>
               <li><Link to="#" className="hover:text-primary-600 transition-colors">Careers</Link></li>
             </ul>
           </div>
           <div>
             <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
             <ul className="space-y-4 text-gray-500 font-medium">
               <li><Link to="#" className="hover:text-primary-600 transition-colors">Help Center</Link></li>
               <li><Link to="#" className="hover:text-primary-600 transition-colors">Terms of Service</Link></li>
             </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-100">
          <p className="text-gray-400 text-sm">© 2026 FarmMoni Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Internal Step Card Component
const StepCard = ({ number, title, desc, icon: Icon }) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative z-10 text-center group hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-default">
    <div className="w-20 h-20 bg-white border-4 border-primary-50 text-primary-600 rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-200 transition-all duration-300 relative">
      <Icon size={28} />
      <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">{number}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors">{title}</h3>
    <p className="text-gray-500 leading-relaxed group-hover:text-gray-600">{desc}</p>
  </div>
);

export default LandingPage;