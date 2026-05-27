"use client";

import { useState } from "react";

export function ShareButtons({
  url,
  text,
}: {
  url: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const enc = encodeURIComponent;
  const shareUrl = enc(url);
  const shareText = enc(text);

  const links = {
    whatsapp: `https://api.whatsapp.com/send?text=${shareText}%20${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
  };

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: text, text, url });
      } catch {
        /* el usuario canceló — ignorar */
      }
    } else {
      void copyLink();
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sin permisos del clipboard */
    }
  }

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-brand-sage-dark mb-3">
        Comparte e invita a otros a hacer el test
      </p>
      <div className="flex flex-wrap gap-2">
        <ShareLink href={links.whatsapp} label="WhatsApp" />
        <ShareLink href={links.twitter} label="X / Twitter" />
        <ShareLink href={links.facebook} label="Facebook" />
        <ShareLink href={links.linkedin} label="LinkedIn" />
        <button
          type="button"
          onClick={nativeShare}
          className="px-3 py-2 rounded-full border border-brand-sage text-brand-sage-dark text-sm hover:bg-brand-sage hover:text-white transition-colors"
        >
          Más opciones
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="px-3 py-2 rounded-full border border-black/10 text-brand-ink text-sm hover:bg-black/5 transition-colors"
        >
          {copied ? "¡Copiado!" : "Copiar enlace"}
        </button>
      </div>
    </div>
  );
}

function ShareLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="px-3 py-2 rounded-full bg-brand-sage text-white text-sm hover:bg-brand-sage-dark transition-colors"
    >
      {label}
    </a>
  );
}
