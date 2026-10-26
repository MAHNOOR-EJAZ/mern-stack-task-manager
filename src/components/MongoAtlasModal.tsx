import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  HelpCircle,
  Lock,
  RefreshCw,
  Server,
  ShieldCheck,
  X,
} from 'lucide-react';
import { MongoStatus } from '../types/task.ts';

interface MongoAtlasModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: MongoStatus | null;
  onRefreshStatus: () => Promise<void>;
  isLoading: boolean;
}

export const MongoAtlasModal: React.FC<MongoAtlasModalProps> = ({
  isOpen,
  onClose,
  status,
  onRefreshStatus,
  isLoading,
}) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const isConnected = status?.isConnected;


  const copyToClipboard = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E8ECE5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E8ECE5] bg-[#F7F8F5]/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAF0E7] flex items-center justify-center text-[#789477]">
              <Database className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#283128]">
                MongoDB Atlas &amp; Mongoose Database
              </h2>
              <p className="text-xs text-[#737B72]">
                Cloud Database Integration for MERN Stack
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Status Card */}
          <div
            className={`p-4 rounded-xl border ${
              isConnected
                ? 'bg-[#EAF0E7]/60 border-[#789477]/30'
                : 'bg-[#F8EED9]/60 border-[#E8ECE5]'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                {isConnected ? (
                  <CheckCircle2 className="w-5 h-5 text-[#789477] flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-[#7A520E] flex-shrink-0" />
                )}
                <div>
                  <h4 className="text-sm font-bold text-[#283128]">
                    {isConnected
                      ? 'Connected to MongoDB Atlas'
                      : 'MongoDB Atlas Connection Pending'}
                  </h4>
                  <p className="text-xs text-[#737B72] mt-0.5">
                    {isConnected
                      ? `Database: ${status?.dbName || 'cluster'} | Host: ${
                          status?.host || 'MongoDB Atlas'
                        }`
                      : 'Express REST API is running. Connect your Atlas cluster to persist tasks.'}
                  </p>
                </div>
              </div>

              <button
                onClick={onRefreshStatus}
                disabled={isLoading}
                title="Refresh Status"
                className="p-1.5 rounded-lg bg-white border border-[#E8ECE5] text-[#737B72] hover:text-[#283128] transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Diagnostic stats */}
            <div className="mt-3.5 pt-3 border-t border-[#E8ECE5] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-[#E8ECE5]/60">
                <span className="text-[#737B72] block text-[10px] uppercase font-medium">Driver</span>
                <span className="font-semibold text-[#283128]">{status?.driver || 'Mongoose'}</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E8ECE5]/60">
                <span className="text-[#737B72] block text-[10px] uppercase font-medium">State</span>
                <span
                  className={`font-semibold capitalize ${
                    isConnected ? 'text-[#789477]' : 'text-[#7A520E]'
                  }`}
                >
                  {status?.state || 'ready'}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E8ECE5]/60">
                <span className="text-[#737B72] block text-[10px] uppercase font-medium">Collection</span>
                <span className="font-semibold text-[#283128]">tasks</span>
              </div>
              <div className="p-2 rounded-lg bg-white border border-[#E8ECE5]/60">
                <span className="text-[#737B72] block text-[10px] uppercase font-medium">Tasks</span>
                <span className="font-semibold text-[#283128]">{status?.totalTasks ?? 0}</span>
              </div>
            </div>

            {/* Error or IP Whitelist Notice Banner */}
            {status?.error && (
              <div className="mt-3.5 p-3 rounded-lg bg-[#F8E5E2] border border-[#9B453A]/20 text-[#9B453A] text-xs">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">MongoDB Atlas IP Whitelist Notice</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#9B453A]/90">
                      MongoDB Atlas clusters block external IPs by default. To allow cloud and local connections:
                      go to <strong>Security &gt; Network Access &gt; Add IP Address</strong>, then select <strong>&quot;Allow Access from Anywhere&quot; (<code>0.0.0.0/0</code>)</strong>.
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => copyToClipboard('0.0.0.0/0', 99)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-white border border-[#9B453A]/30 text-[#9B453A] font-medium text-[11px] hover:bg-[#F8E5E2] cursor-pointer"
                      >
                        {copiedStep === 99 ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#789477]" />
                            <span>Copied 0.0.0.0/0</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy 0.0.0.0/0</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Environment-Protected Configuration Notice */}
          <div className="bg-[#F7F8F5] p-5 rounded-xl border border-[#E8ECE5]">
            <h3 className="text-sm font-bold text-[#283128] flex items-center space-x-2 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#789477]" />
              <span>Environment-Protected Database Configuration</span>
            </h3>
            <p className="text-xs text-[#737B72] leading-relaxed">
              Database connection settings and credentials are configured strictly on the server through the{' '}
              <code className="px-1.5 py-0.5 rounded bg-white border border-[#E8ECE5] text-[#283128] font-mono">
                MONGODB_URI
              </code>{' '}
              environment variable. Dynamic browser reconfiguration is disabled to ensure cluster protection and integrity.
            </p>
          </div>

          {/* Beginner Step-by-Step Guide */}
          <div>
            <h3 className="text-sm font-bold text-[#283128] mb-3 flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#789477]" />
              <span>Step-by-Step: Setting up Free MongoDB Atlas</span>
            </h3>

            <div className="space-y-2.5 text-xs text-[#737B72]">
              <div className="p-3.5 rounded-xl bg-white border border-[#E8ECE5]">
                <div className="flex items-center justify-between font-semibold text-[#283128] mb-1">
                  <span>Step 1: Sign up at MongoDB Atlas</span>
                  <a
                    href="https://www.mongodb.com/cloud/atlas/register"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-[#789477] hover:underline"
                  >
                    <span>cloud.mongodb.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p>Register a free account and choose the <strong>M0 Free Tier</strong> (no credit card required).</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8ECE5]">
                <div className="font-semibold text-[#283128] mb-1">Step 2: Create Database User</div>
                <p>In Atlas, go to <strong>Database Access &gt; Add New Database User</strong> with username &amp; password.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8ECE5]">
                <div className="font-semibold text-[#283128] mb-1">Step 3: Network Access (Allow Anywhere)</div>
                <p>Under <strong>Network Access</strong>, click <strong>Add IP Address &gt; Allow Access from Anywhere (0.0.0.0/0)</strong>.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8ECE5]">
                <div className="font-semibold text-[#283128] mb-1">Step 4: Copy Connection String</div>
                <div className="relative mt-2">
                  <pre className="p-2.5 rounded-lg bg-[#F7F8F5] font-mono text-[11px] text-[#283128] overflow-x-auto border border-[#E8ECE5]">
                    mongodb+srv://admin:&lt;password&gt;@cluster0.mongodb.net/taskmanager?retryWrites=true&amp;w=majority
                  </pre>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'mongodb+srv://admin:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority',
                        4
                      )
                    }
                    className="absolute top-2 right-2 p-1 rounded bg-white hover:bg-[#EAF0E7] text-[#737B72] border border-[#E8ECE5]"
                  >
                    {copiedStep === 4 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#789477]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E8ECE5]">
                <div className="flex items-center space-x-1.5 font-semibold text-[#283128] mb-1">
                  <Lock className="w-3.5 h-3.5 text-[#789477]" />
                  <span>Why credentials never go in the React frontend</span>
                </div>
                <p className="leading-relaxed">
                  Frontend code running in the browser can be inspected by anyone. In a clean MERN architecture,
                  the frontend only calls Express API endpoints (<code>/api/tasks</code>), while the backend safely
                  manages <code>process.env.MONGODB_URI</code>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#E8ECE5] bg-[#F7F8F5] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#EAF0E7] text-[#283128] border border-[#E8ECE5] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
