import { type FormEvent } from "react";
import { Mail, MapPin, MessageCircle, Send } from "lucide-react";
import contactimage from "../assets/image/contact_image.jpg";

const Contact = () => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") || "");
    const email = String(data.get("email") || "");
    const subject = String(data.get("subject") || "");
    const message = String(data.get("message") || "");

    const emailSubject = encodeURIComponent(subject);
    const emailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:pendohub@gmail.com?subject=${emailSubject}&body=${emailBody}`;
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Section 1: Contact Hero */}
      <section
        className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-black px-6 py-20 text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${contactimage})` }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 mx-auto max-w-3xl text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            We're Here to Help
          </p>

          <h1 className="text-4xl font-extrabold sm:text-6xl">
            Contact <span className="text-orange-400">Us</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-200">
            Have a question about our clothes or shoes? We'd love to hear from
            you.
          </p>
        </div>
      </section>

      {/* Section 2: Contact Information and Form */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 lg:py-20">
        <div>
          <p className="mb-3 font-bold uppercase tracking-widest text-orange-700">
            Get in Touch
          </p>

          <h2 className="text-3xl font-bold">How can we help you?</h2>

          <p className="mt-4 leading-7 text-gray-600">
            Contact us about products, orders, or any questions about PendoHub.
          </p>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <Mail size={22} className="text-orange-700" />
              </div>

              <div>
                <h3 className="font-semibold">Email Us</h3>
                <a
                  href="mailto:pendohub@gmail.com"
                  className="mt-1 text-gray-600 transition hover:text-orange-700"
                >
                  pendohub@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <MessageCircle size={22} className="text-orange-700" />
              </div>

              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="mt-1 text-gray-600">
                  We're happy to help with your shopping questions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-3">
                <MapPin size={22} className="text-orange-700" />
              </div>

              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="mt-1 text-gray-600">Kigali, Rwanda</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-semibold"
              >
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                placeholder="What is your message about?"
                className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Write your message..."
                className="w-full resize-y rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-orange-600 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-orange-800"
            >
              Send Message
              <Send size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Contact;
