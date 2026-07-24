import { useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaEnvelope,
} from "react-icons/fa";

const LINKS = {
  linkedin: "https://www.linkedin.com/in/vetrikarthikeyan/",
  libRepo: "https://github.com/Vetri-Karthikeyan/Layera",
  demoRepo: "https://github.com/Vetri-Karthikeyan/Layera-EMS-Demo",
  email: "vetrikarthi3@gmail.com",
  docs: "https://github.com/Vetri-Karthikeyan/Layera/tree/main/docs",
};

const INSTALL_CMD = "npm install layera";

function CopyIcon({ copied }) {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function Footer() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can fail (permissions, non-secure context) — the
      // command is still selectable/visible, so this fails quietly.
    }
  }

  return (
    <footer className="app-footer">
      <div className="footer-split">
        <div className="footer-brand">
          <div className="footer-mark wordmark" aria-hidden="true">
            <span className="layer layer--1" />
            <span className="layer layer--2" />
            <span className="layer layer--3" />
          </div>

          <p className="footer-blurb">
            <strong>Layera</strong> is my own idea, designed and built end
            to end by me — <strong>Vetri Karthikeyan</strong>.
          </p>
          <p className="footer-blurb">This app is a dogfooding test bed for it.</p>

          <button
            type="button"
            className="footer-install"
            onClick={handleCopy}
            aria-label="Copy install command"
          >
            <span className="footer-install__label">Try it in your own project :</span>
            <code>{INSTALL_CMD}</code>
            <span className="footer-install__icon">
              <CopyIcon copied={copied} />
            </span>
          </button>
        </div>

        <div className="footer-links">
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            LinkedIn   
            <FaLinkedin />
            
          </a>
          <a href={LINKS.libRepo} target="_blank" rel="noreferrer">
            Layera (lib source)
             <FaGithub />
          </a>
          <a href={LINKS.demoRepo} target="_blank" rel="noreferrer">
            This demo's source
              <FaGithub />
          </a>
          <a href={`mailto:${LINKS.email}`}>{LINKS.email}
             <FaEnvelope/>
          </a>
           <a href={LINKS.docs} target="_blank" rel="noreferrer" className="footer-docs-link">
            Read the full docs →
          </a>
          <p className="footer-note">Questions or suggestions? Reach out anytime.</p>
        </div>
      </div>

    </footer>
  );
}
