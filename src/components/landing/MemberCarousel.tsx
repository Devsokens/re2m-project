import React from 'react';
import { Member } from '../../types/member';
import { CreditCard, ChevronRight, Mail, Phone, Sparkles } from 'lucide-react';
import { downloadVCard } from '../../utils/vcard';

interface MemberCarouselProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
}

export const MemberCarousel: React.FC<MemberCarouselProps> = ({ members, onSelectMember }) => {
  return (
    <section id="consultants" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Réseau des Consultants RE2M
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Annuaire des Experts RE2M
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-xl">
              Accédez instantanément au profil digital, téléchargez la vCard 4.0 ou scannez le QR code de chaque membre du cabinet.
            </p>
          </div>

          <div className="text-xs text-sky-300 font-semibold bg-slate-900 px-4 py-2 rounded-xl border border-sky-500/30">
            {members.length} Consultants Actifs
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/80 group transition-all"
            >
              <div className="space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-sky-200 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 uppercase tracking-wider">
                    {member.department}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ID: {member.id}
                  </span>
                </div>

                {/* Avatar Initials + Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-sky-600/30 border border-sky-500/40 flex items-center justify-center font-serif text-xl font-bold text-sky-300 shadow-md group-hover:scale-105 transition-transform">
                    {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                      {member.civility} {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">
                      {member.title}
                    </p>
                  </div>
                </div>

                {/* Bio snippet */}
                {member.bio && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                    « {member.bio} »
                  </p>
                )}

                {/* Contact highlights */}
                <div className="space-y-1.5 pt-2 text-xs text-slate-300 border-t border-slate-800">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                    <span>{member.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => downloadVCard(member)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-200 py-2.5 px-3 rounded-xl border border-slate-700 hover:border-sky-500/40 transition-colors flex items-center justify-center gap-1.5"
                  title="Télécharger vCard 4.0"
                >
                  <CreditCard className="w-3.5 h-3.5 text-sky-300" />
                  .VCF
                </button>

                <button
                  onClick={() => onSelectMember(member)}
                  className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-xs font-semibold text-sky-200 py-2.5 px-3 rounded-xl border border-sky-500/30 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <span>Profil & QR</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
