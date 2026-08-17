import React, { useState } from 'react';
import { Member } from '../../types/member';
import { Search, Filter, ChevronRight } from 'lucide-react';

interface SearchSectionProps {
  members: Member[];
  onSelectMember: (member: Member) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ members, onSelectMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('Tous');

  const departments = ['Tous', ...Array.from(new Set(members.map(m => m.department)))];

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = selectedDept === 'Tous' || member.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  return (
    <section className="py-16 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar */}
        <div className="glass-panel p-8 rounded-3xl border-sky-500/30 mb-8 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Recherche de Consultant RE2M
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Trouvez un expert par nom, fonction, département ou mot-clé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 max-w-3xl mx-auto">
            {/* Search Input */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-sky-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, titre ou email..."
                className="w-full bg-slate-900/90 text-white placeholder-slate-500 rounded-2xl pl-12 pr-4 py-3.5 border border-sky-500/30 focus:outline-none focus:border-sky-400 text-sm"
              />
            </div>

            {/* Department Filter */}
            <div className="md:col-span-4 relative">
              <Filter className="w-4 h-4 text-sky-300 absolute left-4 top-1/2 -translate-y-1/2" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-900/90 text-white rounded-2xl pl-10 pr-4 py-3.5 border border-sky-500/30 focus:outline-none focus:border-sky-400 text-sm cursor-pointer"
              >
                {departments.map((dept, idx) => (
                  <option key={idx} value={dept} className="bg-slate-900">
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="space-y-4">
          <p className="text-xs text-slate-400 font-semibold px-2">
            {filteredMembers.length} résultat(s) trouvé(s)
          </p>

          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
              Aucun consultant ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 p-4 rounded-2xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-950 border border-sky-500/30 flex items-center justify-center font-serif text-base font-bold text-sky-200 shrink-0">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-sm font-bold text-white">
                          {member.civility} {member.firstName} {member.lastName}
                        </h4>
                        <span className="text-[9px] bg-sky-500/10 text-sky-200 px-2 py-0.5 rounded-full border border-sky-500/20 font-semibold">
                          {member.department}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">{member.title}</p>
                      <p className="text-[11px] text-slate-400">{member.mobile} • {member.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectMember(member)}
                    className="bg-blue-950 hover:bg-blue-900 text-sky-200 text-xs font-semibold px-3 py-2 rounded-xl border border-sky-500/30 transition-colors flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>Profil</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
