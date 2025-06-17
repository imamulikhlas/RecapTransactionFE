import { Suspense } from "react"
import EnhancedFailedClient from "./enhanced-client"

export default function FailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnhancedFailedClient />
    </Suspense>
  )
}
