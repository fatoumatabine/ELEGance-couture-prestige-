"use client";

import type { CSSProperties } from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { normalizeImageUrl, normalizeImageUrls } from "@/lib/image-utils";
import { getPaymentMethodLabel, isManualMobilePayment, PAYMENT_SETTING_KEYS } from "@/lib/payments";
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
  LayoutGrid,
  List,
  Tags,
  Layers,
  Images,
  Home,
  Settings,
  KeyRound,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";

// Status badge helper
function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: 'En attente', className: 'border border-[var(--admin-accent)]/35 bg-[var(--admin-accent)]/15 text-[var(--admin-text)]' },
    confirmed: { label: 'Confirmée', className: 'border border-[var(--admin-accent)]/35 bg-[var(--admin-accent)]/15 text-[var(--admin-text)]' },
    shipped: { label: 'Expédiée', className: 'border border-[var(--admin-accent)]/35 bg-[var(--admin-bg)] text-[var(--admin-text)]' },
    delivered: { label: 'Livrée', className: 'border border-[var(--admin-accent)]/45 bg-[var(--admin-accent)]/20 text-[var(--admin-text)]' },
    cancelled: { label: 'Annulée', className: 'border border-[var(--admin-text)]/20 bg-[var(--admin-text)]/10 text-[var(--admin-text)]' },
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
type ProductView = "table" | "cards";
type AdminTheme = "light" | "dark";
type ProductOptionKind = "clothing" | "shoe" | "fabric" | "fragrance" | "accessory";

interface ProductOptionProfile {
  kind: ProductOptionKind;
  title: string;
  summary: string;
  priceLabel: string;
  priceHint: string;
  optionLabel: string;
  optionPlaceholder: string;
  optionHint: string;
  colorLabel: string;
  colorPlaceholder: string;
  presetLabel: string;
  presetValues: string;
}

const productOptionProfiles: Record<ProductOptionKind, ProductOptionProfile> = {
  clothing: {
    kind: "clothing",
    title: "Article textile",
    summary: "Tailles classiques et couleurs disponibles pour les vêtements.",
    priceLabel: "Prix (XOF)",
    priceHint: "Prix de vente d'une pièce.",
    optionLabel: "Tailles disponibles",
    optionPlaceholder: "XS, S, M, L, XL",
    optionHint: "Séparez les tailles avec des virgules.",
    colorLabel: "Couleurs",
    colorPlaceholder: "Noir, Bleu, Or",
    presetLabel: "Tailles standard",
    presetValues: "XS, S, M, L, XL, XXL",
  },
  shoe: {
    kind: "shoe",
    title: "Chaussure",
    summary: "Les options deviennent des pointures pour faciliter la vente des chaussures.",
    priceLabel: "Prix (XOF)",
    priceHint: "Prix de vente d'une paire.",
    optionLabel: "Pointures disponibles",
    optionPlaceholder: "36, 37, 38, 39, 40, 41, 42",
    optionHint: "Ajoutez toutes les pointures disponibles, séparées par des virgules.",
    colorLabel: "Couleurs",
    colorPlaceholder: "Noir, Marron, Doré",
    presetLabel: "Pointures courantes",
    presetValues: "36, 37, 38, 39, 40, 41, 42, 43, 44, 45",
  },
  fabric: {
    kind: "fabric",
    title: "Tissu au mètre",
    summary: "Le prix est pensé au mètre; la quantité choisie représentera le nombre de mètres.",
    priceLabel: "Prix par mètre (XOF)",
    priceHint: "Exemple: 2500 signifie 2 500 XOF pour 1 mètre.",
    optionLabel: "Longueurs proposées",
    optionPlaceholder: "1 m, 2 m, 3 m, 5 m, 10 m",
    optionHint: "Vous pouvez laisser vide si le client choisit librement la quantité en mètres.",
    colorLabel: "Couleurs / motifs",
    colorPlaceholder: "Wax bleu, Bazin blanc, Brodé or",
    presetLabel: "Longueurs au mètre",
    presetValues: "1 m, 2 m, 3 m, 5 m, 10 m",
  },
  fragrance: {
    kind: "fragrance",
    title: "Parfum ou beauté",
    summary: "Les options peuvent représenter les contenances ou formats disponibles.",
    priceLabel: "Prix (XOF)",
    priceHint: "Prix de vente d'un flacon ou format.",
    optionLabel: "Contenances / formats",
    optionPlaceholder: "30 ml, 50 ml, 100 ml",
    optionHint: "Ajoutez les contenances disponibles, séparées par des virgules.",
    colorLabel: "Notes / variantes",
    colorPlaceholder: "Oud, Ambre, Musc",
    presetLabel: "Contenances",
    presetValues: "30 ml, 50 ml, 100 ml",
  },
  accessory: {
    kind: "accessory",
    title: "Accessoire",
    summary: "Options libres pour les dimensions, tailles uniques ou variantes.",
    priceLabel: "Prix (XOF)",
    priceHint: "Prix de vente d'un article.",
    optionLabel: "Options / dimensions",
    optionPlaceholder: "Taille unique, 90 cm, Petit, Grand",
    optionHint: "Utilisez ce champ seulement si l'accessoire a plusieurs formats.",
    colorLabel: "Couleurs / finitions",
    colorPlaceholder: "Noir, Doré, Argenté",
    presetLabel: "Options simples",
    presetValues: "Taille unique",
  },
};

const normalizeSearchValue = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const hasAnyKeyword = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword));

const getProductOptionProfile = (values: Array<string | null | undefined>) => {
  const searchable = normalizeSearchValue(values.filter(Boolean).join(" "));

  if (hasAnyKeyword(searchable, ["chauss", "shoe", "sneaker", "basket", "sandale", "mule", "babouche"])) {
    return productOptionProfiles.shoe;
  }

  if (hasAnyKeyword(searchable, ["tissu", "pagne", "wax", "bazin", "metre", "meter", "dentelle", "brode", "soie", "voile"])) {
    return productOptionProfiles.fabric;
  }

  if (hasAnyKeyword(searchable, ["parfum", "fragrance", "oud", "musc", "ambre"])) {
    return productOptionProfiles.fragrance;
  }

  if (hasAnyKeyword(searchable, ["accessoire", "accessory", "sac", "bijou", "montre", "ceinture"])) {
    return productOptionProfiles.accessory;
  }

  return productOptionProfiles.clothing;
};

