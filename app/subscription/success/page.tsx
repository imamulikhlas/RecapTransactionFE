import { Suspense } from "react"
import EnhancedSuccessClient from "./enhanced-client"

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedSuccessClient />
    </Suspense>
  )
}
