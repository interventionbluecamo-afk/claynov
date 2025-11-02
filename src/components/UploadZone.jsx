import { Upload, Check, Loader2 } from 'lucide-react';

export default function UploadZone({ file, uploading, onFileSelect }) {
  return (
    <div className={`glass rounded-2xl shadow-xl p-4 sm:p-8 border-2 border-dashed transition-all ${
      uploading ? 'border-slate-400 bg-slate-50/50' : file ? 'border-green-400 bg-green-50/50' : 'border-gray-300 hover:border-slate-500'
    }`}>
      <input 
        type="file" 
        id="upload" 
        className="hidden" 
        accept=".pdf,.doc,.docx" 
        onChange={onFileSelect}
        disabled={uploading}
      />
      <label htmlFor="upload" className={`cursor-pointer block min-h-[120px] sm:min-h-[160px] flex items-center justify-center ${uploading ? 'cursor-wait' : ''}`}>
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {uploading ? (
            <>
              <Loader2 className="w-10 h-10 sm:w-16 sm:h-16 text-slate-600 animate-spin" />
              <p className="text-xs sm:text-base font-semibold text-gray-900">Processing file...</p>
            </>
          ) : file ? (
            <>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <div className="text-center px-2">
                <p className="text-sm sm:text-lg font-semibold text-gray-900 break-all">{file.name}</p>
                <p className="text-xs sm:text-sm text-green-600 mt-1 font-medium">Ready to optimize</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-100 to-teal-100 rounded-full flex items-center justify-center shadow-md">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" />
              </div>
              <div className="text-center">
                <p className="text-sm sm:text-lg font-semibold text-gray-900">Upload resume</p>
                <p className="text-[10px] sm:text-sm text-gray-500 mt-1">PDF, DOC, DOCX (max 5MB)</p>
              </div>
            </>
          )}
        </div>
      </label>
    </div>
  );
}

