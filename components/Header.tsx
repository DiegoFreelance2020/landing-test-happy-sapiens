import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="w-full border-b border-black/5 bg-brand-cream/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="Happy Sapiens">
          <Image
            src="/logo.svg"
            alt="Happy Sapiens"
            width={140}
            height={80}
            priority
            className="h-14 sm:h-16 w-auto"
          />
          <span className="sr-only">Happy Sapiens</span>
        </Link>
        <nav className="text-sm text-brand-sage-dark">
          <a
            href="https://happysapiens.co"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            happysapiens.co
          </a>
        </nav>
      </div>
    </header>
  );
}
