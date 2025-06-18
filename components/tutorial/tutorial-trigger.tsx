"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import GmailSetupModal from "./gmail-setup-modal"

interface TutorialTriggerProps {
  userId?: string
  onGoToSettings: () => void
}

export default function TutorialTrigger({ userId, onGoToSettings }: TutorialTriggerProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowModal(true)}
        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
      >
        <Play className="w-4 h-4 mr-2" />
        Watch Tutorial
      </Button>

      <GmailSetupModal isOpen={showModal} onClose={() => setShowModal(false)} onGoToSettings={onGoToSettings} />
    </>
  )
}
