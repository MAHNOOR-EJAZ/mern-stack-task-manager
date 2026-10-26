import React, { useState } from 'react';
import {
  CheckCircle2,
  Code2,
  Copy,
  Terminal,
  X,
} from 'lucide-react';

interface VSCodeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VSCodeGuideModal: React.FC<VSCodeGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8ECE5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E8ECE5] bg-[#F7F8F5]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF0E7] flex items-center justify-center text-[#789477]">
              <Terminal className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#283128]">
                How to Download &amp; Run in VS Code
              </h2>
              <p className="text-xs text-[#737B72]">
                Beginner Guide for University Project Presentation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#737B72] hover:text-[#283128] hover:bg-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs text-[#737B72]">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-white border border-[#E8ECE5]">
            <div className="flex items-center space-x-2 font-bold text-sm text-[#283128] mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EAF0E7] text-[#789477] flex items-center justify-center text-xs">
                1
              </span>
              <span>Download Project Code</span>
            </div>
            <p className="leading-relaxed">
              In AI Studio, click the <strong>Download / Export Code</strong> icon in the header to save the project as a <code>.zip</code>. Extract it into a local folder (e.g. <code>task-manager</code>).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-white border border-[#E8ECE5]">
            <div className="flex items-center space-x-2 font-bold text-sm text-[#283128] mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EAF0E7] text-[#789477] flex items-center justify-center text-xs">
                2
              </span>
              <span>Open in VS Code</span>
            </div>
            <p className="leading-relaxed">
              Open VS Code, select <strong>File &gt; Open Folder...</strong>, and choose the extracted folder.
              Press <kbd className="px-1.5 py-0.5 bg-[#F7F8F5] border border-[#E8ECE5] rounded text-[#283128]">Ctrl + `</kbd> (or <kbd className="px-1.5 py-0.5 bg-[#F7F8F5] border border-[#E8ECE5] rounded text-[#283128]">Cmd + `</kbd> on macOS) to open the terminal.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-white border border-[#E8ECE5]">
            <div className="flex items-center space-x-2 font-bold text-sm text-[#283128] mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EAF0E7] text-[#789477] flex items-center justify-center text-xs">
                3
              </span>
              <span>Install Dependencies</span>
            </div>
            <p className="mb-2">Run the standard npm installation:</p>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-[#F7F8F5] font-mono text-[#283128] border border-[#E8ECE5]">
                npm install
              </pre>
              <button
                onClick={() => copyText('npm install', 3)}
                className="absolute top-2.5 right-2.5 p-1 rounded bg-white hover:bg-[#EAF0E7] text-[#737B72] border border-[#E8ECE5]"
              >
                {copiedIndex === 3 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#789477]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-white border border-[#E8ECE5]">
            <div className="flex items-center space-x-2 font-bold text-sm text-[#283128] mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EAF0E7] text-[#789477] flex items-center justify-center text-xs">
                4
              </span>
              <span>Configure .env</span>
            </div>
            <p className="mb-2">Create a <code>.env</code> file with your MongoDB connection:</p>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-[#F7F8F5] font-mono text-[#283128] border border-[#E8ECE5] whitespace-pre-wrap">
                MONGODB_URI="mongodb+srv://&lt;username&gt;:&lt;password&gt;@cluster0.mongodb.net/taskmanager?retryWrites=true&amp;w=majority"
              </pre>
              <button
                onClick={() =>
                  copyText(
                    'MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority"',
                    4
                  )
                }
                className="absolute top-2.5 right-2.5 p-1 rounded bg-white hover:bg-[#EAF0E7] text-[#737B72] border border-[#E8ECE5]"
              >
                {copiedIndex === 4 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#789477]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-white border border-[#E8ECE5]">
            <div className="flex items-center space-x-2 font-bold text-sm text-[#283128] mb-1.5">
              <span className="w-5 h-5 rounded-full bg-[#EAF0E7] text-[#789477] flex items-center justify-center text-xs">
                5
              </span>
              <span>Start Development Server</span>
            </div>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-[#F7F8F5] font-mono text-[#283128] border border-[#E8ECE5]">
                npm run dev
              </pre>
              <button
                onClick={() => copyText('npm run dev', 5)}
                className="absolute top-2.5 right-2.5 p-1 rounded bg-white hover:bg-[#EAF0E7] text-[#737B72] border border-[#E8ECE5]"
              >
                {copiedIndex === 5 ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#789477]" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <p className="mt-2 text-[#737B72]">
              Open your browser at <strong className="text-[#283128]">http://localhost:3000</strong>.
            </p>
          </div>

          {/* Architecture review */}
          <div className="p-4 rounded-xl bg-[#F7F8F5] border border-[#E8ECE5]">
            <h4 className="font-semibold text-[#283128] mb-2 flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-[#789477]" />
              <span>MERN Stack Architecture Structure</span>
            </h4>
            <ul className="space-y-1 text-[#737B72]">
              <li><strong className="text-[#283128]">server/models/Task.ts</strong>: Mongoose data schema with validation</li>
              <li><strong className="text-[#283128]">server/routes/taskRoutes.ts</strong>: Express REST API routes</li>
              <li><strong className="text-[#283128]">server.ts</strong>: Express server running on port 3000</li>
              <li><strong className="text-[#283128]">src/</strong>: React frontend with minimal modern dashboard</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E8ECE5] bg-[#F7F8F5] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#789477] hover:bg-[#5F795E] text-white transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
