import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { GalleryItem } from "@/types";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface ImageViewerProps {
  images: GalleryItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const ImageViewer = ({ images, initialIndex, isOpen, onClose }: ImageViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sincronizar el índice cuando se abre el modal con una foto distinta
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  // Manejo de Teclado (Flechas)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length); // Loop al principio
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); // Loop al final
  };

  if (!images.length) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] h-[95vh] bg-transparent border-none shadow-none p-0 flex items-center justify-center outline-none">
        {/* Título Oculto para Accesibilidad (Requisito de Radix UI) */}
        <VisuallyHidden.Root>
          <DialogTitle>{currentImage?.title || "Imagen de galería"}</DialogTitle>
        </VisuallyHidden.Root>

        {/* Botón Cerrar Personalizado */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white bg-black/50 hover:bg-black/80 rounded-full"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Botón Anterior */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 z-50 text-white bg-black/20 hover:bg-black/60 rounded-full h-12 w-12 hidden md:flex"
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        {/* Contenedor de la Imagen */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <img
            src={currentImage?.image_url}
            alt={currentImage?.title}
            className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl animate-in fade-in zoom-in-95 duration-300"
          />
          
          {/* Información de la imagen (Pie de foto) */}
          <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
            <div className="inline-block bg-black/70 backdrop-blur-sm px-6 py-3 rounded-full text-white pointer-events-auto">
              <h3 className="font-playfair text-xl font-bold">{currentImage?.title}</h3>
              <p className="font-outfit text-sm text-gray-300">
                {currentImage?.play?.title || currentImage?.description || ""}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentIndex + 1} / {images.length}
              </p>
            </div>
          </div>
        </div>

        {/* Botón Siguiente */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 z-50 text-white bg-black/20 hover:bg-black/60 rounded-full h-12 w-12 hidden md:flex"
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewer;