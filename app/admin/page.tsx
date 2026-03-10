"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  ShoppingCart,
  MessageCircle,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Upload,
  Image as ImageIcon,
  X,
  TrendingUp,
  Eye,
  Lock,
  ArrowRight,
  ChevronRight,
  Check,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";

// Status badge helper
function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'En attente', className: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'Confirmée', className: 'bg-blue-100 text-blue-700' },
    shipped: { label: 'Expédiée', className: 'bg-purple-100 text-purple-700' },
    delivered: { label: 'Livrée', className: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'Annulée', className: 'bg-rose-100 text-rose-700' },
  };
  
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.className}`}>
      {status === 'pending' && <Clock className="w-3 h-3" />}
      {status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
      {status === 'shipped' && <Truck className="w-3 h-3" />}
      {status === 'delivered' && <Check className="w-3 h-3" />}
      {status === 'cancelled' && <XCircle className="w-3 h-3" />}
      {config.label}
    </span>
  );
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

interface Order {
  id: number;
  customerNom: string;
  customerPrenom: string;
  customerEmail: string;
  customerTelephone: string;
  customerAdresse: string;
  customerVille: string;
  customerQuartier: string;
  customerInstructions: string;
  items: any;
  total: number;
  fraisLivraison: number;
  totalFinal: number;
  paiement: string;
  status: string;
  createdAt: string;
}

interface Contact {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  sujet: string;
  message: string;
  lu: boolean;
  createdAt: string;
}

type Tab = "products" | "orders" | "contacts";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("products");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "robes",
    images: [] as string[],
    sizes: "",
    colors: "",
    inStock: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Invalid password");
      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      toast.success("Connexion réussie");
    } catch {
      toast.error("Mot de passe incorrect");
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        sizes: formData.sizes.split(",").map((s) => s.trim()),
        colors: formData.colors.split(",").map((c) => c.trim()),
      };
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error("Erreur");
      toast.success(editingId ? "Produit mis à jour" : "Produit ajouté");
      resetForm();
      setIsDialogOpen(false);
      fetchProducts();
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploadingImages(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const fd = new FormData();
        fd.append("file", files[i]);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: fd,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur upload");
        const data = await res.json();
        uploadedUrls.push(data.url);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} image(s) ajoutée(s)`);
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) =>
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Produit supprimé");
      fetchProducts();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      images: product.images,
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      inStock: product.inStock,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: "", description: "", price: "", category: "robes", images: [], sizes: "", colors: "", inStock: true });
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });
      if (!res.ok) throw new Error();
      toast.success("Statut mis à jour");
      fetchOrders();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const validateToken = async (t: string) => {
    try {
      const res = await fetch("/api/products", { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) { localStorage.removeItem("adminToken"); return; }
      setToken(t);
      setIsLoggedIn(true);
    } catch {
      localStorage.removeItem("adminToken");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) validateToken(saved);
    else setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchOrders();
      fetchContacts();
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setToken("");
    toast.success("Déconnecté");
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const inStockCount = products.filter((p) => p.inStock).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const navItems = [
    { id: "products" as Tab, label: "Produits", icon: Package, count: products.length },
    { id: "orders" as Tab, label: "Commandes", icon: ShoppingCart, count: orders.length },
    { id: "contacts" as Tab, label: "Messages", icon: MessageCircle, count: contacts.filter(c => !c.lu).length },
  ];

  /* ─────────── LOGIN ─────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex bg-[#0a0a0a]">
        {/* Left decorative panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center">
          {/* diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #C9A96E 0, #C9A96E 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/30 to-transparent" />
          <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#C9A96E]/30 to-transparent" />

          {/* Large decorative text */}
          <div className="absolute select-none pointer-events-none font-serif font-bold text-[#C9A96E]/[0.05] text-[12rem] leading-none">
            EC
          </div>

          <div className="relative z-10 text-center px-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-10 bg-[#C9A96E]/60" />
              <span className="text-[9px] tracking-[0.5em] uppercase text-[#C9A96E]/70">Administration</span>
              <div className="h-px w-10 bg-[#C9A96E]/60" />
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#f5f0e8] leading-tight mb-4">
              Elegance<br />
              <span className="text-[#C9A96E] italic font-normal">Couture</span>
            </h1>
            <p className="text-[#6b5c47] text-sm leading-relaxed max-w-xs mx-auto tracking-wide">
              Panneau d'administration réservé aux gestionnaires de la boutique Elegance Couture Prestige.
            </p>

            {/* Stats preview */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {[
                { label: "Produits", value: "8+" },
                { label: "Catégories", value: "6" },
              ].map((s, i) => (
                <div key={i} className="border border-[#2a2520] p-4 text-center">
                  <div className="font-serif text-2xl font-bold text-[#C9A96E]">{s.value}</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[#6b5c47] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 relative">
          {/* Back link */}
          <div className="absolute top-6 left-6">
            <Link href="/" className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[#6b5c47] hover:text-[#C9A96E] transition-colors">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Retour
            </Link>
          </div>

          <div className="w-full max-w-sm">
            {/* Logo */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border border-[#C9A96E]/40 mb-6">
                <Lock className="w-6 h-6 text-[#C9A96E]" />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#C9A96E] mb-2">Accès Sécurisé</p>
              <h2 className="font-serif text-3xl font-bold text-[#f5f0e8]">Connexion Admin</h2>
              <p className="text-[#6b5c47] text-xs mt-2 tracking-wide">Réservé aux administrateurs autorisés</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-[10px] tracking-[0.3em] uppercase text-[#9e9585] mb-3">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-transparent border border-[#2a2520] text-[#f5f0e8] placeholder-[#3a3530] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A96E] transition-colors duration-200"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 bg-[#C9A96E] text-white py-4 text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#e8d5b0] hover:text-[#1a1410] transition-all duration-300"
              >
                Accéder au Dashboard
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-center text-[10px] tracking-wide text-[#3a3530] mt-8">
              Elegance Couture Prestige · Grand Dakar, Thiossane
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────── DASHBOARD ─────────── */
  return (
    <div className="min-h-screen flex bg-[#f8f6f2]">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-60 flex-shrink-0 flex-col bg-[#0d0d0d] border-r border-[#1a1a1a]">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center border border-[#C9A96E]/40">
              <span className="font-serif text-sm font-bold text-[#C9A96E]">EC</span>
            </div>
            <div>
              <p className="text-[#f5f0e8] text-sm font-semibold leading-none">Elegance Couture</p>
              <p className="text-[#6b5c47] text-[10px] tracking-[0.15em] uppercase mt-0.5">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-[9px] tracking-[0.35em] uppercase text-[#3a3530] px-3 mb-4">Navigation</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-[#C9A96E]/10 border-l-2 border-[#C9A96E] text-[#C9A96E]"
                  : "text-[#6b5c47] hover:text-[#f5f0e8] hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-[11px] tracking-[0.15em] uppercase font-medium">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${
                  activeTab === item.id ? "bg-[#C9A96E]/20 text-[#C9A96E]" : "bg-[#1e1e1e] text-[#6b5c47]"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Stats bottom */}
        <div className="px-4 py-6 border-t border-[#1e1e1e] space-y-3">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">En stock</span>
            <span className="text-[#C9A96E] text-sm font-semibold">{inStockCount}</span>
          </div>
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">Total produits</span>
            <span className="text-[#C9A96E] text-sm font-semibold">{products.length}</span>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#3a3530] hover:text-[#f5f0e8] hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[11px] tracking-[0.15em] uppercase">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-white border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground capitalize">
              {activeTab === "products" ? "Gestion des Produits" : activeTab === "orders" ? "Commandes" : "Messages"}
            </h1>
            <p className="text-muted-foreground text-xs tracking-wide mt-0.5">
              {activeTab === "products" ? `${products.length} produits au total` : "Elegance Couture Prestige"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/boutique" target="_blank"
              className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-[#C9A96E] transition-colors">
              <Eye className="w-3.5 h-3.5" />
              Voir la boutique
            </Link>
            <div className="w-8 h-8 bg-[#C9A96E] flex items-center justify-center">
              <span className="font-serif text-white text-xs font-bold">AD</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">

          {/* ── Stats Row ── */}
          {activeTab === "products" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Produits", value: products.length, icon: Package, color: "text-[#C9A96E]" },
                  { label: "En Stock", value: inStockCount, icon: TrendingUp, color: "text-emerald-600" },
                  { label: "Rupture", value: products.length - inStockCount, icon: X, color: "text-rose-500" },
                  { label: "Valeur Totale", value: `${totalValue.toLocaleString()}`, icon: ShoppingCart, sub: "XOF", color: "text-[#C9A96E]" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#C9A96E]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <p className={`font-serif text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                      {stat.sub && <span className="text-xs font-normal text-muted-foreground ml-1">{stat.sub}</span>}
                    </p>
                  </div>
                ))}
              </div>

              {/* Products header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#C9A96E]" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Catalogue</h2>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => { resetForm(); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A96E] text-white text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#e8d5b0] hover:text-[#1a1410] transition-all duration-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Nouveau produit
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl rounded-none">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-xl font-bold">
                        {editingId ? "Modifier le produit" : "Ajouter un produit"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddProduct} className="space-y-4 mt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Nom</Label>
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required className="rounded-none mt-1.5"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Prix (XOF)</Label>
                          <Input
                            type="number" step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required className="rounded-none mt-1.5"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Catégorie</Label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full border border-input bg-background px-3 py-2 text-sm mt-1.5 focus:outline-none focus:ring-1 focus:ring-[#C9A96E]"
                        >
                          <option value="robes">Robes</option>
                          <option value="jupes">Jupes</option>
                          <option value="pantalons">Pantalons</option>
                          <option value="parfums">Parfums</option>
                          <option value="accessoires">Accessoires</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Description</Label>
                        <Textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          required className="rounded-none mt-1.5 resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Tailles (virgules)</Label>
                          <Input value={formData.sizes} onChange={(e) => setFormData({ ...formData, sizes: e.target.value })} placeholder="XS, S, M, L, XL" className="rounded-none mt-1.5" />
                        </div>
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Couleurs (virgules)</Label>
                          <Input value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} placeholder="Noir, Bleu, Or" className="rounded-none mt-1.5" />
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Images</Label>
                        <div className="mt-1.5 border border-dashed border-border hover:border-[#C9A96E] transition-colors p-6 text-center cursor-pointer">
                          <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploadingImages} className="hidden" id="image-input" />
                          <label htmlFor="image-input" className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {uploadingImages ? "Upload en cours..." : "Cliquer pour ajouter des images"}
                            </span>
                          </label>
                        </div>
                        {formData.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-4 gap-2">
                            {formData.images.map((img, idx) => (
                              <div key={idx} className="relative group aspect-square">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(idx)}
                                  className="absolute top-1 right-1 bg-[#0d0d0d]/80 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 py-2">
                        <input type="checkbox" id="inStock" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4 accent-[#C9A96E]" />
                        <label htmlFor="inStock" className="text-sm text-foreground cursor-pointer">Produit en stock</label>
                      </div>

                      <button type="submit" className="w-full py-3 bg-[#C9A96E] text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#e8d5b0] hover:text-[#1a1410] transition-all">
                        {editingId ? "Mettre à jour" : "Ajouter le produit"}
                      </button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Table */}
              <div className="bg-white border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Produit</th>
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium hidden sm:table-cell">Catégorie</th>
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Prix</th>
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium hidden md:table-cell">Stock</th>
                        <th className="px-5 py-4 text-right text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((product, idx) => (
                        <tr key={product.id} className={`border-b border-border hover:bg-muted/30 transition-colors ${idx % 2 === 0 ? "" : "bg-muted/10"}`}>
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 bg-muted shrink-0 overflow-hidden rounded-lg shadow-sm">
                                {product.images?.[0] ? (
                                  <img src={product.images[0]?.replace('http://', 'https://')} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2 max-w-[200px] mt-1">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 hidden sm:table-cell">
                            <span className="inline-block px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#C9A96E]/10 text-[#C9A96E] rounded-md">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-5 py-5">
                            <span className="text-base font-bold text-foreground">{product.price.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground ml-1">XOF</span>
                          </td>
                          <td className="px-5 py-5 hidden md:table-cell">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                              <span className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                              {product.inStock ? "En stock" : "Rupture"}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEditProduct(product)}
                                className="p-2.5 text-muted-foreground hover:text-[#C9A96E] hover:bg-[#C9A96E]/10 transition-all rounded-lg">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)}
                                className="p-2.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 transition-all rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-border px-5 py-3.5 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {startIndex + 1}–{Math.min(startIndex + itemsPerPage, products.length)} sur {products.length}
                    </p>
                    <div className="flex gap-1">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-border text-xs text-foreground hover:border-[#C9A96E] disabled:opacity-40 transition-colors">
                        Préc.
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 text-xs border transition-colors ${currentPage === p ? "border-[#C9A96E] bg-[#C9A96E] text-white" : "border-border text-foreground hover:border-[#C9A96E]"}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-border text-xs text-foreground hover:border-[#C9A96E] disabled:opacity-40 transition-colors">
                        Suiv.
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Commandes", value: orders.length, icon: ShoppingCart, color: "text-[#C9A96E]" },
                  { label: "En Attente", value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: "text-amber-600" },
                  { label: "Confirmées", value: orders.filter(o => o.status === 'confirmed').length, icon: CheckCircle, color: "text-emerald-600" },
                  { label: "Livrées", value: orders.filter(o => o.status === 'delivered').length, icon: Truck, color: "text-blue-600" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#C9A96E]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <p className={`font-serif text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Orders List */}
              <div className="bg-white border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#C9A96E]" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Commandes</h2>
                </div>
                
                {orders.length === 0 ? (
                  <div className="p-16 text-center">
                    <ShoppingCart className="w-10 h-10 mx-auto text-[#C9A96E]/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground text-sm tracking-wide">Les commandes apparaîtront ici dès qu'un client en passera une.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {orders.map((order) => (
                      <div key={order.id} className="p-5 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-foreground">#{order.id}</span>
                              <StatusBadge status={order.status} />
                            </div>
                            <p className="text-sm text-foreground mb-1">
                              <strong>{order.customerPrenom} {order.customerNom}</strong>
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">{order.customerTelephone} • {order.customerEmail}</p>
                            <p className="text-xs text-muted-foreground">{order.customerVille}, {order.customerQuartier}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {order.items?.length || 0} produit(s) • Total: {order.totalFinal?.toLocaleString() || 0} XOF
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          
                          {/* Status Update */}
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="text-xs border border-border rounded px-2 py-1 bg-white focus:outline-none focus:border-[#C9A96E]"
                          >
                            <option value="pending">En attente</option>
                            <option value="confirmed">Confirmée</option>
                            <option value="shipped">Expédiée</option>
                            <option value="delivered">Livrée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Contacts */}
          {activeTab === "contacts" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Messages", value: contacts.length, icon: MessageCircle, color: "text-[#C9A96E]" },
                  { label: "Non Lus", value: contacts.filter(c => !c.lu).length, icon: Eye, color: "text-amber-600" },
                  { label: "Lus", value: contacts.filter(c => c.lu).length, icon: Check, color: "text-emerald-600" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#C9A96E]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <p className={`font-serif text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Contacts List */}
              <div className="bg-white border border-border">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-1 h-5 bg-[#C9A96E]" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Messages</h2>
                </div>
                
                {contacts.length === 0 ? (
                  <div className="p-16 text-center">
                    <MessageCircle className="w-10 h-10 mx-auto text-[#C9A96E]/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucun message</h3>
                    <p className="text-muted-foreground text-sm tracking-wide">Les messages de contact apparaîtront ici.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {contacts.map((contact) => (
                      <div key={contact.id} className={`p-5 hover:bg-muted/30 transition-colors ${!contact.lu ? 'bg-blue-50/50' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-foreground">{contact.nom}</span>
                              {!contact.lu && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">Nouveau</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{contact.email} • {contact.telephone}</p>
                            <p className="text-sm text-foreground mb-2"><strong>{contact.sujet}</strong></p>
                            <p className="text-sm text-muted-foreground line-clamp-2">{contact.message}</p>
                            <p className="text-[10px] text-muted-foreground mt-2">
                              {new Date(contact.createdAt).toLocaleDateString('fr-FR', { 
                                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          
                          <a
                            href={`mailto:${contact.email}?subject=Re: ${contact.sujet}`}
                            className="px-3 py-1.5 border border-[#C9A96E] text-[#C9A96E] text-xs hover:bg-[#C9A96E] hover:text-white transition-colors"
                          >
                            Répondre
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </main>
      </div>
    </div>
  );
}
