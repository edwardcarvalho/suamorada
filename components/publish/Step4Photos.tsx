"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { X, GripVertical, ImagePlus, AlertCircle, Check } from "lucide-react";
import { usePublishStore, type UploadedImage } from "./usePublishStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

async function uploadFile(file: File): Promise<{ url: string; key: string }> {
  // 1. Pedir signed URL
  const res = await fetch("/api/upload/signed-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
  });

  if (!res.ok) throw new Error("Erro ao obter URL de upload");
  const { uploadUrl, publicUrl, key } = await res.json();

  // 2. Upload directo para R2
  try {
    await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
  } catch {
    // Em dev sem R2, usa object URL local como fallback
    return { url: URL.createObjectURL(file), key };
  }

  return { url: publicUrl, key };
}

export function Step4Photos() {
  const { data, addImage, updateImage, removeImage, reorderImages, setStep } = usePublishStore();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onDrop = React.useCallback(async (files: File[]) => {
    const valid = files.filter((f) => {
      if (!["image/jpeg","image/png","image/webp"].includes(f.type)) {
        toast.error(`${f.name}: formato não suportado`); return false;
      }
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name}: máximo 10MB`); return false;
      }
      return true;
    });

    for (const file of valid) {
      const id = crypto.randomUUID();
      const preview = URL.createObjectURL(file);
      const position = data.images.length;

      addImage({ id, url: "", key: "", preview, isCover: position === 0,
        position, uploading: true, width: undefined, height: undefined });

      uploadFile(file)
        .then(({ url, key }) => updateImage(id, { url, key, uploading: false }))
        .catch(() => { updateImage(id, { uploading: false, error: "Falha no upload" }); });
    }
  }, [data.images.length, addImage, updateImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    maxFiles: 30,
    disabled: data.images.length >= 30,
  });

  async function handleSubmit() {
    const pending = data.images.filter((i) => i.uploading);
    if (pending.length) { toast.error("Aguarde o upload terminar"); return; }
    if (data.images.length < 1) { toast.error("Adicione pelo menos 1 foto"); return; }

    setIsSubmitting(true);
    try {
      const body = {
        listingType:         data.listingType,
        propertyType:        data.propertyType,
        title:               data.title,
        description:         data.description,
        price:               Number(data.price),
        priceNegotiable:     data.priceNegotiable,
        bedrooms:            data.bedrooms,
        bathrooms:           data.bathrooms,
        areaUseful:          data.areaUseful ? Number(data.areaUseful) : undefined,
        areaGross:           data.areaGross  ? Number(data.areaGross)  : undefined,
        floor:               data.floor      ? Number(data.floor)      : undefined,
        totalFloors:         data.totalFloors? Number(data.totalFloors): undefined,
        condition:           data.condition  || undefined,
        energyCertificate:   data.energyCertificate || undefined,
        hasGarage:   data.hasGarage, hasElevator: data.hasElevator,
        hasPool:     data.hasPool,   hasGarden:   data.hasGarden,
        features:    data.features,
        lat:         data.lat || "38.7223",
        lng:         data.lng || "-9.1393",
        addressStreet:       data.addressStreet,
        addressParish:       data.addressParish,
        addressMunicipality: data.addressMunicipality,
        addressDistrict:     data.addressDistrict,
        addressPostalCode:   data.addressPostalCode,
        images: data.images.map((i) => ({
          url: i.url, key: i.key, position: i.position, isCover: i.isCover
        })),
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro");

      toast.success("Anúncio submetido! Em verificação em 24h.");
      window.location.href = `/imovel/${json.slug}`;
    } catch (err) {
      toast.error((err as Error).message ?? "Erro ao publicar");
    } finally {
      setIsSubmitting(false);
    }
  }

  const readyCount  = data.images.filter((i) => !i.uploading && !i.error).length;
  const errorCount  = data.images.filter((i) => i.error).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-sans font-semibold text-base text-ink mb-1">Fotos do imóvel</h2>
        <p className="text-sm text-muted font-sans">
          Mínimo 1 foto · Máximo 30 · JPG, PNG ou WebP · Máx 10MB cada
        </p>
      </div>

      {/* Dropzone */}
      {data.images.length < 30 && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all",
            isDragActive
              ? "border-brand bg-brand/5"
              : "border-border hover:border-navy/50 hover:bg-warm"
          )}
        >
          <input {...getInputProps()} />
          <ImagePlus size={36} className={cn("mx-auto mb-3", isDragActive ? "text-brand" : "text-faint")} />
          <p className="font-sans font-medium text-sm text-ink">
            {isDragActive ? "Largue as fotos aqui" : "Arraste fotos ou clique para seleccionar"}
          </p>
          <p className="text-xs text-faint font-sans mt-1">
            {data.images.length}/30 fotos adicionadas
          </p>
        </div>
      )}

      {/* Status summary */}
      {data.images.length > 0 && (
        <div className="flex items-center gap-4 text-xs font-sans">
          <span className="flex items-center gap-1 text-trust">
            <Check size={12} /> {readyCount} prontas
          </span>
          {data.images.filter((i) => i.uploading).length > 0 && (
            <span className="text-brand animate-pulse">
              ⏳ {data.images.filter((i) => i.uploading).length} a carregar...
            </span>
          )}
          {errorCount > 0 && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircle size={12} /> {errorCount} com erro
            </span>
          )}
        </div>
      )}

      {/* Grid de fotos */}
      {data.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {data.images.map((img, idx) => (
            <div key={img.id} className="relative group aspect-[4/3] rounded-lg overflow-hidden border border-border bg-warm-dark">
              {(img.preview || img.url) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.preview || img.url}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Loading overlay */}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                  <AlertCircle size={20} className="text-white" />
                </div>
              )}

              {/* Cover badge */}
              {img.isCover && !img.uploading && (
                <span className="absolute top-1.5 left-1.5 bg-brand text-white text-[10px] font-sans font-semibold px-1.5 py-0.5 rounded">
                  Capa
                </span>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover foto"
              >
                <X size={12} />
              </button>

              {/* Position number */}
              <span className="absolute bottom-1.5 right-1.5 bg-black/50 text-white text-[10px] font-sans px-1.5 py-0.5 rounded">
                {idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {data.images.length > 0 && (
        <p className="text-xs text-faint font-sans">
          💡 A primeira foto é a capa. Remova e readicione para alterar a ordem.
        </p>
      )}

      {/* Preview do anúncio */}
      {readyCount > 0 && (
        <div className="bg-trust/10 border border-trust/30 rounded-xl p-4">
          <h3 className="font-sans font-semibold text-sm text-trust mb-1">✓ Pronto para publicar</h3>
          <p className="text-xs text-muted font-sans">
            <strong>{data.title.slice(0,50)}</strong> · {data.addressMunicipality} ·{" "}
            {Number(data.price).toLocaleString("pt-PT")} €
          </p>
        </div>
      )}

      {/* Navegação */}
      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="md" onClick={() => setStep(3)}>← Anterior</Button>
        <Button
          variant="primary"
          size="lg"
          disabled={readyCount === 0}
          loading={isSubmitting}
          onClick={handleSubmit}
        >
          Publicar Anúncio
        </Button>
      </div>
    </div>
  );
}
