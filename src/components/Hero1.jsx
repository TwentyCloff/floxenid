'use client';

import React, { useState } from 'react';
import Tilt from 'react-parallax-tilt';

const HeroLanding = () => {
  const [activeTab, setActiveTab] = useState('Productivity');
  const tabs = ['Productivity', 'Ecommerce', 'Social', 'AI'];

  const tabContent = {
    Productivity: [
      {
        column: 'To do',
        tasks: [
          { title: 'Fix login bug', desc: 'Implement new authentication flow with OAuth2', tags: ['Frontend', 'Bug'] },
          { title: 'Design new UI', desc: 'Add responsive layouts and improve mobile experience', tags: ['Frontend', 'Feature'] },
        ]
      },
      {
        column: 'In progress',
        tasks: [
          { title: 'Write unit tests', desc: 'Integrate and test Stripe payment processing', tags: ['Backend', 'Tech'] },
          { title: 'Test payment gateway', desc: 'Implement code splitting and lazy loading', tags: ['Frontend', 'Bug'] }
        ]
      },
      {
        column: 'Done',
        tasks: [
          { title: 'Deploy to production', desc: 'Update API documentation and usage examples', tags: ['Backend', 'Feature'] }
        ]
      }
    ],
    Ecommerce: [
      {
        column: 'To do',
        tasks: [
          { title: 'Setup store schema', desc: 'Define DB tables for products, users, and orders', tags: ['Backend'] },
        ]
      },
      {
        column: 'In progress',
        tasks: [
          { title: 'Checkout integration', desc: 'Add Stripe and PayPal integration', tags: ['Frontend', 'Payment'] }
        ]
      },
      {
        column: 'Done',
        tasks: [
          { title: 'Landing page', desc: 'Initial marketing layout', tags: ['Frontend'] }
        ]
      }
    ],
    Social: [
      {
        column: 'To do',
        tasks: [
          { title: 'Implement follow system', desc: 'Users can follow and unfollow', tags: ['Backend'] }
        ]
      },
      {
        column: 'In progress',
        tasks: [
          { title: 'Post feed', desc: 'Show latest user posts', tags: ['Frontend'] }
        ]
      },
      {
        column: 'Done',
        tasks: [
          { title: 'User auth', desc: 'Login and registration flow', tags: ['Frontend', 'Auth'] }
        ]
      }
    ],
    AI: [
      {
        column: 'To do',
        tasks: [
          { title: 'Dataset cleaning', desc: 'Prepare input for model training', tags: ['Data'] }
        ]
      },
      {
        column: 'In progress',
        tasks: [
          { title: 'Train GPT model', desc: 'Fine-tune on internal data', tags: ['ML'] }
        ]
      },
      {
        column: 'Done',
        tasks: [
          { title: 'Initial model benchmark', desc: 'Evaluate first round results', tags: ['ML'] }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 py-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-20">
        {/* Left: Hero Content */}
        <div className="lg:w-1/2">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-950 text-blue-400 text-sm font-medium mb-6">
            Get Pro – Limited time offer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-black">
            Build faster than AI<br /> with Once UI for Next.js
          </h1>
          <p className="text-gray-600 mb-6">
            The open-source stack that helps you ship faster than VC-backed startups
          </p>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex -space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-gray-300"
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">Used by 1k+ indie creators</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-zinc-900 text-white text-sm px-4 py-2 rounded-md font-mono flex items-center">
              npx create-once-ui-app@latest
              <span className="ml-2">📋</span>
            </div>
            <button className="bg-black text-white px-5 py-2 rounded-md shadow hover:bg-zinc-800 transition">
              Start building
            </button>
          </div>
        </div>

        {/* Right: Tabs Selector Outside Tilt */}
        <div className="lg:w-[130%] -ml-20 mb-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 text-sm rounded-full transition-all border border-zinc-700 backdrop-blur-md ${
                  activeTab === tab ? 'bg-black text-white' : 'bg-zinc-200 text-black/60 hover:bg-zinc-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Tilted Preview */}
        <div className="lg:w-[130%] -ml-20">
          <Tilt
            tiltEnable={true}
            tiltMaxAngleX={7}
            tiltMaxAngleY={7}
            perspective={1200}
            scale={1.01}
            transitionSpeed={1500}
            className="w-full"
          >
            <div className="transform rotate-x-[2deg] rotate-y-[-7deg] scale-[0.96] hover:rotate-x-0 hover:rotate-y-0 hover:scale-100 transition-all duration-700 bg-[#0b0b0b] border border-zinc-800 rounded-2xl shadow-2xl p-6 text-white max-h-[600px] overflow-hidden">
              <h3 className="text-lg font-semibold mb-4">Platform Squad</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(tabContent[activeTab] || []).map((col) => (
                  <div key={col.column}>
                    <h4 className="text-sm font-medium text-white/80 mb-2">{col.column}</h4>
                    <div className="space-y-3">
                      {col.tasks.map((task, i) => (
                        <div
                          key={i}
                          className="bg-zinc-800 p-4 rounded-lg shadow hover:shadow-xl transition border border-zinc-700"
                        >
                          <h5 className="text-sm font-semibold mb-1">{task.title}</h5>
                          <p className="text-xs text-white/60 mb-2">{task.desc}</p>
                          <div className="flex gap-2 flex-wrap">
                            {task.tags.map((tag, j) => (
                              <span key={j} className="text-xs bg-zinc-700 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Tilt>
        </div>
      </div>
    </div>
  );
};

export default HeroLanding;
