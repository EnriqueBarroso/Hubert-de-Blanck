import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import heroImage from "@/assets/hero-1.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      sponsor: "Cervezas Alhambra",
      title: "Monsieur Van Pratt",
      subtitle: "Super Spicy Records",
      image: heroImage,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-start container mx-auto px-4">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-foreground/80 mb-4 tracking-widest uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-primary"></span>
                {slide.sponsor}
              </p>
              <h1 className="text-7xl md:text-8xl font-bold text-foreground mb-4 leading-none">
                {slide.title}
              </h1>
              <p className="text-xl text-foreground/80 mb-8">{slide.subtitle}</p>
              <Button
                size="icon"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-4 md:left-8 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? "bg-primary w-8" : "bg-foreground/30"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default Hero;
