'use client'

import { useState } from 'react'
import Link from 'next/link'
import AnimatedSection from '@/components/ui/AnimatedSection'

type PathwayResult = {
  program: string
  nextProgram: string
  timeline: string
  monthlyInvestment: string
  annualInvestment: string
  recommendation: string
  coach: string
}

function PathwayPlannerInteractive() {
  const [formData, setFormData] = useState({
    age: '',
    experience: '',
    goal: '',
    commitment: ''
  })
  const [results, setResults] = useState<PathwayResult | null>(null)

  const calculatePathway = (e: React.FormEvent) => {
    e.preventDefault()
    
    let pathway: PathwayResult = {
      program: '',
      nextProgram: '',
      timeline: '',
      monthlyInvestment: '',
      annualInvestment: '',
      recommendation: '',
      coach: ''
    }

    // Determine program based on age
    if (formData.age === '3-4') {
      pathway.program = 'Little Tennis Stars'
      pathway.nextProgram = 'Red Ball Tennis'
      pathway.timeline = '1-2 years to progress'
      pathway.coach = 'Michelle Bevins'
    } else if (formData.age === '5-7') {
      pathway.program = formData.experience === 'never-played' ? 'Red Ball Tennis' : 'Orange Ball Tennis'
      pathway.nextProgram = 'Green Dot Tennis'
      pathway.timeline = '2-3 years to competitive level'
      pathway.coach = 'Michelle Bevins'
    } else if (formData.age === '7-9') {
      pathway.program = formData.experience === 'advanced' ? 'Green Dot Tennis' : 'Orange Ball Tennis'
      pathway.nextProgram = 'Youth Development'
      pathway.timeline = '2-4 years to high school varsity'
      pathway.coach = 'Michelle Bevins or Kevin Jackson'
    } else if (formData.age === '9-11') {
      pathway.program = 'Green Dot Tennis'
      pathway.nextProgram = 'Youth Development → High Performance'
      pathway.timeline = '4-6 years to college recruitment'
      pathway.coach = 'Kevin Jackson'
    } else if (formData.age === '11-15') {
      pathway.program = 'Youth Development'
      pathway.nextProgram = 'High Performance → College Bound'
      pathway.timeline = '3-5 years to D1 scholarship readiness'
      pathway.coach = 'Kevin Jackson'
    } else if (formData.age === '15-18') {
      pathway.program = 'High Performance'
      pathway.nextProgram = 'College Recruitment Active'
      pathway.timeline = '1-3 years to college placement'
      pathway.coach = 'Andrew Mateljan or Kevin Jackson'
    } else {
      pathway.program = 'Adult Programs'
      pathway.nextProgram = 'Competitive Match Play'
      pathway.timeline = 'Ongoing development'
      pathway.coach = 'Savriyan Danilov or Andy Wu'
    }

    // Calculate investment
    let monthlyMin, monthlyMax, annualMin, annualMax
    
    if (formData.commitment === '1x') {
      monthlyMin = 140
      monthlyMax = 200
    } else if (formData.commitment === '2x') {
      monthlyMin = 260
      monthlyMax = 380
    } else if (formData.commitment === '3-4x') {
      monthlyMin = 400
      monthlyMax = 650
    } else {
      monthlyMin = 700
      monthlyMax = 1200
    }

    annualMin = monthlyMin * 12
    annualMax = monthlyMax * 12

    pathway.monthlyInvestment = `$${monthlyMin}-${monthlyMax}`
    pathway.annualInvestment = `$${annualMin.toLocaleString()}-${annualMax.toLocaleString()}`

    // Goal-specific guidance
    if (formData.goal === 'fun') {
      pathway.recommendation = 'Community Track - Focus on skill building, fitness, and enjoyment'
    } else if (formData.goal === 'high-school') {
      pathway.recommendation = 'Pathway Track - Structured development for high school varsity'
    } else if (formData.goal === 'college') {
      pathway.recommendation = 'College Pathway - NCAA recruitment guidance with Kevin Jackson'
    } else {
      pathway.recommendation = 'Elite Track - Professional development pathway, consider VYLO'
    }

    setResults(pathway)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <p className="text-overline mb-6">Pathway Planner</p>
            <h1 className="text-display-lg heading-display mb-6">
              Find Your Development Path
            </h1>
            <p className="text-xl font-sans font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Four questions. Your personalized tennis roadmap.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form */}
      <section className="section-spacing bg-lbta-cream">
        <div className="container-narrow">
          <form onSubmit={calculatePathway} className="max-w-2xl mx-auto space-y-8">
            <div>
              <label className="block text-lg font-sans font-medium text-lbta-charcoal mb-4">
                1. What is your (or your child's) age?
              </label>
              <select
                required
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-4 border border-gray-300 rounded-sm font-sans focus:outline-none focus:ring-2 focus:ring-lbta-burnt focus:ring-offset-2 min-h-[48px]"
              >
                <option value="">Select age range</option>
                <option value="3-4">Ages 3-4</option>
                <option value="5-7">Ages 5-7</option>
                <option value="7-9">Ages 7-9</option>
                <option value="9-11">Ages 9-11</option>
                <option value="11-15">Ages 11-15</option>
                <option value="15-18">Ages 15-18</option>
                <option value="adult">Adult (18+)</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-sans font-medium text-lbta-charcoal mb-4">
                2. What is your current tennis experience?
              </label>
              <select
                required
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-4 py-4 border border-gray-300 rounded-sm font-sans focus:outline-none focus:ring-2 focus:ring-lbta-burnt focus:ring-offset-2 min-h-[48px]"
              >
                <option value="">Select experience level</option>
                <option value="never-played">Never Played</option>
                <option value="beginner">Beginner (0-6 months)</option>
                <option value="intermediate">Intermediate (6 months - 2 years)</option>
                <option value="advanced">Advanced (2+ years)</option>
                <option value="competitive">Competitive (Tournament player)</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-sans font-medium text-lbta-charcoal mb-4">
                3. What is your primary tennis goal?
              </label>
              <select
                required
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="w-full px-4 py-4 border border-gray-300 rounded-sm font-sans focus:outline-none focus:ring-2 focus:ring-lbta-burnt focus:ring-offset-2 min-h-[48px]"
              >
                <option value="">Select your goal</option>
                <option value="fun">Fun & Fitness</option>
                <option value="high-school">Make High School Team</option>
                <option value="college">Earn College Scholarship</option>
                <option value="professional">Professional Tennis Career</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-sans font-medium text-lbta-charcoal mb-4">
                4. How many sessions per week can you commit to?
              </label>
              <select
                required
                value={formData.commitment}
                onChange={(e) => setFormData({...formData, commitment: e.target.value})}
                className="w-full px-4 py-4 border border-gray-300 rounded-sm font-sans focus:outline-none focus:ring-2 focus:ring-lbta-burnt focus:ring-offset-2 min-h-[48px]"
              >
                <option value="">Select commitment level</option>
                <option value="1x">1 session per week</option>
                <option value="2x">2 sessions per week</option>
                <option value="3-4x">3-4 sessions per week</option>
                <option value="5+">5+ sessions per week (Elite)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full justify-center text-base">
              BUILD MY PLAN
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      {results && (
        <section className="section-spacing bg-white">
          <div className="container-narrow">
            <AnimatedSection>
              <h2 className="text-4xl font-serif font-light text-lbta-charcoal mb-12 text-center">
                Your Personalized Pathway
              </h2>

              <div className="space-y-8">
                <div className="card-lbta p-8">
                  <h3 className="text-sm font-sans tracking-wide uppercase text-gray-500 mb-2">Start Here</h3>
                  <p className="text-2xl font-serif font-light text-lbta-charcoal mb-3">
                    {results.program}
                  </p>
                  <p className="text-gray-600 mb-4">
                    {results.recommendation}
                  </p>
                  <p className="text-sm text-gray-500">
                    Recommended coach: {results.coach}
                  </p>
                </div>

                <div className="card-lbta p-8">
                  <h3 className="text-sm font-sans tracking-wide uppercase text-gray-500 mb-2">Timeline</h3>
                  <p className="text-2xl font-serif font-light text-lbta-charcoal mb-3">
                    {results.timeline}
                  </p>
                  <p className="text-gray-600">
                    Progression: {results.program} → {results.nextProgram}
                  </p>
                </div>

                <div className="card-lbta p-8">
                  <h3 className="text-sm font-sans tracking-wide uppercase text-gray-500 mb-2">Investment</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Monthly</p>
                      <p className="text-xl font-serif font-light text-lbta-charcoal">
                        {results.monthlyInvestment}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Annual</p>
                      <p className="text-xl font-serif font-light text-lbta-charcoal">
                        {results.annualInvestment}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Based on {formData.commitment === '1x' ? '1' : formData.commitment === '2x' ? '2' : formData.commitment === '3-4x' ? '3-4' : '5+'} sessions per week
                  </p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/book" className="btn-primary">
                  SCHEDULE TRIAL
                </Link>
                <p className="text-sm text-gray-500 mt-4">
                  Book complimentary assessment to validate your plan
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* CTA */}
      {!results && (
        <section className="section-spacing bg-white border-t border-gray-200">
          <div className="container-narrow text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-serif font-light text-lbta-charcoal mb-6">
                Not Sure Where to Start?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Complete the planner above or schedule a complimentary consultation
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/book" className="btn-primary">
                  SCHEDULE CONSULTATION
                </Link>
                <a href="tel:9494646645" className="btn-secondary">
                  (949) 464-6645
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}
    </>
  )
}

export default function PathwayPlannerPage() {
  return <PathwayPlannerInteractive />
}
