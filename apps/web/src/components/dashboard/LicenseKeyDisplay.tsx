'use client';

import { useState } from 'react';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';

interface Props {
  licenseKey: string;
}

export function LicenseKeyDisplay({ licenseKey }: Props) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const displayed = visible ? licenseKey : `${licenseKey.slice(0, 12)}${'•'.repeat(20)}`;

  return (
    <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 font-mono text-sm">
      <span className="flex-1 truncate">{displayed}</span>
      <button onClick={() => setVisible((v) => !v)} className="text-muted-foreground hover:text-foreground transition-colors" title={visible ? 'Hide' : 'Show'}>
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
      <button onClick={copy} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}
