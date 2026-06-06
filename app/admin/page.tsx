"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { normalizeImageUrl, normalizeImageUrls } from "@/lib/image-utils";
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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Filter,
  Truck,
  CheckCircle,
  XCircle,
  Loader2,
  Navigation,
  PhoneCall,
  Search,
  Send,
  ShieldCheck,
  LayoutDashboard,
  Tags,
  Layers,
  Images,
  Home,
  Settings,
  KeyRound,
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
  gender?: string | null;
  collection?: string | null;
  subcategory?: string | null;
  featured?: boolean;
  bestSeller?: boolean;
  onSale?: boolean;
  discount?: number | null;
  sortOrder?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
  parentSlug?: string | null;
  active: boolean;
}

interface Collection {
  id: number;
  name: string;
  slug: string;
  gender: string;
  active: boolean;
}

interface SiteImage {
  id: number;
  title: string;
  key: string;
  url: string;
  section: string;
  active: boolean;
}

interface HomeSection {
  id: number;
  title: string;
  key: string;
  subtitle?: string | null;
  active: boolean;
}

interface SiteSetting {
  id: number;
  key: string;
  value: string;
  group: string;
  label?: string | null;
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

type Tab = "dashboard" | "products" | "categories" | "collections" | "images" | "home" | "orders" | "contacts" | "settings" | "security";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loginLoading, setLoginLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "femme",
    gender: "femme",
    collection: "",
    subcategory: "",
    featured: false,
    bestSeller: false,
    onSale: false,
    discount: "",
    sortOrder: "0",
    images: [] as string[],
    sizes: "",
    colors: "",
    inStock: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingSiteImage, setUploadingSiteImage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [orderCurrentPage, setOrderCurrentPage] = useState(1);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productImageUrl, setProductImageUrl] = useState("");
  const [quickForms, setQuickForms] = useState({
    categoryName: "",
    categoryType: "product",
    categoryParent: "",
    collectionName: "",
    collectionGender: "femme",
    imageTitle: "",
    imageKey: "",
    imageUrl: "",
    imageSection: "home",
    homeTitle: "",
    homeKey: "",
    homeSubtitle: "",
    settingKey: "",
    settingValue: "",
    settingGroup: "general",
  });
  const itemsPerPage = 10;
  const ordersPerPage = 6;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || "Identifiant ou mot de passe incorrect");
      }
      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      toast.success("Connexion réussie");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Identifiant ou mot de passe incorrect";
      toast.error(message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseInt(formData.discount) : null,
        sortOrder: parseInt(formData.sortOrder || "0"),
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
        const imageUrl = normalizeImageUrl(data.secure_url || data.url);
        if (!imageUrl) throw new Error("URL image manquante");
        uploadedUrls.push(imageUrl);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
      toast.success(`${uploadedUrls.length} image(s) ajoutée(s)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSiteImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingSiteImage(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", `elegance-couture/${quickForms.imageSection || "site"}`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || "Erreur upload");
      }

      const imageUrl = normalizeImageUrl(data?.secure_url || data?.url);
      if (!imageUrl) throw new Error("URL image manquante");

      setQuickForms((prev) => ({ ...prev, imageUrl }));
      toast.success("Image uploadée, vous pouvez la sauvegarder");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'upload");
    } finally {
      setUploadingSiteImage(false);
      e.target.value = "";
    }
  };

  const removeImage = (index: number) =>
    setFormData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  const addProductImageUrl = () => {
    const url = productImageUrl.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast.error("L'URL doit commencer par http:// ou https://");
      return;
    }
    const imageUrl = normalizeImageUrl(url);
    if (!imageUrl) {
      toast.error("URL image invalide");
      return;
    }
    setFormData((prev) => ({ ...prev, images: normalizeImageUrls([...prev.images, imageUrl]) }));
    setProductImageUrl("");
    toast.success("Image ajoutée par URL");
  };

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
      gender: product.gender || "femme",
      collection: product.collection || "",
      subcategory: product.subcategory || "",
      featured: product.featured || false,
      bestSeller: product.bestSeller || false,
      onSale: product.onSale || false,
      discount: product.discount?.toString() || "",
      sortOrder: product.sortOrder?.toString() || "0",
      images: product.images,
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      inStock: product.inStock,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "femme",
      gender: "femme",
      collection: "",
      subcategory: "",
      featured: false,
      bestSeller: false,
      onSale: false,
      discount: "",
      sortOrder: "0",
      images: [],
      sizes: "",
      colors: "",
      inStock: true,
    });
    setProductImageUrl("");
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

  const fetchAdminContent = async () => {
    const [catRes, colRes, imgRes, homeRes, settingsRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/collections"),
      fetch("/api/site-images"),
      fetch("/api/home-sections"),
      fetch("/api/site-settings"),
    ]);

    if (catRes.ok) setCategories(await catRes.json());
    if (colRes.ok) setCollections(await colRes.json());
    if (imgRes.ok) setSiteImages(await imgRes.json());
    if (homeRes.ok) setHomeSections(await homeRes.json());
    if (settingsRes.ok) setSettings(await settingsRes.json());
  };

  const saveAdminResource = async (endpoint: string, payload: Record<string, unknown>, successMessage: string) => {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Erreur de sauvegarde");
      }
      toast.success(successMessage);
      fetchAdminContent();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur de sauvegarde");
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

  const getOrderItems = (order: Order) => Array.isArray(order.items) ? order.items : [];

  const getOrderCustomerName = (order: Order) =>
    `${order.customerPrenom || ""} ${order.customerNom || ""}`.trim() || "Client";

  const getOrderLocationUrl = (order: Order) =>
    order.customerAdresse?.startsWith("http") ? order.customerAdresse : "";

  const getOrderLocationLabel = (order: Order) => {
    const locationUrl = getOrderLocationUrl(order);
    if (locationUrl) return "Position GPS fournie";
    return [order.customerVille, order.customerQuartier].filter(Boolean).join(", ") || "Localisation non fournie";
  };

  const getOrderItemLabel = (item: any) => {
    const product = item?.product || item;
    const name = product?.name || item?.name || `Produit #${product?.id || item?.productId || ""}`.trim();
    const quantity = item?.quantity || 1;
    const options = [item?.selectedSize || item?.size, item?.selectedColor || item?.color].filter(Boolean).join(" / ");
    return `${name}${options ? ` (${options})` : ""} x${quantity}`;
  };

  const buildDeliveryMessage = (order: Order) => {
    const locationUrl = getOrderLocationUrl(order);
    const orderItems = getOrderItems(order).map(getOrderItemLabel).join("\n");

    return [
      "Livraison - Elegance Couture Prestige",
      `Commande #${order.id}`,
      `Client: ${getOrderCustomerName(order)}`,
      `Téléphone: ${order.customerTelephone || "Non renseigné"}`,
      `Total: ${(order.totalFinal || 0).toLocaleString()} XOF`,
      locationUrl ? `Position: ${locationUrl}` : `Adresse: ${getOrderLocationLabel(order)}`,
      orderItems ? `Produits:\n${orderItems}` : "",
    ].filter(Boolean).join("\n");
  };

  const handleCopyOrderLocation = async (order: Order) => {
    const locationUrl = getOrderLocationUrl(order);
    if (!locationUrl) {
      toast.error("Aucune position GPS à copier");
      return;
    }

    try {
      await navigator.clipboard.writeText(locationUrl);
      toast.success("Position copiée");
    } catch {
      toast.error("Impossible de copier la position");
    }
  };

  const handleShareOrderLocation = (order: Order) => {
    const locationUrl = getOrderLocationUrl(order);
    if (!locationUrl) {
      toast.error("Aucune position GPS à partager");
      return;
    }

    window.open(`https://wa.me/?text=${encodeURIComponent(buildDeliveryMessage(order))}`, "_blank", "noopener,noreferrer");
  };

  const validateToken = async (t: string) => {
    try {
      const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) {
        localStorage.removeItem("adminToken");
        return;
      }
      setToken(t);
      setIsLoggedIn(true);
    } catch {
      localStorage.removeItem("adminToken");
    } finally {
      setLoading(false);
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
      fetchAdminContent();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setOrderCurrentPage(1);
  }, [orderSearch, orderStatusFilter]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    localStorage.removeItem("adminToken");
    setIsLoggedIn(false);
    setToken("");
    toast.success("Déconnecté");
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  const normalizedOrderSearch = orderSearch.trim().toLowerCase();
  const filteredOrders = orders.filter((order) => {
    const statusMatches = orderStatusFilter === "all" || order.status === orderStatusFilter;
    const searchableText = [
      order.id,
      getOrderCustomerName(order),
      order.customerTelephone,
      order.customerEmail,
      order.customerVille,
      order.customerQuartier,
      getOrderLocationUrl(order),
    ].filter(Boolean).join(" ").toLowerCase();

    return statusMatches && (!normalizedOrderSearch || searchableText.includes(normalizedOrderSearch));
  });
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));
  const orderStartIndex = (orderCurrentPage - 1) * ordersPerPage;
  const paginatedOrders = filteredOrders.slice(orderStartIndex, orderStartIndex + ordersPerPage);
  const visibleOrderPageStart = Math.max(1, Math.min(orderCurrentPage - 2, totalOrderPages - 4));
  const visibleOrderPages = Array.from(
    { length: Math.min(5, totalOrderPages) },
    (_, i) => visibleOrderPageStart + i
  );
  const inStockCount = products.filter((p) => p.inStock).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const navItems = [
    { id: "dashboard" as Tab, label: "Dashboard", icon: LayoutDashboard, count: 0 },
    { id: "products" as Tab, label: "Produits", icon: Package, count: products.length },
    { id: "categories" as Tab, label: "Catégories", icon: Tags, count: categories.length },
    { id: "collections" as Tab, label: "Collections", icon: Layers, count: collections.length },
    { id: "images" as Tab, label: "Images du site", icon: Images, count: siteImages.length },
    { id: "home" as Tab, label: "Accueil", icon: Home, count: homeSections.length },
    { id: "orders" as Tab, label: "Commandes", icon: ShoppingCart, count: orders.length },
    { id: "contacts" as Tab, label: "Messages", icon: MessageCircle, count: contacts.filter(c => !c.lu).length },
    { id: "settings" as Tab, label: "Réglages", icon: Settings, count: settings.length },
    { id: "security" as Tab, label: "Sécurité", icon: KeyRound, count: 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111827] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Loader2 className="h-6 w-6 animate-spin text-[#FF9D00]" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FF9D00]">Administration</p>
          <p className="mt-2 text-sm text-white/60">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  /* ─────────── LOGIN ─────────── */
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#111827] lg:flex">
        {/* Left decorative panel */}
        <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden flex-col items-center justify-center bg-[#0f172a]">
          {/* diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, #FF9D00 0, #FF9D00 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF9D00]/30 to-transparent" />
          <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#FF9D00]/30 to-transparent" />

          {/* Large decorative text */}
          <div className="absolute select-none pointer-events-none font-serif font-bold text-[#FF9D00]/[0.05] text-[12rem] leading-none">
            EC
          </div>

          <div className="relative z-10 text-center px-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-10 bg-[#FF9D00]/60" />
              <span className="text-[9px] tracking-[0.5em] uppercase text-[#FF9D00]/70">Administration</span>
              <div className="h-px w-10 bg-[#FF9D00]/60" />
            </div>
            <h1 className="font-serif text-5xl font-bold text-[#fff8ed] leading-tight mb-4">
              Elegance<br />
              <span className="text-[#FF9D00] italic font-normal">Couture</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto tracking-wide">
              Gérez le catalogue, les commandes et les messages depuis un espace sécurisé.
            </p>

            {/* Stats preview */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {[
                { label: "Session", value: "24h" },
                { label: "Accès", value: "Admin" },
              ].map((s, i) => (
                <div key={i} className="border border-white/10 bg-white/[0.03] p-4 text-center">
                  <div className="font-serif text-2xl font-bold text-[#FF9D00]">{s.value}</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-slate-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login form */}
        <div className="relative flex min-h-screen flex-1 flex-col items-center justify-start px-6 py-20 sm:justify-center sm:py-10">
          {/* Back link */}
          <div className="absolute top-6 left-6">
            <Link href="/" className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-slate-500 hover:text-[#FF9D00] transition-colors">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Retour
            </Link>
          </div>

          <div className="w-full max-w-md rounded-[8px] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/30 backdrop-blur">
            {/* Logo */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[8px] border border-[#FF9D00]/40 bg-[#FF9D00]/10 mb-6">
                <ShieldCheck className="w-6 h-6 text-[#FF9D00]" />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[#FF9D00] mb-2">Accès Sécurisé</p>
              <h2 className="font-serif text-3xl font-bold text-[#fff8ed]">Connexion Admin</h2>
              <p className="text-slate-400 text-xs mt-2 tracking-wide">Réservé aux administrateurs autorisés</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="admin-username" className="block mb-2 text-xs font-medium text-[#FF9D00]">Identifiant</label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Identifiant admin"
                  required
                  className="w-full rounded-[6px] bg-slate-950/60 border border-white/10 text-[#fff8ed] placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/20 transition-colors duration-200 mb-4"
                  autoComplete="username"
                />
                <label htmlFor="admin-password" className="block mb-2 text-xs font-medium text-[#FF9D00]">Mot de passe</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-[6px] bg-slate-950/60 border border-white/10 text-[#fff8ed] placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/20 transition-colors duration-200"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="brand-glow flex w-full items-center justify-center gap-3 rounded-[6px] bg-gradient-to-r from-[#FF9D00] to-[#FFCF71] py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#111827] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(255,157,0,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading ? "Connexion..." : "Connexion"}
                {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-[10px] tracking-wide text-slate-600 mt-8">
              Elegance Couture Prestige · Grand Dakar, Thiossane
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────── DASHBOARD ─────────── */
  return (
    <div className="min-h-screen flex bg-[#f6f7f9]">

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-[#111827] border-r border-slate-900">
        {/* Brand */}
        <div className="px-6 py-8 border-b border-[#1e1e1e]">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center border border-[#FF9D00]/40">
              <span className="font-serif text-sm font-bold text-[#FF9D00]">EC</span>
            </div>
            <div>
              <p className="text-[#fff8ed] text-sm font-semibold leading-none">Elegance Couture</p>
              <p className="text-[#7B542F] text-[10px] tracking-[0.15em] uppercase mt-0.5">Admin</p>
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
                  ? "bg-[#FF9D00]/10 border-l-2 border-[#FF9D00] text-[#FF9D00]"
                  : "text-[#7B542F] hover:text-[#fff8ed] hover:bg-white/5 border-l-2 border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-[11px] tracking-[0.15em] uppercase font-medium">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 ${
                  activeTab === item.id ? "bg-[#FF9D00]/20 text-[#FF9D00]" : "bg-[#1e1e1e] text-[#7B542F]"
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
            <span className="text-[#FF9D00] text-sm font-semibold">{inStockCount}</span>
          </div>
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[#3a3530]">Total produits</span>
            <span className="text-[#FF9D00] text-sm font-semibold">{products.length}</span>
          </div>
        </div>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-[#3a3530] hover:text-[#fff8ed] hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[11px] tracking-[0.15em] uppercase">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-white/95 backdrop-blur border-b border-border px-5 md:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-xl font-bold text-foreground capitalize">
              {{
                dashboard: "Tableau de bord",
                products: "Gestion des Produits",
                categories: "Catégories",
                collections: "Collections",
                images: "Images du site",
                home: "Page d'accueil",
                orders: "Commandes",
                contacts: "Messages",
                settings: "Réglages",
                security: "Sécurité",
              }[activeTab]}
            </h1>
            <p className="text-muted-foreground text-xs tracking-wide mt-0.5">
              {activeTab === "products" ? `${products.length} produits au total` : "Elegance Couture Prestige"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/boutique" target="_blank"
              className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-[#FF9D00] transition-colors">
              <Eye className="w-3.5 h-3.5" />
              Voir la boutique
            </Link>
            <div className="w-8 h-8 bg-[#FF9D00] flex items-center justify-center">
              <span className="font-serif text-white text-xs font-bold">AD</span>
            </div>
          </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto md:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] border px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  activeTab === item.id
                    ? "border-[#FF9D00] bg-[#FF9D00] text-white"
                    : "border-border bg-white text-muted-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">

          {activeTab === "dashboard" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Produits", value: products.length, icon: Package, color: "text-[#FF9D00]" },
                  { label: "Catégories", value: categories.length, icon: Tags, color: "text-[#B6771D]" },
                  { label: "Collections", value: collections.length, icon: Layers, color: "text-emerald-600" },
                  { label: "Images site", value: siteImages.length, icon: Images, color: "text-blue-600" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#FF9D00]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-70`} />
                    </div>
                    <p className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white border border-border p-6">
                  <h2 className="font-serif text-xl font-bold mb-2">Priorités admin</h2>
                  <p className="text-sm text-muted-foreground mb-5">Ce dashboard pilote maintenant le catalogue, les menus, l'accueil et les images de l'interface.</p>
                  {[
                    "Ajouter les catégories Femme, Homme, Enfant et Accessoires",
                    "Créer les collections couture visibles dans la navigation",
                    "Ajouter des images du site pour remplacer les visuels codés",
                    "Marquer les produits à afficher dans À la une",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 border-t border-border py-3 text-sm">
                      <Check className="h-4 w-4 text-[#FF9D00]" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-border p-6">
                  <h2 className="font-serif text-xl font-bold mb-5">Accès rapide</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {navItems.slice(1, 7).map((item) => (
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex items-center gap-3 border border-border p-4 text-left transition-colors hover:border-[#FF9D00] hover:bg-[#FF9D00]/5">
                        <item.icon className="h-4 w-4 text-[#FF9D00]" />
                        <span className="text-xs font-semibold uppercase tracking-[0.12em]">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── Stats Row ── */}
          {activeTab === "products" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Produits", value: products.length, icon: Package, color: "text-[#FF9D00]" },
                  { label: "En Stock", value: inStockCount, icon: TrendingUp, color: "text-emerald-600" },
                  { label: "Rupture", value: products.length - inStockCount, icon: X, color: "text-rose-500" },
                  { label: "Valeur Totale", value: `${totalValue.toLocaleString()}`, icon: ShoppingCart, sub: "XOF", color: "text-[#FF9D00]" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#FF9D00]/30 transition-colors">
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
                  <div className="w-1 h-5 bg-[#FF9D00]" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Catalogue</h2>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => { resetForm(); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#FF9D00] text-white text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-[#FFCF71] hover:text-[#241609] transition-all duration-300"
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
                          onChange={(e) => setFormData({ ...formData, category: e.target.value, gender: e.target.value === "accessoires" ? "accessoire" : e.target.value })}
                          className="w-full border border-input bg-background px-3 py-2 text-sm mt-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF9D00]"
                        >
                          {categories.filter((category) => !category.parentSlug).map((category) => (
                            <option key={category.slug} value={category.slug}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Public</Label>
                          <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm mt-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF9D00]">
                            <option value="femme">Femme</option>
                            <option value="homme">Homme</option>
                            <option value="enfant">Enfant</option>
                            <option value="accessoire">Accessoire</option>
                          </select>
                        </div>
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                            {formData.gender === "accessoire" ? "Sous-catégorie" : "Collection"}
                          </Label>
                          <select value={formData.collection} onChange={(e) => setFormData({ ...formData, collection: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm mt-1.5 focus:outline-none focus:ring-1 focus:ring-[#FF9D00]">
                            <option value="">Aucune</option>
                            {formData.gender === "accessoire"
                              ? categories.filter((category) => category.parentSlug === "accessoires").map((category) => (
                                  <option key={category.slug} value={category.slug}>{category.name}</option>
                                ))
                              : collections.filter((collection) => collection.gender === formData.gender).map((collection) => (
                                  <option key={collection.slug} value={collection.slug}>{collection.name}</option>
                                ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ordre</Label>
                          <Input type="number" value={formData.sortOrder} onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })} className="rounded-none mt-1.5" />
                        </div>
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
                        <div className="mt-1.5 flex gap-2">
                          <Input
                            type="url"
                            value={productImageUrl}
                            onChange={(e) => setProductImageUrl(e.target.value)}
                            placeholder="Coller une URL d'image https://..."
                            className="rounded-none"
                          />
                          <button
                            type="button"
                            onClick={addProductImageUrl}
                            className="shrink-0 bg-[#241609] px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#FF9D00] hover:text-[#241609]"
                          >
                            Ajouter URL
                          </button>
                        </div>
                        <div className="mt-1.5 border border-dashed border-border hover:border-[#FF9D00] transition-colors p-6 text-center cursor-pointer">
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
                                  className="absolute top-1 right-1 bg-[#120b06]/80 text-white p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 py-2">
                        <input type="checkbox" id="inStock" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="w-4 h-4 accent-[#FF9D00]" />
                        <label htmlFor="inStock" className="text-sm text-foreground cursor-pointer">Produit en stock</label>
                      </div>
                      <div className="grid grid-cols-3 gap-3 border border-border bg-muted/20 p-3">
                        {[
                          ["featured", "À la une"],
                          ["bestSeller", "Best seller"],
                          ["onSale", "Promotion"],
                        ].map(([key, label]) => (
                          <label key={key} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={Boolean(formData[key as "featured" | "bestSeller" | "onSale"])}
                              onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                              className="h-4 w-4 accent-[#FF9D00]"
                            />
                            {label}
                          </label>
                        ))}
                        <div className="col-span-3">
                          <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Réduction (%)</Label>
                          <Input type="number" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: e.target.value })} className="rounded-none mt-1.5" placeholder="40" />
                        </div>
                      </div>

                      <button type="submit" className="w-full py-3 bg-[#FF9D00] text-white text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-[#FFCF71] hover:text-[#241609] transition-all">
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
                            <span className="inline-block px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[#FF9D00]/10 text-[#FF9D00] rounded-md">
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
                                className="p-2.5 text-muted-foreground hover:text-[#FF9D00] hover:bg-[#FF9D00]/10 transition-all rounded-lg">
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
                        className="px-3 py-1.5 border border-border text-xs text-foreground hover:border-[#FF9D00] disabled:opacity-40 transition-colors">
                        Préc.
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 text-xs border transition-colors ${currentPage === p ? "border-[#FF9D00] bg-[#FF9D00] text-white" : "border-border text-foreground hover:border-[#FF9D00]"}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-border text-xs text-foreground hover:border-[#FF9D00] disabled:opacity-40 transition-colors">
                        Suiv.
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "categories" && (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <div className="bg-white border border-border p-6">
                <h2 className="font-serif text-xl font-bold mb-5">Nouvelle catégorie</h2>
                <div className="space-y-4">
                  <Input placeholder="Nom: Femme, Montres..." value={quickForms.categoryName} onChange={(e) => setQuickForms({ ...quickForms, categoryName: e.target.value })} />
                  <select value={quickForms.categoryType} onChange={(e) => setQuickForms({ ...quickForms, categoryType: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm">
                    <option value="product">Produit</option>
                    <option value="accessory">Accessoire</option>
                    <option value="page">Page</option>
                  </select>
                  <Input placeholder="Parent optionnel: femme, homme..." value={quickForms.categoryParent} onChange={(e) => setQuickForms({ ...quickForms, categoryParent: e.target.value })} />
                  <button onClick={() => saveAdminResource("/api/categories", { name: quickForms.categoryName, type: quickForms.categoryType, parentSlug: quickForms.categoryParent || null }, "Catégorie sauvegardée")} className="w-full bg-[#FF9D00] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">Sauvegarder</button>
                </div>
              </div>
              <div className="bg-white border border-border">
                <div className="border-b border-border px-5 py-4"><h2 className="font-serif text-lg font-semibold">Catégories en base</h2></div>
                <div className="divide-y divide-border">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.slug} · {category.type}{category.parentSlug ? ` · parent: ${category.parentSlug}` : ""}</p>
                      </div>
                      <span className={`text-xs ${category.active ? "text-emerald-600" : "text-rose-600"}`}>{category.active ? "Actif" : "Masqué"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "collections" && (
            <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
              <div className="bg-white border border-border p-6">
                <h2 className="font-serif text-xl font-bold mb-5">Nouvelle collection</h2>
                <div className="space-y-4">
                  <Input placeholder="Grand boubou, Super 100..." value={quickForms.collectionName} onChange={(e) => setQuickForms({ ...quickForms, collectionName: e.target.value })} />
                  <select value={quickForms.collectionGender} onChange={(e) => setQuickForms({ ...quickForms, collectionGender: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm">
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                    <option value="enfant">Enfant</option>
                  </select>
                  <button onClick={() => saveAdminResource("/api/collections", { name: quickForms.collectionName, gender: quickForms.collectionGender }, "Collection sauvegardée")} className="w-full bg-[#FF9D00] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">Sauvegarder</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {["femme", "homme", "enfant"].map((gender) => (
                  <div key={gender} className="bg-white border border-border p-5">
                    <h3 className="mb-4 font-serif text-lg font-bold capitalize">{gender}</h3>
                    <div className="space-y-3">
                      {collections.filter((c) => c.gender === gender).map((collection) => (
                        <div key={collection.id} className="border-t border-border pt-3">
                          <p className="text-sm font-semibold">{collection.name}</p>
                          <p className="text-xs text-muted-foreground">{collection.slug}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "images" && (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <div className="bg-white border border-border p-6">
                <h2 className="font-serif text-xl font-bold mb-5">Image d'interface</h2>
                <div className="space-y-4">
                  <Input placeholder="Titre" value={quickForms.imageTitle} onChange={(e) => setQuickForms({ ...quickForms, imageTitle: e.target.value })} />
                  <Input placeholder="Clé: hero, home-a-la-une..." value={quickForms.imageKey} onChange={(e) => setQuickForms({ ...quickForms, imageKey: e.target.value })} />
                  <Input placeholder="Section: home, collections..." value={quickForms.imageSection} onChange={(e) => setQuickForms({ ...quickForms, imageSection: e.target.value })} />
                  <div className="space-y-3 rounded-[6px] border border-dashed border-border p-4">
                    <Input placeholder="URL Cloudinary ou image" value={quickForms.imageUrl} onChange={(e) => setQuickForms({ ...quickForms, imageUrl: e.target.value })} />
                    <div className="flex items-center gap-3">
                      <input id="site-image-upload" type="file" accept="image/*" onChange={handleSiteImageUpload} disabled={uploadingSiteImage} className="hidden" />
                      <label htmlFor="site-image-upload" className="inline-flex cursor-pointer items-center gap-2 bg-[#241609] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#FF9D00] hover:text-[#241609]">
                        {uploadingSiteImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        {uploadingSiteImage ? "Upload..." : "Uploader"}
                      </label>
                      <span className="text-xs text-muted-foreground">ou collez une URL</span>
                    </div>
                    {quickForms.imageUrl && (
                      <div className="aspect-[4/3] overflow-hidden bg-muted">
                        <img src={quickForms.imageUrl} alt="Aperçu" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                  <button onClick={() => saveAdminResource("/api/site-images", { title: quickForms.imageTitle, key: quickForms.imageKey, url: quickForms.imageUrl, section: quickForms.imageSection }, "Image sauvegardée")} className="w-full bg-[#FF9D00] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">Sauvegarder</button>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {siteImages.map((image) => (
                  <div key={image.id} className="bg-white border border-border overflow-hidden">
                    <div className="aspect-[4/3] bg-muted"><img src={image.url} alt={image.title} className="h-full w-full object-cover" /></div>
                    <div className="p-4"><p className="font-semibold">{image.title}</p><p className="text-xs text-muted-foreground">{image.key} · {image.section}</p></div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "home" && (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <div className="bg-white border border-border p-6">
                <h2 className="font-serif text-xl font-bold mb-5">Section accueil</h2>
                <div className="space-y-4">
                  <Input placeholder="Titre" value={quickForms.homeTitle} onChange={(e) => setQuickForms({ ...quickForms, homeTitle: e.target.value })} />
                  <Input placeholder="Clé: hero-1, a-la-une..." value={quickForms.homeKey} onChange={(e) => setQuickForms({ ...quickForms, homeKey: e.target.value })} />
                  <Textarea placeholder="Sous-titre" value={quickForms.homeSubtitle} onChange={(e) => setQuickForms({ ...quickForms, homeSubtitle: e.target.value })} />
                  <button onClick={() => saveAdminResource("/api/home-sections", { title: quickForms.homeTitle, key: quickForms.homeKey, subtitle: quickForms.homeSubtitle }, "Section sauvegardée")} className="w-full bg-[#FF9D00] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">Sauvegarder</button>
                </div>
              </div>
              <div className="bg-white border border-border divide-y divide-border">
                {homeSections.map((section) => (
                  <div key={section.id} className="p-5"><p className="font-semibold">{section.title}</p><p className="text-xs text-muted-foreground">{section.key}</p><p className="mt-2 text-sm text-muted-foreground">{section.subtitle}</p></div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <div className="bg-white border border-border p-6">
                <h2 className="font-serif text-xl font-bold mb-5">Réglage boutique</h2>
                <div className="space-y-4">
                  <Input placeholder="Clé: phone, whatsapp, address..." value={quickForms.settingKey} onChange={(e) => setQuickForms({ ...quickForms, settingKey: e.target.value })} />
                  <Input placeholder="Groupe: contact, social, footer..." value={quickForms.settingGroup} onChange={(e) => setQuickForms({ ...quickForms, settingGroup: e.target.value })} />
                  <Textarea placeholder="Valeur" value={quickForms.settingValue} onChange={(e) => setQuickForms({ ...quickForms, settingValue: e.target.value })} />
                  <button onClick={() => saveAdminResource("/api/site-settings", { key: quickForms.settingKey, value: quickForms.settingValue, group: quickForms.settingGroup }, "Réglage sauvegardé")} className="w-full bg-[#FF9D00] py-3 text-xs font-bold uppercase tracking-[0.2em] text-white">Sauvegarder</button>
                </div>
              </div>
              <div className="bg-white border border-border divide-y divide-border">
                {settings.map((setting) => (
                  <div key={setting.id} className="p-5"><p className="font-semibold">{setting.key}</p><p className="text-xs text-muted-foreground">{setting.group}</p><p className="mt-2 text-sm">{setting.value}</p></div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-white border border-border p-6 max-w-2xl">
              <h2 className="font-serif text-xl font-bold mb-3">Sécurité admin</h2>
              <p className="text-sm text-muted-foreground mb-5">L'authentification utilise maintenant un JWT signé HS256. Les identifiants se règlent dans les variables d'environnement.</p>
              <div className="space-y-3 text-sm">
                <p><strong>Identifiant:</strong> <code>ADMIN_USERNAME</code></p>
                <p><strong>Mot de passe:</strong> <code>ADMIN_PASSWORD</code></p>
                <p><strong>Secret JWT:</strong> <code>JWT_SECRET</code></p>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Commandes", value: orders.length, icon: ShoppingCart, color: "text-[#FF9D00]" },
                  { label: "En Attente", value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: "text-amber-600" },
                  { label: "Confirmées", value: orders.filter(o => o.status === 'confirmed').length, icon: CheckCircle, color: "text-emerald-600" },
                  { label: "Livrées", value: orders.filter(o => o.status === 'delivered').length, icon: Truck, color: "text-blue-600" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#FF9D00]/30 transition-colors">
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
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-5 bg-[#FF9D00]" />
                      <div>
                        <h2 className="font-serif text-lg font-semibold text-foreground">Commandes</h2>
                        <p className="text-xs text-muted-foreground">
                          {filteredOrders.length} résultat(s) sur {orders.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        placeholder="Rechercher par numéro, téléphone, client ou localisation..."
                        className="h-10 pl-9"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="h-10 w-full rounded-[6px] border border-border bg-white pl-9 pr-3 text-sm focus:outline-none focus:border-[#FF9D00]"
                      >
                        <option value="all">Tous les statuts</option>
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmées</option>
                        <option value="shipped">Expédiées</option>
                        <option value="delivered">Livrées</option>
                        <option value="cancelled">Annulées</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {orders.length === 0 ? (
                  <div className="p-16 text-center">
                    <ShoppingCart className="w-10 h-10 mx-auto text-[#FF9D00]/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground text-sm tracking-wide">Les commandes apparaîtront ici dès qu'un client en passera une.</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-16 text-center">
                    <Search className="w-10 h-10 mx-auto text-[#FF9D00]/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucun résultat</h3>
                    <p className="text-muted-foreground text-sm tracking-wide">Essayez un autre téléphone, numéro de commande ou statut.</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border">
                      {paginatedOrders.map((order) => {
                        const orderItems = getOrderItems(order);
                        const locationUrl = getOrderLocationUrl(order);
                        const customerName = getOrderCustomerName(order);
                        const phoneHref = order.customerTelephone ? `tel:${order.customerTelephone.replace(/\s+/g, "")}` : "";

                        return (
                          <div key={order.id} className="p-5 hover:bg-muted/30 transition-colors">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-semibold text-foreground">#{order.id}</span>
                                  <StatusBadge status={order.status} />
                                </div>
                                <p className="text-sm text-foreground mb-1">
                                  <strong>{customerName}</strong>
                                </p>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {order.customerTelephone}{order.customerEmail ? ` • ${order.customerEmail}` : ""}
                                </p>
                                <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)]">
                                  <div className="rounded-[6px] border border-border bg-[#fffaf2] p-3">
                                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                      <Package className="h-3.5 w-3.5" />
                                      Articles
                                    </p>
                                    {orderItems.length > 0 ? (
                                      <div className="space-y-1.5">
                                        {orderItems.slice(0, 4).map((item: any, index: number) => (
                                          <p key={index} className="text-xs text-foreground">
                                            {getOrderItemLabel(item)}
                                          </p>
                                        ))}
                                        {orderItems.length > 4 && (
                                          <p className="text-xs font-medium text-[#B6771D]">+{orderItems.length - 4} autre(s) article(s)</p>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">Aucun détail produit enregistré.</p>
                                    )}
                                  </div>

                                  <div className="rounded-[6px] border border-border p-3">
                                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                      <Navigation className="h-3.5 w-3.5" />
                                      Livraison
                                    </p>
                                    {locationUrl ? (
                                      <a
                                        href={locationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-xs font-semibold text-[#B6771D] underline-offset-4 hover:underline"
                                      >
                                        Position Google Maps
                                        <ExternalLink className="h-3.5 w-3.5" />
                                      </a>
                                    ) : (
                                      <p className="text-xs text-muted-foreground">{getOrderLocationLabel(order)}</p>
                                    )}
                                    {order.customerInstructions && (
                                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{order.customerInstructions}</p>
                                    )}
                                  </div>
                                </div>

                                <p className="text-xs text-muted-foreground mt-3">
                                  {orderItems.length || 0} produit(s) • Total: {order.totalFinal?.toLocaleString() || 0} XOF
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                  })}
                                </p>
                              </div>

                              <div className="w-full space-y-3 xl:w-56">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                  className="h-10 w-full rounded-[6px] border border-border bg-white px-3 text-xs focus:outline-none focus:border-[#FF9D00]"
                                >
                                  <option value="pending">En attente</option>
                                  <option value="confirmed">Confirmée</option>
                                  <option value="shipped">Expédiée</option>
                                  <option value="delivered">Livrée</option>
                                  <option value="cancelled">Annulée</option>
                                </select>

                                <div className="grid grid-cols-2 gap-2 xl:grid-cols-1">
                                  {phoneHref && (
                                    <a
                                      href={phoneHref}
                                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-[#FF9D00] hover:text-[#B6771D]"
                                    >
                                      <PhoneCall className="h-3.5 w-3.5" />
                                      Appeler
                                    </a>
                                  )}
                                  {locationUrl ? (
                                    <>
                                      <a
                                        href={locationUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-[#FF9D00] hover:text-[#B6771D]"
                                      >
                                        <Navigation className="h-3.5 w-3.5" />
                                        Ouvrir
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyOrderLocation(order)}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-[#FF9D00] hover:text-[#B6771D]"
                                      >
                                        <Copy className="h-3.5 w-3.5" />
                                        Copier
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleShareOrderLocation(order)}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100"
                                      >
                                        <Send className="h-3.5 w-3.5" />
                                        Livreur
                                      </button>
                                    </>
                                  ) : (
                                    <span className="col-span-2 rounded-[6px] border border-dashed border-border px-3 py-2 text-center text-xs text-muted-foreground xl:col-span-1">
                                      Position absente
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        Affichage {orderStartIndex + 1}-{Math.min(orderStartIndex + ordersPerPage, filteredOrders.length)} sur {filteredOrders.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={orderCurrentPage === 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border text-xs disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#FF9D00]"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        {visibleOrderPages.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setOrderCurrentPage(page)}
                            className={`h-8 min-w-8 rounded-[6px] border px-2 text-xs transition-colors ${orderCurrentPage === page ? "border-[#FF9D00] bg-[#FF9D00] text-white" : "border-border text-foreground hover:border-[#FF9D00]"}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setOrderCurrentPage((p) => Math.min(totalOrderPages, p + 1))}
                          disabled={orderCurrentPage === totalOrderPages}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border text-xs disabled:cursor-not-allowed disabled:opacity-40 hover:border-[#FF9D00]"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </>
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
                  { label: "Total Messages", value: contacts.length, icon: MessageCircle, color: "text-[#FF9D00]" },
                  { label: "Non Lus", value: contacts.filter(c => !c.lu).length, icon: Eye, color: "text-amber-600" },
                  { label: "Lus", value: contacts.filter(c => c.lu).length, icon: Check, color: "text-emerald-600" },
                ].map((stat, i) => (
                  <div key={i} className="bg-white border border-border p-5 group hover:border-[#FF9D00]/30 transition-colors">
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
                  <div className="w-1 h-5 bg-[#FF9D00]" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Messages</h2>
                </div>
                
                {contacts.length === 0 ? (
                  <div className="p-16 text-center">
                    <MessageCircle className="w-10 h-10 mx-auto text-[#FF9D00]/40 mb-4" />
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
                            className="px-3 py-1.5 border border-[#FF9D00] text-[#FF9D00] text-xs hover:bg-[#FF9D00] hover:text-white transition-colors"
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
