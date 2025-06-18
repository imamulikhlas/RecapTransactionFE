"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  Mail,
  Shield,
  Key,
  Settings,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface GmailSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToSettings: () => void;
}

const tutorialSteps = [
  {
    id: 1,
    title: "Welcome to Gmail Setup",
    description: "Mari kita setup Gmail untuk monitoring transaksi otomatis",
    image: "/tutorial/step-1-welcome.jpg",
    content:
      "Dengan menghubungkan Gmail, aplikasi akan otomatis memantau email transaksi dari bank dan e-wallet kamu.",
    icon: <Mail className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Buka Google Account",
    description: "Klik link untuk membuka halaman Google Account Security",
    image: "https://trans.imamulikhlas.com/assets/logo.png",
    content:
      "Pastikan kamu sudah login ke akun Gmail yang ingin dihubungkan dengan aplikasi ini.",
    icon: <Shield className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 3,
    title: "Enable 2-Step Verification",
    description: "Aktifkan 2-Step Verification jika belum aktif",
    image: "/tutorial/step-3-2fa.jpg",
    content:
      "2-Step Verification diperlukan untuk membuat App Password. Ini akan meningkatkan keamanan akun kamu.",
    icon: <Shield className="w-6 h-6" />,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    title: "Go to App Passwords",
    description: "Cari dan klik menu 'App passwords' di halaman Security",
    image: "/tutorial/step-4-app-passwords.jpg",
    content:
      "App passwords memungkinkan aplikasi pihak ketiga mengakses Gmail dengan aman tanpa password utama.",
    icon: <Key className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "Generate New Password",
    description: "Klik 'Generate' untuk membuat app password baru",
    image: "/tutorial/step-5-generate.jpg",
    content:
      "Pilih 'Other (custom name)' dan beri nama seperti 'TransHub' atau 'Transaction Monitor'.",
    icon: <Key className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: 6,
    title: "Copy App Password",
    description: "Salin 16-karakter app password yang dihasilkan",
    image: "/tutorial/step-6-copy-password.jpg",
    content:
      "Password ini hanya ditampilkan sekali. Pastikan kamu menyalinnya dengan benar dan aman.",
    icon: <Key className="w-6 h-6" />,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 7,
    title: "Paste to Settings",
    description: "Kembali ke aplikasi dan paste password di halaman Settings",
    image: "/tutorial/step-7-paste-settings.jpg",
    content:
      "Masukkan email Gmail dan app password yang sudah disalin ke form di halaman Settings.",
    icon: <Settings className="w-6 h-6" />,
    color: "from-teal-500 to-green-500",
  },
  {
    id: 8,
    title: "Test & Save",
    description: "Klik 'Save Gmail Settings' untuk test koneksi dan menyimpan",
    image: "/tutorial/step-8-save.jpg",
    content:
      "Aplikasi akan test koneksi ke Gmail dan menyimpan pengaturan jika berhasil. Selamat! 🎉",
    icon: <CheckCircle className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
  },
];

