import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongodb';
import Report from '../../../models/Report';

export async function GET() {
  try {
    await dbConnect();
    const reports = await Report.find({}, '_id title subject year updatedAt').sort({ updatedAt: -1 });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

const defaultData = {
  title: 'New Report',
  authors: [{ name: '', usn: '' }],
  guide: [{ name: '', designation: '', department: ['', ''] }],
  year: '',
  semester: [0, ''],
  semester_section: '',
  subject: '',
  subject_code: '',
  department: { name: '', abbreviation: '', hod: '' },
  abstract: '',
  chapters: {
    introduction: { title: 'Introduction', body: '', sections: [] },
    literature_survey: { title: 'Literature Survey', body: '', sections: [] },
    system_requirements: { title: 'System Requirements', body: '', sections: [] },
    methodology: { title: 'Methodology & Implementation', body: '', sections: [] },
    results: { title: 'Result & Discussion', body: '', sections: [] },
    conclusion: { title: 'Conclusion', body: '', sections: [] }
  }
};
export async function POST() {
  try {
    await dbConnect();
    const report = await Report.create(defaultData);
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
