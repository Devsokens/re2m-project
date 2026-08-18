import React, { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, List, Link as LinkIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const TOOLBAR_ACTIONS: { icon: React.ElementType; command: string; label: string }[] = [
  { icon: Bold, command: 'bold', label: 'Gras' },
  { icon: Italic, command: 'italic', label: 'Italique' },
  { icon: Underline, command: 'underline', label: 'Souligné' },
  { icon: List, command: 'insertUnorderedList', label: 'Liste à puces' }
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  // Tracks whether the last DOM change came from the user typing in this
  // editor, so the sync effect below doesn't reset innerHTML (and the
  // caret) back to the start on every keystroke — that was making text
  // appear to type in reverse.
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    isInternalChange.current = true;
    onChange(e.currentTarget.innerHTML);
  };

  const exec = (command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = window.prompt('Adresse du lien (https://...)');
    if (!url) return;
    editorRef.current?.focus();
    document.execCommand('createLink', false, url);
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-200 bg-slate-50">
        {TOOLBAR_ACTIONS.map(({ icon: Icon, command, label }) => (
          <button
            key={command}
            type="button"
            onClick={() => exec(command)}
            title={label}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-[#002366] hover:shadow-sm cursor-pointer transition-all"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <button
          type="button"
          onClick={handleLink}
          title="Insérer un lien"
          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white hover:text-[#002366] hover:shadow-sm cursor-pointer transition-all"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        className="min-h-[180px] max-h-[320px] overflow-y-auto px-3 py-3 text-xs text-[#0f172a] leading-relaxed focus:outline-none rich-text-editor"
      />
    </div>
  );
};

export default RichTextEditor;
