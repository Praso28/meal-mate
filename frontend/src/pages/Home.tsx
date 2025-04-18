// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-orange-500">MealMate</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-500">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-orange-500">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-orange-500">Contact</Link>
            <Link to="/login" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              Login
            </Link>
            <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Register
            </Link>
          </nav>
          <button className="md:hidden text-gray-700">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-[600px] bg-gradient-to-r from-gray-900 to-gray-800">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/assets/images/hero-image.jpg')" }}></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative h-full container mx-auto px-4 sm:px-6 lg:px-8 flex items-center z-10">
            <div className="max-w-2xl">
              <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">Connect. Donate. Nourish.</h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">Join our community to help reduce food waste and feed those in need. Every donation makes a difference.</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600">
                  Register as Donor
                </Link>
                <Link to="/register" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  Join as Volunteer
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why MealMate Section */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Why MealMate?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">We connect food donors with those who need it most, creating a sustainable ecosystem to reduce waste and fight hunger.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-hand-holding-heart text-2xl text-orange-500"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Reduce Food Waste</h3>
                <p className="text-gray-600">Help restaurants, grocery stores, and individuals donate excess food instead of throwing it away.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-users text-2xl text-green-600"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Support Communities</h3>
                <p className="text-gray-600">Connect with local food banks and organizations to ensure food reaches those who need it most.</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-8 transition-all hover:shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-chart-line text-2xl text-blue-500"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Track Your Impact</h3>
                <p className="text-gray-600">See real-time statistics on how your donations are making a difference in your community.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 sm:py-20 bg-orange-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">Join our growing community of donors, volunteers, and organizations working together to reduce food waste and fight hunger.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-orange-500 bg-white hover:bg-orange-50">
                Get Started Now
              </Link>
              <Link to="/about" className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">MealMate</h3>
              <p className="text-gray-400 mb-4">Connecting food donors with those who need it most.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <i className="fas fa-envelope text-gray-400"></i>
                  <span className="text-gray-400">info@mealmate.org</span>
                </li>
                <li className="flex items-center space-x-2">
                  <i className="fas fa-phone text-gray-400"></i>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 MealMate. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

