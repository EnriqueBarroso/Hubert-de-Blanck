import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import heroTheater from "@/assets/hero-theater.jpg";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      category: "Teatro Musical",
      title: "En el Bosque",
      subtitle: "Una experiencia inmersiva que desafía los límites del teatro contemporáneo",
      image: heroTheater,
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-10" />
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-start container mx-auto px-4">
            <div className="max-w-4xl">
              <p className="font-outfit text-sm font-medium text-secondary mb-4 tracking-widest uppercase flex items-center gap-2">
                <span className="w-8 h-px bg-secondary"></span>
                {slide.category}
              </p>
              <h1 className="font-playfair text-7xl md:text-8xl lg:text-9xl font-bold text-foreground mb-6 leading-none">
                {slide.title}
              </h1>
              <p className="font-outfit text-xl md:text-2xl text-foreground/90 mb-8 max-w-2xl leading-relaxed">
                {slide.subtitle}
              </p>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-outfit font-semibold rounded-full px-8 group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Descubre más
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
