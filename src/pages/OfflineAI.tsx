import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Sparkles, 
  Smartphone, 
  Database, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { DeviceCapability, DeviceCapabilityInfo, isDeviceAICapable } from '../lib/androidCapabilities';
import { 
  getModelPackStatus, 
  startModelPackDownload, 
  pauseModelPackDownload, 
  deleteModelPack,
  AI_MODEL_PACK_SIZE_BYTES 
} from '../lib/modelPackManager';
import { useAppContext } from '../AppContext';
import { type Language } from '../lib/i18n';

const OfflineAI: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const lang: Language = state.user?.language ?? 'English';
  
  const [capabilities, setCapabilities] = useState<DeviceCapabilityInfo | null>(null);
  const [status, setStatus] = useState<string>('checking'); // 'checking', 'not_downloaded', 'downloading', 'downloaded', 'failed', 'incompatible'
  const [progress, setProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const caps = await DeviceCapability.getCapabilities();
        setCapabilities(caps);
        
        if (!isDeviceAICapable(caps)) {
          setStatus('incompatible');
          return;
        }

        const modelStatus = await getModelPackStatus();
        if (modelStatus) {
          setStatus(modelStatus.status);
          setProgress(modelStatus.progressPercent || 0);
        } else {
          setStatus('not_downloaded');
        }
      } catch (err) {
        console.error('[OfflineAI] Initialisation failed:', err);
        setStatus('not_downloaded');
      }
    }
    init();
  }, []);

  const handleDownload = async () => {
    setErrorMessage(null);
    setStatus('downloading');
    try {
      await startModelPackDownload((percent) => {
        setProgress(percent);
      });
      setStatus('downloaded');
    } catch (err: any) {
      if (err.message === 'Aborted') {
        setStatus('failed');
      } else {
        setErrorMessage(err.message || 'Failed to download pack.');
        setStatus('failed');
      }
    }
  };

  const handlePause = async () => {
    await pauseModelPackDownload();
    setStatus('failed');
  };

  const handleDelete = async () => {
    await deleteModelPack();
    setStatus('not_downloaded');
    setProgress(0);
    setShowDeleteConfirm(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col font-nunito pb-12">
      <header className="p-6 flex items-center gap-4 border-b border-navy/5 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-off-white flex items-center justify-center text-navy transition-transform active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-poppins font-bold text-navy">Smart Jabari</h1>
          <p className="text-xs text-grey">Offline AI Companion settings</p>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-md mx-auto w-full space-y-6">
        {/* Status card */}
        <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow/20 text-yellow-600 rounded-2xl flex items-center justify-center text-xl shrink-0">
              <Sparkles size={24} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-bold text-navy">Offline Language Model</h2>
              <p className="text-xs text-grey">Run secure, local mentoring conversations offline</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'checking' && (
              <motion.div key="checking" className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-yellow border-t-transparent rounded-full animate-spin mr-2" />
                <span className="text-xs text-navy/50 font-bold uppercase tracking-wider">Checking system...</span>
              </motion.div>
            )}

            {status === 'incompatible' && (
              <motion.div key="incompatible" className="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2">
                <div className="flex gap-2 text-red-800">
                  <AlertTriangle size={18} className="shrink-0" />
                  <p className="font-bold text-sm">Device Incompatible</p>
                </div>
                <p className="text-xs text-red-700/90 leading-relaxed font-nunito">
                  Your device does not meet the hardware requirements for on-device AI. 
                  You need Android 12+, at least 192 MB RAM, and 2 GB free storage space.
                </p>
              </motion.div>
            )}

            {(status === 'not_downloaded' || status === 'failed') && (
              <motion.div key="not_downloaded" className="space-y-4">
                <div className="p-4 bg-yellow/10 border border-yellow/20 rounded-2xl space-y-1.5 text-navy">
                  <p className="font-bold text-sm">Download Optional Model Pack</p>
                  <p className="text-xs text-navy/70 leading-relaxed">
                    This pack (~500 MB) enables smart mentoring replies when offline. 
                    Without it, offline chats use simpler search matching.
                  </p>
                </div>

                {errorMessage && (
                  <p className="text-xs text-red-500 font-bold">{errorMessage}</p>
                )}

                <button
                  onClick={handleDownload}
                  className="w-full h-12 rounded-full bg-navy text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <Play size={16} />
                  {status === 'failed' ? 'Resume Download' : 'Download Pack (500 MB)'}
                </button>
              </motion.div>
            )}

            {status === 'downloading' && (
              <motion.div key="downloading" className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-navy">Downloading Model File...</span>
                    <span className="text-yellow-600">{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-navy/5 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-yellow transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <button
                  onClick={handlePause}
                  className="w-full h-12 rounded-full bg-navy/5 text-navy font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <Pause size={16} />
                  Pause Download
                </button>
              </motion.div>
            )}

            {status === 'downloaded' && (
              <motion.div key="downloaded" className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3 text-green-800">
                  <CheckCircle2 size={24} className="text-green-600 shrink-0" />
                  <div>
                    <p className="font-bold text-sm">Smart Jabari Installed</p>
                    <p className="text-xs text-green-700/90 leading-relaxed font-nunito">
                      Local AI runs directly on this device. Your offline messages are analyzed locally.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 h-12 rounded-full border border-red-200 text-red-600 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform bg-white cursor-pointer"
                  >
                    <Trash2 size={16} />
                    Uninstall Model
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Requirements check list */}
        {capabilities && (
          <div className="bg-white p-6 rounded-[32px] border border-navy/5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-navy uppercase tracking-wider">Device Requirements</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-grey flex items-center gap-2"><Smartphone size={14} /> Android OS</span>
                <span className={`font-bold ${capabilities.androidSdkVersion >= 31 ? 'text-green-600' : 'text-red-500'}`}>
                  API {capabilities.androidSdkVersion} {capabilities.androidSdkVersion >= 31 ? '(OK)' : '(Needs 31+)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-grey flex items-center gap-2"><Database size={14} /> Memory Class</span>
                <span className={`font-bold ${capabilities.memoryClassMB >= 192 ? 'text-green-600' : 'text-red-500'}`}>
                  {capabilities.memoryClassMB} MB {capabilities.memoryClassMB >= 192 ? '(OK)' : '(Low-end)'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-grey flex items-center gap-2"><Database size={14} /> Free Space</span>
                <span className={`font-bold ${capabilities.freeStorageBytes >= 1_500_000_000 ? 'text-green-600' : 'text-red-500'}`}>
                  {formatBytes(capabilities.freeStorageBytes)} {capabilities.freeStorageBytes >= 1_500_000_000 ? '(OK)' : '(Low Space)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-end justify-center p-6 bg-navy/40 backdrop-blur-sm">
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-[32px] p-6 space-y-6 border border-navy/5 shadow-xl text-center"
              >
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
                  <Trash2 size={24} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-poppins font-bold text-navy text-lg">Uninstall AI Model?</h3>
                  <p className="text-xs text-grey leading-relaxed">
                    This will delete the 500 MB model file and free up device space. You can reinstall it anytime.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 h-12 rounded-full bg-navy/5 text-navy font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 h-12 rounded-full bg-red-600 text-white font-bold text-xs cursor-pointer"
                  >
                    Uninstall
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OfflineAI;
