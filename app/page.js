'use client';

import Link from 'next/link';
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
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      linkText: 'text-blue-600',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      linkText: 'text-purple-600',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      linkText: 'text-green-600',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Box className="text-blue-600" size={28} />
              <span className="text-xl font-bold text-gray-800">Laundry Tracker</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </Link>
              <Link
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Contact
              </Link>
              <Link
                href="/customer"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-blue-50 to-white">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              M1G Laundry
              <span className="block text-blue-600 mt-2">Management System</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Project for the Course of Parallel And Distributed Computing
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => handlePortalClick('customer')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2 cursor-pointer"
              >
                <span>Track Your Order</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => handlePortalClick('admin')}
                className="bg-white text-blue-600 border-2 border-gray-300 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Business Login
              </button>
            </div>
          </div>
        </section>

        {/* Role Access Cards */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Access Your Portal
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {portalCards.map((card) => {
                const colors = cardColors[card.color];
                return (
                  <button
                    key={card.title}
                    onClick={() => handlePortalClick(card.portalType)}
                    className="group block text-left hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-xl"
                  >
                    <div
                      className={`p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col ${colors.bg} cursor-pointer`}
                    >
                      <div
                        className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 ${colors.iconBg}`}
                      >
                        <card.icon className={colors.iconText} size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                      <p className="text-gray-600 mb-6 flex-grow">{card.description}</p>
                      <div className={`flex items-center font-semibold ${colors.linkText}`}>
                        <span>Access Portal</span>
                        <ArrowRight
                          className="ml-2 group-hover:translate-x-1.5 transition-transform"
                          size={18}
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
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">
                Features
              </h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                Everything You Need to Manage Your Laundry
              </p>
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Powerful features designed to streamline operations and improve customer
                satisfaction.
              </p>
            </div>

            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                  <div key={feature.title} className="pt-6">
                    <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                            <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Get in Touch</h2>
            <p className="mt-4 text-lg text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-8 justify-center items-center text-lg">
              <div className="flex items-center space-x-3 text-gray-800">
                <Phone />
                <span>+639696438031</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800">
                <Mail />
                <span>mamdavid@tip.edu.ph</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-800">
                <MapPin />
                <span>Manila, Philippines</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} M1G Laundry Systems. All rights reserved.</p>
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
