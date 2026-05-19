'use client';

import { useState } from 'react';
import { Monitor, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Device {
  id: string;
  hostname: string | null;
  os: string | null;
  appVersion: string | null;
  status: 'active' | 'revoked';
  activatedAt: string;
  lastSeenAt: string;
}

interface License {
  id: string;
  key: string;
  maxDevices: number;
  devices: Device[];
}

interface Props {
  licenses: unknown[];
  token: string;
}

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'https://api.ariainterview.com';

export function DeviceList({ licenses: initialLicenses, token }: Props) {
  const [licenses, setLicenses] = useState<License[]>(initialLicenses as License[]);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function revokeDevice(deviceId: string) {
    if (!confirm('Revoke this device? It will need to be re-activated.')) return;
    setRevoking(deviceId);

    try {
      await fetch(`${API_URL}/v1/account/devices/${deviceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setLicenses((prev) =>
        prev.map((lic) => ({
          ...lic,
          devices: lic.devices.map((d) =>
            d.id === deviceId ? { ...d, status: 'revoked' as const } : d,
          ),
        })),
      );
    } catch {
      alert('Failed to revoke device. Please try again.');
    } finally {
      setRevoking(null);
    }
  }

  if (licenses.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Monitor className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-medium">No devices yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Download ARIA and activate your license to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {licenses.map((lic) => (
        <div key={lic.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">{lic.key}</span>
            <span className="text-xs text-muted-foreground">
              {lic.devices.filter((d) => d.status === 'active').length} / {lic.maxDevices} slots used
            </span>
          </div>

          {lic.devices.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">No devices activated</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left px-5 py-3 font-medium">Hostname</th>
                  <th className="text-left px-5 py-3 font-medium">OS</th>
                  <th className="text-left px-5 py-3 font-medium">Version</th>
                  <th className="text-left px-5 py-3 font-medium">Last seen</th>
                  <th className="text-left px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {lic.devices.map((device) => (
                  <tr key={device.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium">{device.hostname ?? '-'}</td>
                    <td className="px-5 py-3 text-muted-foreground">{device.os ?? '-'}</td>
                    <td className="px-5 py-3 text-muted-foreground font-mono">{device.appVersion ?? '-'}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(device.lastSeenAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full',
                        device.status === 'active'
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-muted text-muted-foreground',
                      )}>
                        {device.status === 'active'
                          ? <CheckCircle2 className="h-3 w-3" />
                          : <XCircle className="h-3 w-3" />
                        }
                        {device.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {device.status === 'active' && (
                        <button
                          onClick={() => revokeDevice(device.id)}
                          disabled={revoking === device.id}
                          className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                          title="Revoke device"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
