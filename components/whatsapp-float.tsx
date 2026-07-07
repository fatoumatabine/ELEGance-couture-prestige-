import { MessageCircle } from "lucide-react"

export function WhatsappFloat() {
  return (
    <a
      href="https://wa.me/221778137032"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Rejoindre Elegance Couture sur WhatsApp"
      className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_rgba(37,211,102,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#20bd5a] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 md:bottom-[max(1.75rem,env(safe-area-inset-bottom))] md:right-[max(1.75rem,env(safe-area-inset-right))] md:h-16 md:w-16"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping" />
      <MessageCircle className="relative h-7 w-7 md:h-8 md:w-8" />
    </a>
  )
}
