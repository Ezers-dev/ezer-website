"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Magnetic } from "@/components/motion/Magnetic";
import { Reveal } from "@/components/motion/Reveal";
import { contact, site } from "@/data/site";

type Status = "idle" | "sending" | "sent" | "error";

/** The time where the studio is, kept current while the page is open. */
function LocalTime({ timeZone }: { timeZone: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setTime(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone }).format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  // Nothing until the clock is read on the client, so the panel doesn't shift.
  return <span className="tabular-nums text-paper/55">{time ?? "—:—"}</span>;
}

/**
 * Start a Conversation: an ink panel that closes the page, with the form as
 * the main thing on it and the studio's own details set small beneath.
 */
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
      setError(`Something went wrong. Email us at ${site.email} and we'll pick it up from there.`);
    }
  }

  return (
    <section id="contact" data-nav-theme="paper" className="scroll-mt-0 bg-ink text-paper">
      <div className="mx-auto max-w-[1560px] px-5 pb-[clamp(4rem,7vw,6rem)] pt-[clamp(5rem,10vw,9rem)] sm:px-8 lg:px-12">
        <header className="grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <p className="text-label uppercase text-paper/55 lg:col-span-3">{contact.eyebrow}</p>
          <div className="lg:col-span-9">
            <h2 className="text-display max-w-[14ch]">
              <Reveal>Tell us what</Reveal>
              <Reveal delay={1}>
                you&rsquo;re <span className="text-blue">building.</span>
              </Reveal>
            </h2>
            <p className="mt-8 max-w-[46ch] text-lede font-medium text-paper/75">{contact.lede}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="mt-[clamp(3.5rem,7vw,6rem)] grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-9 lg:col-start-4">
            <div className="grid gap-x-10 gap-y-[clamp(2rem,4vw,3rem)] sm:grid-cols-2">
              <Field name="name" label="Your name" autoComplete="name" placeholder="Ada Okoye" required />
              <Field name="email" label="Email" type="email" autoComplete="email" placeholder="ada@studio.com" required />
              <Field name="company" label="Company" autoComplete="organization" placeholder="Optional" />
              <Field name="budget" label="Budget" placeholder="Optional" />
            </div>

            <div className="mt-[clamp(2rem,4vw,3rem)]">
              <Field
                name="message"
                label="What are you working on?"
                placeholder="A launch, a rebrand, a campaign…"
                required
                multiline
              />
            </div>

            <div className="mt-[clamp(2.5rem,5vw,4rem)] flex flex-wrap items-center gap-x-8 gap-y-4">
              <Magnetic>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="pill inline-flex items-center gap-3 bg-paper px-8 py-4 text-[0.95rem] font-semibold text-ink transition-colors duration-300 hover:bg-blue hover:text-paper disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send a message"}
                  <span aria-hidden>→</span>
                </button>
              </Magnetic>
              <p className="text-[0.9rem] text-paper/55">{contact.reply}</p>
            </div>

            <p aria-live="polite" className="mt-5 min-h-6 text-[0.95rem] font-medium">
              {status === "sent" && <span className="text-blue">Thank you — your message is in.</span>}
              {status === "error" && <span className="text-pink">{error}</span>}
            </p>
          </div>
        </form>

        {/* The studio's own details, small: the form is the way in. */}
        <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-x-10 gap-y-8 border-t border-paper/15 pt-9 lg:grid-cols-12">
          <p className="text-label uppercase text-paper/55 lg:col-span-3">Or reach us directly</p>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
            <Detail label="Email">
              <a href={`mailto:${site.email}`} className="break-all hover:text-blue">
                {site.email}
              </a>
            </Detail>
            {site.phones.map((phone) => (
              <Detail key={phone.href} label={phone.label}>
                <a href={phone.href} className="hover:text-blue">
                  {phone.number}
                </a>
              </Detail>
            ))}
            {site.locations.map((location) => (
              <Detail key={location.city} label={`${location.country} time`}>
                <span className="flex items-baseline gap-3">
                  {location.city} <LocalTime timeZone={location.timeZone} />
                </span>
              </Detail>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-label uppercase text-paper/55">{label}</dt>
      <dd className="mt-2 text-[1.02rem] font-semibold tracking-[-0.01em] transition-colors duration-300">{children}</dd>
    </div>
  );
}

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  multiline?: boolean;
};

/**
 * One line of the form: a small label, big type to write in, and a rule that
 * lights up in brand blue as the field takes focus.
 */
function Field({ name, label, type = "text", placeholder, required, autoComplete, multiline }: FieldProps) {
  // The site-wide focus ring (globals.css) marks the focused field; the blue
  // rule and label are the quieter half of the same signal.
  const shared =
    "w-full resize-none bg-transparent pb-3 text-[clamp(1.15rem,1.8vw,1.5rem)] font-medium tracking-[-0.02em] text-paper placeholder:text-paper/30";

  return (
    <div className="group/field relative">
      <label
        htmlFor={name}
        className="text-label block uppercase text-paper/55 transition-colors duration-300 group-has-[:focus]/field:text-blue"
      >
        {label}
        {required && <span className="ml-1 text-blue">*</span>}
      </label>
      <div className="mt-3">
        {multiline ? (
          <textarea id={name} name={name} rows={3} required={required} placeholder={placeholder} className={shared} />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            autoComplete={autoComplete}
            placeholder={placeholder}
            className={shared}
          />
        )}
        {/* The rule under the field, drawn in from the left on focus. */}
        <span aria-hidden className="relative block h-px w-full bg-paper/20">
          <span className="absolute inset-0 origin-left scale-x-0 bg-blue transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-has-[:focus]/field:scale-x-100" />
        </span>
      </div>
    </div>
  );
}
