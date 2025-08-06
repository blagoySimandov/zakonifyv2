import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-500">Zakonify</h1>
            <nav className="flex gap-6">
              <Link
                href="/attorneys"
                className="text-gray-500 hover:text-gray-700"
              >
                Find Attorneys
              </Link>
              <Link
                href="/register"
                className="text-gray-500 hover:text-gray-700"
              >
                Join as Attorney
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-700 mb-6">
            Connect with Qualified Legal Professionals
          </h1>
          <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto">
            Find experienced attorneys for consultations, get legal advice, and
            book appointments with verified legal professionals in your area.
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/attorneys"
              className="bg-blue-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
            >
              Find an Attorney
            </Link>
            <Link
              href="/register"
              className="border border-blue-500 text-blue-500 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Join as Attorney
            </Link>
          </div>
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
            <p className="text-gray-500">
              Find attorneys by practice area, location, experience, and pricing
              to match your specific needs.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m0 0V9a2 2 0 01-2 2H10a2 2 0 01-2-2V7m4 0a4 4 0 00-4 4v3a2 2 0 002 2h4a2 2 0 002-2v-3a4 4 0 00-4-4z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Verified Professionals
            </h3>
            <p className="text-gray-500">
              All attorneys are verified with proper credentials and bar
              association memberships.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Consultations</h3>
            <p className="text-gray-500">
              Book consultations easily and get the legal guidance you need from
              qualified professionals.
            </p>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
