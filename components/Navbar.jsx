"use client";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useState } from "react";

const icons = {
  home: (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>),
  userCheck: (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>),
  login: (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>),
  logout: (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>),
  adminPanel: (<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>),
};

export default function Navbar({ onOpenLogin }) {
  const { user, isAdmin, setUser, setIsAdmin } = useApp();
  const logout = () => { setUser(null); setIsAdmin(false); };

  return (
    <header className="bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500">Broom Marketplace</Link>
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">{icons.home}<span>Home</span></Link>
          </nav>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-6 text-sm font-medium">
                {isAdmin && (
                  <Link href="/admin" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">{icons.adminPanel}<span>Panel Admin</span></Link>
                )}
                <div className={`flex items-center space-x-4 pl-4 ${isAdmin ? 'border-l border-slate-700' : ''}`}>
                  <div className="flex items-center space-x-2 text-sm text-slate-200 bg-slate-700/50 px-4 py-2 rounded-full">
                    <span className="text-green-400">{icons.userCheck}</span>
                    <span>{user.username}</span>
                  </div>
                  <button onClick={logout} className="flex items-center space-x-2 text-slate-400 hover:text-white">{icons.logout}<span>Logout</span></button>
                </div>
              </div>
            ) : (
              <button onClick={onOpenLogin} className="flex items-center space-x-2 text-sm font-semibold text-white px-5 py-2 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 transition-all transform hover:scale-105">
                {icons.login}<span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
