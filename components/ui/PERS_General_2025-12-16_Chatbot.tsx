'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating Chatbot Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-lbta-burnt hover:bg-lbta-charcoal text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[600px] bg-white rounded-lg shadow-2xl overflow-hidden border border-lbta-sand"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-lbta-burnt to-lbta-charcoal text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Image
                    src="/UPDATED LBTA PICS/chatbot-logo.svg"
                    alt="LBTA Chat"
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-sm">LBTA Assistant</h3>
                  <p className="text-xs text-white/80">We're here to help!</p>
                </div>
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="h-[calc(100%-180px)] overflow-y-auto p-6 bg-lbta-cream space-y-4">
              {/* Welcome Message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-lbta-burnt rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/UPDATED LBTA PICS/chatbot-logo.svg"
                    alt="LBTA"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-[280px]">
                  <p className="text-sm text-lbta-charcoal leading-relaxed">
                    Welcome to Laguna Beach Tennis Academy! 👋
                  </p>
                  <p className="text-sm text-lbta-charcoal leading-relaxed mt-2">
                    How can I help you today?
                  </p>
                  <div className="mt-4 space-y-2">
                    <button className="w-full text-left text-xs bg-lbta-sand/50 hover:bg-lbta-sand rounded px-3 py-2 transition-colors">
                      📅 Book a free trial
                    </button>
                    <button className="w-full text-left text-xs bg-lbta-sand/50 hover:bg-lbta-sand rounded px-3 py-2 transition-colors">
                      🎾 View programs
                    </button>
                    <button className="w-full text-left text-xs bg-lbta-sand/50 hover:bg-lbta-sand rounded px-3 py-2 transition-colors">
                      💰 See pricing
                    </button>
                    <button className="w-full text-left text-xs bg-lbta-sand/50 hover:bg-lbta-sand rounded px-3 py-2 transition-colors">
                      📞 Contact us
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-lbta-sand">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-lbta-sand rounded-lg focus:outline-none focus:ring-2 focus:ring-lbta-burnt text-sm"
                />
                <button className="bg-lbta-burnt hover:bg-lbta-charcoal text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by LBTA AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
