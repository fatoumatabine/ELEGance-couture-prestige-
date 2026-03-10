import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function ConditionsPage() {
  const sections = [
    {
      title: "1. Objet",
      content: `Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Elegance Couture, boutique de mode africaine basée à Keur Massar, Dakar, Sénégal, et toute personne physique ou morale souhaitant effectuer un achat via notre boutique en ligne ou en magasin.`
    },
    {
      title: "2. Produits",
      content: `Nos produits sont des articles de mode africaine incluant des robes, jupes, pantalons, accessoires, parfums et créations sur mesure. Chaque article est décrit avec le plus grand soin. Les photographies sont aussi fidèles que possible, mais de légères variations de couleur peuvent exister selon les écrans.`
    },
    {
      title: "3. Prix",
      content: `Les prix sont indiqués en Francs CFA (FCFA) toutes taxes comprises. Elegance Couture se réserve le droit de modifier ses prix à tout moment. Les produits sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.`
    },
    {
      title: "4. Commande",
      content: `La commande est considérée comme définitive après confirmation par email de la part d'Elegance Couture. Nous nous réservons le droit d'annuler toute commande en cas de stock insuffisant, d'anomalie de prix ou de suspicion de fraude.`
    },
    {
      title: "5. Paiement",
      content: `Le paiement est exigé lors de la commande. Nous acceptons les virements bancaires, le paiement mobile (Wave, Orange Money) et le paiement à la livraison dans la zone de Dakar. Toute transaction est sécurisée.`
    },
    {
      title: "6. Livraison",
      content: `Les délais de livraison varient selon la zone géographique. Pour plus de détails, veuillez consulter notre page Livraison. Elegance Couture ne saurait être tenue responsable des retards causés par des circonstances indépendantes de sa volonté (grèves, intempéries, etc.).`
    },
    {
      title: "7. Retours & Remboursements",
      content: `Les retours sont acceptés dans un délai de 14 jours à compter de la réception, sous réserve que les articles soient dans leur état d'origine. Pour les créations sur mesure, les retours ne sont pas acceptés sauf défaut manifeste. Consultez notre page Retours pour les détails.`
    },
    {
      title: "8. Propriété Intellectuelle",
      content: `L'ensemble du contenu du site (photos, textes, logos, designs) est la propriété exclusive d'Elegance Couture et est protégé par les lois en vigueur sur la propriété intellectuelle. Toute reproduction sans autorisation est strictement interdite.`
    },
    {
      title: "9. Protection des Données",
      content: `Les informations collectées lors de la commande sont utilisées uniquement pour le traitement de celle-ci et pour l'amélioration de nos services. Conformément à la loi, vous disposez d'un droit d'accès, de modification et de suppression de vos données personnelles.`
    },
    {
      title: "10. Droit Applicable",
      content: `Les présentes CGV sont soumises au droit sénégalais. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents de Dakar, Sénégal seront saisis.`
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#111111]">
      <Header />

      {/* Hero */}
      <section className="h-64 bg-[#0d0d0d] border-b border-[#2a2520] flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E]">Légal</span>
            <div className="h-px w-8 bg-[#C9A96E]" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-[#f5f0e8] font-bold tracking-wide">
            Conditions Générales de Vente
          </h1>
        </div>
      </section>

      <main className="flex-1 py-20">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* Last Updated */}
          <div className="flex items-center gap-3 mb-12 pb-6 border-b border-[#2a2520]">
            <div className="h-px w-8 bg-[#C9A96E]" />
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#9e9585]">
              Dernière mise à jour : Janvier 2025
            </p>
          </div>

          {/* Intro */}
          <p className="text-[#9e9585] text-sm leading-relaxed mb-12 tracking-wide">
            En accédant à notre boutique et en effectuant un achat, vous acceptez d'être lié(e) par les présentes
            Conditions Générales de Vente. Veuillez les lire attentivement avant de passer commande.
          </p>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((s, i) => (
              <div key={i} className="border-l-2 border-[#2a2520] pl-6 hover:border-l-[#C9A96E]/50 transition-colors duration-300">
                <h2 className="font-serif text-lg text-[#f5f0e8] font-bold mb-3 tracking-wide">{s.title}</h2>
                <p className="text-[12px] text-[#9e9585] leading-relaxed tracking-wide">{s.content}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-16 border border-[#2a2520] p-8 bg-[#0d0d0d]">
            <h3 className="font-serif text-lg text-[#f5f0e8] font-bold mb-3 tracking-wide">
              Des Questions ?
            </h3>
            <p className="text-[12px] text-[#9e9585] mb-5 tracking-wide">
              Pour toute question relative à ces conditions, contactez-nous :
            </p>
            <div className="flex flex-col gap-2">
              <a href="mailto:contact@elegancecouture.sn" className="text-[12px] text-[#C9A96E] hover:text-[#e8d5b0] transition-colors tracking-wide">
                contact@elegancecouture.sn
              </a>
              <a href="tel:+221778137032" className="text-[12px] text-[#C9A96E] hover:text-[#e8d5b0] transition-colors tracking-wide">
                +221 77 813 70 32
              </a>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}
