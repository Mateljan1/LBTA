'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, Calendar, Users, CheckCircle } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const steps = [
  {
    number: "1",
    icon: Phone,
    title: "We Respond Within 24 Hours",
    description: "You'll hear from our team the same or next business day. We'll answer your questions and help you find the right program."
  },
  {
    number: "2",
    icon: Calendar,
    title: "Schedule Your Free Trial",
    description: "Choose a convenient time for your complimentary trial session. No commitment, no pressure—just come experience LBTA firsthand."
  },
  {
    number: "3",
    icon: Users,
    title: "Meet Your Coach",
    description: "Your assigned coach will assess your level, understand your goals, and create a personalized development plan."
  },
  {
    number: "4",
    icon: CheckCircle,
    title: "Start Your Tennis Journey",
    description: "If it's the right fit, we'll get you registered and into your program within days. If not, no worries—we'll point you in the right direction."
  }
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    program: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStatus('success')
    setTimeout(() => {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        program: '',
        message: ''
      })
      setStatus('idle')
    }, 3000)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Contact</p>
            <h1 className="text-display-lg heading-display mb-6">
              Get in Touch
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We respond within 24 hours. Let's find the right program for you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-lbta">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <AnimatedSection>
              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-lbta-burnt flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sans font-medium mb-2">Phone</h3>
                  <a 
                    href="tel:9494646645"
                    className="text-2xl font-serif font-light text-lbta-charcoal hover:text-lbta-burnt transition-colors"
                  >
                    (949) 464-6645
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-lbta-burnt flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sans font-medium mb-2">Email</h3>
                  <a 
                    href="mailto:support@lagunabeachtennisacademy.com"
                    className="text-lg text-lbta-charcoal hover:text-lbta-burnt transition-colors break-all"
                  >
                    support@lagunabeachtennisacademy.com
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-lbta-burnt flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sans font-medium mb-2">Address</h3>
                  <p className="text-gray-600 mb-2">
                    1098 Balboa Ave<br />
                    Laguna Beach, CA 92651
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=1098+Balboa+Ave+Laguna+Beach+CA+92651"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-lbta-burnt hover:text-lbta-orange transition-colors"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-lbta-burnt flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-sans font-medium mb-2">Hours</h3>
                  <p className="text-gray-600">
                    Monday-Friday: 6:00 AM – 9:00 PM<br />
                    Saturday-Sunday: 7:00 AM – 6:00 PM
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="section-spacing bg-white">
        <div className="container-lbta">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-6">
              What Happens After You Reach Out
            </h2>
            <p className="text-lg text-gray-600">
              Your journey from inquiry to first lesson—transparent, simple, pressure-free
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <AnimatedSection key={step.number} delay={index * 0.1}>
                  <div className="card-lbta p-8 relative">
                    <div className="absolute -left-3 top-8 w-10 h-10 bg-lbta-burnt text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                      {step.number}
                    </div>
                    <div className="pl-10">
                      <div className="flex items-center gap-2 mb-3">
                        <Icon className="w-5 h-5 text-lbta-burnt" />
                        <h3 className="text-lg font-sans font-medium text-lbta-charcoal">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

          <AnimatedSection delay={0.5} className="text-center mt-12">
            <p className="text-gray-500 italic max-w-2xl mx-auto">
              No pressure. No hard sell. Just honest guidance about whether LBTA is the right fit for you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="card-lbta p-10">
              <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-8 text-center">
                Send Us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                    placeholder="(949) 555-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Program Interest *
                  </label>
                  <select
                    required
                    value={formData.program}
                    onChange={(e) => setFormData({...formData, program: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all"
                  >
                    <option value="">Select a program</option>
                    <option value="Little Tennis Stars (Ages 3-4)">Little Tennis Stars (Ages 3-4)</option>
                    <option value="Junior Programs">Junior Programs</option>
                    <option value="High Performance">High Performance</option>
                    <option value="Adult Beginner">Adult Beginner</option>
                    <option value="Adult Intermediate">Adult Intermediate</option>
                    <option value="Adult Advanced">Adult Advanced</option>
                    <option value="Cardio Tennis">Cardio Tennis</option>
                    <option value="Private Lessons">Private Lessons</option>
                    <option value="Not Sure">Not Sure - Help Me Choose</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-lbta-charcoal mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-lbta-burnt transition-all resize-none"
                    placeholder="Tell us about your tennis goals and any questions you have"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="btn-primary w-full justify-center disabled:opacity-50"
                >
                  {status === 'sending' ? (
                    'Sending...'
                  ) : status === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      SEND MESSAGE
                    </>
                  )}
                </button>

                {status === 'success' && (
                  <p className="text-center text-sm text-green-600">
                    Thank you! We'll get back to you within 24 hours.
                  </p>
                )}

                <p className="text-xs text-center text-gray-500 leading-relaxed">
                  Expect a response within 24 hours. We'll help you find the perfect program—or let you know honestly if another option might serve you better.
                </p>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Map */}
      <section className="bg-gray-200">
        <div className="h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.8947!2d-117.7767!3d33.5428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDMyJzM0LjEiTiAxMTfCsDQ2JzM2LjEiVw!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="LBTA Location"
          />
        </div>
      </section>
    </>
  )
}
