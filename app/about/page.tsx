import { Award, BookOpen, Heart, Trophy } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'

const coaches = [
  {
    name: 'Michael Chen',
    title: 'Head Coach & Director',
    credentials: 'USPTA Elite Professional, Former ATP Player',
    bio: 'With 20 years of coaching experience and a career-high ATP ranking of 312, Michael brings both playing and teaching expertise. He has developed numerous junior champions and college scholarship recipients.',
    specialties: ['Advanced technique', 'Tournament preparation', 'Mental game coaching'],
  },
  {
    name: 'Sarah Martinez',
    title: 'Junior Program Director',
    credentials: 'PTR Master Professional, NCAA Division I Coach',
    bio: 'Sarah spent 10 years as assistant coach at USC before joining LBTA. Her player-centered approach emphasizes skill development alongside character building and academic balance.',
    specialties: ['Junior development', 'College recruitment', 'Group instruction'],
  },
  {
    name: 'David Thompson',
    title: 'Adult Programs Coordinator',
    credentials: 'USPTA Professional, Biomechanics Specialist',
    bio: 'David combines technical expertise with an understanding of adult learning styles. His background in biomechanics helps students optimize movement patterns and prevent injury.',
    specialties: ['Adult beginners', 'Injury prevention', 'Technical refinement'],
  },
]

const milestones = [
  {
    year: '2010',
    title: 'Academy Founded',
    description: 'Established with a vision to bring world-class tennis instruction to Laguna Beach.',
  },
  {
    year: '2014',
    title: 'Facility Expansion',
    description: 'Added three premier courts and dedicated training areas to serve growing membership.',
  },
  {
    year: '2018',
    title: 'Junior Champions',
    description: 'Five academy students earned Division I college scholarships, establishing our reputation.',
  },
  {
    year: '2023',
    title: 'Community Impact',
    description: 'Launched scholarship program providing free instruction to 20 local youth annually.',
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-sand-50 to-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h1 className="text-display-lg heading-display mb-6">
              About the Academy
            </h1>
            <p className="text-xl md:text-2xl font-light text-clay-600 max-w-2xl mx-auto leading-relaxed">
              Where passion for tennis meets commitment to excellence. 
              Our story is written by every student who walks onto our courts.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Story */}
      <section className="section-spacing bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <h2 className="text-display-sm heading-display mb-8">
                Our Story
              </h2>
              <div className="space-y-6 body-text">
                <p>
                  Laguna Beach Tennis Academy was born from a simple belief: that tennis, taught 
                  with patience and precision, can transform lives. Founded in 2010 by former 
                  professional players who wanted to share their love of the game, we've grown 
                  into Southern California's premier destination for tennis instruction.
                </p>
                <p>
                  What sets us apart isn't just our technical expertise—it's our commitment to 
                  understanding each student as an individual. We recognize that everyone arrives 
                  with unique goals, whether that's winning championships, staying active, or 
                  simply enjoying time on the court.
                </p>
                <p>
                  Over the years, we've had the privilege of coaching players from complete 
                  beginners to college-bound athletes. Our proudest moments aren't just the 
                  trophies won, but the confidence gained, friendships formed, and lifelong 
                  passion for tennis we help ignite.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                <div className="card-luxury p-6 text-center">
                  <Trophy className="h-8 w-8 text-sage-600 mx-auto mb-4" />
                  <div className="text-3xl font-display font-light text-clay-900 mb-2">15+</div>
                  <div className="text-sm text-clay-600">Years of Excellence</div>
                </div>
                <div className="card-luxury p-6 text-center">
                  <Award className="h-8 w-8 text-sage-600 mx-auto mb-4" />
                  <div className="text-3xl font-display font-light text-clay-900 mb-2">500+</div>
                  <div className="text-sm text-clay-600">Students Coached</div>
                </div>
                <div className="card-luxury p-6 text-center">
                  <BookOpen className="h-8 w-8 text-sage-600 mx-auto mb-4" />
                  <div className="text-3xl font-display font-light text-clay-900 mb-2">25+</div>
                  <div className="text-sm text-clay-600">College Scholarships</div>
                </div>
                <div className="card-luxury p-6 text-center">
                  <Heart className="h-8 w-8 text-sage-600 mx-auto mb-4" />
                  <div className="text-3xl font-display font-light text-clay-900 mb-2">98%</div>
                  <div className="text-sm text-clay-600">Satisfaction Rate</div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-spacing bg-sand-50">
        <div className="container-luxury">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-display-sm heading-display mb-6">
              Our Journey
            </h2>
            <p className="body-text text-clay-600">
              From humble beginnings to a thriving tennis community, 
              each milestone represents our commitment to growth.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <AnimatedSection key={milestone.year} delay={index * 0.1}>
                <div className="flex items-start space-x-6 md:space-x-8 mb-12 last:mb-0">
                  <div className="flex-shrink-0 w-20 md:w-24">
                    <div className="text-2xl md:text-3xl font-display font-light text-sage-700">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-grow border-l-2 border-sage-300 pl-6 md:pl-8 pb-8">
                    <h3 className="text-xl md:text-2xl font-sans font-medium text-clay-900 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-clay-600 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section id="coaches" className="section-spacing bg-white">
        <div className="container-luxury">
          <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-display-sm heading-display mb-6">
              Meet Your Coaches
            </h2>
            <p className="body-text text-clay-600">
              Our team brings decades of combined experience, professional playing backgrounds, 
              and most importantly, genuine passion for developing players.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {coaches.map((coach, index) => (
              <AnimatedSection key={coach.name} delay={index * 0.1}>
                <div className="card-luxury p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-display font-light text-clay-900 mb-2">
                      {coach.name}
                    </h3>
                    <p className="text-sage-700 font-medium mb-1">{coach.title}</p>
                    <p className="text-sm text-clay-600">{coach.credentials}</p>
                  </div>
                  
                  <p className="text-clay-700 leading-relaxed mb-6">
                    {coach.bio}
                  </p>

                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-clay-900 mb-3">
                      Specialties
                    </h4>
                    <ul className="space-y-2">
                      {coach.specialties.map((specialty) => (
                        <li key={specialty} className="flex items-start space-x-2 text-sm text-clay-600">
                          <span className="text-sage-600 mt-0.5">•</span>
                          <span>{specialty}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-spacing bg-clay-900 text-sand-100">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h2 className="text-display-sm font-display font-light tracking-tight mb-6">
              Join Our Tennis Community
            </h2>
            <p className="text-lg md:text-xl font-light text-sand-300 mb-10 leading-relaxed">
              Experience the difference that dedicated coaching and a supportive 
              environment can make in your tennis journey.
            </p>
            <a href="/contact" className="btn-primary">
              Get Started Today
            </a>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

