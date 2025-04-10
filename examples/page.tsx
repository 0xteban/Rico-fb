import FunctionExamples from "@/components/function-examples"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ExamplesPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="flex items-center p-4 bg-card shadow-sm">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Rico Function Examples
        </h1>
      </header>
      <FunctionExamples />
    </main>
  )
}

