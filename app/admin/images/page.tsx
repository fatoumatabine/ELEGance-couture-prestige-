"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Image as ImageIcon, 
  Trash2, 
  RefreshCw, 
  Upload,
  FolderOpen,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";

interface ImageItem {
  id: string;
  publicId: string;
  url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  createdAt: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolder, setSelectedFolder] = useState("elegance-couture");
  const [isUploading, setIsUploading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const folders = [
    { value: "elegance-couture", label: "Toutes les images" },
    { value: "elegance-couture/products", label: "Produits" },
    { value: "elegance-couture/collections", label: "Collections" },
    { value: "elegance-couture/banners", label: "Bannières" },
    { value: "elegance-couture/general", label: "Général" },
  ];

  const fetchImages = async (folder: string, cursor?: string) => {
    try {
      setLoading(true);
      let url = `/api/images?folder=${folder}&limit=20`;
      if (cursor) {
        url += `&nextCursor=${cursor}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur lors de la récupération");

      const data = await res.json();
      
      if (cursor) {
        setImages(prev => [...prev, ...data.images]);
      } else {
        setImages(data.images);
      }
      
      setNextCursor(data.nextCursor || null);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Erreur lors de la récupération des images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(selectedFolder);
  }, [selectedFolder]);

  const handleDelete = async (publicId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/images?publicId=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      setImages(prev => prev.filter(img => img.publicId !== publicId));
      toast.success("Image supprimée avec succès");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Erreur lors de la suppression de l'image");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const token = localStorage.getItem("adminToken");

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", selectedFolder);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.error || "Erreur lors de l'upload");
        }

        const data = await res.json();
        
        // Ajouter la nouvelle image à la liste
        const newImage: ImageItem = {
          id: data.asset_id,
          publicId: data.public_id,
          url: data.secure_url,
          format: data.format,
          width: data.width,
          height: data.height,
          bytes: data.bytes,
          createdAt: data.created_at,
        };
        
        setImages(prev => [newImage, ...prev]);
      }

      toast.success(`${files.length} image(s) uploadée(s)`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Images</h1>
          <p className="text-muted-foreground">Gérez les images uploadées sur Cloudinary</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {folders.map(folder => (
              <option key={folder.value} value={folder.value}>
                {folder.label}
              </option>
            ))}
          </select>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button asChild disabled={isUploading}>
                <span>
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? "Upload en cours..." : "Uploader des images"}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Images dans "{folders.find(f => f.value === selectedFolder)?.label}"
            <span className="text-muted-foreground text-sm font-normal">
              ({images.length} images)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune image trouvée</p>
              <p className="text-sm text-muted-foreground mt-2">
                Uploadez des images pour les voir ici
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
                  >
                    <img
                      src={image.url}
                      alt={image.publicId}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                      <p className="text-white text-xs text-center truncate w-full">
                        {image.publicId.split('/').pop()}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(image.publicId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-2 py-1">
                      <p className="text-white text-xs truncate">{image.width}x{image.height}</p>
                      <p className="text-white/70 text-xs">{formatBytes(image.bytes)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => fetchImages(selectedFolder, nextCursor || undefined)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Charger plus d'images
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
