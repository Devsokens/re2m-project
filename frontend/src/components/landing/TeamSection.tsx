import React from 'react';
import { Member } from '../../types/member';
import { Linkedin } from 'lucide-react';

interface TeamSectionProps {
  members: Member[];
  variant?: 'light' | 'dark';
}

export const TeamSection: React.FC<TeamSectionProps> = ({ members, variant = 'light' }) => {
  const activeMembers = members.filter((m) => m.status === 'active');
  if (activeMembers.length === 0) return null;

  const isDark = variant === 'dark';

  return (
    <section className={`py-16 ${isDark ? 'bg-[#002366]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <h2 className={`font-serif text-3xl font-extrabold leading-tight ${isDark ? 'text-white' : 'text-[#002366]'}`}>
            Notre Équipe
          </h2>
          <p className={`text-sm sm:text-base ${isDark ? 'text-blue-100/80' : 'text-slate-500'}`}>
            Des experts-consultants dédiés à la performance de vos fonctions Achats et Logistique.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth team-scroll">
          {activeMembers.map((member) => (
            <div
              key={member.id}
              className="snap-start shrink-0 w-56 corporate-card rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm group hover:shadow-lg transition-all duration-300"
            >
              <div className="w-full aspect-[4/5] overflow-hidden bg-slate-100 relative">
                <img
                  src={member.photo || '/logo.png'}
                  alt={`${member.firstName} ${member.lastName}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#002366] hover:bg-white transition-colors shadow"
                    title={`LinkedIn de ${member.firstName} ${member.lastName}`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
              </div>
              <div className="p-4 text-center">
                <h4 className="font-serif text-sm font-bold text-[#002366] leading-snug">
                  {member.civility} {member.firstName} {member.lastName}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{member.title}</p>
                <p className="text-[9px] text-blue-800 font-bold uppercase tracking-wider mt-1.5">{member.department}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
