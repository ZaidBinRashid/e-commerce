import React, { useState } from "react";

const initialState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  file: null,
  honeypot: "", // spam trap
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.message.trim()) e.message = "Message is required";
    if (form.file && form.file.size > 5 * 1024 * 1024) e.file = "File must be under 5MB";
    return e;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((prev) => ({ ...prev, file: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Spam trap: if honeypot filled, silently ignore
    if (form.honeypot) return;

    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    setStatus({ loading: true, success: null, error: null });

    try {
      // Example: send as FormData — replace URL with your real endpoint
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("subject", form.subject);
      fd.append("message", form.message);
      if (form.file) fd.append("file", form.file);

      // Replace '/api/contact' with your server endpoint
      const res = await fetch("/api/contact", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Submission failed");
      }

      setStatus({ loading: false, success: "Thanks — your message has been sent!", error: null });
      setForm(initialState);
    } catch (err) {
      setStatus({ loading: false, success: null, error: err.message || "Something went wrong" });
    }
  };

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-gray-200">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Info */}
          <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-700 text-white">
            <h3 className="text-2xl font-semibold mb-2">Get in touch</h3>
            <p className="text-sm text-slate-200 mb-6">
              Have a question about a product or order? Send us a message and we’ll respond within 24 hours.
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:support@example.com" className="text-slate-200 hover:text-white">
                  support@example.com
                </a>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+1234567890" className="text-slate-200 hover:text-white">
                  +1 (234) 567-890
                </a>
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-slate-200">123 Timepiece Lane, Suite 100, City, Country</p>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* status messages */}
            {status.success && (
              <div className="mb-4 rounded-md bg-green-100 text-green-800 px-4 py-2 text-sm">{status.success}</div>
            )}
            {status.error && (
              <div className="mb-4 rounded-md bg-red-100 text-red-800 px-4 py-2 text-sm">{status.error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-slate-300"
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-slate-300"
                  }`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                  errors.message ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-slate-300"
                }`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <div className="mt-4 flex items-center space-x-4">
              {/* <div className="flex-1">
                <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                  Attachment (optional, max 5MB)
                </label>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleChange}
                  className="mt-1 text-sm"
                />
                {form.file && (
                  <p className="mt-2 text-xs text-gray-600">
                    Selected: <span className="font-medium">{form.file.name}</span>
                  </p>
                )}
                {errors.file && <p className="mt-1 text-xs text-red-600">{errors.file}</p>}
              </div> */}

              {/* visually-hidden honeypot */}
              <div style={{ display: "none" }}>
                <label htmlFor="honeypot">Leave this empty</label>
                <input id="honeypot" name="honeypot" value={form.honeypot} onChange={handleChange} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="submit"
                disabled={status.loading}
                className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white transition ${
                  status.loading ? "bg-slate-400 cursor-wait" : "bg-slate-800 hover:bg-slate-900"
                }`}
              >
                {status.loading ? "Sending..." : "Send Message"}
              </button>

              <div className="text-sm text-gray-500">
                <span>Or email us at </span>
                <a href="mailto:support@example.com" className="text-slate-700 underline">
                  support@example.com
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* small footer note */}
      <p className="max-w-4xl mx-auto mt-4 px-4 text-xs text-center text-gray-500">
        By contacting us you agree to our <a href="#" className="underline">terms</a>.
      </p>
    </section>
  );
}
