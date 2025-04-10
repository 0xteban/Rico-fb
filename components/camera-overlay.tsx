"use client"

import type React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"

interface CameraOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  onClose: () => void
  onCapture: () => void
}

export function CameraOverlay({ videoRef, canvasRef, onClose, onCapture }: CameraOverlayProps) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center p-4">
        <Button variant="ghost" size="icon" className="rounded-full bg-gray-800/50 text-white" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <h2 className="text-white font-medium">{t("takeAPhoto")}</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="p-6 flex justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-16 w-16 rounded-full bg-white border-4 border-gray-800"
          onClick={onCapture}
        >
          <div className="h-12 w-12 rounded-full bg-gray-800" />
        </Button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

