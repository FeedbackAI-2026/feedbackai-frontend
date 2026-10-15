import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ooredoo-ink text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-700">
              <BrainCircuit className="h-4 w-4 text-white" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight text-white">
                Feedback<span className="text-red-500">AI</span>
              </span>
              <span className="mt-0.5 whitespace-nowrap text-[9px] font-semibold uppercase tracking-tight text-slate-400">
                Ooredoo Use Case
              </span>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            AI-powered customer feedback intelligence. An independent student
            project developed as part of the ThirdUni AI Program, using Ooredoo
            Algeria as a demonstration use case.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#offres" className="hover:text-white">
                Demo Plans
              </Link>
            </li>
            <li>
              <Link href="/#offres" className="hover:text-white">
                Demo Offers
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                AI Features
              </Link>
            </li>
            <li>
              <Link href="/#services" className="hover:text-white">
                Customer Insights
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            Support
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/feedback" className="hover:text-white">
                Feedback &amp; Complaints
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/forgot-password" className="hover:text-white">
                Reset Password
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
            About This Project
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>ThirdUni AI Program</li>
            <li>Ooredoo Algeria — Use Case</li>
            <li>Independent student project</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 text-center text-xs leading-relaxed text-slate-500">
        © {new Date().getFullYear()} FeedbackAI. Educational project developed
        as part of the ThirdUni AI Program. Not affiliated with, sponsored by,
        or endorsed by Ooredoo Algeria. All trademarks belong to their
        respective owners.
      </div>
    </footer>
  );
}
