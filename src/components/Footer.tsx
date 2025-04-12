import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useFooterContent } from "@/hooks/use-footer-content";

const Footer = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { footerContent, isLoading, subscribeToFooterContent } = useFooterContent();
  
  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToFooterContent();
    return () => {
      unsubscribe();
    };
  }, [subscribeToFooterContent]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };
    
    return date.toLocaleDateString('pt-BR', options);
  };

  if (isLoading || !footerContent) {
    return null;
  }
  
  return (
    <footer className="bg-i9-dark text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <img 
              src={footerContent.logo_url}
              alt="i9 Agência" 
              className="h-12 mb-6" 
            />
            <p className="text-gray-400 mb-6">
              {footerContent.company_description}
            </p>
            <div className="flex space-x-4">
              <a href={footerContent.social_media.facebook} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-i9-blue p-2 rounded-full transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={footerContent.social_media.instagram} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-i9-blue p-2 rounded-full transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={footerContent.social_media.linkedin} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-i9-blue p-2 rounded-full transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href={footerContent.social_media.twitter} target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-i9-blue p-2 rounded-full transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Links Rápidos</h3>
            <ul className="space-y-4">
              {footerContent.quick_links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Serviços</h3>
            <ul className="space-y-4">
              {footerContent.services_links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-gray-400">
              {footerContent.copyright_text}
            </p>
            <p className="text-gray-500 text-sm mt-1">{formatDate(currentDate)}</p>
          </div>
          
          <div className="flex gap-6">
            <a 
              href={footerContent.privacy_policy_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Política de Privacidade
            </a>
            <a 
              href={footerContent.terms_of_use_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Termos de Uso
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;