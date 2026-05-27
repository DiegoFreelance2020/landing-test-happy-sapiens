export function Footer() {
  return (
    <footer className="w-full border-t border-black/5 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-brand-sage-dark">
        <p>
          By <strong>Happy Sapiens</strong> · One Blend. One Ritual.
        </p>
        <p className="mt-1 text-xs text-black/50">
          © {new Date().getFullYear()} Happy Sapiens.
        </p>
      </div>
    </footer>
  );
}
