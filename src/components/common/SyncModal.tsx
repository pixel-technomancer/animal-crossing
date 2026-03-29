import { useState } from 'react';
import { X, Upload, Download, Check, Copy } from 'lucide-react';
import { exportAllData, importAllData } from '../../utils/storage';

interface SyncModalProps {
  onClose: () => void;
  onImported: () => void;
}

export function SyncModal({ onClose, onImported }: SyncModalProps) {
  const [mode, setMode] = useState<'choose' | 'export' | 'import'>('choose');
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleExport = () => {
    setCode(exportAllData());
    setMode('export');
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImport = () => {
    setError('');
    const result = importAllData(code);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onImported();
        onClose();
      }, 1000);
    } else {
      setError('Invalid sync code. Make sure you copied the full code.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md p-6 relative mx-auto my-[env(safe-area-inset-top,16px)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-sand/30 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-brown-light" />
        </button>

        <h2 className="text-lg font-extrabold text-brown-dark font-heading mb-1">Sync Data</h2>
        <p className="text-xs text-brown-light mb-5">Transfer your collection between devices</p>

        {mode === 'choose' && (
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-leaf/10 hover:bg-leaf/20 transition-colors text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-leaf/20 flex items-center justify-center">
                <Upload className="w-5 h-5 text-leaf-dark" />
              </div>
              <div>
                <p className="font-bold text-brown-dark text-sm">Export from this device</p>
                <p className="text-xs text-brown-light">Get a code to paste on your other device</p>
              </div>
            </button>
            <button
              onClick={() => setMode('import')}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-sky/10 hover:bg-sky/20 transition-colors text-left cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-sky/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-sky-dark" />
              </div>
              <div>
                <p className="font-bold text-brown-dark text-sm">Import to this device</p>
                <p className="text-xs text-brown-light">Paste a code from your other device</p>
              </div>
            </button>
          </div>
        )}

        {mode === 'export' && (
          <div className="space-y-3">
            <textarea
              readOnly
              value={code}
              className="w-full h-32 px-3 py-2 rounded-xl bg-sand/20 border border-sand-dark/20 text-xs font-mono text-brown-dark resize-none focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-leaf text-white font-bold text-sm hover:bg-leaf-dark transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
            <p className="text-xs text-brown-light text-center">
              Paste this code on your other device using Import
            </p>
          </div>
        )}

        {mode === 'import' && (
          <div className="space-y-3">
            {success ? (
              <div className="flex flex-col items-center gap-2 py-6">
                <div className="w-12 h-12 rounded-full bg-leaf/20 flex items-center justify-center">
                  <Check className="w-6 h-6 text-leaf-dark" />
                </div>
                <p className="font-bold text-leaf-dark">Data imported!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={code}
                  onChange={(e) => { setCode(e.target.value); setError(''); }}
                  placeholder="Paste your sync code here..."
                  className="w-full h-32 px-3 py-2 rounded-xl bg-sand/20 border border-sand-dark/20 text-xs font-mono text-brown-dark resize-none focus:outline-none focus:ring-2 focus:ring-sky/30"
                />
                {error && <p className="text-xs text-coral-dark font-semibold">{error}</p>}
                <button
                  onClick={handleImport}
                  disabled={!code.trim()}
                  className="w-full px-4 py-3 rounded-xl bg-sky text-white font-bold text-sm hover:bg-sky-dark transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Import Data
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
