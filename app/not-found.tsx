import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="font-serif text-8xl font-bold mb-4">404</h1>
          <h2 className="font-serif text-3xl font-bold mb-4">Page non trouvée</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Désolé, nous ne trouvons pas la page que vous recherchez. Elle a peut-être été déplacée ou supprimée.
          </p>
          <Button asChild size="lg">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
