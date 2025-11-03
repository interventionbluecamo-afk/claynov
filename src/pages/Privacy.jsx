import React from 'react';
import { X } from 'lucide-react';

export default function Privacy({ onBack }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Close</span>
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
            <p className="leading-relaxed mb-3">
              Clay is designed with privacy in mind. We collect minimal information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> If you create an account, we collect your email address and name (optional)</li>
              <li><strong>Usage Data:</strong> We track the number of resume optimizations you've used (for free tier limits)</li>
              <li><strong>Resume Content:</strong> Your resume is processed temporarily but never stored permanently</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. How We Use Your Information</h2>
            <p className="leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our resume optimization service</li>
              <li>Track usage limits for free tier users</li>
              <li>Send important service updates (if you've created an account)</li>
              <li>Prevent fraud and abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Data Storage and Security</h2>
            <p className="leading-relaxed mb-3">
              <strong>Your Resume:</strong> Your resume is processed in memory and through secure AI services. We do not permanently store your resume content.
            </p>
            <p className="leading-relaxed mb-3">
              <strong>Account Data:</strong> If you create an account, your email and usage count are stored securely using industry-standard encryption.
            </p>
            <p className="leading-relaxed">
              <strong>Processing:</strong> Resume optimization happens either on your device (for anonymous users) or through secure, encrypted API calls. We use third-party AI services (Anthropic Claude) that comply with data privacy regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Third-Party Services</h2>
            <p className="leading-relaxed mb-3">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Anthropic Claude:</strong> For AI-powered resume optimization. Their privacy policy applies to data processed through their API.</li>
              <li><strong>Supabase:</strong> For user authentication and account management (if you create an account)</li>
              <li><strong>Stripe:</strong> For payment processing (if you upgrade to Pro). We do not store your payment information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Cookies and Tracking</h2>
            <p className="leading-relaxed">
              We use minimal cookies and local storage for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Maintaining your session (if logged in)</li>
              <li>Tracking usage count for anonymous users (localStorage only)</li>
              <li>Remembering your preferences</li>
            </ul>
            <p className="leading-relaxed mt-3">
              We do not use tracking cookies or analytics that share your data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Your Rights</h2>
            <p className="leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your account data</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of email communications</li>
              <li>Use the service anonymously without creating an account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Children's Privacy</h2>
            <p className="leading-relaxed">
              Our Service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">9. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

