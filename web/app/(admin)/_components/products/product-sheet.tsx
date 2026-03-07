"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { createProductSchema } from "@/schemas/products.schema";
import {
  type CreateProductInput,
  type UpdateProductInput,
  type ProductResponse,
  type ProductImageResponse,
} from "@/types/products.types";
import { useProductMutations, useProduct } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import { ProductImageSection } from "./product-image-section";
import { ProductDeleteSection } from "./product-delete-section";

interface ProductSheetProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ProductResponse | null;
}

export function ProductSheet({ isOpen, onClose, product }: ProductSheetProps) {
  const isEditing = !!product;

  const { create, update } = useProductMutations();
  const { data: categoriesResponse, isLoading: isLoadingCategories } =
    useCategories();
  const categories = categoriesResponse?.categories || [];

  const { data: fullProductData, isLoading: isLoadingFullProduct } = useProduct(
    product?.id || "",
  );
  const fullProductDataTyped = fullProductData as
    | { product: ProductResponse }
    | undefined;
  const fullImages: ProductImageResponse[] =
    fullProductDataTyped?.product?.images || product?.images || [];

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      description: "",
      material: "",
      productionTime: 1,
      price: 0,
      categoryId: "",
      images: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: product?.name || "",
        description: product?.description || "",
        material: product?.material || "",
        productionTime: product?.productionTime || 1,
        price: product?.price ? Number(product.price) : 0,
        categoryId: product?.categoryId || "",
        images: [],
      });
    }
  }, [isOpen, product, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (data: CreateProductInput) => {
    try {
      if (isEditing && product) {
        const updatePayload: UpdateProductInput = {
          name: data.name,
          description: data.description,
          material: data.material,
          productionTime: data.productionTime,
          price: data.price,
          categoryId: data.categoryId,
        };
        await update.mutateAsync({ id: product.id, data: updatePayload });
      } else {
        const validImages = data.images?.filter(
          (img) => img.url.trim() !== "" && img.name.trim() !== "",
        );
        const createPayload: CreateProductInput = {
          ...data,
          images: validImages?.length ? validImages : undefined,
        };
        await create.mutateAsync(createPayload);
      }
      handleClose();
    } catch (error) {
      console.error("Erro no submit:", error);
    }
  };

  const isPending = create.isPending || update.isPending;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent className="bg-background z-100 flex w-full flex-col overflow-y-auto p-6 sm:max-w-md">
        <SheetHeader className="mb-6 shrink-0">
          <SheetTitle>
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Gerencie as fotos abaixo ou atualize as informações de texto do produto."
              : "Preencha as informações do novo produto."}
          </SheetDescription>
        </SheetHeader>

        {/* O <Form> agora abraça todo o conteúdo do SheetContent para prover o contexto globalmente */}
        <Form {...form}>
          <div className="flex flex-1 flex-col gap-6 pb-4">
            {/* SEÇÃO DE IMAGENS: 
              Está FORA da tag <form> HTML, mas DENTRO do <Form> Provider.
              Assim, tem acesso ao useFormContext sem disparar submit.
            */}
            <div className="space-y-3">
              {isEditing && (
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Fotos (Salvas automaticamente)
                </p>
              )}
              <ProductImageSection
                isEditing={isEditing}
                productId={product?.id}
                fullImages={fullImages}
                isLoadingFullProduct={isLoadingFullProduct}
                control={form.control}
              />
            </div>

            {isEditing && <Separator className="my-2" />}

            {/* SEÇÃO DE TEXTO / FORMULÁRIO PRINCIPAL 
              A tag HTML <form> abraça estritamente os campos e o botão de salvar.
            */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {isEditing && (
                <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                  Informações de Texto
                </p>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Amigurumi Ursinho" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoadingCategories}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent
                        position="popper"
                        className="bg-background z-110 shadow-md"
                      >
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-4 sm:flex-row">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : parseFloat(val));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="productionTime"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Prazo (Dias)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Ex: 5"
                          {...field}
                          value={field.value === 0 ? "" : field.value}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : parseInt(val, 10));
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Linha 100% Algodão" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os detalhes da peça..."
                        className="h-24 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="mt-4 shrink-0">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isEditing ? "Salvar Informações" : "Criar Produto"}
                </Button>
              </div>
            </form>

            {/* SEÇÃO DE DELETAR
              Mantida fora da tag <form> HTML principal para evitar submits acidentais.
            */}
            {isEditing && product && (
              <div className="mt-2 border-t pt-4">
                <ProductDeleteSection
                  productId={product.id}
                  productName={product.name}
                  onSuccess={handleClose}
                />
              </div>
            )}
          </div>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
