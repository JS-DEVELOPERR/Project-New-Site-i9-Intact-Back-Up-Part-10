import { useState, useRef, useEffect } from "react";
import { 
  SearchIcon, BarChart3, MonitorSmartphone, LineChart, MessageSquare, 
  Target, Globe, TrendingUp, Instagram, Linkedin, Mail, Layout, 
  MessageCircle, Star, Brush, Users, DollarSign, BarChartHorizontal, 
  RefreshCw, Video, MailWarning, Search, Database, Smartphone, 
  ShoppingBag, MousePointer, Locate, Building, Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ServiceModal from "@/components/ServiceModal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useToast } from "@/hooks/use-toast";
import { useServices, type Service } from "@/hooks/use-services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const iconMap = {
  "search": SearchIcon,
  "bar-chart-3": BarChart3,
  "monitor-smartphone": MonitorSmartphone,
  "line-chart": LineChart,
  "message-square": MessageSquare,
  "target": Target,
  "globe": Globe,
  "trending-up": TrendingUp,
  "instagram": Instagram,
  "linkedin": Linkedin,
  "mail": Mail,
  "layout": Layout,
  "message-circle": MessageCircle,
  "star": Star,
  "brush": Brush,
  "users": Users,
  "dollar-sign": DollarSign,
  "bar-chart-horizontal": BarChartHorizontal,
  "refresh-cw": RefreshCw,
  "video": Video,
  "mail-warning": MailWarning,
  "database": Database,
  "smartphone": Smartphone,
  "shopping-bag": ShoppingBag,
  "mouse-pointer": MousePointer,
  "locate": Locate,
  "building": Building,
  "youtube": Youtube,
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllServicesModalOpen, setIsAllServicesModalOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const [api, setApi] = useState<any>(null);
  
  // Fetch services from Supabase
  const { services: unsortedServices, isLoading, subscribeToServices } = useServices();

  // Sort services alphabetically by title
  const services = unsortedServices?.sort((a, b) => a.title.localeCompare(b.title));

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToServices();
    return () => {
      unsubscribe();
    };
  }, [subscribeToServices]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (api) {
      const interval = setInterval(() => {
        api.scrollNext();
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [api]);

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  return (
    <section id="services" className="container-section relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 dark:from-background/20 dark:to-background/40 -z-10 opacity-80"></div>
      
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-i9-blue/10 dark:bg-i9-blue/20 text-i9-blue font-medium text-sm mb-4">
          Nossos Serviços
        </span>
        <p className="section-subtitle dark:text-gray-300">
          Oferecemos um conjunto abrangente de serviços de marketing digital para impulsionar sua marca e gerar resultados mensuráveis.
        </p>
      </div>

      <div className="mt-12 px-8 md:px-12" ref={carouselRef}>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {services?.map((service, index) => {
                const IconComponent = iconMap[service.icon] || MessageSquare;
                
                return (
                  <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                    <div 
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-i9-blue/20 dark:hover:border-i9-blue/40 group h-full cursor-pointer"
                      onClick={() => handleServiceClick(service)}
                    >
                      <div className="bg-i9-blue/10 dark:bg-i9-blue/20 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-i9-blue group-hover:text-white transition-all">
                        <IconComponent className="w-6 h-6 text-i9-blue group-hover:text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{service.short_description}</p>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="absolute top-1/2 -translate-y-1/2 -left-6 -right-6 flex justify-between pointer-events-none z-10">
              <CarouselPrevious className="relative pointer-events-auto w-10 h-10" />
              <CarouselNext className="relative pointer-events-auto w-10 h-10" />
            </div>
          </Carousel>
        </div>
      </div>

      <div className="mt-16 text-center">
        <Button 
          className="btn-primary"
          onClick={() => setIsAllServicesModalOpen(true)}
        >
          Ver Todos os Serviços
        </Button>
      </div>

      {selectedService && (
        <ServiceModal 
          service={selectedService} 
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onRequestQuote={() => {
            toast({
              title: "Solicitação de proposta enviada!",
              description: `Você será redirecionado para agendar uma consultoria para ${selectedService.title}.`,
            });
            
            setIsModalOpen(false);
            
            const event = new CustomEvent('openAppointmentModal', { 
              detail: { serviceName: selectedService.title }
            });
            window.dispatchEvent(event);
          }}
        />
      )}

      <AllServicesModal
        open={isAllServicesModalOpen}
        onOpenChange={setIsAllServicesModalOpen}
        services={services || []}
        onServiceSelect={handleServiceClick}
      />
    </section>
  );
};

interface AllServicesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  services: Service[];
  onServiceSelect: (service: Service) => void;
}

const AllServicesModal = ({ open, onOpenChange, services, onServiceSelect }: AllServicesModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Todos os Nossos Serviços</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {services.map((service, index) => {
            const IconComponent = iconMap[service.icon] || MessageSquare;
            
            return (
              <div
                key={index}
                className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors flex items-center gap-3"
                onClick={() => {
                  onOpenChange(false);
                  setTimeout(() => onServiceSelect(service), 300);
                }}
              >
                <div className="bg-i9-blue/10 dark:bg-i9-blue/20 rounded-full p-2 flex-shrink-0">
                  <IconComponent className="w-5 h-5 text-i9-blue" />
                </div>
                <span className="font-medium">{service.title}</span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Services;