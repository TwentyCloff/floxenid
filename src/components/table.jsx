'use client';

import React, { useState } from 'react';
import { Home, User, ShoppingCart, MessageSquare, Settings, Bell, Search, Plus, Heart, Mail, Bookmark, ChevronDown } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const Table = () => {
  const [activeTab, setActiveTab] = useState('Productivity');
  const tabs = ['Productivity', 'Ecommerce', 'Social', 'AI'];

  // MacOS-style window controls
  const WindowControls = () => (
    <div className="absolute top-4 left-4 flex space-x-2 z-20">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
  );

  // Whobee Robot (positioned behind the tabs)
  const WhobeeRobot = () => (
    <div className="absolute top-[-50px] left-1/2 transform -translate-x-1/2 z-0 w-40 h-40">
      <Spline scene="https://prod.spline.design/zK6boI3lfAHoTjb4/scene.splinecode" />
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Dashboard cards */}
        {[
          { title: 'Profile', value: 'User Dashboard', icon: <User className="text-blue-600" size={20} />, color: 'blue' },
          { title: 'Products', value: '24 Items', icon: <ShoppingCart className="text-green-600" size={20} />, color: 'green' },
          { title: 'History', value: '$1,240', icon: <Bookmark className="text-purple-600" size={20} />, color: 'purple' },
          { title: 'Analytics', value: '+12.5%', icon: <Settings className="text-orange-600" size={20} />, color: 'orange' }
        ].map((item, index) => (
          <div key={index} className="bg-white/70 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{item.title}</p>
                <h3 className="text-xl font-semibold mt-1">{item.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-full bg-${item.color}-100 flex items-center justify-center`}>
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Productivity':
        return renderDashboard();
      case 'Ecommerce':
        return (
          <div className="p-6 w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="h-40 bg-gray-200 relative">
                    <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
                      <Heart className="text-gray-700" size={16} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Product {i + 1}</h3>
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
      case 'Social':
        return (
          <div className="p-6 w-full">
            <div className="max-w-2xl mx-auto space-y-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                      <span className="font-semibold">username{item}</span>
                    </div>
                    <ChevronDown size={20} />
                  </div>
                  <div className="h-96 bg-gray-200"></div>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'AI':
        return (
          <div className="p-6 w-full h-full">
            <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Floxen AI</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <div className="max-w-[70%] bg-gray-100 rounded-xl p-4">
                      <p>Hello! I'm Floxen AI. How can I assist you today?</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[70%] bg-blue-500 text-white rounded-xl p-4">
                      <p>What can you do?</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Message Floxen..."
                    className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 px-4 pr-12 focus:outline-none"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="relative max-w-6xl mx-auto px-6">
      {/* Harmony shadow */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden z-[-1]">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-cyan-100/30 to-blue-100/30 blur-xl opacity-20"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
          }}
        ></div>
      </div>

      {/* White shape with MacOS controls */}
      <div className="bg-white/90 backdrop-blur-md rounded-t-2xl border border-gray-200 shadow-sm relative pt-4 pb-2 px-6">
        <WindowControls />
        <WhobeeRobot />
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main table content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-b-2xl border border-t-0 border-gray-200 shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default Table;