const splitCommaList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getSettingValue = (settings: SiteSetting[], key: string) =>
  settings.find((setting) => setting.key === key)?.value || "";

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
  const [productView, setProductView] = useState<ProductView>("cards");
  const [adminTheme, setAdminTheme] = useState<AdminTheme>("light");
  const [adminThemeLoaded, setAdminThemeLoaded] = useState(false);
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
  const [paymentSettingsForm, setPaymentSettingsForm] = useState({
    waveMerchantCode: "",
    waveNumber: "",
    orangeMerchantCode: "",
    orangeNumber: "",
  });
  const itemsPerPage = 10;
  const ordersPerPage = 6;
  const adminStyle = {
    "--admin-bg": adminTheme === "dark" ? "#222222" : "#FAF3E1",
    "--admin-panel": adminTheme === "dark" ? "#2C2C2C" : "#FFFFFF",
    "--admin-soft": adminTheme === "dark" ? "#F5E7C6" : "#F5E7C6",
    "--admin-accent": "#FA8112",
    "--admin-text": adminTheme === "dark" ? "#FAF3E1" : "#222222",
    "--admin-muted": adminTheme === "dark" ? "rgba(245, 231, 198, 0.14)" : "rgba(34, 34, 34, 0.06)",
    "--admin-border": adminTheme === "dark" ? "rgba(245, 231, 198, 0.24)" : "rgba(34, 34, 34, 0.16)",
    "--admin-input": adminTheme === "dark" ? "rgba(245, 231, 198, 0.32)" : "rgba(34, 34, 34, 0.20)",
    "--admin-accent-rgb": "250, 129, 18",
    "--admin-text-rgb": adminTheme === "dark" ? "250, 243, 225" : "34, 34, 34",
  } as CSSProperties;

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
      const price = Number(formData.price);
      if (!Number.isFinite(price) || price <= 0) {
        toast.error("Veuillez saisir un prix valide");
        return;
      }

      const productData = {
        ...formData,
        price: Math.round(price),
        discount: formData.discount ? parseInt(formData.discount) : null,
        sortOrder: parseInt(formData.sortOrder || "0"),
        sizes: splitCommaList(formData.sizes),
        colors: splitCommaList(formData.colors),
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

  const handleSavePaymentSettings = async () => {
    const paymentSettings = [
      {
        key: PAYMENT_SETTING_KEYS.waveMerchantCode,
        value: paymentSettingsForm.waveMerchantCode,
        group: "payment",
        label: "Code marchand Wave",
      },
      {
        key: PAYMENT_SETTING_KEYS.waveNumber,
        value: paymentSettingsForm.waveNumber,
        group: "payment",
        label: "Numéro Wave",
      },
      {
        key: PAYMENT_SETTING_KEYS.orangeMerchantCode,
        value: paymentSettingsForm.orangeMerchantCode,
        group: "payment",
        label: "Code marchand Orange Money",
      },
      {
        key: PAYMENT_SETTING_KEYS.orangeNumber,
        value: paymentSettingsForm.orangeNumber,
        group: "payment",
        label: "Numéro Orange Money",
      },
    ];

    try {
      const responses = await Promise.all(
        paymentSettings.map((setting) =>
          fetch("/api/site-settings", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(setting),
          })
        )
      );

      const failed = responses.find((res) => !res.ok);
      if (failed) {
        const data = await failed.json().catch(() => null);
        throw new Error(data?.error || "Erreur de sauvegarde paiement");
      }

      toast.success("Réglages paiement sauvegardés");
      fetchAdminContent();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur de sauvegarde paiement");
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

  const getOrderPaymentLines = (order: Order) =>
    (order.customerInstructions || "")
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => /paiement|référence|reference|transaction|wave|orange|om/i.test(line));

  const buildDeliveryMessage = (order: Order) => {
    const locationUrl = getOrderLocationUrl(order);
    const orderItems = getOrderItems(order).map(getOrderItemLabel).join("\n");

    return [
      "Livraison - Elegance Couture Prestige",
      `Commande #${order.id}`,
      `Client: ${getOrderCustomerName(order)}`,
      `Téléphone: ${order.customerTelephone || "Non renseigné"}`,
      `Total: ${(order.totalFinal || 0).toLocaleString()} XOF`,
      `Paiement: ${getPaymentMethodLabel(order.paiement)}`,
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
    const savedTheme = localStorage.getItem("adminTheme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setAdminTheme(savedTheme);
    }
    setAdminThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!adminThemeLoaded) return;
    localStorage.setItem("adminTheme", adminTheme);
  }, [adminTheme, adminThemeLoaded]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
      fetchOrders();
      fetchContacts();
      fetchAdminContent();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setPaymentSettingsForm({
      waveMerchantCode: getSettingValue(settings, PAYMENT_SETTING_KEYS.waveMerchantCode),
      waveNumber: getSettingValue(settings, PAYMENT_SETTING_KEYS.waveNumber),
      orangeMerchantCode: getSettingValue(settings, PAYMENT_SETTING_KEYS.orangeMerchantCode),
      orangeNumber: getSettingValue(settings, PAYMENT_SETTING_KEYS.orangeNumber),
    });
  }, [settings]);

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
      order.customerInstructions,
      order.paiement,
      getPaymentMethodLabel(order.paiement),
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
  const rootCategoryCount = categories.filter((category) => !category.parentSlug).length;
  const childCategoryCount = categories.filter((category) => category.parentSlug).length;
  const imageSectionCount = new Set(siteImages.map((image) => image.section).filter(Boolean)).size;
  const settingsGroupCount = new Set(settings.map((setting) => setting.group).filter(Boolean)).size;

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

  const tabMeta: Record<Tab, { title: string; description: string; eyebrow: string; metric: string }> = {
    dashboard: {
      title: "Tableau de bord",
      description: "Vue rapide sur l'activité de la boutique, les priorités et les accès fréquents.",
      eyebrow: "Pilotage",
      metric: `${products.length} produits`,
    },
    products: {
      title: "Gestion des produits",
      description: "Ajoutez, corrigez et organisez les articles visibles dans la boutique.",
      eyebrow: "Catalogue",
      metric: `${products.length} produits`,
    },
    categories: {
      title: "Catégories",
      description: "Structurez les familles de produits et les sous-rubriques de navigation.",
      eyebrow: "Navigation",
      metric: `${categories.length} catégories`,
    },
    collections: {
      title: "Collections",
      description: "Classez les pièces par univers Femme, Homme et Enfant pour une boutique plus lisible.",
      eyebrow: "Merchandising",
      metric: `${collections.length} collections`,
    },
    images: {
      title: "Images du site",
      description: "Centralisez les visuels de l'accueil, des collections et des zones éditoriales.",
      eyebrow: "Médias",
      metric: `${siteImages.length} images`,
    },
    home: {
      title: "Page d'accueil",
      description: "Préparez les blocs de contenu qui composent la première impression de la boutique.",
      eyebrow: "Accueil",
      metric: `${homeSections.length} sections`,
    },
    orders: {
      title: "Commandes",
      description: "Suivez les commandes, statuts, articles et informations de livraison.",
      eyebrow: "Ventes",
      metric: `${orders.length} commandes`,
    },
    contacts: {
      title: "Messages",
      description: "Retrouvez les demandes clients, leurs coordonnées et les réponses à traiter.",
      eyebrow: "Relation client",
      metric: `${contacts.filter(c => !c.lu).length} non lus`,
    },
    settings: {
      title: "Réglages",
      description: "Gérez les informations réutilisées dans la boutique: contact, footer, réseaux et textes.",
      eyebrow: "Configuration",
      metric: `${settings.length} réglages`,
    },
    security: {
      title: "Sécurité",
      description: "Consultez les variables nécessaires pour protéger l'accès administrateur.",
      eyebrow: "Accès admin",
      metric: "Session 24h",
    },
  };
  const activeMeta = tabMeta[activeTab];
  const ActiveTabIcon = navItems.find((item) => item.id === activeTab)?.icon || LayoutDashboard;
  const activeCategories = categories.filter((category) => category.active);
  const rootCategoryOptions = activeCategories.filter((category) => !category.parentSlug);
  const childCategoryOptions = activeCategories.filter((category) => category.parentSlug);
  const selectedCategorySlug =
    formData.category === "accessoires" &&
    formData.collection &&
    childCategoryOptions.some((category) => category.slug === formData.collection)
      ? formData.collection
      : formData.category;
  const getCategoryName = (slug?: string | null) => {
    if (!slug) return "";
    return categories.find((category) => category.slug === slug)?.name || slug;
  };
  const accessoryCategoryOptions = categories.filter((category) => category.parentSlug === "accessoires");
  const selectedProductCategory = categories.find((category) => category.slug === selectedCategorySlug);
  const selectedCollectionLabel =
    categories.find((category) => category.slug === formData.collection)?.name ||
    collections.find((collection) => collection.slug === formData.collection)?.name ||
    formData.collection;
  const productOptionProfile = getProductOptionProfile([
    formData.category,
    formData.gender,
    formData.collection,
    formData.subcategory,
    selectedCategorySlug,
    selectedProductCategory?.name,
    selectedCollectionLabel,
  ]);
  const handleProductCategoryChange = (slug: string) => {
    const selectedCategory = categories.find((category) => category.slug === slug);

    if (selectedCategory?.parentSlug === "accessoires") {
      setFormData({
        ...formData,
        category: "accessoires",
        gender: "accessoire",
        collection: selectedCategory.slug,
        subcategory: selectedCategory.slug,
      });
      return;
    }

    const isAccessory = selectedCategory?.slug === "accessoires" || selectedCategory?.type === "accessory";
    setFormData({
      ...formData,
      category: slug,
      gender: isAccessory ? "accessoire" : slug,
      collection: isAccessory ? formData.collection : "",
      subcategory: "",
    });
  };
  const handleProductCollectionChange = (value: string) => {
    setFormData({
      ...formData,
      category: formData.gender === "accessoire" ? "accessoires" : formData.category,
      collection: value,
      subcategory: formData.gender === "accessoire" ? value : "",
    });
  };
  const getProductCategoryLabel = (product: Product) => {
    const accessorySubcategory = product.collection
      ? categories.find((category) => category.slug === product.collection && category.parentSlug === "accessoires")
      : null;
    return accessorySubcategory?.name || getCategoryName(product.category);
  };

  if (loading) {
    return (
      <div
        className="admin-dashboard-theme min-h-screen flex items-center justify-center bg-[var(--admin-bg)] text-[var(--admin-text)]"
        data-admin-theme={adminTheme}
        style={adminStyle}
      >
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--admin-accent)]" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[var(--admin-accent)]">Administration</p>
          <p className="mt-2 text-sm text-[var(--admin-text)]">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  /* ─────────── LOGIN ─────────── */
  if (!isLoggedIn) {
    return (
      <div
        className="admin-dashboard-theme min-h-dvh bg-[var(--admin-bg)] xl:flex"
        data-admin-theme={adminTheme}
        style={adminStyle}
      >
        {/* Left decorative panel */}
        <div className="relative hidden overflow-hidden bg-[var(--admin-soft)] xl:flex xl:w-[44%] xl:flex-col xl:items-center xl:justify-center">
          {/* diagonal pattern */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg, var(--admin-accent) 0, var(--admin-accent) 1px, transparent 0, transparent 50%)",
              backgroundSize: "30px 30px",
            }}
          />
          <div className="absolute left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--admin-accent)]/30 to-transparent" />
          <div className="absolute right-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--admin-accent)]/30 to-transparent" />

          {/* Large decorative text */}
          <div className="absolute select-none pointer-events-none font-serif font-bold text-[var(--admin-accent)]/[0.05] text-[12rem] leading-none">
            EC
          </div>

          <div className="relative z-10 text-center px-12">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-10 bg-[var(--admin-accent)]/60" />
              <span className="text-[9px] tracking-[0.5em] uppercase text-[var(--admin-accent)]/70">Administration</span>
              <div className="h-px w-10 bg-[var(--admin-accent)]/60" />
            </div>
            <h1 className="font-serif text-5xl font-bold text-[var(--admin-bg)] leading-tight mb-4">
              <span className="text-[var(--admin-bg)]">Elegance</span><br />
              <span className="text-[var(--admin-accent)] italic font-normal">Couture</span>
            </h1>
            <p className="text-[var(--admin-bg)] text-sm leading-relaxed max-w-xs mx-auto tracking-wide">
              Gérez le catalogue, les commandes et les messages depuis un espace sécurisé.
            </p>

            {/* Stats preview */}
            <div className="mt-12 grid grid-cols-2 gap-4 max-w-xs mx-auto">
              {[
                { label: "Session", value: "24h" },
                { label: "Accès", value: "Admin" },
              ].map((s, i) => (
                <div key={i} className="border border-[var(--admin-accent)]/35 bg-[var(--admin-bg)]/90 p-4 text-center shadow-sm">
                  <div className="font-serif text-2xl font-bold text-[var(--admin-accent)]">{s.value}</div>
                  <div className="text-[10px] tracking-[0.2em] uppercase text-[var(--admin-text)] mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right login form */}
        <div className="relative flex min-h-dvh flex-1 flex-col items-center justify-start px-4 py-20 sm:justify-center sm:px-6 sm:py-10">
          {/* Back link */}
          <div className="absolute top-6 left-6">
            <Link href="/" className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-[var(--admin-text)] hover:text-[var(--admin-accent)] transition-colors">
              <ArrowRight className="w-3 h-3 rotate-180" />
              Retour
            </Link>
          </div>

          <div className="w-full max-w-md rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-[0_22px_70px_rgba(var(--admin-text-rgb),0.14)] sm:p-6">
            {/* Logo */}
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-[8px] border border-[var(--admin-accent)]/40 bg-[var(--admin-accent)]/10 mb-6">
                <ShieldCheck className="w-6 h-6 text-[var(--admin-accent)]" />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--admin-accent)] mb-2">Accès Sécurisé</p>
              <h2 className="font-serif text-3xl font-bold text-[var(--admin-text)]">Connexion Admin</h2>
              <p className="text-[var(--admin-text)] text-xs mt-2 tracking-wide">Réservé aux administrateurs autorisés</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="admin-username" className="block mb-2 text-xs font-medium text-[var(--admin-accent)]">Identifiant</label>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Identifiant admin"
                  required
                  className="w-full rounded-[6px] bg-[var(--admin-bg)] border border-[var(--admin-soft)] text-[var(--admin-text)] placeholder-[var(--admin-text)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 transition-colors duration-200 mb-4"
                  autoComplete="username"
                />
                <label htmlFor="admin-password" className="block mb-2 text-xs font-medium text-[var(--admin-accent)]">Mot de passe</label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-[6px] bg-[var(--admin-bg)] border border-[var(--admin-soft)] text-[var(--admin-text)] placeholder-[var(--admin-text)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/20 transition-colors duration-200"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="brand-glow flex w-full items-center justify-center gap-3 rounded-[6px] bg-gradient-to-r from-[var(--admin-accent)] to-[var(--admin-soft)] py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--admin-text)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(var(--admin-accent-rgb),0.28)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loginLoading ? "Connexion..." : "Connexion"}
                {loginLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </form>

            <p className="text-center text-[10px] tracking-wide text-[var(--admin-text)] mt-8">
              Elegance Couture Prestige · Grand Dakar, Thiossane
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ─────────── DASHBOARD ─────────── */
  return (
    <div
      className="admin-dashboard-theme flex h-dvh overflow-hidden bg-[var(--admin-bg)] text-[var(--admin-text)]"
      data-admin-theme={adminTheme}
      style={adminStyle}
    >

      {/* ── Sidebar ── */}
      <aside className="hidden h-full w-56 flex-shrink-0 flex-col border-r border-[var(--admin-soft)] bg-[var(--admin-bg)] shadow-[8px_0_28px_rgba(var(--admin-text-rgb),0.06)] xl:flex 2xl:w-64">
        {/* Brand */}
        <div className="border-b border-[var(--admin-soft)] px-4 py-6 2xl:px-6 2xl:py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-[var(--admin-accent)]/40 bg-[var(--admin-soft)]">
              <span className="font-serif text-sm font-bold text-[var(--admin-accent)]">EC</span>
            </div>
            <div>
              <p className="text-[var(--admin-text)] text-sm font-semibold leading-none">Elegance Couture</p>
              <p className="text-[var(--admin-text)] text-[10px] tracking-[0.15em] uppercase mt-0.5">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5 2xl:px-4 2xl:py-6">
          <p className="mb-4 px-3 text-[9px] uppercase tracking-[0.35em] text-[var(--admin-text)]">Navigation</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-[8px] px-3 py-2.5 transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-[var(--admin-accent)] text-[var(--admin-text)] shadow-[0_12px_26px_rgba(var(--admin-accent-rgb),0.22)]"
                  : "text-[var(--admin-text)] hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-[10px] font-medium uppercase tracking-[0.11em] 2xl:text-[11px] 2xl:tracking-[0.15em]">{item.label}</span>
              </div>
              {item.count > 0 && (
                <span className={`rounded-full text-[10px] font-semibold px-1.5 py-0.5 ${
                  activeTab === item.id ? "bg-[var(--admin-bg)]/60 text-[var(--admin-text)]" : "bg-[var(--admin-soft)] text-[var(--admin-bg)]"
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Stats bottom */}
        <div className="space-y-3 border-t border-[var(--admin-soft)] px-3 py-5 2xl:px-4 2xl:py-6">
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--admin-text)]">En stock</span>
            <span className="text-[var(--admin-accent)] text-sm font-semibold">{inStockCount}</span>
          </div>
          <div className="flex items-center justify-between px-3">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--admin-text)]">Total produits</span>
            <span className="text-[var(--admin-accent)] text-sm font-semibold">{products.length}</span>
          </div>
        </div>

        {/* Logout */}
        <div className="px-3 pb-5 2xl:px-4 2xl:pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-[var(--admin-text)] hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)] transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[11px] tracking-[0.15em] uppercase">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex min-h-0 flex-1 flex-col">

        {/* Header */}
        <header className="z-30 shrink-0 border-b border-[var(--admin-soft)] bg-[var(--admin-bg)]/95 px-4 py-4 backdrop-blur md:px-6 xl:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-serif text-lg font-bold capitalize text-foreground sm:text-xl">
              {activeMeta.title}
            </h1>
            <p className="mt-0.5 line-clamp-2 text-xs tracking-wide text-muted-foreground">
              {activeMeta.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:justify-end xl:gap-4">
            <button
              type="button"
              onClick={() => setAdminTheme((theme) => (theme === "dark" ? "light" : "dark"))}
              className="inline-flex h-9 items-center gap-2 rounded-[6px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--admin-text)] transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)]"
              aria-label={adminTheme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"}
              title={adminTheme === "dark" ? "Mode clair" : "Mode sombre"}
            >
              {adminTheme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              <span className="hidden xl:inline">{adminTheme === "dark" ? "Clair" : "Sombre"}</span>
            </button>
            <Link href="/boutique" target="_blank"
              className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-[var(--admin-accent)] transition-colors">
              <Eye className="w-3.5 h-3.5" />
              Voir la boutique
            </Link>
            <div className="w-8 h-8 rounded-[6px] bg-[var(--admin-accent)] flex items-center justify-center">
              <span className="font-serif text-[var(--admin-text)] text-xs font-bold">AD</span>
            </div>
          </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide xl:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] border px-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  activeTab === item.id
                    ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-[var(--admin-text)]"
                    : "border-border bg-[var(--admin-panel)] text-muted-foreground"
                }`}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 xl:p-8">
          <section className="mb-6 rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] px-4 py-5 shadow-sm sm:px-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] bg-[var(--admin-soft)] text-[var(--admin-bg)]">
                  <ActiveTabIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--admin-text)]">{activeMeta.eyebrow}</p>
                  <h2 className="break-words font-serif text-xl font-bold text-[var(--admin-text)] sm:text-2xl">{activeMeta.title}</h2>
                  <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[var(--admin-text)]">{activeMeta.description}</p>
                </div>
              </div>
              <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[var(--admin-soft)] bg-[var(--admin-bg)] px-4 py-2 text-xs font-semibold text-[var(--admin-text)]">
                <span className="h-2 w-2 rounded-full bg-[var(--admin-accent)]" />
                {activeMeta.metric}
              </div>
            </div>
          </section>

          {activeTab === "dashboard" && (
            <>
              <div className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Produits", value: products.length, icon: Package, color: "text-[var(--admin-accent)]" },
                  { label: "Catégories", value: categories.length, icon: Tags, color: "text-[var(--admin-text)]" },
                  { label: "Collections", value: collections.length, icon: Layers, color: "text-emerald-600" },
                  { label: "Images site", value: siteImages.length, icon: Images, color: "text-blue-600" },
                ].map((stat, i) => (
                  <div key={i} className="group rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm transition-colors hover:border-[var(--admin-accent)]/60 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-70`} />
                    </div>
                    <p className={`font-serif text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="border border-border bg-[var(--admin-panel)] p-4 sm:p-6">
                  <h2 className="font-serif text-xl font-bold mb-2">Priorités admin</h2>
                  <p className="text-sm text-muted-foreground mb-5">Ce dashboard pilote maintenant le catalogue, les menus, l'accueil et les images de l'interface.</p>
                  {[
                    "Ajouter les catégories Femme, Homme, Enfant et Accessoires",
                    "Créer les collections couture visibles dans la navigation",
                    "Ajouter des images du site pour remplacer les visuels codés",
                    "Marquer les produits à afficher dans À la une",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 border-t border-border py-3 text-sm">
                      <Check className="h-4 w-4 text-[var(--admin-accent)]" />
                      {item}
                    </div>
                  ))}
                </div>

                <div className="bg-[var(--admin-panel)] border border-border p-6">
                  <h2 className="font-serif text-xl font-bold mb-5">Accès rapide</h2>
                  <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                    {navItems.slice(1, 7).map((item) => (
                      <button key={item.id} onClick={() => setActiveTab(item.id)} className="flex min-w-0 items-center gap-3 border border-border p-4 text-left transition-colors hover:border-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/5">
                        <item.icon className="h-4 w-4 text-[var(--admin-accent)]" />
                        <span className="min-w-0 text-xs font-semibold uppercase tracking-[0.12em]">{item.label}</span>
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
              <div className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Produits", value: products.length, icon: Package, color: "text-[var(--admin-accent)]" },
                  { label: "En Stock", value: inStockCount, icon: TrendingUp, color: "text-emerald-600" },
                  { label: "Rupture", value: products.length - inStockCount, icon: X, color: "text-rose-500" },
                  { label: "Valeur Totale", value: `${totalValue.toLocaleString()}`, icon: ShoppingCart, sub: "XOF", color: "text-[var(--admin-accent)]" },
                ].map((stat, i) => (
                  <div key={i} className="group border border-border bg-[var(--admin-panel)] p-4 transition-colors hover:border-[var(--admin-accent)]/30 sm:p-5">
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
              <div className="mb-5 flex flex-col gap-4 rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-5 bg-[var(--admin-accent)]" />
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-foreground">Catalogue</h2>
                    <p className="text-xs text-[var(--admin-text)]">Choisissez l'affichage le plus pratique pour gérer les articles.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-bg)] p-1">
                    <button
                      type="button"
                      onClick={() => setProductView("table")}
                      className={`inline-flex h-9 items-center gap-2 rounded-[6px] px-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        productView === "table"
                          ? "bg-[var(--admin-accent)] text-[var(--admin-text)] shadow-sm"
                          : "text-[var(--admin-text)] hover:bg-[var(--admin-panel)]"
                      }`}
                    >
                      <List className="h-3.5 w-3.5" />
                      Tableau
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductView("cards")}
                      className={`inline-flex h-9 items-center gap-2 rounded-[6px] px-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${
                        productView === "cards"
                          ? "bg-[var(--admin-accent)] text-[var(--admin-text)] shadow-sm"
                          : "text-[var(--admin-text)] hover:bg-[var(--admin-panel)]"
                      }`}
                    >
                      <LayoutGrid className="h-3.5 w-3.5" />
                      Cartes
                    </button>
                  </div>

                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        onClick={() => { resetForm(); }}
                        className="flex items-center justify-center gap-2 rounded-[8px] bg-[var(--admin-accent)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)] transition-all duration-300 hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nouveau produit
                      </button>
                    </DialogTrigger>
                  <DialogContent
                    className="admin-dashboard-theme max-h-[92vh] w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[10px] border-2 border-[var(--admin-soft)] bg-[var(--admin-panel)] p-0 text-[var(--admin-text)] shadow-[0_28px_90px_rgba(var(--admin-text-rgb),0.28)] sm:max-w-[calc(100vw-2rem)] lg:max-w-5xl xl:max-w-6xl"
                    data-admin-theme={adminTheme}
                    style={adminStyle}
                  >
                    <form onSubmit={handleAddProduct} className="flex max-h-[92vh] flex-col">
                      <DialogHeader className="border-b border-t-4 border-b-[var(--admin-soft)] border-t-[var(--admin-accent)] bg-[var(--admin-bg)] px-5 py-4 pr-14 text-left">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div>
                            <DialogTitle className="font-serif text-2xl font-bold text-[var(--admin-text)]">
                              {editingId ? "Modifier le produit" : "Ajouter un produit"}
                            </DialogTitle>
                            <p className="mt-1 text-xs text-[var(--admin-text)]">
                              {productOptionProfile.summary}
                            </p>
                          </div>
                          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--admin-soft)] bg-[var(--admin-panel)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--admin-text)]">
                            <Tags className="h-3.5 w-3.5 text-[var(--admin-accent)]" />
                            {productOptionProfile.title}
                          </div>
                        </div>
                      </DialogHeader>

                      <div className="min-h-0 overflow-y-auto p-4 sm:p-5">
                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
                          <div className="space-y-5">
                            <section className="rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4">
                              <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-[var(--admin-soft)] text-[var(--admin-bg)]">
                                  <Package className="h-4 w-4" />
                                </div>
                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-[var(--admin-text)]">Informations principales</h3>
                                  <p className="text-xs text-[var(--admin-text)]">Nom, prix, catégorie et description.</p>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.6fr)]">
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Nom</Label>
                                  <Input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="mt-1.5 rounded-[6px]"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{productOptionProfile.priceLabel}</Label>
                                  <Input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    className="mt-1.5 rounded-[6px]"
                                  />
                                  <p className="mt-1 text-[11px] text-muted-foreground">{productOptionProfile.priceHint}</p>
                                </div>
                              </div>

                              <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px_160px]">
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Catégorie / sous-catégorie</Label>
                                  <select
                                    value={selectedCategorySlug}
                                    onChange={(e) => handleProductCategoryChange(e.target.value)}
                                    className="mt-1.5 h-10 w-full rounded-[6px] border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
                                  >
                                    {rootCategoryOptions.map((category) => (
                                      <option key={category.slug} value={category.slug}>{category.name}</option>
                                    ))}
                                    {childCategoryOptions.length > 0 && (
                                      <optgroup label="Sous-catégories">
                                        {childCategoryOptions.map((category) => (
                                          <option key={category.slug} value={category.slug}>
                                            {getCategoryName(category.parentSlug)} / {category.name}
                                          </option>
                                        ))}
                                      </optgroup>
                                    )}
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Public</Label>
                                  <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value, collection: "", subcategory: "" })}
                                    className="mt-1.5 h-10 w-full rounded-[6px] border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
                                  >
                                    <option value="femme">Femme</option>
                                    <option value="homme">Homme</option>
                                    <option value="enfant">Enfant</option>
                                    <option value="accessoire">Accessoire</option>
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Ordre</Label>
                                  <Input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                                    className="mt-1.5 rounded-[6px]"
                                  />
                                </div>
                              </div>

                              <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                                    {formData.gender === "accessoire" ? "Sous-catégorie accessoire" : "Collection"}
                                  </Label>
                                  <select
                                    value={formData.collection}
                                    onChange={(e) => handleProductCollectionChange(e.target.value)}
                                    className="mt-1.5 h-10 w-full rounded-[6px] border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-accent)]"
                                  >
                                    <option value="">Aucune</option>
                                    {formData.gender === "accessoire"
                                      ? accessoryCategoryOptions.map((category) => (
                                          <option key={category.slug} value={category.slug}>{category.name}</option>
                                        ))
                                      : collections.filter((collection) => collection.gender === formData.gender).map((collection) => (
                                          <option key={collection.slug} value={collection.slug}>{collection.name}</option>
                                        ))}
                                  </select>
                                </div>
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Description</Label>
                                  <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    className="mt-1.5 min-h-24 resize-none rounded-[6px]"
                                    rows={4}
                                  />
                                </div>
                              </div>
                            </section>

                            <section className="rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-bg)] p-4">
                              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-[var(--admin-text)]">Options de vente</h3>
                                  <p className="text-xs text-[var(--admin-text)]">{productOptionProfile.optionHint}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setFormData({ ...formData, sizes: productOptionProfile.presetValues })}
                                  className="inline-flex h-9 w-fit items-center justify-center rounded-[6px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--admin-text)] transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)]"
                                >
                                  {productOptionProfile.presetLabel}
                                </button>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{productOptionProfile.optionLabel}</Label>
                                  <Input
                                    value={formData.sizes}
                                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                    placeholder={productOptionProfile.optionPlaceholder}
                                    className="mt-1.5 rounded-[6px]"
                                  />
                                </div>
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{productOptionProfile.colorLabel}</Label>
                                  <Input
                                    value={formData.colors}
                                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                                    placeholder={productOptionProfile.colorPlaceholder}
                                    className="mt-1.5 rounded-[6px]"
                                  />
                                </div>
                              </div>
                            </section>
                          </div>

                          <aside className="space-y-5">
                            <section className="rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4">
                              <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                  <h3 className="font-serif text-lg font-semibold text-[var(--admin-text)]">Images</h3>
                                  <p className="text-xs text-[var(--admin-text)]">{formData.images.length} image(s) sélectionnée(s)</p>
                                </div>
                                <ImageIcon className="h-5 w-5 text-[var(--admin-accent)]" />
                              </div>

                              <div className="flex gap-2">
                                <Input
                                  type="url"
                                  value={productImageUrl}
                                  onChange={(e) => setProductImageUrl(e.target.value)}
                                  placeholder="URL image https://..."
                                  className="rounded-[6px]"
                                />
                                <button
                                  type="button"
                                  onClick={addProductImageUrl}
                                  className="shrink-0 rounded-[6px] bg-[var(--admin-text)] px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[var(--admin-accent)] hover:text-[var(--admin-text)]"
                                >
                                  URL
                                </button>
                              </div>

                              <div className="mt-3 rounded-[8px] border border-dashed border-border p-5 text-center transition-colors hover:border-[var(--admin-accent)]">
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploadingImages} className="hidden" id="image-input" />
                                <label htmlFor="image-input" className="flex cursor-pointer flex-col items-center gap-2">
                                  {uploadingImages ? <Loader2 className="h-5 w-5 animate-spin text-[var(--admin-accent)]" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                                  <span className="text-xs text-muted-foreground">
                                    {uploadingImages ? "Upload en cours..." : "Importer des images"}
                                  </span>
                                </label>
                              </div>

                              {formData.images.length > 0 && (
                                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-3">
                                  {formData.images.map((img, idx) => (
                                    <div key={idx} className="group relative aspect-square overflow-hidden rounded-[6px] bg-muted">
                                      <img src={img} alt="" className="h-full w-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute right-1 top-1 rounded-[4px] bg-[var(--admin-soft)]/90 p-1 text-[var(--admin-bg)] opacity-0 transition-opacity group-hover:opacity-100"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </section>

                            <section className="rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-bg)] p-4">
                              <h3 className="mb-4 font-serif text-lg font-semibold text-[var(--admin-text)]">Statut boutique</h3>
                              <div className="space-y-3">
                                <label className="flex items-center justify-between gap-3 rounded-[6px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] px-3 py-2.5 text-sm text-foreground">
                                  <span>Produit en stock</span>
                                  <input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} className="h-4 w-4 accent-[var(--admin-accent)]" />
                                </label>
                                {[
                                  ["featured", "À la une"],
                                  ["bestSeller", "Best seller"],
                                  ["onSale", "Promotion"],
                                ].map(([key, label]) => (
                                  <label key={key} className="flex items-center justify-between gap-3 rounded-[6px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] px-3 py-2.5 text-sm text-foreground">
                                    <span>{label}</span>
                                    <input
                                      type="checkbox"
                                      checked={Boolean(formData[key as "featured" | "bestSeller" | "onSale"])}
                                      onChange={(e) => setFormData({ ...formData, [key]: e.target.checked })}
                                      className="h-4 w-4 accent-[var(--admin-accent)]"
                                    />
                                  </label>
                                ))}
                                <div>
                                  <Label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Réduction (%)</Label>
                                  <Input
                                    type="number"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="mt-1.5 rounded-[6px]"
                                    placeholder="40"
                                  />
                                </div>
                              </div>
                            </section>
                          </aside>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-[var(--admin-soft)] bg-[var(--admin-panel)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-muted-foreground">
                          {productOptionProfile.kind === "fabric"
                            ? "Pour les tissus, le prix est enregistré par mètre."
                            : "Les champs vides d'options ne seront pas enregistrés."}
                        </p>
                        <button type="submit" className="inline-flex h-11 items-center justify-center rounded-[6px] bg-[var(--admin-accent)] px-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--admin-text)] transition-all hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]">
                          {editingId ? "Mettre à jour" : "Ajouter le produit"}
                        </button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                </div>
              </div>

              {/* Products list */}
              <div className="overflow-hidden rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm">
                {productView === "table" ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px]">
                    <thead>
                      <tr className="border-b border-[var(--admin-soft)] bg-[var(--admin-bg)]/70">
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Produit</th>
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium hidden sm:table-cell">Catégorie</th>
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Prix</th>
                        <th className="px-5 py-4 text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium hidden md:table-cell">Stock</th>
                        <th className="px-5 py-4 text-right text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedProducts.map((product, idx) => (
                        <tr key={product.id} className={`border-b border-[var(--admin-soft)]/70 transition-colors hover:bg-[var(--admin-bg)]/55 ${idx % 2 === 0 ? "" : "bg-[var(--admin-bg)]/20"}`}>
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
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground line-clamp-1">{product.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-2 max-w-[200px] mt-1">{product.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-5 hidden sm:table-cell">
                            <span className="inline-block px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase font-medium bg-[var(--admin-accent)]/10 text-[var(--admin-accent)] rounded-md">
                              {getProductCategoryLabel(product)}
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
                              <Link href={`/produit/${product.id}`} target="_blank"
                                className="rounded-lg p-2.5 text-muted-foreground transition-all hover:bg-[var(--admin-accent)]/10 hover:text-[var(--admin-text)]"
                                title="Visualiser le produit">
                                <Eye className="w-4 h-4" />
                              </Link>
                              <button onClick={() => handleEditProduct(product)}
                                className="p-2.5 text-muted-foreground hover:text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 transition-all rounded-lg">
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
                ) : (
                  <div className="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {paginatedProducts.map((product) => (
                      <div key={product.id} className="group overflow-hidden rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(var(--admin-text-rgb),0.12)]">
                        <div className="relative aspect-[4/3] bg-[var(--admin-bg)]">
                          {product.images?.[0] ? (
                            <img src={product.images[0]?.replace('http://', 'https://')} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-8 w-8 text-[var(--admin-text)]/45" />
                            </div>
                          )}
                          <div className="absolute left-3 top-3 rounded-full bg-[var(--admin-panel)]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--admin-text)] shadow-sm">
                            {getProductCategoryLabel(product)}
                          </div>
                          <span className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${product.inStock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                            <span className={`h-2 w-2 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-rose-500"}`} />
                            {product.inStock ? "Stock" : "Rupture"}
                          </span>
                        </div>

                        <div className="space-y-4 p-4">
                          <div>
                            <h3 className="line-clamp-1 text-sm font-bold text-[var(--admin-text)]">{product.name}</h3>
                            <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs leading-relaxed text-[var(--admin-text)]">{product.description}</p>
                          </div>
                          <div className="flex items-end justify-between gap-3">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Prix</p>
                              <p className="font-serif text-xl font-bold text-[var(--admin-text)]">
                                {product.price.toLocaleString()}
                                <span className="ml-1 text-xs font-normal text-[var(--admin-text)]">XOF</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Link href={`/produit/${product.id}`} target="_blank"
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--admin-soft)] text-[var(--admin-text)] transition-colors hover:border-[var(--admin-accent)] hover:bg-[var(--admin-bg)]"
                                title="Visualiser le produit">
                                <Eye className="h-4 w-4" />
                              </Link>
                              <button onClick={() => handleEditProduct(product)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--admin-soft)] text-[var(--admin-text)] transition-colors hover:border-[var(--admin-accent)] hover:bg-[var(--admin-bg)]">
                                <Edit className="h-4 w-4" />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-[var(--admin-soft)] text-[var(--admin-text)] transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col gap-3 border-t border-[var(--admin-soft)] bg-[var(--admin-bg)]/35 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <p className="text-xs text-muted-foreground">
                      {startIndex + 1}–{Math.min(startIndex + itemsPerPage, products.length)} sur {products.length}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-border text-xs text-foreground hover:border-[var(--admin-accent)] disabled:opacity-40 transition-colors">
                        Préc.
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setCurrentPage(p)}
                          className={`w-8 h-8 text-xs border transition-colors ${currentPage === p ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-[var(--admin-text)]" : "border-border text-foreground hover:border-[var(--admin-accent)]"}`}>
                          {p}
                        </button>
                      ))}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-border text-xs text-foreground hover:border-[var(--admin-accent)] disabled:opacity-40 transition-colors">
                        Suiv.
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "categories" && (
            <>
              <div className="mb-6 grid gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
                {[
                  { label: "Racines", value: rootCategoryCount, icon: Tags },
                  { label: "Sous-catégories", value: childCategoryCount, icon: Layers },
                  { label: "Actives", value: categories.filter((category) => category.active).length, icon: CheckCircle },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">{stat.label}</p>
                      <stat.icon className="h-4 w-4 text-[var(--admin-accent)]" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-[var(--admin-text)]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <h2 className="font-serif text-xl font-bold">Nouvelle catégorie</h2>
                <p className="mb-5 mt-1 text-sm text-[var(--admin-text)]">Créez une famille principale ou une sous-rubrique liée à une catégorie existante.</p>
                <div className="space-y-4">
                  <Input placeholder="Nom: Femme, Montres..." value={quickForms.categoryName} onChange={(e) => setQuickForms({ ...quickForms, categoryName: e.target.value })} />
                  <select value={quickForms.categoryType} onChange={(e) => setQuickForms({ ...quickForms, categoryType: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm">
                    <option value="product">Produit</option>
                    <option value="accessory">Accessoire</option>
                    <option value="page">Page</option>
                  </select>
                  <Input placeholder="Parent optionnel: femme, homme..." value={quickForms.categoryParent} onChange={(e) => setQuickForms({ ...quickForms, categoryParent: e.target.value })} />
                  <button onClick={() => saveAdminResource("/api/categories", { name: quickForms.categoryName, type: quickForms.categoryType, parentSlug: quickForms.categoryParent || null }, "Catégorie sauvegardée")} className="w-full rounded-[6px] bg-[var(--admin-accent)] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--admin-text)] shadow-[0_12px_28px_rgba(var(--admin-accent-rgb),0.18)] transition-colors hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]">Sauvegarder</button>
                </div>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm">
                <div className="border-b border-[var(--admin-soft)] bg-[var(--admin-bg)] px-5 py-4">
                  <h2 className="font-serif text-lg font-semibold">Catégories en base</h2>
                  <p className="mt-1 text-xs text-[var(--admin-text)]">{categories.length} entrée(s) disponibles pour organiser la boutique.</p>
                </div>
                {categories.length === 0 ? (
                  <div className="p-12 text-center">
                    <Tags className="mx-auto mb-3 h-9 w-9 text-[var(--admin-accent)]/45" />
                    <p className="font-serif text-lg font-semibold">Aucune catégorie</p>
                    <p className="mt-1 text-sm text-[var(--admin-text)]">Créez d'abord Femme, Homme, Enfant ou Accessoires.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--admin-soft)]">
                    {categories.map((category) => (
                      <div key={category.id} className="flex flex-col gap-3 p-4 transition-colors hover:bg-[var(--admin-bg)] min-[460px]:flex-row min-[460px]:items-center min-[460px]:justify-between min-[460px]:gap-4">
                        <div className="min-w-0">
                          <p className="font-semibold text-[var(--admin-text)]">{category.name}</p>
                          <p className="text-xs text-[var(--admin-text)]">{category.slug} · {category.type}{category.parentSlug ? ` · parent: ${category.parentSlug}` : ""}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${category.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{category.active ? "Actif" : "Masqué"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
                </div>
            </>
          )}

          {activeTab === "collections" && (
            <>
              <div className="mb-6 grid gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
                {["femme", "homme", "enfant"].map((gender) => (
                  <div key={gender} className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">{gender}</p>
                      <Layers className="h-4 w-4 text-[var(--admin-accent)]" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-[var(--admin-text)]">{collections.filter((c) => c.gender === gender).length}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <h2 className="font-serif text-xl font-bold">Nouvelle collection</h2>
                <p className="mb-5 mt-1 text-sm text-[var(--admin-text)]">Ajoutez un groupe de produits qui apparaîtra dans la navigation et les filtres.</p>
                <div className="space-y-4">
                  <Input placeholder="Grand boubou, Super 100..." value={quickForms.collectionName} onChange={(e) => setQuickForms({ ...quickForms, collectionName: e.target.value })} />
                  <select value={quickForms.collectionGender} onChange={(e) => setQuickForms({ ...quickForms, collectionGender: e.target.value })} className="w-full border border-input bg-background px-3 py-2 text-sm">
                    <option value="femme">Femme</option>
                    <option value="homme">Homme</option>
                    <option value="enfant">Enfant</option>
                  </select>
                  <button onClick={() => saveAdminResource("/api/collections", { name: quickForms.collectionName, gender: quickForms.collectionGender }, "Collection sauvegardée")} className="w-full rounded-[6px] bg-[var(--admin-accent)] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--admin-text)] shadow-[0_12px_28px_rgba(var(--admin-accent-rgb),0.18)] transition-colors hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]">Sauvegarder</button>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {["femme", "homme", "enfant"].map((gender) => (
                  <div key={gender} className="min-h-[320px] rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between border-b border-[var(--admin-soft)] pb-3">
                      <h3 className="font-serif text-lg font-bold capitalize text-[var(--admin-text)]">{gender}</h3>
                      <span className="rounded-full bg-[var(--admin-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--admin-bg)]">
                        {collections.filter((c) => c.gender === gender).length}
                      </span>
                    </div>
                    {collections.filter((c) => c.gender === gender).length === 0 ? (
                      <div className="flex h-48 items-center justify-center rounded-[8px] border border-dashed border-[var(--admin-soft)] bg-[var(--admin-bg)] px-4 text-center text-sm text-[var(--admin-text)]">
                        Aucune collection pour cet univers.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {collections.filter((c) => c.gender === gender).map((collection) => (
                          <div key={collection.id} className="rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-bg)] p-3">
                            <p className="text-sm font-semibold text-[var(--admin-text)]">{collection.name}</p>
                            <p className="text-xs text-[var(--admin-text)]">{collection.slug}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </>
          )}

          {activeTab === "images" && (
            <>
              <div className="mb-6 grid gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
                {[
                  { label: "Images", value: siteImages.length, icon: Images },
                  { label: "Sections", value: imageSectionCount, icon: Layers },
                  { label: "Actives", value: siteImages.filter((image) => image.active).length, icon: CheckCircle },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">{stat.label}</p>
                      <stat.icon className="h-4 w-4 text-[var(--admin-accent)]" />
                    </div>
                    <p className="font-serif text-3xl font-bold text-[var(--admin-text)]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <h2 className="font-serif text-xl font-bold">Image d'interface</h2>
                <p className="mb-5 mt-1 text-sm text-[var(--admin-text)]">Associez chaque visuel à une clé stable pour l'utiliser dans les pages publiques.</p>
                <div className="space-y-4">
                  <Input placeholder="Titre" value={quickForms.imageTitle} onChange={(e) => setQuickForms({ ...quickForms, imageTitle: e.target.value })} />
                  <Input placeholder="Clé: hero, home-a-la-une..." value={quickForms.imageKey} onChange={(e) => setQuickForms({ ...quickForms, imageKey: e.target.value })} />
                  <Input placeholder="Section: home, collections..." value={quickForms.imageSection} onChange={(e) => setQuickForms({ ...quickForms, imageSection: e.target.value })} />
                  <div className="space-y-3 rounded-[6px] border border-dashed border-border p-4">
                    <Input placeholder="URL Cloudinary ou image" value={quickForms.imageUrl} onChange={(e) => setQuickForms({ ...quickForms, imageUrl: e.target.value })} />
                    <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center">
                      <input id="site-image-upload" type="file" accept="image/*" onChange={handleSiteImageUpload} disabled={uploadingSiteImage} className="hidden" />
                      <label htmlFor="site-image-upload" className="inline-flex cursor-pointer items-center gap-2 bg-[var(--admin-text)] px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-[var(--admin-accent)] hover:text-[var(--admin-text)]">
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
                  <button onClick={() => saveAdminResource("/api/site-images", { title: quickForms.imageTitle, key: quickForms.imageKey, url: quickForms.imageUrl, section: quickForms.imageSection }, "Image sauvegardée")} className="w-full rounded-[6px] bg-[var(--admin-accent)] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--admin-text)] shadow-[0_12px_28px_rgba(var(--admin-accent-rgb),0.18)] transition-colors hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]">Sauvegarder</button>
                </div>
              </div>
              {siteImages.length === 0 ? (
                <div className="flex min-h-[360px] items-center justify-center rounded-[10px] border border-dashed border-[var(--admin-soft)] bg-[var(--admin-panel)] p-8 text-center shadow-sm">
                  <div>
                    <Images className="mx-auto mb-3 h-10 w-10 text-[var(--admin-accent)]/45" />
                    <p className="font-serif text-xl font-semibold text-[var(--admin-text)]">Aucune image enregistrée</p>
                    <p className="mt-1 text-sm text-[var(--admin-text)]">Ajoutez vos visuels d'accueil et de collections ici.</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {siteImages.map((image) => (
                    <div key={image.id} className="overflow-hidden rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm">
                      <div className="aspect-[4/3] bg-muted"><img src={image.url} alt={image.title} className="h-full w-full object-cover" /></div>
                      <div className="p-4"><p className="font-semibold text-[var(--admin-text)]">{image.title}</p><p className="text-xs text-[var(--admin-text)]">{image.key} · {image.section}</p></div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </>
          )}

          {activeTab === "home" && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <h2 className="font-serif text-xl font-bold">Section accueil</h2>
                <p className="mb-5 mt-1 text-sm text-[var(--admin-text)]">Préparez les contenus réutilisables sur la première page.</p>
                <div className="space-y-4">
                  <Input placeholder="Titre" value={quickForms.homeTitle} onChange={(e) => setQuickForms({ ...quickForms, homeTitle: e.target.value })} />
                  <Input placeholder="Clé: hero-1, a-la-une..." value={quickForms.homeKey} onChange={(e) => setQuickForms({ ...quickForms, homeKey: e.target.value })} />
                  <Textarea placeholder="Sous-titre" value={quickForms.homeSubtitle} onChange={(e) => setQuickForms({ ...quickForms, homeSubtitle: e.target.value })} />
                  <button onClick={() => saveAdminResource("/api/home-sections", { title: quickForms.homeTitle, key: quickForms.homeKey, subtitle: quickForms.homeSubtitle }, "Section sauvegardée")} className="w-full rounded-[6px] bg-[var(--admin-accent)] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--admin-text)] shadow-[0_12px_28px_rgba(var(--admin-accent-rgb),0.18)] transition-colors hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]">Sauvegarder</button>
                </div>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm">
                <div className="border-b border-[var(--admin-soft)] bg-[var(--admin-bg)] px-5 py-4">
                  <h2 className="font-serif text-lg font-semibold">Sections disponibles</h2>
                  <p className="mt-1 text-xs text-[var(--admin-text)]">{homeSections.length} bloc(s) préparé(s) pour l'accueil.</p>
                </div>
                {homeSections.length === 0 ? (
                  <div className="p-12 text-center">
                    <Home className="mx-auto mb-3 h-9 w-9 text-[var(--admin-accent)]/45" />
                    <p className="font-serif text-lg font-semibold">Aucune section</p>
                    <p className="mt-1 text-sm text-[var(--admin-text)]">Créez un bloc hero, nouveautés ou collection mise en avant.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--admin-soft)]">
                    {homeSections.map((section) => (
                      <div key={section.id} className="p-5 transition-colors hover:bg-[var(--admin-bg)]"><p className="font-semibold text-[var(--admin-text)]">{section.title}</p><p className="text-xs text-[var(--admin-text)]">{section.key}</p><p className="mt-2 text-sm text-[var(--admin-text)]">{section.subtitle}</p></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <>
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">Réglages</p>
                  <p className="mt-3 font-serif text-3xl font-bold text-[var(--admin-text)]">{settings.length}</p>
                </div>
                <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-5 shadow-sm">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">Groupes</p>
                  <p className="mt-3 font-serif text-3xl font-bold text-[var(--admin-text)]">{settingsGroupCount}</p>
                </div>
              </div>

              <div className="mb-6 rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--admin-text)]">Paiements manuels</p>
                    <h2 className="mt-1 font-serif text-xl font-bold text-[var(--admin-text)]">Codes marchands Wave et Orange Money</h2>
                    <p className="mt-1 text-sm text-[var(--admin-text)]">Ces informations s'affichent au client quand il choisit Wave ou OM.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSavePaymentSettings}
                    className="w-full rounded-[6px] bg-[var(--admin-accent)] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--admin-text)] shadow-[0_12px_28px_rgba(var(--admin-accent-rgb),0.18)] transition-colors hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)] sm:w-auto"
                  >
                    Sauvegarder
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="wave-merchant-code">Code marchand Wave</Label>
                    <Input
                      id="wave-merchant-code"
                      value={paymentSettingsForm.waveMerchantCode}
                      onChange={(e) => setPaymentSettingsForm((prev) => ({ ...prev, waveMerchantCode: e.target.value }))}
                      placeholder="Ex: WAVE-..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wave-number">Numéro Wave</Label>
                    <Input
                      id="wave-number"
                      value={paymentSettingsForm.waveNumber}
                      onChange={(e) => setPaymentSettingsForm((prev) => ({ ...prev, waveNumber: e.target.value }))}
                      placeholder="+221 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orange-merchant-code">Code marchand Orange Money</Label>
                    <Input
                      id="orange-merchant-code"
                      value={paymentSettingsForm.orangeMerchantCode}
                      onChange={(e) => setPaymentSettingsForm((prev) => ({ ...prev, orangeMerchantCode: e.target.value }))}
                      placeholder="Ex: OM-..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orange-number">Numéro Orange Money</Label>
                    <Input
                      id="orange-number"
                      value={paymentSettingsForm.orangeNumber}
                      onChange={(e) => setPaymentSettingsForm((prev) => ({ ...prev, orangeNumber: e.target.value }))}
                      placeholder="+221 ..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <h2 className="font-serif text-xl font-bold">Réglage boutique</h2>
                <p className="mb-5 mt-1 text-sm text-[var(--admin-text)]">Ajoutez les valeurs globales utilisées par la boutique et le footer.</p>
                <div className="space-y-4">
                  <Input placeholder="Clé: phone, whatsapp, address..." value={quickForms.settingKey} onChange={(e) => setQuickForms({ ...quickForms, settingKey: e.target.value })} />
                  <Input placeholder="Groupe: contact, social, footer..." value={quickForms.settingGroup} onChange={(e) => setQuickForms({ ...quickForms, settingGroup: e.target.value })} />
                  <Textarea placeholder="Valeur" value={quickForms.settingValue} onChange={(e) => setQuickForms({ ...quickForms, settingValue: e.target.value })} />
                  <button onClick={() => saveAdminResource("/api/site-settings", { key: quickForms.settingKey, value: quickForms.settingValue, group: quickForms.settingGroup }, "Réglage sauvegardé")} className="w-full rounded-[6px] bg-[var(--admin-accent)] py-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--admin-text)] shadow-[0_12px_28px_rgba(var(--admin-accent-rgb),0.18)] transition-colors hover:bg-[var(--admin-soft)] hover:text-[var(--admin-bg)]">Sauvegarder</button>
                </div>
              </div>
              <div className="overflow-hidden rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] shadow-sm">
                {settings.length === 0 ? (
                  <div className="p-12 text-center">
                    <Settings className="mx-auto mb-3 h-9 w-9 text-[var(--admin-accent)]/45" />
                    <p className="font-serif text-lg font-semibold">Aucun réglage</p>
                    <p className="mt-1 text-sm text-[var(--admin-text)]">Ajoutez un téléphone, une adresse ou un lien social.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--admin-soft)]">
                    {settings.map((setting) => (
                      <div key={setting.id} className="p-5 transition-colors hover:bg-[var(--admin-bg)]"><p className="font-semibold text-[var(--admin-text)]">{setting.key}</p><p className="text-xs text-[var(--admin-text)]">{setting.group}</p><p className="mt-2 text-sm text-[var(--admin-text)]">{setting.value}</p></div>
                    ))}
                  </div>
                )}
              </div>
              </div>
            </>
          )}

          {activeTab === "security" && (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.5fr)]">
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-panel)] p-4 shadow-sm sm:p-6">
                <h2 className="font-serif text-xl font-bold mb-3">Sécurité admin</h2>
                <p className="text-sm text-[var(--admin-text)] mb-5">L'authentification utilise un JWT signé HS256. Les identifiants se règlent dans les variables d'environnement.</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Identifiant", "ADMIN_USERNAME"],
                    ["Mot de passe", "ADMIN_PASSWORD"],
                    ["Secret JWT", "JWT_SECRET"],
                  ].map(([label, value]) => (
                    <div key={value} className="rounded-[8px] border border-[var(--admin-soft)] bg-[var(--admin-bg)] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--admin-text)]">{label}</p>
                      <code className="mt-2 block text-xs font-semibold text-[var(--admin-text)]">{value}</code>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[10px] border border-[var(--admin-soft)] bg-[var(--admin-bg)] p-4 shadow-sm sm:p-6">
                <ShieldCheck className="mb-4 h-8 w-8 text-[var(--admin-accent)]" />
                <h3 className="font-serif text-lg font-bold text-[var(--admin-text)]">Bonnes pratiques</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--admin-text)]">Utilisez un mot de passe fort, gardez `JWT_SECRET` privé et changez-le après une fuite ou un accès suspect.</p>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <>
              {/* Stats */}
              <div className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Commandes", value: orders.length, icon: ShoppingCart, color: "text-[var(--admin-accent)]" },
                  { label: "En Attente", value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: "text-amber-600" },
                  { label: "Confirmées", value: orders.filter(o => o.status === 'confirmed').length, icon: CheckCircle, color: "text-emerald-600" },
                  { label: "Livrées", value: orders.filter(o => o.status === 'delivered').length, icon: Truck, color: "text-blue-600" },
                ].map((stat, i) => (
                  <div key={i} className="group border border-border bg-[var(--admin-panel)] p-4 transition-colors hover:border-[var(--admin-accent)]/30 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <p className={`font-serif text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Orders List */}
              <div className="border border-border bg-[var(--admin-panel)]">
                <div className="px-5 py-4 border-b border-border">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-5 bg-[var(--admin-accent)]" />
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
                        className="h-10 w-full rounded-[6px] border border-border bg-[var(--admin-panel)] pl-9 pr-3 text-sm focus:outline-none focus:border-[var(--admin-accent)]"
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
                  <div className="p-8 text-center sm:p-16">
                    <ShoppingCart className="w-10 h-10 mx-auto text-[var(--admin-accent)]/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground text-sm tracking-wide">Les commandes apparaîtront ici dès qu'un client en passera une.</p>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="p-8 text-center sm:p-16">
                    <Search className="w-10 h-10 mx-auto text-[var(--admin-accent)]/40 mb-4" />
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
                        const paymentLines = getOrderPaymentLines(order);
                        const manualOrderPayment = isManualMobilePayment(order.paiement);

                        return (
                          <div key={order.id} className="p-4 transition-colors hover:bg-muted/30 sm:p-5">
                            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="mb-2 flex flex-wrap items-center gap-3">
                                  <span className="font-semibold text-foreground">#{order.id}</span>
                                  <StatusBadge status={order.status} />
                                </div>
                                <p className="text-sm text-foreground mb-1">
                                  <strong>{customerName}</strong>
                                </p>
                                <p className="text-xs text-muted-foreground mb-1">
                                  {order.customerTelephone}{order.customerEmail ? ` • ${order.customerEmail}` : ""}
                                </p>
                                <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(220px,0.7fr)_minmax(220px,0.7fr)]">
                                  <div className="rounded-[6px] border border-border bg-[var(--admin-bg)] p-3">
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
                                          <p className="text-xs font-medium text-[var(--admin-text)]">+{orderItems.length - 4} autre(s) article(s)</p>
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
                                        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--admin-text)] underline-offset-4 hover:underline"
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

                                  <div className={`rounded-[6px] border p-3 ${manualOrderPayment ? "border-amber-200 bg-amber-50/80" : "border-border bg-[var(--admin-bg)]"}`}>
                                    <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                                      <ShieldCheck className="h-3.5 w-3.5" />
                                      Paiement
                                    </p>
                                    <p className="text-xs font-semibold text-foreground">{getPaymentMethodLabel(order.paiement)}</p>
                                    <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                                      {manualOrderPayment ? "À vérifier dans l'application marchand avant confirmation." : "À encaisser à la réception."}
                                    </p>
                                    {paymentLines.length > 0 && (
                                      <div className="mt-2 space-y-1">
                                        {paymentLines.slice(0, 4).map((line) => (
                                          <p key={line} className="rounded-[4px] bg-white/70 px-2 py-1 text-[11px] font-medium text-amber-900">
                                            {line}
                                          </p>
                                        ))}
                                      </div>
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
                                  className="h-10 w-full rounded-[6px] border border-border bg-[var(--admin-panel)] px-3 text-xs focus:outline-none focus:border-[var(--admin-accent)]"
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
                                      className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-text)]"
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
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-text)]"
                                      >
                                        <Navigation className="h-3.5 w-3.5" />
                                        Ouvrir
                                      </a>
                                      <button
                                        type="button"
                                        onClick={() => handleCopyOrderLocation(order)}
                                        className="inline-flex h-9 items-center justify-center gap-2 rounded-[6px] border border-border px-3 text-xs font-medium text-foreground transition-colors hover:border-[var(--admin-accent)] hover:text-[var(--admin-text)]"
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
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setOrderCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={orderCurrentPage === 1}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border text-xs disabled:cursor-not-allowed disabled:opacity-40 hover:border-[var(--admin-accent)]"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        {visibleOrderPages.map((page) => (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setOrderCurrentPage(page)}
                            className={`h-8 min-w-8 rounded-[6px] border px-2 text-xs transition-colors ${orderCurrentPage === page ? "border-[var(--admin-accent)] bg-[var(--admin-accent)] text-[var(--admin-text)]" : "border-border text-foreground hover:border-[var(--admin-accent)]"}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => setOrderCurrentPage((p) => Math.min(totalOrderPages, p + 1))}
                          disabled={orderCurrentPage === totalOrderPages}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] border border-border text-xs disabled:cursor-not-allowed disabled:opacity-40 hover:border-[var(--admin-accent)]"
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
              <div className="mb-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
                {[
                  { label: "Total Messages", value: contacts.length, icon: MessageCircle, color: "text-[var(--admin-accent)]" },
                  { label: "Non Lus", value: contacts.filter(c => !c.lu).length, icon: Eye, color: "text-amber-600" },
                  { label: "Lus", value: contacts.filter(c => c.lu).length, icon: Check, color: "text-emerald-600" },
                ].map((stat, i) => (
                  <div key={i} className="group border border-border bg-[var(--admin-panel)] p-4 transition-colors hover:border-[var(--admin-accent)]/30 sm:p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`w-4 h-4 ${stat.color} opacity-60`} />
                    </div>
                    <p className={`font-serif text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Contacts List */}
              <div className="border border-border bg-[var(--admin-panel)]">
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <div className="w-1 h-5 bg-[var(--admin-accent)]" />
                  <h2 className="font-serif text-lg font-semibold text-foreground">Messages</h2>
                </div>
                
                {contacts.length === 0 ? (
                  <div className="p-8 text-center sm:p-16">
                    <MessageCircle className="w-10 h-10 mx-auto text-[var(--admin-accent)]/40 mb-4" />
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Aucun message</h3>
                    <p className="text-muted-foreground text-sm tracking-wide">Les messages de contact apparaîtront ici.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {contacts.map((contact) => (
                      <div key={contact.id} className={`p-4 transition-colors hover:bg-muted/30 sm:p-5 ${!contact.lu ? 'bg-blue-50/50' : ''}`}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-3">
                              <span className="font-semibold text-foreground">{contact.nom}</span>
                              {!contact.lu && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded">Nouveau</span>
                              )}
                            </div>
                            <p className="mb-1 break-all text-xs text-muted-foreground">{contact.email} • {contact.telephone}</p>
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
                            className="inline-flex h-9 items-center justify-center border border-[var(--admin-accent)] px-3 py-1.5 text-xs text-[var(--admin-text)] transition-colors hover:bg-[var(--admin-accent)] hover:text-[var(--admin-text)]"
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
