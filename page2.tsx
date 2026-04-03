'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, ScanLine, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

export default function StudentScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Cleanup scanner when component unmounts
        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    const startScanning = () => {
        setStatus('scanning');
        setScanResult(null);
        setMessage('');

        setTimeout(() => {
            if (!document.getElementById('reader')) return;

            const scanner = new Html5QrcodeScanner(
                'reader',
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                    rememberLastUsedCamera: true,
                },
                false
            );

            scannerRef.current = scanner;

            scanner.render(
                async (decodedText) => {
                    // Pause scanning on successful read
                    scanner.pause(true);
                    setScanResult(decodedText);
                    handleScanSuccess(decodedText, scanner);
                },
                (error) => {
                    // Ignore frequent error callbacks from html5-qrcode
                }
            );
        }, 100);
    };

    const stopScanning = async () => {
        if (scannerRef.current) {
            try {
                await scannerRef.current.clear();
                setStatus('idle');
            } catch (err) {
                console.error('Failed to clear scanner', err);
            }
        }
    };

    const handleScanSuccess = async (qrData: string, scanner: Html5QrcodeScanner) => {
        try {
            const res = await fetch('/api/student/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ qrData }),
            });

            const data = await res.json();

            scanner.clear().catch(console.error);

            if (res.ok) {
                setStatus('success');
                setMessage(data.message || 'Attendance marked successfully!');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to mark attendance.');
            }
        } catch (err) {
            scanner.clear().catch(console.error);
            setStatus('error');
            setMessage('Network error. Please try again.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 shadow-inner">
                    <ScanLine className="w-8 h-8 text-indigo-400" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Scan QR Code</h2>
                <p className="text-slate-400 text-lg">Scan the class QR code displayed by your instructor to mark attendance.</p>
            </div>

            <Card className="bg-slate-900/50 border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
                <CardContent className="p-8">

                    {status === 'idle' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                            <div className="w-48 h-48 border-2 border-dashed border-slate-600 rounded-3xl flex items-center justify-center bg-slate-800/50">
                                <QrCode className="w-20 h-20 text-slate-500" />
                            </div>
                            <Button
                                onClick={startScanning}
                                className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 text-lg py-6 rounded-xl"
                            >
                                <ScanLine className="mr-2 h-5 w-5" /> Start Scanner
                            </Button>
                        </div>
                    )}

                    {status === 'scanning' && (
                        <div className="flex flex-col items-center space-y-6">
                            <div id="reader" className="w-full max-w-md overflow-hidden rounded-2xl border-2 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.2)] bg-black"></div>
                            <Button onClick={stopScanning} variant="destructive" className="w-full max-w-xs shadow-lg shadow-red-500/20 rounded-xl">
                                Cancel Scanning
                            </Button>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                                <CheckCircle2 className="w-16 h-16 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                                <p className="text-emerald-400 text-lg font-medium">{message}</p>
                            </div>
                            <Button onClick={() => setStatus('idle')} className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl px-8">
                                Scan Another Class
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
                            <div className="w-32 h-32 bg-rose-500/10 rounded-full flex items-center justify-center border-4 border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.2)]">
                                <AlertCircle className="w-16 h-16 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-2">Scan Failed</h3>
                                <p className="text-rose-400 text-lg font-medium max-w-md">{message}</p>
                            </div>
                            <Button onClick={startScanning} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 rounded-xl px-8">
                                Try Again
                            </Button>
                        </div>
                    )}

                </CardContent>
            </Card>

            {/* CSS to clean up html5-qrcode default styling to fit dark mode better */}
            <style dangerouslySetInnerHTML={{
                __html: `
        #reader { border: none !important; }
        #reader__dashboard_section_csr span { color: #94a3b8 !important; }
        #reader__dashboard_section_csr button { 
          background: #4f46e5 !important; 
          color: white !important; 
          border: none !important; 
          padding: 8px 16px !important; 
          border-radius: 8px !important; 
          cursor: pointer !important;
          margin-top: 10px !important;
        }
        #reader__dashboard_section_swaplink { color: #818cf8 !important; text-decoration: none !important; }
      `}} />
        </div>
    );
}
