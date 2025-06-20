'use client';

import Link from 'next/link';
import {
  Package,
  Users,
  User,
  Truck,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Star
} from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Package,
      title: 'Order Management',
      description: 'Track orders from pickup to delivery with real-time status updates'
    },
    {
      icon: Clock,
      title: 'Appointment Booking',
      description: 'Easy online scheduling for pickup and delivery appointments'
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Assign tasks and monitor staff productivity efficiently'
    },
    {
      icon: Truck,
      title: 'Delivery Tracking',
      description: 'Real-time delivery tracking with estimated arrival times'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Owner',
      content: 'This system has transformed how we manage our laundry business. So much more organized!',
      rating: 5
    },
    {
      name: 'Mike Chen',
      role: 'Regular Customer',
      content: 'Love being able to track my orders online. Makes everything so convenient.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Package className="text-blue-600" size={28} />
              <span className="text-xl font-bold text-gray-800">Laundry Tracker</span>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
              <Link
                href="/customer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Professional Laundry
            <span className="text-blue-600 block">Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline your laundry business operations with our comprehensive tracking and management solution.
            Perfect for businesses and convenient for customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/customer"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <span>Track Your Order</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/admin"
              className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Business Login
            </Link>
          </div>
        </div>
      </section>

      {/* Role Access Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Access Your Portal
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Customer Portal */}
            <Link href="/customer" className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all group-hover:scale-105">
                <div className="bg-blue-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <User className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Portal</h3>
                <p className="text-gray-600 mb-6">
                  Track your orders, book appointments, and manage your laundry services easily.
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <span>Access Portal</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              </div>
            </Link>

            {/* Admin Portal */}
            <Link href="/admin" className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all group-hover:scale-105">
                <div className="bg-purple-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Users className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Portal</h3>
                <p className="text-gray-600 mb-6">
                  Manage orders, appointments, staff, and business operations from one dashboard.
                </p>
                <div className="flex items-center text-purple-600 font-semibold">
                  <span>Access Portal</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              </div>
            </Link>

            {/* Staff Portal */}
            <Link href="/staff" className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-sm hover:shadow-md transition-all group-hover:scale-105">
                <div className="bg-green-600 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                  <Truck className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Staff Portal</h3>
                <p className="text-gray-600 mb-6">
                  View assigned tasks, update order status, and manage daily operations efficiently.
                </p>
                <div className="flex items-center text-green-600 font-semibold">
                  <span>Access Portal</span>
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Laundry Business
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed to streamline operations and improve customer satisfaction
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Get Started Today</h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to streamline your laundry business? Contact us to learn more.
          </p>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-8">
            <div className="flex items-center space-x-3">
              <Phone size={24} />
              <span className="text-lg">(555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail size={24} />
              <span className="text-lg">info@laundrytracker.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin size={24} />
              <span className="text-lg">123 Business St, City</span>
            </div>
          </div>

          <Link
            href="/customer"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
          >
            <span>Start Tracking Orders</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package size={24} />
            <span className="text-xl font-bold">Laundry Tracker</span>
          </div>
          <p className="text-gray-400">
            © 2024 Laundry Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}