import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata = {
  title: 'Terms of Service | Laguna Beach Tennis Academy',
  description: 'Terms and conditions for using Laguna Beach Tennis Academy services.',
}

export default function TermsPage() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-sand-50 to-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h1 className="text-display-lg heading-display mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-clay-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="container-narrow prose prose-lg max-w-none">
          <AnimatedSection>
            <div className="space-y-8 body-text">
              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Acceptance of Terms</h2>
                <p>
                  By accessing or using Laguna Beach Tennis Academy's services, you agree to be 
                  bound by these Terms of Service. If you do not agree to these terms, please do 
                  not use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Program Registration</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Registration is required for all programs and lessons</li>
                  <li>Payment is due at the time of registration unless otherwise arranged</li>
                  <li>Spaces are limited and filled on a first-come, first-served basis</li>
                  <li>We reserve the right to cancel programs due to insufficient enrollment</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Cancellation Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Private lessons: 24-hour notice required for cancellation or rescheduling</li>
                  <li>Group clinics: No refunds for missed sessions; makeup sessions may be available</li>
                  <li>Program cancellations: Refunds available up to 48 hours before start date</li>
                  <li>No-shows will be charged the full session fee</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Code of Conduct</h2>
                <p>All participants are expected to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Treat coaches, staff, and fellow students with respect</li>
                  <li>Maintain appropriate conduct on and off the court</li>
                  <li>Follow safety guidelines and facility rules</li>
                  <li>Wear appropriate tennis attire and footwear</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Liability</h2>
                <p>
                  Participants engage in tennis activities at their own risk. Laguna Beach Tennis 
                  Academy is not responsible for injuries, accidents, or loss of personal property. 
                  We recommend appropriate insurance coverage for all participants.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Photography and Media</h2>
                <p>
                  By participating in our programs, you consent to photography and video recording 
                  for instructional purposes and promotional materials, unless you notify us in 
                  writing of your objection.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Continued use of our 
                  services after changes constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Contact</h2>
                <p>
                  Questions about these terms? Contact us at{' '}
                  <a href="mailto:info@lbtennisacademy.com" className="link-luxury">
                    info@lbtennisacademy.com
                  </a>
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}

