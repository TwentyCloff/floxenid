'use client';

import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';

const HeroLanding = () => {
  const [activeTab, setActiveTab] = useState('Product');
  const [hoveredTab, setHoveredTab] = useState(null);

  const tabs = ['Product', 'Docs', 'Resource', 'Pricing'];
  const menuItems = ['Dashboard', 'Product', 'History', 'Settings'];

  return (
    <div className="min-h-screen bg-white">
      {/* Dot pattern background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-white to-transparent z-10" />
        <svg className="w-full h-full" aria-hidden="true">
          <defs>
            <pattern
              id="dot-pattern"
              width="20.4"
              height="20.4"
              patternUnits="userSpaceOnUse"
              patternTransform="scale(1)"
            >
              <circle cx="10.2" cy="10.2" r="1" fill="rgba(160, 160, 160, 0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" opacity="1" />
        </svg>
      </div>

      {/* Main content container */}
      <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Hero Section */}
          <div className="lg:w-1/2">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 text-sm font-medium mb-6">
              Get Pro – Limited time offer
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Build faster than AI with Once UI for Next.js
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              The most complete UI kit for Next.js with 150+ components, templates, and design system. 
              Accelerate your development process with our carefully crafted components.
            </p>

            {/* Avatar stack */}
            <div className="flex items-center mb-8">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div 
                    key={item}
                    className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"
                    style={{ zIndex: 5 - item }}
                  />
                ))}
              </div>
              <span className="ml-3 text-gray-600 text-sm">Used by 3k+ people</span>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg">
                Get Started
              </button>
              <button className="px-6 py-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
                Our Community
              </button>
            </div>
          </div>

          {/* Right Side - UI Preview Board */}
          <div className="lg:w-1/2">
            <Tilt
              tiltEnable={true}
              tiltMaxAngleX={8}
              tiltMaxAngleY={8}
              glareEnable={true}
              glareMaxOpacity={0.1}
              glareColor="#ffffff"
              glarePosition="all"
              scale={1.02}
              transitionSpeed={2000}
              className="w-full"
            >
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
                {/* Top tabs */}
                <div className="flex border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      onMouseEnter={() => setHoveredTab(tab)}
                      onMouseLeave={() => setHoveredTab(null)}
                      className={`px-4 py-3 text-sm font-medium relative 
                        ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab}
                      {(activeTab === tab || hoveredTab === tab) && (
                        <div 
                          className={`absolute bottom-0 left-0 right-0 h-0.5 
                            ${activeTab === tab ? 'bg-blue-600' : 'bg-gray-200'}`}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-16 md:w-20 bg-gray-50 border-r border-gray-200">
                    <div className="py-4 flex flex-col items-center">
                      {menuItems.map((item, index) => (
                        <button
                          key={item}
                          className={`w-full py-3 flex flex-col items-center text-xs 
                            ${index === 1 ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                          <div className="w-6 h-6 mb-1 bg-gray-200 rounded"></div>
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 p-4">
                    {activeTab === 'Product' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-900">Product Dashboard</h3>
                          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="bg-blue-100 rounded-lg p-2 text-center">
                            <div className="text-xs text-blue-800">Active</div>
                            <div className="font-bold text-blue-900">24</div>
                          </div>
                          <div className="bg-green-100 rounded-lg p-2 text-center">
                            <div className="text-xs text-green-800">Completed</div>
                            <div className="font-bold text-green-900">56</div>
                          </div>
                          <div className="bg-purple-100 rounded-lg p-2 text-center">
                            <div className="text-xs text-purple-800">Pending</div>
                            <div className="font-bold text-purple-900">12</div>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {[
                                { task: 'Design new UI', status: 'In Progress', due: 'Jun 30' },
                                { task: 'Fix login bug', status: 'Completed', due: 'Jun 28' },
                                { task: 'API integration', status: 'Pending', due: 'Jul 5' },
                              ].map((item, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.task}</td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                      ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                        item.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                                        'bg-yellow-100 text-yellow-800'}`}>
                                      {item.status}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{item.due}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {activeTab === 'Docs' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-900">Documentation</h3>
                          <button className="text-sm text-blue-600 hover:text-blue-800">Search</button>
                        </div>
                        <div className="space-y-3">
                          {[
                            'Getting Started',
                            'Components Reference',
                            'API Documentation',
                            'Customization Guide'
                          ].map((item, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <div className="font-medium text-gray-900">{item}</div>
                              <div className="text-sm text-gray-500 mt-1">Learn how to {item.toLowerCase()} with Once UI</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Resource' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-900">Resources</h3>
                          <button className="text-sm text-blue-600 hover:text-blue-800">Filter</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { name: 'Templates', count: 12 },
                            { name: 'Icons', count: 256 },
                            { name: 'Illustrations', count: 48 },
                            { name: 'UI Kits', count: 8 }
                          ].map((item, index) => (
                            <div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                              <div className="font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">{item.count} items</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'Pricing' && (
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-medium text-gray-900">Pricing Plans</h3>
                          <button className="text-sm text-blue-600 hover:text-blue-800">Compare</button>
                        </div>
                        <div className="space-y-3">
                          {[
                            { plan: 'Free', price: '$0', features: 'Basic components' },
                            { plan: 'Pro', price: '$29', features: 'All components + support' },
                            { plan: 'Enterprise', price: 'Custom', features: 'Everything + dedicated team' }
                          ].map((item, index) => (
                            <div key={index} className={`p-3 border rounded-lg cursor-pointer transition-colors 
                              ${index === 1 ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                              <div className="flex justify-between">
                                <div className="font-medium text-gray-900">{item.plan}</div>
                                <div className="font-bold">{item.price}</div>
                              </div>
                              <div className="text-sm text-gray-500 mt-1">{item.features}</div>
                              {index === 1 && (
                                <button className="mt-2 w-full py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
                                  Get Started
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tilt>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
