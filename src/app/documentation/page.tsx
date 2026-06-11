import fs from "fs";
import path from "path";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DocumentationPage() {
  const docsDir = path.join(process.cwd(), "src", "docs");
  
  // The sequence the user requested: 1 to 6
  const files = [
    "PRD.md",
    "TRD.md",
    "App_Flow.md",
    "UI_UX_Design_Brief.md",
    "Backend_Schema.md",
    "Build_Sequence.md"
  ];

  const contents = files.map(file => {
    try {
      return {
        filename: file,
        content: fs.readFileSync(path.join(docsDir, file), "utf-8")
      };
    } catch (e) {
      console.error(`Could not read file ${file}`, e);
      return { filename: file, content: "" };
    }
  });

  return (
    <div className="min-h-screen bg-[#0B0B13] text-[#E5E7EB] py-16 px-6 sm:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] pb-4">
          SaaSify Master Documentation
        </h1>
        
        {contents.map((doc, index) => (
          doc.content ? (
            <div key={index} className="prose prose-invert prose-purple max-w-none bg-[#131320] p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl hover:border-white/10 transition-colors">
              <div className="mb-10 pb-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-sm font-bold tracking-wider text-[#A78BFA] uppercase">Document {index + 1}</span>
                <span className="text-xs text-slate-500 font-mono bg-white/5 px-3 py-1.5 rounded-md border border-white/5">{doc.filename}</span>
              </div>
              <ReactMarkdown>{doc.content}</ReactMarkdown>
            </div>
          ) : null
        ))}

        <div className="text-center pt-8 border-t border-white/5 text-slate-500 mt-16">
            End of Documentation.
        </div>
      </div>
    </div>
  );
}
