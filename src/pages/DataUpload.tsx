import { useRef, useState } from 'react';
import { Upload, Database, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../types/project';
import { computeRiskScore, classifyStatus } from '../lib/analytics';

type ProjectsData = ReturnType<typeof useProjects>;

interface DataUploadProps {
  data: ProjectsData;
}

function parseCSV(text: string): Project[] | null {
  try {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return null;

    const headers = lines[0].split(',').map(h => h.trim());
    const projects: Project[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, j) => { row[h] = values[j] ?? ''; });

      const budget = Number(row.budget);
      const actualCost = Number(row.actualCost);
      const daysLate = Number(row.daysLate);

      const project: Project = {
        id: `csv-${i}`,
        name: row.name || `Project ${i}`,
        location: row.location || 'Unknown',
        manager: row.manager || 'TBD',
        type: (row.type as Project['type']) || 'Commercial',
        startDate: row.startDate || '2024-01-01',
        expectedEndDate: row.expectedEndDate || '2025-01-01',
        budget,
        actualCost,
        completionPercent: Number(row.completionPercent) || 0,
        daysLate,
        status: classifyStatus(daysLate, budget, actualCost),
        riskScore: 0,
        tasks: [],
        costTrend: [],
        subcontractors: [],
        changeOrders: Number(row.changeOrders) || 0,
        safetyIncidents: Number(row.safetyIncidents) || 0,
      };
      project.riskScore = computeRiskScore(project);
      projects.push(project);
    }

    return projects;
  } catch {
    return null;
  }
}

const CSV_TEMPLATE = `name,location,manager,type,startDate,expectedEndDate,budget,actualCost,daysLate,completionPercent,changeOrders,safetyIncidents
Sample Project A,City Center NY,John Doe,Commercial,2024-01-01,2025-06-30,5000000,4800000,0,70,3,0
Sample Project B,West Side LA,Jane Smith,Residential,2024-03-01,2025-09-30,2500000,2750000,8,60,7,1`;

export function DataUpload({ data }: DataUploadProps) {
  const { setProjects, resetData, projects } = data;
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setStatus('error');
      setMessage('Please upload a .csv file');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (!parsed || parsed.length === 0) {
        setStatus('error');
        setMessage('Could not parse CSV. Check the format matches the template.');
        return;
      }
      setProjects(parsed);
      setStatus('success');
      setMessage(`Successfully loaded ${parsed.length} projects from CSV.`);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'constructiq-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data Upload</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Import your own project data via CSV or reload mock data
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${isDragging
            ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/20'
            : 'border-slate-300 dark:border-slate-600 hover:border-sky-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
          }
        `}
      >
        <Upload size={32} className="mx-auto mb-3 text-slate-400 dark:text-slate-500" />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Drop a CSV file here or <span className="text-sky-600 dark:text-sky-400">browse</span>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Only .csv files are supported
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Status */}
      {status !== 'idle' && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border ${
          status === 'success'
            ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400'
            : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/10 text-red-700 dark:text-red-400'
        }`}>
          {status === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={downloadTemplate}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
        >
          <Database size={15} />
          Download CSV Template
        </button>

        <button
          onClick={() => { resetData(); setStatus('success'); setMessage('Mock data reloaded successfully.'); }}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors font-medium"
        >
          <RefreshCw size={15} />
          Reload Mock Data
        </button>
      </div>

      {/* Current data info */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Current Dataset
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white">{projects.length}</span> projects loaded
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Names: {projects.map(p => p.name).join(', ')}
        </p>
      </div>

      {/* CSV format guide */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Required CSV Columns
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
          {[
            ['name', 'Project name'],
            ['location', 'City, State'],
            ['manager', 'Project manager'],
            ['type', 'Commercial / Residential / etc.'],
            ['startDate', 'YYYY-MM-DD'],
            ['expectedEndDate', 'YYYY-MM-DD'],
            ['budget', 'Total budget (number)'],
            ['actualCost', 'Actual cost to date (number)'],
            ['daysLate', 'Days behind schedule'],
            ['completionPercent', '0–100'],
            ['changeOrders', 'Number of change orders'],
            ['safetyIncidents', 'Number of incidents'],
          ].map(([col, desc]) => (
            <div key={col} className="flex gap-2">
              <code className="text-sky-600 dark:text-sky-400 font-mono">{col}</code>
              <span className="text-slate-500 dark:text-slate-400">— {desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