export default function GmailSetupModal({
  isOpen,
  onClose,
  onGoToSettings,
}: GmailSetupModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const router = useRouter();

  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= tutorialSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4000); // 4 seconds per step
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen]);

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setIsPlaying(false);
  };

  const handleGoToSettings = () => {
    onClose();
    onGoToSettings();
  };

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/90 backdrop-blur-sm" />
      <DialogContent
        hideCloseButton
        className="max-w-6xl w-full h-[95vh] md:h-[90vh] p-0 bg-transparent border-none overflow-hidden mx-2 md:mx-auto [&>button[data-radix-dialog-close]]:hidden"
      >
        <DialogTitle></DialogTitle>
        {/* Cinema-style Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: Math.random() * 10 + 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-4 lg:p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg lg:text-2xl font-bold text-white">
                  Gmail Setup Tutorial
                </h2>
                <p className="text-slate-300 text-xs lg:text-sm">
                  Step-by-step guide untuk menghubungkan Gmail
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full w-8 h-8 lg:w-10 lg:h-10 p-0"
            >
              <X className="w-4 h-4 lg:w-5 lg:h-5" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 px-4 lg:px-6 py-3 lg:py-4 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs lg:text-sm text-slate-300">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
              <Badge
                className={`bg-gradient-to-r ${currentStepData.color} text-white border-none text-xs lg:text-sm`}
              >
                {Math.round(progress)}% Complete
              </Badge>
            </div>
            <Progress value={progress} className="h-1.5 lg:h-2 bg-slate-700" />
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row">
            {/* Image/Visual Area */}
            <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center min-h-[300px] lg:min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative w-full max-w-2xl mx-auto p-4 lg:p-8"
                >
                  {/* Step Icon */}
                  <div className="text-center mb-4 lg:mb-8">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                      className={`inline-flex p-4 lg:p-6 bg-gradient-to-r ${currentStepData.color} rounded-full shadow-lg`}
                    >
                      <div className="w-5 h-5 lg:w-6 lg:h-6">
                        {currentStepData.icon}
                      </div>
                    </motion.div>
                  </div>

                  {/* Mock Screenshot/Visual */}
                  <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden mb-4 lg:mb-6">
                    <div className="h-48 lg:h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center px-4">
                        <div
                          className={`w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-r ${currentStepData.color} rounded-full mx-auto mb-3 lg:mb-4 flex items-center justify-center`}
                        >
                          <div className="w-5 h-5 lg:w-6 lg:h-6 text-white">
                            {currentStepData.icon}
                          </div>
                        </div>
                        <p className="text-gray-600 font-medium text-sm lg:text-base">
                          {currentStepData.title}
                        </p>
                        {/* <p className="text-xs lg:text-sm text-gray-500 mt-2">
                          Screenshot placeholder
                        </p> */}
                      </div>
                    </div>

                    {/* Arrow Indicator */}
                    <motion.div
                      animate={{
                        x: [0, 10, 0],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                      className="absolute top-1/2 right-2 lg:right-4 transform -translate-y-1/2"
                    >
                      <ArrowRight className="w-6 h-6 lg:w-8 lg:h-8 text-red-500 drop-shadow-lg" />
                    </motion.div>
                  </div>

                  {/* Step Counter */}
                  <div className="flex justify-center space-x-1 lg:space-x-2 mb-4">
                    {tutorialSteps.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all duration-300 ${
                          index === currentStep
                            ? `bg-gradient-to-r ${currentStepData.color} shadow-lg`
                            : index < currentStep
                            ? "bg-green-500"
                            : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Content Panel */}
            <div className="w-full lg:w-96 bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-t lg:border-t-0 lg:border-l border-white/10 p-4 lg:p-6 flex flex-col max-h-[50vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1"
                >
                  <div className="mb-4 lg:mb-6">
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-2">
                      {currentStepData.title}
                    </h3>
                    <p className="text-slate-300 mb-3 lg:mb-4 text-sm lg:text-base">
                      {currentStepData.description}
                    </p>
                    <div className="p-3 lg:p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
                        {currentStepData.content}
                      </p>
                    </div>
                  </div>

                  {/* Quick Links - Mobile Optimized */}
                  {currentStep === 1 && (
                    <div className="space-y-2 mb-4 lg:mb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full justify-start border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs lg:text-sm h-8 lg:h-9"
                      >
                        <a
                          href="https://myaccount.google.com/security"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Shield className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                          Google Account Security
                          <ExternalLink className="w-2 h-2 lg:w-3 lg:h-3 ml-auto" />
                        </a>
                      </Button>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-2 mb-4 lg:mb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs lg:text-sm h-8 lg:h-9"
                      >
                        <a
                          href="https://myaccount.google.com/apppasswords"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Key className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                          App Passwords
                          <ExternalLink className="w-2 h-2 lg:w-3 lg:h-3 ml-auto" />
                        </a>
                      </Button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Controls - Mobile Optimized */}
              <div className="space-y-3 lg:space-y-4 mt-auto">
                {/* Playback Controls */}
                <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(0)}
                    className="text-slate-300 hover:bg-slate-700 w-8 h-8 lg:w-9 lg:h-9 p-0"
                  >
                    <RotateCcw className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="text-slate-300 hover:bg-slate-700 disabled:opacity-50 w-8 h-8 lg:w-9 lg:h-9 p-0"
                  >
                    <ChevronLeft className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-slate-300 hover:bg-slate-700 w-8 h-8 lg:w-9 lg:h-9 p-0"
                  >
                    {isPlaying ? (
                      <Pause className="w-3 h-3 lg:w-4 lg:h-4" />
                    ) : (
                      <Play className="w-3 h-3 lg:w-4 lg:h-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={nextStep}
                    disabled={currentStep === tutorialSteps.length - 1}
                    className="text-slate-300 hover:bg-slate-700 disabled:opacity-50 w-8 h-8 lg:w-9 lg:h-9 p-0"
                  >
                    <ChevronRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {/* <Button
                    onClick={handleGoToSettings}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-sm lg:text-base h-9 lg:h-10"
                  >
                    <Settings className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                    Go to Settings
                  </Button> */}
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 text-sm lg:text-base h-8 lg:h-9"
                  >
                    Close Tutorial
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
