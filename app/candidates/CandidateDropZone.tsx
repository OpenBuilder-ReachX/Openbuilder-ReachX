'use client';

import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { extractCandidateData } from '@/lib/parser';

// Set worker from CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export default function CandidateDropZone({ onUpload }: { onUpload: (formData: FormData) => Promise<void> }) {
    const [isDragging, setIsDragging] = useState(false);
    const [status, setStatus] = useState<'idle' | 'analyzing' | 'success' | 'error'>('idle');
    const [parsedName, setParsedName] = useState('');
    const [confidence, setConfidence] = useState(0);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (!file || file.type !== 'application/pdf') {
            alert('Please drop a PDF file.');
            return;
        }

        setStatus('analyzing');

        try {
            // CLIENT SIDE READ
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';
            const maxPages = Math.min(pdf.numPages, 2);

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n';
            }

            // PARSE (Using Pure Library)
            const data = extractCandidateData(fullText);
            setParsedName(`${data.firstName} ${data.lastName}`);
            setConfidence(data.confidence);

            // CREATE FORM DATA
            const fd = new FormData();
            fd.append('first_name', data.firstName);
            fd.append('last_name', data.lastName);
            fd.append('role', data.role || 'General Worker');
            fd.append('cv_file', file);

            // UPLOAD
            await onUpload(fd);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);

        } catch (err) {
            console.error("Parsing Error", err);
            setStatus('error');
        }
    };

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer relative overflow-hidden group
            ${isDragging ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-neutral-200 hover:border-blue-400 hover:bg-neutral-50'}
        `}
        >
            {status === 'idle' && (
                <div className="space-y-2 pointer-events-none">
                    <div className="text-4xl filter drop-shadow-md">📄</div>
                    <div className="font-semibold text-neutral-700">Drag & Drop Resume PDF</div>
                    <p className="text-xs text-neutral-500">AI Auto-Extraction Active {confidence > 0 && `(Confidence: ${confidence}%)`}</p>
                    <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Instant Analysis
                    </div>
                </div>
            )}

            {status === 'analyzing' && (
                <div className="space-y-4 animate-pulse">
                    <div className="text-4xl animate-bounce">🧠</div>
                    <div className="font-semibold text-blue-600">Reading with Edge AI...</div>
                </div>
            )}

            {status === 'success' && (
                <div className="space-y-2">
                    <div className="text-4xl">✅</div>
                    <div className="font-semibold text-green-600">Imported {parsedName}!</div>
                    {confidence < 95 && <div className="text-xs text-yellow-600 font-medium">⚠️ Review Needed (Confidence: {confidence}%)</div>}
                </div>
            )}

            {status === 'error' && (
                <div className="space-y-2">
                    <div className="text-4xl">❌</div>
                    <div className="font-semibold text-red-600">Failed. Try manual upload.</div>
                </div>
            )}

            <input
                type="file"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Upload PDF Resume"
                aria-label="Upload PDF Resume"
                onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        alert("Please Drag & Drop for AI features (Click support coming soon)");
                    }
                }}
            />
        </div>
    );
}
