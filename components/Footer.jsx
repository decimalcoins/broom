
'use client';

// File: components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-20 p-6 text-center text-slate-400 border-t border-slate-700">
      <div className="flex justify-center items-center space-x-6">
        <Link href="/privacy" className="hover:text-tosca transition-colors">
          Privacy Policy
        </Link>
        <span>|</span>
        <Link href="/terms" className="hover:text-tosca transition-colors">
          Terms of Service
        </Link>
      </div>
      <p className="mt-4 text-sm">&copy; {new Date().getFullYear()} Broom Marketplace. All Rights Reserved.</p>
    </footer>
  );
}
