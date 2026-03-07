"use client";

import { useState } from "react";
import Image from "next/image";
import { useFieldArray, Control } from "react-hook-form";
import {
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  ImageOff,
} from "lucide-react";

import {
  ProductImageResponse,
  CreateProductInput,
} from "@/types/products.types";
import { useProductMutations } from "@/hooks/use-products";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProductImageSectionProps {
  isEditing: boolean;
  productId?: string;
  fullImages?: ProductImageResponse[];
  isLoadingFullProduct?: boolean;
  control: Control<CreateProductInput>;
}

export function ProductImageSection({
  isEditing,
  productId,
  fullImages = [],
  isLoadingFullProduct = false,
  control,
}: ProductImageSectionProps) {
  // =====================================
  // ESTADOS DO MODO EDIÇÃO (Live Updates)
  // =====================================
  const { addImage, removeImage } = useProductMutations();
  const [newLiveImageName, setNewLiveImageName] = useState("");
  const [newLiveImageUrl, setNewLiveImageUrl] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleAddLiveImage = async () => {
    if (!productId || !newLiveImageUrl.trim() || !newLiveImageName.trim())
      return;
    try {
      await addImage.mutateAsync({
        productId,
        data: { name: newLiveImageName, url: newLiveImageUrl },
      });
      setNewLiveImageName("");
      setNewLiveImageUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveLiveImage = async (imageId: string) => {
    if (!productId) return;
    try {
      await removeImage.mutateAsync({ productId, imageId });
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================
  // ESTADOS DO MODO CRIAÇÃO (useFieldArray)
  // =====================================
  const {
    fields,
    append,
    remove: removeField,
  } = useFieldArray({
    control,
    name: "images",
  });

  return (
    <div className="bg-muted/30 space-y-6 rounded-xl border p-4">
      <div className="flex items-center gap-2 border-b pb-2">
        <ImageIcon className="text-muted-foreground h-5 w-5" />
        <FormLabel className="m-0 text-base font-semibold">
          Galeria de Fotos
        </FormLabel>
        {isEditing && isLoadingFullProduct && (
          <Loader2 className="text-muted-foreground ml-auto h-4 w-4 animate-spin" />
        )}
      </div>

      {isEditing && productId ? (
        // -------------------------------------
        // 1. MODO EDIÇÃO (Ao vivo / Banco de Dados)
        // -------------------------------------
        <div className="space-y-6">
          {fullImages.length > 0 ? (
            // Grid responsivo e lixeirinha sobre a foto!
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fullImages.map((img) => (
                <div
                  key={img.id}
                  className="group bg-muted relative aspect-square overflow-hidden rounded-md border shadow-sm"
                >
                  {!imageErrors[img.id] ? (
                    <Image
                      src={img.url}
                      alt={img.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      onError={() =>
                        setImageErrors((prev) => ({ ...prev, [img.id]: true }))
                      }
                    />
                  ) : (
                    <div className="bg-destructive/5 text-destructive flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center">
                      <ImageOff className="h-5 w-5 opacity-60" />
                      <span
                        className="line-clamp-2 text-[10px] leading-tight opacity-70"
                        title={img.name}
                      >
                        Erro na URL
                      </span>
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    // No celular sempre aparece um pouco, no PC aparece no hover
                    className="absolute top-1.5 right-1.5 h-8 w-8 opacity-90 shadow-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
                    onClick={() => handleRemoveLiveImage(img.id)}
                    disabled={removeImage.isPending}
                    title="Remover foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground bg-background rounded-md border border-dashed py-6 text-center text-sm">
              {isLoadingFullProduct
                ? "Buscando fotos..."
                : "Nenhuma foto cadastrada."}
            </p>
          )}

          {/* AJUSTE AQUI: Formulário de Adição de Foto Responsivo no Modo Edição */}
          <div className="flex flex-col gap-3 border-t pt-4">
            <span className="text-sm font-medium">Adicionar foto extra</span>

            <div className="bg-background flex flex-col items-start gap-3 rounded-lg border p-3 shadow-sm sm:flex-row">
              <div className="w-full space-y-3 sm:flex sm:flex-1 sm:gap-3 sm:space-y-0">
                <Input
                  placeholder="Nome (Ex: Capa)"
                  value={newLiveImageName}
                  onChange={(e) => setNewLiveImageName(e.target.value)}
                  className="bg-background w-full sm:w-1/3"
                />
                <Input
                  placeholder="URL da nova foto..."
                  value={newLiveImageUrl}
                  onChange={(e) => setNewLiveImageUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddLiveImage();
                    }
                  }}
                  className="bg-background w-full flex-1"
                />
              </div>

              <Button
                type="button"
                onClick={handleAddLiveImage}
                disabled={
                  !newLiveImageUrl.trim() ||
                  !newLiveImageName.trim() ||
                  addImage.isPending
                }
                className="w-full shrink-0 sm:w-auto"
                variant="secondary"
              >
                {addImage.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4 sm:mr-0" />
                )}
                <span className="sm:hidden">Adicionar Foto</span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // -------------------------------------
        // 2. MODO CRIAÇÃO (Formulário Local)
        // -------------------------------------
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              // Layout fixo: nada de absolute flutuando!
              className="bg-background flex flex-col items-start gap-3 rounded-lg border p-3 shadow-sm sm:flex-row"
            >
              <div className="w-full space-y-3 sm:flex sm:flex-1 sm:gap-3 sm:space-y-0">
                <FormField
                  control={control}
                  name={`images.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-1/3">
                      <FormControl>
                        <Input placeholder="Nome (Ex: Capa)" {...field} />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
                <div className="flex w-full gap-2 sm:flex-1">
                  <FormField
                    control={control}
                    name={`images.${index}.url`}
                    render={({ field }) => (
                      <FormItem className="w-full flex-1">
                        <FormControl>
                          <Input
                            placeholder="URL da foto (https://...)"
                            type="url"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* No Mobile vira um botãozão largo embaixo, no PC volta a ser só um ícone do lado */}
              {fields.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeField(index)}
                  className="text-destructive border-destructive/20 hover:bg-destructive/10 w-full shrink-0 border sm:w-auto sm:border-none"
                >
                  <Trash2 className="mr-2 h-4 w-4 sm:mr-0" />
                  <span className="sm:hidden">Remover Foto</span>
                </Button>
              )}
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => append({ name: "", url: "" })}
            className="hover:bg-muted mt-2 w-full border-2 border-dashed bg-transparent py-6"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar nova foto
          </Button>
        </div>
      )}
    </div>
  );
}
