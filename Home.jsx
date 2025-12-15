import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Search, FileText, Shield, ArrowRight, Package, Users, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import DotPattern from '../components/DotPattern';

export default function Home() {
  const features = [
    {
      icon: FileText,
      title: 'Report Found Items',
      description: 'Easily submit items you\'ve found around campus with photos and details.',
      color: 'bg-[#473472]',
    },
    {
      icon: Search,
      title: 'Search & Claim',
      description: 'Browse all found items and submit a claim if you find your belongings.',
      color: 'bg-[#53629E]',
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Admin verification ensures items reach their rightful owners.',
      color: 'bg-[#87BAC3]',
    },
  ];

  const stats = [
    { icon: Package, value: '500+', label: 'Items Returned' },
    { icon: Users, value: '2,000+', label: 'Happy Students' },
    { icon: CheckCircle, value: '98%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      <DotPattern />
      <Navbar currentPage="Home" />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#87BAC3]/20 rounded-full text-[#473472] text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#473472] rounded-full animate-pulse" />
              School Lost & Found Portal
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#473472] mb-6 leading-tight">
              Lost Something?
              <span className="block text-[#53629E]">We'll Help You Find It</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Our school's official lost and found system connects finders with owners. 
              Report found items or search for your lost belongings in one simple platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={createPageUrl('Report')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#473472] text-white rounded-2xl font-semibold hover:bg-[#53629E] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <FileText size={20} />
                Report Found Item
              </Link>
              <Link
                to={createPageUrl('Claim')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#473472] rounded-2xl font-semibold border-2 border-[#473472] hover:bg-[#473472] hover:text-white transition-all duration-300"
              >
                <Search size={20} />
                Find My Item
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#473472] to-[#53629E] rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-4">
                      <Icon size={24} className="text-white" />
                    </div>
                    <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-white/70">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#473472] mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Our simple three-step process makes reuniting with your belongings effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 bg-white rounded-3xl border border-[#87BAC3]/20 hover:border-[#473472]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#473472] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[#87BAC3]/10 rounded-3xl p-12 border border-[#87BAC3]/30">
            <h2 className="text-3xl font-bold text-[#473472] mb-4">
              Found Something on Campus?
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Help a fellow student by reporting the item. It only takes a minute!
            </p>
            <Link
              to={createPageUrl('Report')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#473472] text-white rounded-2xl font-semibold hover:bg-[#53629E] transition-all duration-300"
            >
              Report Now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-6 border-t border-[#87BAC3]/20">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2024 School Lost & Found. Helping students reconnect with their belongings.</p>
        </div>
      </footer>
    </div>
  );
}
