'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Subsection {
  title: string;
  body: string;
  _id?: string;
}

interface Section {
  title: string;
  body: string;
  subsections: Subsection[];
  _id?: string;
}

interface Chapter {
  title: string;
  body: string;
  sections: Section[];
}

interface Report {
  _id: string;
  title: string;
  authors: { name: string; usn: string }[];
  guide: { name: string; designation: string; department: string[] }[];
  year: string;
  semester: [number, string];
  semester_section: string;
  subject: string;
  subject_code: string;
  department: { name: string; abbreviation: string; hod: string };
  abstract: string;
  chapters: {
    introduction: Chapter;
    literature_survey: Chapter;
    system_requirements: Chapter;
    methodology: Chapter;
    results: Chapter;
    conclusion: Chapter;
  };
}

type SectionKey = 'metadata' | keyof Report['chapters'];

export default function ReportEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [report, setReport] = useState<Report | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('metadata');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => { fetchReport(); }, [id]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`/api/report/${id}`);
      if (!res.ok) throw new Error('Report not found');
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error(error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const saveReport = async (updatedReport = report) => {
    if (!updatedReport) return;
    setSaving(true);
    try {
      await fetch(`/api/report/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedReport),
      });
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string, value: any) => {
    if (!report) return;
    const newReport = { ...report };
    const parts = path.split('.');
    let current: any = newReport;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (part) current = current[part];
    }
    const lastPart = parts[parts.length - 1];
    if (lastPart) current[lastPart] = value;
    setReport(newReport);
  };

  const handleBlur = () => saveReport();

  const generatePDF = async () => {
    if (!report) return;
    setGenerating(true);
    try {
      const res = await fetch(`/api/generate/${id}`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || 'Failed to generate PDF');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Generation failed. Check console for details.');
    } finally {
      setGenerating(false);
    }
  };

  const addAuthor = () => {
    if (!report) return;
    updateField('authors', [...report.authors, { name: '', usn: '' }]);
  };

  const removeAuthor = (index: number) => {
    if (!report) return;
    updateField('authors', report.authors.filter((_, i) => i !== index));
  };

  const addSection = (chapterKey: keyof Report['chapters']) => {
    if (!report) return;
    updateField(`chapters.${chapterKey}.sections`, [
      ...report.chapters[chapterKey].sections,
      { title: '', body: '', subsections: [] },
    ]);
  };

  const removeSection = (chapterKey: keyof Report['chapters'], index: number) => {
    if (!report) return;
    updateField(`chapters.${chapterKey}.sections`, report.chapters[chapterKey].sections.filter((_, i) => i !== index));
  };

  const addSubsection = (chapterKey: keyof Report['chapters'], sectionIndex: number) => {
    if (!report) return;
    const sections = [...report.chapters[chapterKey].sections];
    const section = sections[sectionIndex];
    if (section) {
      section.subsections.push({ title: '', body: '' });
      updateField(`chapters.${chapterKey}.sections`, sections);
    }
  };

  const removeSubsection = (chapterKey: keyof Report['chapters'], sectionIndex: number, subIndex: number) => {
    if (!report) return;
    const sections = [...report.chapters[chapterKey].sections];
    const section = sections[sectionIndex];
    if (section) {
      section.subsections = section.subsections.filter((_, i) => i !== subIndex);
      updateField(`chapters.${chapterKey}.sections`, sections);
    }
  };

  if (loading) return <div className="p-8 text-muted-foreground">Loading editor...</div>;
  if (!report) return null;

  const sidebarItems: { key: SectionKey; label: string }[] = [
    { key: 'metadata', label: 'Metadata' },
    { key: 'introduction', label: 'Introduction' },
    { key: 'literature_survey', label: 'Literature Survey' },
    { key: 'system_requirements', label: 'System Requirements' },
    { key: 'methodology', label: 'Methodology & Implementation' },
    { key: 'results', label: 'Result & Discussion' },
    { key: 'conclusion', label: 'Conclusion' },
  ];

  const inputClass = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition";
  const labelClass = "block text-xs font-medium text-muted-foreground mb-1";
  const inputGroupClass = "mb-4";

  return (
    <div className="h-screen flex overflow-hidden bg-background">

      {/* Sidebar */}
      <aside className="w-64 bg-muted border-r border-border flex flex-col shrink-0">
        <div className="px-6 py-5 border-b border-border">
          <Link href="/" className="font-serif italic text-lg text-muted-foreground hover:text-foreground transition-colors">
            ← Re:Port
          </Link>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm mb-0.5 transition-all ${
                activeSection === item.key
                  ? 'bg-accent/10 text-accent font-semibold'
                  : 'text-muted-foreground hover:bg-border/50 hover:text-foreground font-normal'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Sticky Header */}
        <header className="px-8 py-3 bg-background border-b border-border flex justify-between items-center sticky top-0 z-10">
          <input
            type="text"
            value={report.title}
            onChange={(e) => updateField('title', e.target.value)}
            onBlur={handleBlur}
            className="text-lg font-semibold w-96 bg-transparent border-none outline-none focus:ring-0 text-foreground"
          />
          <div className="flex gap-3 items-center">
            <span className="text-xs text-muted-foreground">
              {saving ? 'Saving...' : 'All changes saved'}
            </span>
            <button
              onClick={() => saveReport()}
              className="bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              Save
            </button>
            <button
              onClick={generatePDF}
              disabled={generating}
              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate PDF'}
            </button>
          </div>
        </header>

        {/* Scrollable Editor */}
        <main className="flex-1 overflow-y-auto px-8 py-12">
          <div className="max-w-3xl mx-auto">

            {activeSection === 'metadata' ? (
              <div>
                <h2 className="text-2xl font-semibold mb-8">Report Metadata</h2>

                <div className="grid grid-cols-2 gap-6">
                  {[
                    { label: 'Subject Name', field: 'subject', value: report.subject },
                    { label: 'Subject Code', field: 'subject_code', value: report.subject_code },
                    { label: 'Academic Year', field: 'year', value: report.year, placeholder: '2025-26' },
                    { label: 'Section', field: 'semester_section', value: report.semester_section },
                  ].map(({ label, field, value, placeholder }) => (
                    <div key={field} className={inputGroupClass}>
                      <label className={labelClass}>{label}</label>
                      <input
                        className={inputClass}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => updateField(field, e.target.value)}
                        onBlur={handleBlur}
                      />
                    </div>
                  ))}
                  <div className={inputGroupClass}>
                    <label className={labelClass}>Semester (Number)</label>
                    <input
                      className={inputClass}
                      type="number"
                      value={report.semester[0]}
                      onChange={(e) => updateField('semester.0', parseInt(e.target.value))}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className={inputGroupClass}>
                    <label className={labelClass}>Semester (Name)</label>
                    <input
                      className={inputClass}
                      placeholder="Fifth"
                      value={report.semester[1]}
                      onChange={(e) => updateField('semester.1', e.target.value)}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div className={inputGroupClass}>
                  <label className={labelClass}>Abstract</label>
                  <textarea
                    className={`${inputClass} min-h-32 resize-y`}
                    value={report.abstract}
                    onChange={(e) => updateField('abstract', e.target.value)}
                    onBlur={handleBlur}
                  />
                </div>

                <hr className="my-8 border-border" />

                {/* Authors */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Authors</h3>
                    <button
                      onClick={addAuthor}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      + Add Author
                    </button>
                  </div>
                  {report.authors.map((author, idx) => (
                    <div key={idx} className="grid grid-cols-[1fr_1fr_40px] gap-3 mb-3">
                      <input className={inputClass} placeholder="Name" value={author.name} onChange={(e) => updateField(`authors.${idx}.name`, e.target.value)} onBlur={handleBlur} />
                      <input className={inputClass} placeholder="USN" value={author.usn} onChange={(e) => updateField(`authors.${idx}.usn`, e.target.value)} onBlur={handleBlur} />
                      <button
                        onClick={() => removeAuthor(idx)}
                        className="bg-destructive text-destructive-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Guide */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Guide Information</h3>
                  <div className={inputGroupClass}>
                    <label className={labelClass}>Name</label>
                    <input className={inputClass} value={report.guide[0]?.name} onChange={(e) => updateField('guide.0.name', e.target.value)} onBlur={handleBlur} />
                  </div>
                  <div className={inputGroupClass}>
                    <label className={labelClass}>Designation</label>
                    <input className={inputClass} value={report.guide[0]?.designation} onChange={(e) => updateField('guide.0.designation', e.target.value)} onBlur={handleBlur} />
                  </div>
                </div>

                {/* Department */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Department Information</h3>
                  {[
                    { label: 'Department Name', field: 'department.name', value: report.department.name },
                    { label: 'Abbreviation', field: 'department.abbreviation', value: report.department.abbreviation },
                    { label: 'HOD Name', field: 'department.hod', value: report.department.hod },
                  ].map(({ label, field, value }) => (
                    <div key={field} className={inputGroupClass}>
                      <label className={labelClass}>{label}</label>
                      <input className={inputClass} value={value} onChange={(e) => updateField(field, e.target.value)} onBlur={handleBlur} />
                    </div>
                  ))}
                </div>
              </div>

            ) : (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  {report.chapters[activeSection as keyof Report['chapters']].title}
                </h2>
                <div className={inputGroupClass}>
                  <label className={labelClass}>Chapter Intro Body</label>
                  <textarea
                    className={`${inputClass} min-h-48 resize-y`}
                    value={report.chapters[activeSection as keyof Report['chapters']].body}
                    onChange={(e) => updateField(`chapters.${activeSection}.body`, e.target.value)}
                    onBlur={handleBlur}
                  />
                </div>

                <div className="mt-10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Sections</h3>
                    <button
                      onClick={() => addSection(activeSection as keyof Report['chapters'])}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      + Add Section
                    </button>
                  </div>

                  {report.chapters[activeSection as keyof Report['chapters']].sections.map((section, sIdx) => (
                    <div key={sIdx} className="bg-muted border border-border rounded-xl p-6 mb-6">
                      <div className="flex gap-3 mb-4">
                        <input
                          className={`${inputClass} font-semibold`}
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) => updateField(`chapters.${activeSection}.sections.${sIdx}.title`, e.target.value)}
                          onBlur={handleBlur}
                        />
                        <button
                          onClick={() => removeSection(activeSection as keyof Report['chapters'], sIdx)}
                          className="bg-destructive text-destructive-foreground px-3 py-1.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                      <textarea
                        className={`${inputClass} resize-y`}
                        placeholder="Section Body"
                        value={section.body}
                        onChange={(e) => updateField(`chapters.${activeSection}.sections.${sIdx}.body`, e.target.value)}
                        onBlur={handleBlur}
                      />

                      {/* Subsections */}
                      <div className="mt-6 pl-6 border-l-2 border-border">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm text-muted-foreground font-medium">Subsections</h4>
                          <button
                            onClick={() => addSubsection(activeSection as keyof Report['chapters'], sIdx)}
                            className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            + Add Sub
                          </button>
                        </div>
                        {section.subsections.map((sub, subIdx) => (
                          <div key={subIdx} className="mb-4">
                            <div className="flex gap-2 mb-2">
                              <input
                                className={`${inputClass} text-sm`}
                                placeholder="Subsection Title"
                                value={sub.title}
                                onChange={(e) => updateField(`chapters.${activeSection}.sections.${sIdx}.subsections.${subIdx}.title`, e.target.value)}
                                onBlur={handleBlur}
                              />
                              <button
                                onClick={() => removeSubsection(activeSection as keyof Report['chapters'], sIdx, subIdx)}
                                className="bg-destructive text-destructive-foreground w-8 rounded-md text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer shrink-0"
                              >
                                ×
                              </button>
                            </div>
                            <textarea
                              className={`${inputClass} text-sm min-h-20 resize-y`}
                              placeholder="Subsection Body"
                              value={sub.body}
                              onChange={(e) => updateField(`chapters.${activeSection}.sections.${sIdx}.subsections.${subIdx}.body`, e.target.value)}
                              onBlur={handleBlur}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
