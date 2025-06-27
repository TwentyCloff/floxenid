'use client';

import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { Home, User, ShoppingCart, MessageSquare, Settings, Bell, Search, Plus, Heart, Mail, Bookmark, ChevronDown } from 'lucide-react';

const HeroLanding = () => {
  const [activeTab, setActiveTab] = useState('Productivity');
  const tabs = ['Productivity', 'Ecommerce', 'Social', 'AI'];

  const renderDashboard = () => (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profile</p>
              <h3 className="text-xl font-semibold mt-1">User Dashboard</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Products</p>
              <h3 className="text-xl font-semibold mt-1">24 Items</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <ShoppingCart className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">History</p>
              <h3 className="text-xl font-semibold mt-1">$1,240</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <Bookmark className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Analytics</p>
              <h3 className="text-xl font-semibold mt-1">+12.5%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
              <Settings className="text-orange-600" size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/30 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-white/10 last:border-0">
              <div className="w-10 h-10 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <p className="font-medium">Activity {item}</p>
                <p className="text-sm text-gray-600">Description of activity {item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEcommerce = () => (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Personal Store</h2>
        <div className="flex items-center space-x-4">
          <Search className="text-gray-500" size={20} />
          <ShoppingCart className="text-gray-500" size={20} />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-sm overflow-hidden">
            <div className="h-40 bg-gray-200 relative">
              <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                <Heart className="text-gray-700" size={16} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium">Product {item}</h3>
              <p className="text-sm text-gray-600 mt-1">$19.99</p>
              <button className="mt-3 w-full bg-black text-white py-2 rounded-md text-sm hover:bg-gray-800 transition">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSocial = () => (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-white/30 backdrop-blur-lg border-r border-white/20 flex flex-col items-center md:items-start py-6 px-2 md:px-6">
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Home className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block font-semibold">Home</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Search className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Search</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Bell className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Notifications</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Mail className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Messages</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Bookmark className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Saved</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <User className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Profile</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* Stories */}
          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-pink-500 mb-1"></div>
                <span className="text-xs">user{item}</span>
              </div>
            ))}
          </div>
          
          {/* Posts */}
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white/30 backdrop-blur-lg rounded-xl border border-white/20 shadow-sm">
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                    <span className="font-semibold">username{item}</span>
                  </div>
                  <ChevronDown size={20} />
                </div>
                
                {/* Post Image */}
                <div className="h-96 bg-gray-200"></div>
                
                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex space-x-4 mb-2">
                    <Heart size={24} className="text-black" />
                    <MessageSquare size={24} className="text-black" />
                    <Mail size={24} className="text-black" />
                    <Bookmark size={24} className="text-black ml-auto" />
                  </div>
                  <p className="font-semibold">1,234 likes</p>
                  <p className="mt-1">
                    <span className="font-semibold">username{item}</span> This is a sample post caption #{item}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">View all 42 comments</p>
                  <p className="text-gray-500 text-xs mt-1">2 HOURS AGO</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAI = () => (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-16 md:w-64 bg-white/30 backdrop-blur-lg border-r border-white/20 flex flex-col items-center md:items-start py-6 px-2 md:px-6">
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <MessageSquare className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block font-semibold">New Chat</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Bookmark className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Saved Chats</span>
        </div>
        <div className="flex items-center justify-center md:justify-start w-full mb-8">
          <Settings className="text-black mr-0 md:mr-3" size={24} />
          <span className="hidden md:block">Settings</span>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/20 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Floxen AI</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-white/10">
              <Settings size={20} />
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white/30 backdrop-blur-lg rounded-xl p-4">
              <p>Hello! I'm Floxen AI. How can I assist you today?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[70%] bg-blue-500 text-white rounded-xl p-4">
              <p>What can you do?</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="max-w-[70%] bg-white/30 backdrop-blur-lg rounded-xl p-4">
              <p>I can help with coding, content creation, research, and much more. I'm powered by advanced AI to provide you with the best assistance possible.</p>
            </div>
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-white/20">
          <div className="relative">
            <input
              type="text"
              placeholder="Message Floxen..."
              className="w-full bg-white/30 backdrop-blur-lg border border-white/20 rounded-full py-3 px-4 pr-12 focus:outline-none"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full">
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const tabContent = {
    Productivity: renderDashboard(),
    Ecommerce: renderEcommerce(),
    Social: renderSocial(),
    AI: renderAI()
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16">
        {/* Left Side */}
        <div className="lg:w-1/2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium mb-6 backdrop-blur-lg bg-white/30 border border-white/20">
            <span className="mr-2">✨</span> Get Pro – Limited time offer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-black">
            Build smarter, faster than AI — powered by Floxen.
          </h1>
          <p className="text-gray-600 mb-6 text-lg">
            The open-source stack for providing ready-to-use game scripts and premium tools with zero setup.
          </p>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full border-2 border-white bg-gray-300"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">Used by 1k+ indie creators</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-black text-white px-6 py-3 rounded-md shadow-md hover:bg-zinc-800 transition hover:shadow-lg font-medium relative overflow-hidden group">
              <span className="relative z-10">Get started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
            <button className="bg-white/30 backdrop-blur-lg border border-white/20 text-black px-6 py-3 rounded-md shadow-sm hover:shadow-md transition font-medium flex items-center justify-center">
              <span className="mr-2">Our Community</span>
              <MessageSquare size={18} />
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-1/2 w-full flex flex-col gap-4">
          {/* Tab Selector */}
          <div className="relative">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 text-sm font-medium rounded-full border transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'bg-zinc-200 text-black/60 hover:bg-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tilt Preview Board */}
          <Tilt
            tiltEnable={true}
            tiltMaxAngleX={6}
            tiltMaxAngleY={6}
            perspective={1200}
            scale={1.02}
            transitionSpeed={1500}
            className="w-full"
          >
            <div className="bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl overflow-hidden h-[600px] relative">
              <div className="absolute top-0 left-0 right-0 h-12 bg-white/20 backdrop-blur-md border-b border-white/20 flex items-center px-4 z-10">
                <h3 className="text-lg font-semibold">Floxen Platform</h3>
              </div>
              <div className="pt-12 h-full overflow-y-auto">
                {tabContent[activeTab]}
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
