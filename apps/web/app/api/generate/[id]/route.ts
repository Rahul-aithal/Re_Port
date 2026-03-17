import { exec } from "child_process";
import fs from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promisify } from "util";
import dbConnect from "../../../../lib/mongodb";
import Report from "../../../../models/Report";

const execAsync = promisify(exec);
type Params = Promise<{ id: string }>;

export async function POST(
  request: NextRequest,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    await dbConnect();
    const report = await Report.findById(id).lean();

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Prepare data for Typst
    // Mongoose adds _id and __v which we don't want in the JSON
    const cleanReport = JSON.parse(JSON.stringify(report));
    delete cleanReport._id;
    delete cleanReport.__v;
    delete cleanReport.createdAt;
    delete cleanReport.updatedAt;

    // Define paths
    // process.cwd() is usually the project root in turborepo if started from root,
    // but in next it might be the app directory.
    // Let's find the project root.
    const rootPath = path.resolve(process.cwd(), "..", "..");
    const templateDir = path.join(
      rootPath,
      "packages",
      "bnmit-typst-report-template",
    );
    const dataPath = path.join(templateDir, "data.json");
    const outputPath = path.join(templateDir, "output.pdf");

    // Write data.json
    await fs.writeFile(dataPath, JSON.stringify(cleanReport, null, 2));

    // Run Typst
    try {
      await execAsync("typst --version");
    } catch (e) {
      return NextResponse.json(
        {
          error:
            "Typst not found on system. Please install Typst to generate PDFs.",
        },
        { status: 500 },
      );
    }

    try {
      await execAsync("typst compile main.typ output.pdf", {
        cwd: templateDir,
      });
    } catch (e) {
      return NextResponse.json(
        {
          error: `Typst compilation failed: ${(e as Error).message}`,
        },
        { status: 500 },
      );
    }

    // Read PDF
    const pdfBuffer = await fs.readFile(outputPath);

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${report.title.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
