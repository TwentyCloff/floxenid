'use client';

import React, { useState } from 'react';
import { User, ShoppingCart, MessageSquare, Settings, Bookmark, ChevronDown, Plus, Heart, Mail, Search } from 'lucide-react';
import Spline from '@splinetool/react-spline';

const Table = () => {
  const [activeTab, setActiveTab] = useState('Productivity');
  const tabs = ['Productivity', 'Ecommerce', 'Social', 'AI'];
  const ROBOT_SCENE_URL = 'https://prod.spline.design/zK6boI3lfAHoTjb4/scene.splinecode';

  // MacOS-style window controls
  const WindowControls = () => (
    <div className="absolute top-4 left-4 flex space-x-2 z-20">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
  );

  const renderDashboard = () => (
    <div className="p-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: 'Profile', value: 'User Dashboard', icon: <User className="text-blue-600" size={20} />, color: 'blue' },
          { title: 'Products', value: '24 Items', icon: <ShoppingCart className="text-green-600" size={20} />, color: 'green' },
          { title: 'History', value: '$1,240', icon: <Bookmark className="text-purple-600" size={20} />, color: 'purple' },
          { title: 'Analytics', value: '+12.5%', icon: <Settings className="text-orange-600" size={20} />, color: 'orange' }
        ].map((item, index) => (
          <div key={index} className="bg-white/99 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
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
      <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-gray-200 last:border-0">
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

  const renderContent = () => {
    switch (activeTab) {
      case 'Productivity':
        return renderDashboard();
      case 'Ecommerce':
        return (
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
                <div key={item} className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 shadow-sm">
                      <Heart className="text-gray-700" size={18} />
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
      case 'Social':
        return (
          <div className="p-6 w-full">
            <div className="max-w-2xl mx-auto">
              <div className="flex space-x-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="flex flex-col items-center flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 border-2 border-pink-400 mb-1"></div>
                    <span className="text-xs">user{item}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-3"></div>
                        <span className="font-semibold">username{item}</span>
                      </div>
                      <ChevronDown size={20} />
                    </div>
                    <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                    <div className="p-4">
                      <div className="flex space-x-4 mb-2">
                        <Heart size={24} className="text-black hover:text-red-500 cursor-pointer" />
                        <MessageSquare size={24} className="text-black hover:text-blue-500 cursor-pointer" />
                        <Mail size={24} className="text-black hover:text-yellow-500 cursor-pointer" />
                        <Bookmark size={24} className="text-black hover:text-green-500 cursor-pointer ml-auto" />
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
          </div>
        );
      case 'AI':
        return (
          <div className="p-6 w-full h-full">
            <div className="bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm h-full flex flex-col hover:shadow-md transition-all">
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
                    className="w-full bg-gray-100 border border-gray-200 rounded-full py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition">
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
    <div className="relative max-w-6xl mx-auto px-6 mt-40">
      {/* Whobee Robot - positioned above the table showing only head and neck */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 z-10"
        style={{ 
          top: '-250px',
          width: '250px',
          height: '550px',
          pointerEvents: 'none'
        }}
      >
        <Spline 
          scene={ROBOT_SCENE_URL}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </div>

      {/* Unified table and tabs container */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 shadow-xl overflow-hidden relative z-20">
        {/* Window controls and tabs */}
        <div className="relative pt-4 pb-2 px-6 border-b border-gray-200">
          <WindowControls />
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mt-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-black text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main content area */}
        <div className="min-h-[500px]">
          {renderContent()}
        </div>
      </div>

      {/* Harmony shadow */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden z-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-green-100/20 via-cyan-100/20 to-blue-100/20 blur-xl opacity-20"
          style={{
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
          }}
        ></div>
      </div>
    </div>
  );
};

export default Table;