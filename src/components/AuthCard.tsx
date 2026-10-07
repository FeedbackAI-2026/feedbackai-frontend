import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          {children}

          {footer && (
            <div className="mt-6 text-center text-sm text-slate-500">
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
