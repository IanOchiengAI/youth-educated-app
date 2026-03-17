import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-off-white pb-12">
      <header className="bg-navy text-white px-6 pt-12 pb-8 rounded-b-[40px] relative overflow-hidden">
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
        <button aria-label="Go back" onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full mb-4 inline-flex">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-3 relative z-10">
          <Shield size={28} className="text-yellow" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-white/60 mt-1 relative z-10 text-sm">Youth Educated — Effective March 2026</p>
      </header>

      <main className="px-6 pt-8 space-y-6 text-navy">
        {[
          {
            title: '1. Who We Are',
            body: 'Youth Educated is a life-skills and educational platform designed for young people in Kenya, aged 10–22. We are committed to protecting your privacy and complying with Kenya\'s Data Protection Act, 2019.',
          },
          {
            title: '2. Information We Collect',
            body: 'We collect: your name, age bracket, county, gender, goals, and phone number for authentication. We also collect usage data including module progress, quiz scores, mood logs (optional), and points earned. We do NOT collect full names, ID numbers, GPS location, or payment information.',
          },
          {
            title: '3. How We Use Your Data',
            body: 'We use your data to: personalise your learning experience, track your progress and achievements, connect you with mentors, and provide age-appropriate content gating. We do not sell, rent, or share your data with third parties for advertising purposes.',
          },
          {
            title: '4. Children\'s Privacy (Under 16)',
            body: 'For users under 16, we require guardian consent during onboarding. We apply stricter content filters and safeguarding rules. Category A & B safeguarding keywords trigger automatic notifications to our Designated Safeguarding Leads (DSLs). No marketing communications are sent to users under 16.',
          },
          {
            title: '5. Data Storage & Security',
            body: 'Your data is stored securely on Supabase (a GDPR-compliant platform). Data is encrypted in transit (TLS) and at rest. Row-level security ensures users can only access their own data.',
          },
          {
            title: '6. Your Rights',
            body: 'You have the right to: access your data, correct inaccurate data, delete your account and all associated data, and withdraw consent at any time. To exercise these rights, contact us at privacy@youtheducated.org.',
          },
          {
            title: '7. AI & Chat',
            body: 'Our AI companion "Jabari" is powered by Google Gemini. Chat messages are processed through Google\'s API to generate responses. We do not store full conversation histories in a way that can be linked to your identity beyond our own database. Flagged safeguarding messages are reviewed by trained DSLs only.',
          },
          {
            title: '8. Contact Us',
            body: 'For any privacy concerns, contact: privacy@youtheducated.org\nChildline Kenya (for urgent safeguarding): 116 (free, 24/7)',
          },
        ].map((section) => (
          <div key={section.title} className="bg-white rounded-[28px] p-6 border border-navy/5 shadow-sm">
            <h2 className="text-base font-bold text-navy mb-2">{section.title}</h2>
            <p className="text-sm text-navy/70 leading-relaxed whitespace-pre-line">{section.body}</p>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PrivacyPolicy;
