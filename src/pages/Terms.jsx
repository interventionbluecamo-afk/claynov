import React from 'react';
import { X } from 'lucide-react';

export default function Terms({ onBack }) {
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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 space-y-6">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed">
              By accessing and using Clay ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Use License</h2>
            <p className="leading-relaxed mb-3">
              Permission is granted to temporarily use the Service for personal, non-commercial use. This license does not include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose</li>
              <li>Attempting to reverse engineer any software</li>
              <li>Removing any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Privacy</h2>
            <p className="leading-relaxed">
              Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Service Availability</h2>
            <p className="leading-relaxed">
              We strive to ensure the Service is available 24/7, but we do not guarantee uninterrupted access. The Service may be unavailable due to maintenance, updates, or circumstances beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. User Content</h2>
            <p className="leading-relaxed mb-3">
              You retain all rights to your resume and job descriptions. By using the Service, you grant us permission to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Process your content to provide optimization services</li>
              <li>Store your content temporarily during processing</li>
            </ul>
            <p className="leading-relaxed mt-3">
              We do not store your resume or job descriptions after processing. Your data remains private and is processed on your device or in secure, temporary processing environments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Limitations</h2>
            <p className="leading-relaxed">
              In no event shall Clay or its suppliers be liable for any damages arising out of the use or inability to use the Service, even if Clay has been notified of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Revisions</h2>
            <p className="leading-relaxed">
              Clay may revise these terms at any time without notice. By using this Service, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">8. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions about these Terms, please contact us through our website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

