import React from 'react';
import { User, Mail, Phone, ShieldCheck, LogOut, ExternalLink, Sparkles } from 'lucide-react';

interface UserProfileProps {
  user: any;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const firstName = user.fullName?.firstName || user.email?.split('@')[0] || 'Tunease User';
  const lastName = user.fullName?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();

  const landingUrl = 'http://localhost:5173';

  return (
    <div className="w-full text-center">
      {/* User Avatar */}
      <div className="relative inline-block mb-4">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-[#FF5A00] shadow-xl shadow-[#FF5A00]/20 mx-auto"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#FF5A00] via-[#FF7A00] to-[#FF9A00] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#FF5A00]/20 mx-auto border-2 border-white/20">
            {firstName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-[#0C0C0E] flex items-center justify-center text-white text-[10px]">
          ✓
        </div>
      </div>

      <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
        {fullName}
      </h2>
      <p className="text-neutral-400 text-xs mb-6 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A00]" />
        <span>Verified Tunease Account</span>
      </p>

      {/* Profile Details List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 mb-6 text-left text-xs">
        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-neutral-400 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-neutral-500" />
            Email
          </span>
          <span className="text-white font-medium">{user.email || 'N/A'}</span>
        </div>

        {user.mobileNo && (
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-neutral-400 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-neutral-500" />
              Mobile
            </span>
            <span className="text-white font-medium">{user.mobileNo}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-1 border-b border-white/5">
          <span className="text-neutral-400 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-neutral-500" />
            Role
          </span>
          <span className="capitalize px-2 py-0.5 rounded-full bg-[#FF5A00]/20 text-[#FF5A00] font-bold text-[10px]">
            {user.role || 'User'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-neutral-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-neutral-500" />
            Auth Method
          </span>
          <span className="text-neutral-300 font-medium capitalize">
            {user.authProvider || (user.googleId ? 'Google OAuth' : 'Email/Password')}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <a
          href={landingUrl}
          className="w-full bg-gradient-to-r from-[#FF5A00] to-[#FF8A00] text-white font-bold py-3 rounded-2xl shadow-lg shadow-[#FF5A00]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <span>Return to Landing Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onLogout}
          className="w-full bg-white/5 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 border border-white/10 font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
