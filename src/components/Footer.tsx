import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-ooredoo-ink text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-2xl font-extrabold lowercase italic tracking-tight text-white">
            ooredoo<span className="not-italic text-ooredoo-red">•</span>
          </span>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Born for 5G. The network that connects Algerians to what matters:
            mobile Internet, plans, and digital services.
          </p>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Offers
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#offres" className="hover:text-white">
                Internet plans
              </Link>
            </li>
            <li>
              <Link href="/#offres" className="hover:text-white">
                5G offers
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                eStorm
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                Noudjoum
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Help
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/feedback" className="hover:text-white">
                Feedback &amp; Complaints
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Customer account
              </Link>
            </li>
            <li>
              <Link href="/forgot-password" className="hover:text-white">
                Forgot password
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Call Center: 12 12</li>
            <li>support@ooredoo-clone.dz</li>
            <li>Algiers, Algeria</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Demo clone inspired by Ooredoo Algeria —
        Educational project, no affiliation.
      </div>
    </footer>
  );
}
