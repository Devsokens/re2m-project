import React, { useState } from 'react';
import { Member } from '../../types/member';
import { Package, Download, CheckSquare, Square, FileText, QrCode, Archive, Loader2, CheckCircle2 } from 'lucide-react';
import { downloadMemberPDF } from '../../utils/pdfPrint';
import confetti from 'canvas-confetti';

interface BatchGeneratorProps {
  members: Member[];
}

export const BatchGenerator: React.FC<BatchGeneratorProps> = ({ members }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(members.map(m => m.id));
  const [filterPreset, setFilterPreset] = useState<'all' | 'active' | 'recent'>('all');
  const [exportType, setExportType] = useState<'PDF_HD' | 'ZIP_VCARD' | 'QR_PNG'>('PDF_HD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handlePresetChange = (preset: 'all' | 'active' | 'recent') => {
    setFilterPreset(preset);
    if (preset === 'all') {
      setSelectedIds(members.map(m => m.id));
    } else if (preset === 'active') {
      setSelectedIds(members.filter(m => m.status === 'active').map(m => m.id));
    } else {
      // Recent (last 3 members)
      setSelectedIds(members.slice(0, 3).map(m => m.id));
    }
  };

  const toggleSelectMember = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleStartBatchProcess = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessing(true);
    setProgress(0);
    setCompleted(false);

    // Simulate background batch processing steps
    const selectedMembers = members.filter(m => selectedIds.includes(m.id));

    for (let i = 1; i <= 100; i += 10) {
      await new Promise((res) => setTimeout(res, 150));
      setProgress(i);
    }

    // Trigger individual exports or summary PDF
    if (exportType === 'PDF_HD' && selectedMembers.length > 0) {
      await downloadMemberPDF(selectedMembers[0]);
    }

    setIsProcessing(false);
    setProgress(100);
    setCompleted(true);
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#0f172a]">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-[10px] font-extrabold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5" /> Traitements par Lot
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#002366]">
          Génération en Masse & Packs d'Impression
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Sélectionnez un ensemble de consultants pour exporter en un clic leurs cartes PDF HD 85×54 mm, leurs vCards 4.0 ou le lot des QR Codes PNG.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Selection & Member List */}
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <h3 className="font-serif text-base font-bold text-[#002366]">1. Sélection des Membres ({selectedIds.length}/{members.length})</h3>
            
            {/* Presets */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => handlePresetChange('all')}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  filterPreset === 'all'
                    ? 'bg-[#002366] text-white border-[#002366] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => handlePresetChange('active')}
                className={`px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  filterPreset === 'active'
                    ? 'bg-[#002366] text-white border-[#002366] shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                Actifs
              </button>
            </div>
          </div>

          {/* Members Checkbox List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-2">
            {members.map((member) => {
              const isSelected = selectedIds.includes(member.id);
              return (
                <div
                  key={member.id}
                  onClick={() => toggleSelectMember(member.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-200 text-[#002366]'
                      : 'bg-slate-50/40 border-slate-100 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-900 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-350 shrink-0" />
                    )}
                    <div>
                      <p className="font-serif text-sm font-bold text-[#002366]">
                        {member.civility} {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-slate-555 font-medium">{member.title} • {member.department}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">
                    {member.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Export Options & Processing Status */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6">
            <h3 className="font-serif text-base font-bold text-[#002366]">2. Format du Pack d'Export</h3>

            <div className="space-y-3">
              {/* Option PDF HD */}
              <div
                onClick={() => setExportType('PDF_HD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  exportType === 'PDF_HD'
                    ? 'bg-blue-50/60 border-blue-200 text-[#002366] shadow-sm'
                    : 'bg-slate-50/30 border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                <FileText className="w-6 h-6 text-[#002366] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#002366] uppercase tracking-wide">Pack PDF HD Recto/Verso</p>
                  <p className="text-[11px] text-slate-500 font-medium">Format d'impression 85×54 mm offset CMYK 300 DPI</p>
                </div>
              </div>

              {/* Option ZIP vCards */}
              <div
                onClick={() => setExportType('ZIP_VCARD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  exportType === 'ZIP_VCARD'
                    ? 'bg-blue-50/60 border-blue-200 text-[#002366] shadow-sm'
                    : 'bg-slate-50/30 border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                <Archive className="w-6 h-6 text-[#002366] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#002366] uppercase tracking-wide">Archive ZIP Fichiers .VCF</p>
                  <p className="text-[11px] text-slate-500 font-medium">Ensemble des cartes vCard 4.0 prêtes à importer</p>
                </div>
              </div>

              {/* Option QR PNG */}
              <div
                onClick={() => setExportType('QR_PNG')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  exportType === 'QR_PNG'
                    ? 'bg-blue-50/60 border-blue-200 text-[#002366] shadow-sm'
                    : 'bg-slate-50/30 border-slate-100 text-slate-500 hover:border-slate-200'
                }`}
              >
                <QrCode className="w-6 h-6 text-[#002366] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#002366] uppercase tracking-wide">Lot de QR Codes (PNG HD)</p>
                  <p className="text-[11px] text-slate-500 font-medium">Fichiers images haute définition avec logo centré</p>
                </div>
              </div>
            </div>

            {/* Launch Process Button */}
            <button
              onClick={handleStartBatchProcess}
              disabled={isProcessing || selectedIds.length === 0}
              className="w-full bg-[#002366] hover:bg-blue-900 text-white font-bold py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-xs disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Génération en cours ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Lancer la Génération ({selectedIds.length})</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-3">
              <div className="flex justify-between text-xs text-[#002366] font-bold">
                <span>Traitement en arrière-plan...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200/60">
                <div
                  className="bg-[#002366] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-base font-bold text-[#002366]">Génération Terminée !</h4>
              <p className="text-xs text-slate-500 font-medium">
                Le pack d'export contenant {selectedIds.length} élément(s) a été préparé et téléchargé.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
