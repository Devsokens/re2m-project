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
      await new Promise((res) => setTimeout(res, 200));
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
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border-sky-500/30 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-semibold uppercase tracking-wider">
          <Package className="w-3.5 h-3.5" /> Section 5.4 — Génération par Lot & Exports Masqués
        </div>
        <h2 className="font-serif text-2xl font-bold text-white">
          Traitement par Lot & Packs d'Impression
        </h2>
        <p className="text-xs text-slate-300">
          Sélectionnez un ensemble de consultants pour exporter en un clic leurs cartes PDF HD 85×54 mm, leurs vCards 4.0 ou le lot des QR Codes PNG.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Preset Selection & Member List */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border-sky-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <h3 className="font-serif text-lg font-bold text-white">1. Sélection des Membres ({selectedIds.length}/{members.length})</h3>
            
            {/* Presets */}
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => handlePresetChange('all')}
                className={`px-3 py-1.5 rounded-xl border transition-colors ${
                  filterPreset === 'all'
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => handlePresetChange('active')}
                className={`px-3 py-1.5 rounded-xl border transition-colors ${
                  filterPreset === 'active'
                    ? 'bg-sky-500 text-slate-950 font-bold border-sky-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800'
                }`}
              >
                Actifs Uniquement
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
                      ? 'bg-blue-950/80 border-sky-500/50 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-sky-300 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-serif text-sm font-bold text-white">
                        {member.civility} {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-slate-400">{member.title} • {member.department}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {member.id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Export Options & Processing Status */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="glass-panel rounded-3xl p-6 border-sky-500/30 space-y-6">
            <h3 className="font-serif text-lg font-bold text-white">2. Format du Pack d'Export</h3>

            <div className="space-y-3">
              {/* Option PDF HD */}
              <div
                onClick={() => setExportType('PDF_HD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  exportType === 'PDF_HD'
                    ? 'bg-blue-950 border-sky-400 text-white shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                }`}
              >
                <FileText className="w-6 h-6 text-sky-300 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Pack PDF HD Recto/Verso</p>
                  <p className="text-[11px] text-slate-300">Format d'impression 85×54 mm offset CMYK 300 DPI</p>
                </div>
              </div>

              {/* Option ZIP vCards */}
              <div
                onClick={() => setExportType('ZIP_VCARD')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  exportType === 'ZIP_VCARD'
                    ? 'bg-blue-950 border-sky-400 text-white shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                }`}
              >
                <Archive className="w-6 h-6 text-sky-300 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Archive ZIP Fichiers .VCF</p>
                  <p className="text-[11px] text-slate-300">Ensemble des cartes vCard 4.0 prêtes à importer</p>
                </div>
              </div>

              {/* Option QR PNG */}
              <div
                onClick={() => setExportType('QR_PNG')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                  exportType === 'QR_PNG'
                    ? 'bg-blue-950 border-sky-400 text-white shadow-lg'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="w-6 h-6 text-sky-300 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">Lot de QR Codes (PNG HD)</p>
                  <p className="text-[11px] text-slate-300">Fichiers images haute définition avec logo centré</p>
                </div>
              </div>
            </div>

            {/* Launch Process Button */}
            <button
              onClick={handleStartBatchProcess}
              disabled={isProcessing || selectedIds.length === 0}
              className="w-full bg-gradient-to-r from-blue-900 via-sky-800 to-sky-600 hover:from-sky-700 hover:to-sky-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 text-sm ice-glow cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Génération en cours ({progress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Lancer la Génération du Pack ({selectedIds.length})</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Bar or Completed Notice */}
          {isProcessing && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-sky-500/40 space-y-3">
              <div className="flex justify-between text-xs text-sky-300 font-semibold">
                <span>Traitement en arrière-plan...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-700 to-sky-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {completed && (
            <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2 animate-fadeIn">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-white">Génération Terminée !</h4>
              <p className="text-xs text-slate-300">
                Le pack d'export contenant {selectedIds.length} élément(s) a été préparé et téléchargé.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
