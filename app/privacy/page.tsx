import AnimatedSection from '@/components/ui/AnimatedSection'

export const metadata = {
  title: 'Privacy Policy | Laguna Beach Tennis Academy',
  description: 'Privacy policy and data protection practices at Laguna Beach Tennis Academy.',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-sand-50 to-white pt-40 pb-20">
        <div className="container-narrow text-center">
          <AnimatedSection>
            <h1 className="text-display-lg heading-display mb-6">
              Privacy Policy
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
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Introduction</h2>
                <p>
                  Laguna Beach Tennis Academy ("we," "our," or "us") respects your privacy and is 
                  committed to protecting your personal information. This Privacy Policy explains how 
                  we collect, use, disclose, and safeguard your information when you visit our website 
                  or use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Information We Collect</h2>
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Name, email address, and phone number</li>
                  <li>Program preferences and tennis experience level</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Communications with our coaching staff</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Provide and improve our tennis instruction services</li>
                  <li>Process registrations and payments</li>
                  <li>Communicate about programs, schedules, and updates</li>
                  <li>Send promotional materials (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your 
                  personal information. However, no method of transmission over the internet is 
                  100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-display font-light text-clay-900 mb-4">Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at{' '}
                  <a href="mailto:privacy@lbtennisacademy.com" className="link-luxury">
                    privacy@lbtennisacademy.com
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

