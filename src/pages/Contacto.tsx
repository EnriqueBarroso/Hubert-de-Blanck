import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido").max(100, "El nombre debe tener menos de 100 caracteres"),
  email: z.string().trim().email("Email inválido").max(255, "El email debe tener menos de 255 caracteres"),
  subject: z.string().trim().min(1, "El asunto es requerido").max(200, "El asunto debe tener menos de 200 caracteres"),
  message: z.string().trim().min(1, "El mensaje es requerido").max(1000, "El mensaje debe tener menos de 1000 caracteres"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const Contacto = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Form data:", data);
      toast.success("¡Mensaje enviado! Nos pondremos en contacto contigo pronto.");
      form.reset();
    } catch (error) {
      toast.error("Error al enviar el mensaje. Por favor, intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">
            Contacta con <span className="text-primary">Nosotros</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos aquí para responder tus preguntas sobre nuestras producciones, talleres o cualquier otra consulta.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="font-playfair text-3xl font-bold text-foreground mb-6">
                  Información de <span className="text-secondary">Contacto</span>
                </h2>
                <p className="text-muted-foreground mb-8">
                  Visítanos, llámanos o escríbenos. Estaremos encantados de atenderte.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-foreground mb-1">Dirección</h3>
                    <p className="text-muted-foreground">
                      Calle Calzada #657 entre D y E<br />
                      Vedado, La Habana, Cuba
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-foreground mb-1">Teléfono</h3>
                    <p className="text-muted-foreground">
                      +53 7 832 4721
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-semibold text-foreground mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      info@hubertdeblanck.cu
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-outfit font-semibold text-foreground mb-4">Síguenos</h3>
                <div className="flex gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Facebook className="w-5 h-5 text-foreground" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Instagram className="w-5 h-5 text-foreground" />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-card border border-border hover:border-primary hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <Twitter className="w-5 h-5 text-foreground" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="font-playfair text-2xl font-bold text-foreground mb-6">
                Envíanos un <span className="text-secondary">Mensaje</span>
              </h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Asunto</FormLabel>
                        <FormControl>
                          <Input placeholder="¿Sobre qué quieres hablar?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Escribe tu mensaje aquí..." 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto max-w-6xl">
          <div className="aspect-video rounded-lg overflow-hidden border border-border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.8395652!2d-82.3892!3d23.1356!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDA4JzA4LjIiTiA4MsKwMjMnMjEuMSJX!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Compañía Hubert de Blanck. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Contacto;