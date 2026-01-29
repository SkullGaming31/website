"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [business, setBusiness] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, business, message }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setBusiness("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
      console.error("Contact form error", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 text-left">
      <div>
        <label className="block text-sm text-purple-200 mb-1">Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md p-2 bg-zinc-800 text-white border border-zinc-700"
          placeholder="Full name"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-purple-200 mb-1">Your email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md p-2 bg-zinc-800 text-white border border-zinc-700"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-purple-200 mb-1">Business / Organization</label>
        <select
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full rounded-md p-2 bg-zinc-800 text-white border border-zinc-700"
        >
          <option value="">Select type (optional)</option>
          <option value="Business / Organization">Business / Organization</option>
          <option value="Individual">Individual</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-purple-200 mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md p-2 h-36 bg-zinc-800 text-white border border-zinc-700"
          placeholder="Tell me about your inquiry (dates, budget, details...)"
          required
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-md"
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        {status === "success" && <span className="text-green-400">Message sent. Thanks!</span>}
        {status === "error" && <span className="text-red-400">Failed to send message.</span>}
      </div>
    </form>
  );
}
