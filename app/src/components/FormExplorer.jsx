import { motion } from 'framer-motion';
import { useDemo } from '../context/DemoContext';
import { formFieldTranslations } from '../data/mockData';
import { X, FileText, ArrowRight, Sparkles, Link2 } from 'lucide-react';

export default function FormExplorer() {
  const { openFormCode, closeForm } = useDemo();

  if (!openFormCode) return null;

  const form = formFieldTranslations[openFormCode];
  if (!form) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm" onClick={closeForm} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-navy-900 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{openFormCode}</h2>
                <span className="text-[10px] font-semibold bg-accent text-navy-900 px-2 py-0.5 rounded-full">
                  {form.pageCount} pages → simplified
                </span>
              </div>
              <p className="text-[12px] text-slate-500">{form.formTitle}</p>
            </div>
          </div>
          <button
            onClick={closeForm}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Intro bar */}
        <div className="px-6 py-3 bg-accent/30 border-b border-accent-dark/30 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-navy-900" />
          <p className="text-[12px] text-navy-900 font-medium">
            CaseBridge translates {form.pageCount}-page government forms into guided, plain-language fields. Here's what {openFormCode} actually asks:
          </p>
        </div>

        {/* Field list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {form.fields.map((field, i) => (
            <div key={i} className="rounded-xl border border-slate-200 overflow-hidden">
              {/* Government language */}
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-slate-200 px-1.5 py-0.5 rounded">
                    {field.ref}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-red-400">
                    Government asks
                  </span>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">{field.gov}</p>
              </div>

              {/* Plain language */}
              <div className="px-4 py-3 bg-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-green-600">
                    In plain English
                  </span>
                </div>
                <p className="text-[13px] text-slate-800 leading-relaxed">{field.plain}</p>
              </div>

              {/* Pre-filled value */}
              <div className="px-4 py-2 bg-accent/20 border-t border-accent-dark/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link2 className="w-3 h-3 text-navy-900" />
                  <span className="text-[11px] font-semibold text-navy-900">{field.value}</span>
                </div>
                <span className="text-[10px] text-slate-500">{field.source}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <p className="text-[11px] text-slate-400">
            Showing {form.fields.length} key fields of {form.pageCount} pages · Full form has 50+ fields auto-populated from shared record
          </p>
          <button
            onClick={closeForm}
            className="text-[12px] font-semibold text-navy-900 hover:text-navy-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
