'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ReportSummary {
  _id: string;
  title: string;
  subject: string;
  year: string;
  updatedAt: string;
}

export default function Dashboard() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/report');
      const data = await res.json();
      if (Array.isArray(data)) setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async () => {
    try {
      const res = await fetch('/api/report', { method: 'POST' });
      const data = await res.json();
      if (data._id) router.push(`/report/${data._id}`);
    } catch (error) {
      console.error('Failed to create report:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="px-8 py-6 flex justify-between items-center border-b border-border">
        <h1 className="font-serif italic text-4xl tracking-tight">
          Re:Port
        </h1>
        <button
          onClick={createReport}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          + New Report
        </button>
      </header>

      <main className="flex-1 px-8 py-12 max-w-6xl mx-auto w-full">
        <h2 className="text-lg text-muted-foreground mb-8 font-medium">
          Your Reports
        </h2>

        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {reports.map((report) => (
              <Link
                key={report._id}
                href={`/report/${report._id}`}
                className="block bg-card text-card-foreground border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg mb-2">{report.title}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {report.subject || 'No Subject'} • {report.year || 'No Year'}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-mono">
                    {new Date(report.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-accent">Edit →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-muted rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground mb-6">
              No reports yet. Start by creating one.
            </p>
            <button
              onClick={createReport}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Create your first report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
