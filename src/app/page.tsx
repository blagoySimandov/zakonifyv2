import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShieldCheck,
  CalendarCheck,
  BadgeCheck,
  MapPin,
  Scale,
  Star,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-blue-600" aria-hidden />
              <span className="text-xl font-semibold tracking-tight text-slate-800">
                Zakonify
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <Link
                href="/attorneys"
                className="text-slate-600 hover:text-slate-900">
                Find Attorneys
              </Link>
              <Link
                href="/attorneys"
                className="text-slate-600 hover:text-slate-900">
                Practice Areas
              </Link>
              <Link
                href="/register"
                className="text-slate-600 hover:text-slate-900">
                For Attorneys
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/register"
                className="hidden md:inline-flex rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50">
                Join as Attorney
              </Link>
              <Link
                href="/attorneys"
                className="inline-flex rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                Find an Attorney
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(59,130,246,0.08),transparent_60%)]" />
          <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 md:pt-24 md:pb-16">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                Find the right attorney, faster
              </h1>
              <p className="mt-6 text-lg md:text-xl text-slate-600">
                Search verified legal professionals by expertise and location.
                Compare profiles, ratings, and availability—then book a
                consultation in minutes.
              </p>

              {/* Search Bar */}
              <div className="mt-10 mx-auto max-w-2xl">
                <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[1fr_1fr_auto]">
                  <div className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-slate-200">
                    <Search className="h-5 w-5 text-slate-400" aria-hidden />
                    <input
                      aria-label="Search practice area"
                      placeholder="e.g. Immigration, Family, Corporate"
                      className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 hover:border-slate-200">
                    <MapPin className="h-5 w-5 text-slate-400" aria-hidden />
                    <input
                      aria-label="Location"
                      placeholder="City or Region"
                      className="w-full bg-transparent text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <Link
                    href="/attorneys"
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700">
                    Search
                  </Link>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Verified profiles. No hidden fees. Cancel anytime before your
                  consultation.
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-80">
                <Image src="/next.svg" alt="Next.js" width={80} height={24} />
                <Image src="/vercel.svg" alt="Vercel" width={80} height={24} />
                <Image src="/globe.svg" alt="Global" width={24} height={24} />
                <Image src="/window.svg" alt="Window" width={24} height={24} />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-6 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:grid-cols-4">
            <div>
              <div className="text-3xl font-bold text-slate-900">500+</div>
              <div className="mt-1 text-sm text-slate-500">
                Verified Attorneys
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">1k+</div>
              <div className="mt-1 text-sm text-slate-500">
                Consultations Booked
              </div>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-slate-900">
                4.9
                <Star
                  className="h-6 w-6 fill-yellow-400 text-yellow-400"
                  aria-hidden
                />
              </div>
              <div className="mt-1 text-sm text-slate-500">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900">24h</div>
              <div className="mt-1 text-sm text-slate-500">
                Median Response Time
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-6 pb-8 md:pb-16">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3">
                <Search className="h-5 w-5 text-blue-600" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Powerful search and filters
              </h3>
              <p className="mt-2 text-slate-600">
                Narrow by practice area, language, price, and location to find
                the best match for your case.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3">
                <ShieldCheck className="h-5 w-5 text-blue-600" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Verified professionals
              </h3>
              <p className="mt-2 text-slate-600">
                We vet credentials and bar memberships so you can book with
                confidence.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3">
                <CalendarCheck className="h-5 w-5 text-blue-600" aria-hidden />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Easy online booking
              </h3>
              <p className="mt-2 text-slate-600">
                Check availability and confirm a time that works. Reminders
                included.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="mx-auto max-w-7xl px-6 pb-12 md:pb-20">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-blue-700">
                  <BadgeCheck className="h-5 w-5" aria-hidden />
                  <span className="text-sm font-semibold">Client story</span>
                </div>
                <blockquote className="mt-3 text-xl font-medium text-slate-900">
                  “I found a specialized attorney within minutes and booked a
                  same‑week consultation. Clear pricing, verified profile, and
                  great experience.”
                </blockquote>
                <p className="mt-2 text-sm text-slate-500">
                  — Maria P., Startup Founder
                </p>
              </div>
              <div className="shrink-0">
                <Link
                  href="/attorneys"
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-700">
                  Start your search
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mx-auto max-w-7xl px-6 pb-20">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 md:p-10">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-semibold text-white">
                    Are you an attorney? Join Zakonify today
                  </h2>
                  <p className="mt-2 max-w-2xl text-blue-100">
                    Reach new clients, showcase your expertise, and manage
                    consultations in one place.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 font-semibold text-blue-700 shadow-sm hover:bg-blue-50">
                  Create your profile
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-2 text-slate-700">
              <Scale className="h-5 w-5 text-blue-600" aria-hidden />
              <span className="font-semibold">Zakonify</span>
              <span className="text-slate-400">•</span>
              <span className="text-sm text-slate-500">
                Legal made accessible
              </span>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/attorneys"
                className="text-slate-600 hover:text-slate-900">
                Browse
              </Link>
              <Link
                href="/register"
                className="text-slate-600 hover:text-slate-900">
                Become a Partner
              </Link>
              <a
                href="mailto:hello@zakonify.com"
                className="text-slate-600 hover:text-slate-900">
                Contact
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900">
                Terms
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900">
                Privacy
              </a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
