'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Box,
  User,
  Users,
  Truck,
  ArrowRight,
  Package,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import PortalAuthModal from '@/components/common/PortalAuthModal';

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState(null);

  const handlePortalClick = (portalType) => {
    setSelectedPortal(portalType);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setSelectedPortal(null);
  };

  const portalCards = [
    {
      portalType: 'customer',
      icon: User,
      title: 'Customer Portal',
      description: 'Track your orders, book appointments, and manage your laundry services easily.',
      color: 'blue',
    },
    {
      portalType: 'admin',
      icon: Users,
      title: 'Admin Portal',
      description:
        'Manage orders, appointments, staff, and business operations from one dashboard.',
      color: 'purple',
    },
    {
      portalType: 'staff',
      icon: Truck,
      title: 'Staff Portal',
      description:
        'View assigned tasks, update order status, and manage daily operations efficiently.',
      color: 'green',
    },
  ];

  const features = [
    {
      icon: Package,
      title: 'Order Management',
      description: 'Track orders from pickup to delivery with real-time status updates',
    },
    {
      icon: Clock,
      title: 'Appointment Booking',
      description: 'Easy online scheduling for pickup and delivery appointments',
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Assign tasks and monitor staff productivity efficiently',
    },
    {
      icon: Truck,
      title: 'Delivery Tracking',
      description: 'Real-time delivery tracking with estimated arrival times',
    },
  ];

  const cardColors = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
      iconBg: 'bg-blue-500',
      iconText: 'text-white',
      linkText: 'text-blue-600',
      border: 'border-blue-200',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100/50',
      iconBg: 'bg-purple-500',
      iconText: 'text-white',
      linkText: 'text-purple-600',
      border: 'border-purple-200',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100/50',
      iconBg: 'bg-green-500',
      iconText: 'text-white',
      linkText: 'text-green-600',
      border: 'border-green-200',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Box
                  className="text-blue-600 group-hover:text-blue-700 transition-colors"
                  size={32}
                />
                <div className="absolute -inset-1 bg-blue-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                LaundraTrack
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Features
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium text-sm"
              >
                Contact
              </Link>
              <button
                onClick={() => handlePortalClick('customer')}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-full font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:scale-105"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-white to-blue-50/30"></div>

          <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8 animate-fade-in">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <Image
                  src="/images/laundra-track-logo.png"
                  alt="LaundraTrack Logo"
                  width={500}
                  height={300}
                  className="relative drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
            </div>

            {/* Subtitle */}

            {/* Main Heading */}
            <h5 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
                Professional Laundry
              </span>
              <span className="block mt-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Management System
              </span>
            </h5>

            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Streamline your laundry business with our comprehensive tracking and management
              solution. Built for efficiency, designed for excellence.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
              <button
                onClick={() => handlePortalClick('customer')}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 flex items-center space-x-3 cursor-pointer"
              >
                <span>Track Your Order</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handlePortalClick('admin')}
                className="bg-white text-blue-600 border-2 border-blue-200 px-10 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 hover:border-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
              >
                Business Login
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={20} />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>

        {/* Role Access Cards */}
        <section className="py-24 bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Access Your Portal
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose your portal to get started with LaundraTrack's powerful features
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {portalCards.map((card) => {
                const colors = cardColors[card.color];
                return (
                  <button
                    key={card.title}
                    onClick={() => handlePortalClick(card.portalType)}
                    className="group block text-left hover:no-underline focus:outline-none focus:ring-4 focus:ring-blue-500/50 rounded-2xl transition-all"
                  >
                    <div
                      className={`relative p-8 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col border-2 ${colors.border} ${colors.bg} cursor-pointer overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/40 to-transparent rounded-full -mr-16 -mt-16"></div>

                      <div
                        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${colors.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                      >
                        <card.icon className={colors.iconText} size={32} />
                      </div>

                      <h3 className="relative text-2xl font-bold text-gray-900 mb-3">
                        {card.title}
                      </h3>
                      <p className="relative text-gray-600 mb-6 flex-grow leading-relaxed">
                        {card.description}
                      </p>

                      <div
                        className={`relative flex items-center font-semibold ${colors.linkText} group-hover:gap-3 gap-2 transition-all`}
                      >
                        <span>Access Portal</span>
                        <ArrowRight
                          className="group-hover:translate-x-1 transition-transform"
                          size={20}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gradient-to-b from-white to-blue-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
                Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Everything You Need
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful features designed to streamline operations and improve customer
                satisfaction
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-blue-100">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full -mr-10 -mt-10"></div>

                    <div className="relative">
                      <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/30"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-blue-100 group hover:-translate-y-1">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Phone className="text-blue-600" size={20} />
                </div>
                <span className="font-semibold text-gray-800">+639696438031</span>
              </div>

              <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-blue-100 group hover:-translate-y-1">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <span className="font-semibold text-gray-800">mikplacencia@tip.edu.ph</span>
              </div>

              <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all border-2 border-blue-100 group hover:-translate-y-1">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <span className="font-semibold text-gray-800">Manila, Philippines</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-white to-blue-50 border-t border-blue-100">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 font-medium">
            &copy; {new Date().getFullYear()} LaundraTrack Laundry Systems. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">Final Project for Technopreneurship</p>
        </div>
      </footer>

      {/* Portal Authentication Modal */}
      {selectedPortal && (
        <PortalAuthModal
          isOpen={isAuthModalOpen}
          portalType={selectedPortal}
          onClose={handleCloseAuthModal}
        />
      )}
    </div>
  );
}
