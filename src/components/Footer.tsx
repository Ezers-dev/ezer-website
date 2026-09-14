import Link from "next/link";
import { Logo } from "@/components/Logo";
import { nav, site } from "@/data/site";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1560px] px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-12 border-b border-paper/15 pb-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo color="blue" accent="yellow" className="h-12 w-auto" />
            <p className="mt-6 max-w-[34ch] text-[0.95rem] leading-relaxed text-paper/70">
              A creative agency helping ambitious brands look, sound, and move
              like the market leaders they&rsquo;re becoming.
            </p>
          </div>

          <div className="md:col-span-3">
            <h2 className="text-label uppercase text-paper/45">Navigate</h2>
            <ul className="mt-5 space-y-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.95rem] font-medium text-paper/85 transition-colors hover:text-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h2 className="text-label uppercase text-paper/45">Get in touch</h2>
            <ul className="mt-5 space-y-2.5">
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="text-[0.95rem] font-medium text-paper/85 transition-colors hover:text-blue"
                  >
                    {phone.number}
                    <span className="ml-2 text-paper/40">{phone.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] font-medium text-paper/85 transition-colors hover:text-blue"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-[0.78rem] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Canada &amp; Nigeria &middot; Since {site.founded}</p>
        </div>
      </div>
    </footer>
  );
}
