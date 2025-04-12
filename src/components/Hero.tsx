import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroContent } from "@/hooks/use-hero-content";
import { useEffect } from "react";

interface HeroProps {
  onOpenAppointment: () => void;
}

const Hero = ({ onOpenAppointment }: HeroProps) => {
  const { heroContent, isLoading, subscribeToHeroContent } = useHeroContent();

  // Subscribe to real-time updates
  useEffect(() => {
    const subscribeToUpdates = () => {
      const unsubscribe = subscribeToHeroContent();
      return () => {
        unsubscribe();
      };
    };

    return subscribeToUpdates();
  }, [subscribeToHeroContent]);

  // Function to scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <section id="home" className="relative min-h-screen flex items-center pt-16 sm:pt-20">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </section>
    );
  }

  const renderMedia = () => {
    if (!heroContent?.img_url) return null;

    if (heroContent.img_type === 'video') {
      // Check if it's a YouTube URL
      const youtubeMatch = heroContent.img_url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      
      if (youtubeMatch) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            className="w-full h-full absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }
      
      // Check if it's a Vimeo URL
      const vimeoMatch = heroContent.img_url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/);
      
      if (vimeoMatch) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
            className="w-full h-full absolute inset-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }
      
      // Fallback for direct video URL
      return (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroContent.img_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Image rendering
    return (
      <img 
        src={heroContent.img_url}
        alt="Hero"
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-16 sm:pt-20"
      style={{
        background: "linear-gradient(135deg, rgba(0,84,166,0.1) 0%, rgba(245,130,32,0.05) 100%)"
      }}
    >
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute w-64 h-64 -top-32 -left-32 bg-i9-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute w-64 h-64 -bottom-32 -right-32 bg-i9-orange/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="flex flex-col space-y-6 sm:space-y-8 text-center lg:text-left">
            <div>
              <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-i9-blue/10 text-i9-blue font-medium text-sm mb-4">
                {heroContent?.subtitle || "Agência de Marketing Digital"}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                <span className="text-i9-blue">{heroContent?.title || "Transforme sua presença digital com estratégias que convertem"}</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8">
                {heroContent?.description || "A i9 Agência desenvolve estratégias personalizadas de marketing digital para empresas que buscam crescimento real e mensurável."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="btn-primary w-full sm:w-auto"
                onClick={onOpenAppointment}
              >
                {heroContent?.primary_button_text || "Agendar uma Consultoria"}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-i9-blue text-i9-blue hover:bg-i9-blue/5 w-full sm:w-auto"
                onClick={scrollToServices}
              >
                {heroContent?.secondary_button_text || "Ver Nossos Serviços"}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-12 mt-6 sm:mt-8 justify-center lg:justify-start">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((item) => (
                  <div 
                    key={item}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center overflow-hidden"
                  >
                    <span className="text-xs font-medium">i9</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">{heroContent?.stats_rating || "4.9"}/5</span>
                </div>
                <p className="text-sm text-gray-500">De mais de {heroContent?.stats_users_count || "200"} clientes satisfeitos</p>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative animate-fade-in">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-tr from-i9-blue to-i9-orange opacity-20 rounded-xl"></div>
              <div className="absolute inset-2 bg-white rounded-lg shadow-xl overflow-hidden flex items-center justify-center">
                {renderMedia()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;