export const metadata = {
  title: 'Contact Me — CanadienDragon',
  description: 'Contact CanadienDragon for inquiries, partnerships, or feedback.',
};

import ContactForm from "../components/ContactForm";

/**
 * TODO: have the email(skullgamingg31@gmail.com) on the contact page below the form incase the contact form is not working.
 */

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <main className="w-full max-w-2xl mx-auto py-20 px-6">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Contact Me</h1>
          <p className="mt-3 text-purple-200 max-w-2xl mx-auto">Use the form below to get in touch about business inquiries, partnerships, or general questions.</p>
        </div>

        <section className="bg-zinc-900 rounded-xl p-6">
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
