import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Gamepad2,
  Music4,
  Rocket,
  ShieldCheck,
  Smartphone,
  Wifi,
  Zap,
} from "lucide-react";

const offers = [
  {
    name: "Maxi 1000",
    data: "1000 GB",
    price: "1500 DA",
    tag: "Best-seller",
    perks: ["5G included", "Unlimited calls", "30-day validity"],
  },
  {
    name: "Maxi 500",
    data: "500 GB",
    price: "1000 DA",
    tag: null,
    perks: ["4G+", "Unlimited calls", "30-day validity"],
  },
  {
    name: "Maxi 200",
    data: "200 GB",
    price: "500 DA",
    tag: null,
    perks: ["4G", "SMS included", "30-day validity"],
  },
];

const services = [
  {
    icon: Rocket,
    title: "Noudjoum",
    desc: "The loyalty program that lets you earn rewards.",
  },
  {
    icon: Smartphone,
    title: "My Ooredoo",
    desc: "Manage your line, track your usage, and recharge with one click.",
  },
  {
    icon: Zap,
    title: "eStorm",
    desc: "Fast and secure electronic recharges, 24/7.",
  },
  {
    icon: Wifi,
    title: "5G+",
    desc: "The next-generation network, built for 5G.",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    desc: "Protection of your data and remote SIM blocking.",
  },
  {
    icon: BadgeCheck,
    title: "AI Assistance",
    desc: "Your feedback is analyzed and a response is automatically sent to you.",
  },
];

export default function HomePage() {
  return (
    <div id="particuliers">
      {/* ================= HERO — billboard style ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-200 via-rose-100 to-amber-100">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,20,43,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,43,.06) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          {/* Billboard */}
          <div className="relative">
            <div className="absolute -inset-3 rotate-[-1.5deg] rounded-3xl bg-white/60 blur-sm" />
            <div className="relative rotate-[-1.5deg] rounded-2xl border-8 border-ooredoo-ink bg-gradient-to-br from-ooredoo-red to-ooredoo-darkred p-8 text-white shadow-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-white/80">
                Ooredoo Internet
              </p>
              <p className="mt-1 text-3xl font-extrabold uppercase leading-tight sm:text-4xl">
                Up to
              </p>
              <p className="text-6xl font-black tracking-tight drop-shadow-lg sm:text-7xl">
                1000<span className="text-yellow-300"> GB</span>
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ooredoo-red">
                  <Zap className="h-4 w-4" /> Starting from 1500 DA
                </span>
                <Link
                  href="/#offers"
                  className="btn-primary !bg-white !text-ooredoo-red hover:!bg-yellow-300 hover:!text-ooredoo-ink"
                >
                  More info <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-6 flex gap-3 text-white/90">
                <Gamepad2 className="h-6 w-6" />
                <Music4 className="h-6 w-6" />
                <Wifi className="h-6 w-6" />
                <Smartphone className="h-6 w-6" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center lg:text-left">
            <span className="text-5xl font-black leading-none tracking-tight text-ooredoo-ink sm:text-7xl">
              The strongest
              <br />
              <span className="text-ooredoo-red">MAX</span> INTERNET
            </span>
            <p className="mx-auto mt-6 max-w-md text-lg text-slate-600 lg:mx-0">
              Stream, play, share. With up to 1000 GB and 5G, experience
              unlimited mobile Internet, everywhere in Algeria.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/signup" className="btn-primary !px-8 !py-3">
                Create an account
              </Link>
              <Link href="/feedback" className="btn-outline !px-8 !py-3">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= OFFERS ================= */}
      <section id="offers" className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-ooredoo-red">
            Our offers
          </span>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            A plan for every need
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((o) => (
            <div
              key={o.name}
              className={`card relative flex flex-col transition hover:-translate-y-1 ${
                o.tag ? "ring-2 ring-ooredoo-red" : ""
              }`}
            >
              {o.tag && (
                <span className="absolute -top-3 left-6 rounded-full bg-ooredoo-red px-3 py-1 text-xs font-bold uppercase text-white">
                  {o.tag}
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-500">{o.name}</h3>
              <p className="mt-2 text-5xl font-black text-ooredoo-ink">
                {o.data}
              </p>
              <p className="mt-1 text-sm text-slate-500">of mobile data</p>
              <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-600">
                {o.perks.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-ooredoo-red" /> {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-extrabold text-ooredoo-red">
                  {o.price}
                </span>
                <Link href="/signup" className="btn-primary !px-5 !py-2">
                  Choose
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SERVICES ================= */}
      <section id="services" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-ooredoo-red">
              All about Ooredoo
            </span>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Services designed for you
            </h2>
          </div>
          <div
            id="entreprises"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-slate-100 p-6 transition hover:border-red-200 hover:shadow-card"
              >
                <div className="mb-4 inline-flex rounded-xl bg-red-50 p-3 text-ooredoo-red transition group-hover:bg-ooredoo-red group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ooredoo-red to-ooredoo-darkred px-8 py-14 text-center text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-56 w-56 rounded-full bg-white/10" />
          <h2 className="relative text-3xl font-extrabold sm:text-4xl">
            Have a question? A complaint?
          </h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/85">
            Write to us: our artificial intelligence analyzes your message and
            responds directly by email.
          </p>
          <Link
            href="/feedback"
            className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-ooredoo-red transition hover:bg-yellow-300 hover:text-ooredoo-ink"
          >
            Send feedback <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
