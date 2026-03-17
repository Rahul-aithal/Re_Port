import mongoose, { Schema, Document } from 'mongoose';

const SubsectionSchema = new Schema({
  title: { type: String, default: '' },
  body: { type: String, default: '' },
});

const SectionSchema = new Schema({
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  subsections: [SubsectionSchema],
});

const ChapterSchema = new Schema({
  title: { type: String, default: '' },
  body: { type: String, default: '' },
  sections: [SectionSchema],
});

const ReportSchema = new Schema({
  title: { type: String, required: true, default: 'Untitled Report' },
  authors: [{
    name: { type: String, default: '' },
    usn: { type: String, default: '' }
  }],
  guide: [{
    name: { type: String, default: '' },
    designation: { type: String, default: '' },
    department: [String]
  }],
  year: { type: String, default: '' },
  semester: [Schema.Types.Mixed], // [number, string]
  semester_section: { type: String, default: '' },
  subject: { type: String, default: '' },
  subject_code: { type: String, default: '' },
  department: {
    name: { type: String, default: '' },
    abbreviation: { type: String, default: '' },
    hod: { type: String, default: '' }
  },
  abstract: { type: String, default: '' },
  chapters: {
    introduction: ChapterSchema,
    literature_survey: ChapterSchema,
    system_requirements: ChapterSchema,
    methodology: ChapterSchema,
    results: ChapterSchema,
    conclusion: ChapterSchema
  }
}, { timestamps: true });

export interface IReport extends Document {
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
    introduction: any;
    literature_survey: any;
    system_requirements: any;
    methodology: any;
    results: any;
    conclusion: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
