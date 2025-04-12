import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  Share2,
  MessageSquare,
  ExternalLink
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestimonialsModal } from "@/components/Testimonials";
import { supabase } from "@/lib/supabase";
import { useServices } from "@/hooks/use-services";
import { useContactContent } from "@/hooks/use-contact-content";

// Form schema with updated validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Por favor, insira seu nome completo.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }).regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, {
    message: "Formato de email inválido.",
  }),
  phone: z.string().optional()
    .refine((val) => !val || /^\+?[0-9]{10,}$/.test(val), {
      message: "Telefone deve conter apenas números, mínimo 10 dígitos",
    }),
  service: z.string().optional(),
  message: z.string().min(10, {
    message: "Por favor, escreva uma mensagem com pelo menos 10 caracteres.",
  }),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testimonialsOpen, setTestimonialsOpen] = useState(false);
  const [blogData, setBlogData] = useState<{
    url: string;
    title: string;
    subtitle: string;
    cta_text: string;
  } | null>(null);

  // Fetch services using the hook
  const { services, isLoading: isLoadingServices } = useServices();
  
  // Fetch contact content using the hook
  const { contactContent, isLoading: isLoadingContact, subscribeToContactContent } = useContactContent();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToContactContent();
    return () => {
      unsubscribe();
    };
  }, [subscribeToContactContent]);

  useEffect(() => {
    const fetchBlogData = async () => {
      const { data, error } = await supabase
        .from('acesse_blog')
        .select('*')
        .eq('active', true)
        .single();
      
      if (!error && data) {
        setBlogData(data);
      }
    };

    fetchBlogData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('formulario_contato')
        .insert([{
          name: values.name,
          email: values.email,
          phone: values.phone || null,
          service: values.service || null,
          message: values.message,
        }]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Entraremos em contato em breve.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Por favor, verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleShareSocial = (platform: string) => {
    if (!contactContent) return;

    const url = window.location.href;
    const title = "i9 Agência de Marketing Digital";
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        break;
      case "facebook":
        shareUrl = `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/${contactContent.whatsapp_number}?text=${encodeURIComponent(contactContent.whatsapp_message)}`;
        break;
      case "blog":
        if (blogData?.url) {
          window.open(blogData.url, "_blank");
        }
        return;
      case "testimonials":
        setTestimonialsOpen(true);
        return;
    }
    
    if (shareUrl) window.open(shareUrl, "_blank");
  };

  if (isLoadingContact) {
    return (
      <section id="contact" className="container-section relative overflow-hidden">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!contactContent) return null;

  return (
    <section id="contact" className="container-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background/40 dark:from-background/50 dark:to-background/20 -z-10"></div>
      
      {/* Parallax effect elements */}
      <div className="absolute inset-0 -z-20 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2426&q=80')] bg-cover bg-center bg-fixed"></div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full bg-i9-blue/10 dark:bg-i9-blue/20 text-i9-blue font-medium text-sm mb-4">
            {contactContent.title}
          </span>
          <p className="section-subtitle dark:text-gray-300">
            {contactContent.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800/70 shadow-sm rounded-xl p-8 relative z-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
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
                            <Input 
                              type="email" 
                              placeholder="seu@email.com" 
                              {...field}
                              pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                              title="Digite um email válido"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone (opcional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(00) 00000-0000" 
                            {...field}
                            pattern="\+?[0-9]{10,}"
                            title="Digite apenas números, mínimo 10 dígitos"
                          />
                        </FormControl>
                        <FormDescription>
                          Se informado, deve conter apenas números (mínimo 10 dígitos)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Serviço de Interesse</FormLabel>
                        <FormDescription>
                          Selecione o serviço que você tem interesse
                        </FormDescription>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione um serviço" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-80">
                            <SelectGroup>
                              <SelectLabel>Serviços</SelectLabel>
                              {!isLoadingServices && services?.map((service) => (
                                <SelectItem key={service.id} value={service.title}>
                                  {service.title}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Como podemos ajudar seu negócio?" 
                            className="min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          
          <div>
            <div className="bg-white dark:bg-gray-800/70 shadow-sm rounded-xl p-8 relative z-10 h-full">
              <h3 className="text-2xl font-semibold mb-6">Informações de Contato</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-i9-blue/10 dark:bg-i9-blue/20 rounded-full p-3">
                    <Mail className="w-5 h-5 text-i9-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Email</h4>
                    <a href={`mailto:${contactContent.email}`} className="text-gray-600 dark:text-gray-300 hover:text-i9-blue dark:hover:text-i9-blue transition-colors">
                      {contactContent.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-i9-blue/10 dark:bg-i9-blue/20 rounded-full p-3">
                    <Phone className="w-5 h-5 text-i9-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Telefone</h4>
                    <a href={`tel:${contactContent.phone}`} className="text-gray-600 dark:text-gray-300 hover:text-i9-blue dark:hover:text-i9-blue transition-colors">
                      {contactContent.phone}
                    </a>
                  </div>
                </div>
                
                {/* Botão de Depoimentos em Destaque */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    onClick={() => handleShareSocial("testimonials")}
                    className="w-full bg-gradient-to-r from-i9-blue to-i9-blueLight hover:from-i9-blueLight hover:to-i9-blue text-white font-medium py-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Ver Depoimentos de Clientes
                  </Button>
                </div>

                {/* Botão de Acesso ao Blog */}
                {blogData && (
                  <div className="pt-4">
                    <Button
                      onClick={() => handleShareSocial("blog")}
                      className="w-full bg-gradient-to-r from-i9-orange to-orange-500 hover:from-orange-500 hover:to-i9-orange text-white font-medium py-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      {blogData.title}
                    </Button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                      {blogData.cta_text}
                    </p>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-4">Compartilhar</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <Button 
                      onClick={() => handleShareSocial("facebook")} 
                      variant="outline"
                      className="w-full aspect-square flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30"
                      aria-label="Compartilhar no Facebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </Button>
                    <Button 
                      onClick={() => handleShareSocial("twitter")} 
                      variant="outline"
                      className="w-full aspect-square flex items-center justify-center hover:bg-sky-50 hover:text-sky-500 dark:hover:bg-sky-900/30"
                      aria-label="Compartilhar no Twitter"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </Button>
                    <Button 
                      onClick={() => handleShareSocial("linkedin")} 
                      variant="outline"
                      className="w-full aspect-square flex items-center justify-center hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30"
                      aria-label="Compartilhar no LinkedIn"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </Button>
                    <Button 
                      onClick={() => handleShareSocial("whatsapp")} 
                      variant="outline"
                      className="w-full aspect-square flex items-center justify-center hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30"
                      aria-label="Compartilhar no WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.646.075-.3-.15-1.267-.465-2.414-1.485-.893-.795-1.494-1.776-1.67-2.076-.174-.301-.018-.465.13-.615.134-.135.301-.353.452-.529.149-.176.198-.301.297-.502.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.219-.239-.582-.487-.501-.673-.51-.172-.009-.371-.01-.571-.01-.2 0-.523.074-.797.359-.273.284-1.045.942-1.045 2.299s1.07 2.669 1.22 2.87c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347z" />
                        <path d="M13.458 24h-.08a11.947 11.947 0 01-6.108-1.688l-.439-.262-4.56 1.229 1.245-4.545-.287-.455A11.934 11.934 0 011 11.882C1 5.335 6.335 0 12.882 0c3.18 0 6.15 1.232 8.4 3.472a11.717 11.717 0 013.443 8.347c0 6.548-5.335 11.882-11.267 11.882z" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonials Modal */}
      <TestimonialsModal open={testimonialsOpen} onOpenChange={setTestimonialsOpen} />
    </section>
  );
};

export default ContactForm;