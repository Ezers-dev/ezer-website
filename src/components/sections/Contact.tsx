"use client";

import { useEffect, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

function LocalTime({ timeZone, city }: { timeZone: string; city: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span className="tabular-nums">
      {city}
      {time ? ` ${time}` : ""}
    </span>
  );
}

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        `Something went wrong. Email us directly at ${site.email} and we'll pick it up from there.`,
      );
    }
  }

  return (
    <section
      id="contact"
      data-nav-theme="paper"
      className="scroll-mt-0 bg-blue-deep text-paper"
    >
      <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="text-display max-w-[16ch]">
          <Reveal>Start a</Reveal>
          <Reveal delay={1}>Conversation</Reveal>
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="text-lede max-w-[38ch] font-medium">
              Have a brand challenge, a launch on the horizon, or an identity
              that needs a refresh? Let&rsquo;s talk.
            </p>

            <dl className="mt-10 space-y-6 border-t border-paper/25 pt-8">
              <div>
                <dt className="text-label uppercase text-paper">Call us</dt>
                <dd className="mt-2 space-y-1">
                  {site.phones.map((phone) => (
                    <a
                      key={phone.href}
                      href={phone.href}
                      className="block text-[clamp(1.2rem,2.2vw,1.85rem)] font-bold tracking-[-0.03em] underline decoration-paper/60 decoration-2 underline-offset-[6px] transition-colors hover:decoration-paper"
                    >
                      {phone.number}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-label uppercase text-paper">Email us</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${site.email}`}
                    className="break-all text-[clamp(1.2rem,2.2vw,1.85rem)] font-bold tracking-[-0.03em] underline decoration-paper/60 decoration-2 underline-offset-[6px] transition-colors hover:decoration-paper"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-label uppercase text-paper">
                  We operate in
                </dt>
                <dd className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.95rem] font-medium">
                  {site.locations.map((location) => (
                    <span key={location.country} className="flex items-center gap-2">
                      <span className="pill h-1.5 w-1.5 bg-yellow" />
                      {location.country}
                      <span className="text-paper">
                        <LocalTime
                          timeZone={location.timeZone}
                          city={location.city}
                        />
                      </span>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>

            <Magnetic className="mt-10 block">
              <a
                href={`mailto:${site.email}?subject=Booking%20a%20call`}
                className="pill inline-flex items-center gap-2 bg-paper px-6 py-3.5 text-[0.9rem] font-semibold text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
              >
                Book a Call <span aria-hidden>→</span>
              </a>
            </Magnetic>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-label uppercase text-paper">
                Send a Message
              </h3>

              <Field name="name" label="Your name" autoComplete="name" required />
              <Field
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
              />
              <Field name="company" label="Company (optional)" />

              <div>
                <label
                  htmlFor="message"
                  className="text-label uppercase text-paper"
                >
                  What are you working on?
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="mt-2 w-full resize-none border-b border-paper/55 bg-transparent pb-2 text-[1.05rem] font-medium placeholder:text-paper/75 focus:border-paper focus:outline-none"
                  placeholder="A launch, a rebrand, a campaign…"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="pill inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[0.9rem] font-semibold text-paper transition-colors duration-300 hover:bg-paper hover:text-ink disabled:opacity-60"
              >
                {status === "sending" ? "Sending…" : "Send a Message"}
                <span aria-hidden>→</span>
              </button>

              <p aria-live="polite" className="text-[0.9rem]">
                {status === "sent" &&
                  "Thank you — your message is in. We reply within two business days."}
                {status === "error" && error}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-label uppercase text-paper">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="mt-2 w-full border-b border-paper/55 bg-transparent pb-2 text-[1.05rem] font-medium placeholder:text-paper/75 focus:border-paper focus:outline-none"
      />
    </div>
  );
}
