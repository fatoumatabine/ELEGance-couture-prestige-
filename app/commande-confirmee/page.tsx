import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home, ShoppingBag } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Commande confirmée - syllaSeduction",
  description: "Votre commande a été confirmée avec succès",
}

export default function CommandeConfirmeePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-accent" />
          </div>

          <h1 className="font-serif text-4xl font-bold mb-4">Commande confirmée!</h1>

          <p className="text-muted-foreground mb-8 leading-relaxed">
            Merci pour votre commande. Nous vous contacterons très bientôt par téléphone ou WhatsApp pour confirmer les
            détails de votre livraison.
          </p>

          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
              <Link href="/boutique">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continuer mes achats
              </Link>
            </Button>
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Une question ? Contactez-nous au{" "}
              <a href="tel:+221781128137" className="font-semibold text-foreground hover:text-accent">
                +221 78 112 81 37
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
