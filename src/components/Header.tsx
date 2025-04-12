import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppointmentModal } from "@/components/AppointmentModal";
import { useHeaderContent } from "@/hooks/use-header-content";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  
  const { headerContent, isLoading, subscribeToHeaderContent } = useHeaderContent();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToHeaderContent();
    return () => {
      unsubscribe();
    };
  }, [subscribeToHeaderContent]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  if (isLoading || !headerContent) {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-md shadow-md py-2" : "bg-transparent py-3 sm:py-5"}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#home" className="flex items-center z-20">
          <img 
            src={headerContent.logo_url}
            alt="i9 Agência" 
            className="h-8 sm:h-10 md:h-12" 
          />
        </a>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {headerContent.nav_links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-i9-blue font-medium transition-colors text-sm lg:text-base"
              >
                {link.name}
              </a>
            ))}
            <ThemeToggle />
            <Button 
              className="btn-primary whitespace-nowrap" 
              onClick={() => setAppointmentOpen(true)}
            >
              {headerContent.appointment_button_text}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="text-foreground p-1 z-20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`fixed inset-0 bg-background transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 15 }}
      >
        <nav className="flex flex-col h-full pt-20 pb-8 px-6 bg-background">
          <div className="flex flex-col gap-2">
            {headerContent.nav_links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-i9-blue font-medium py-3 text-lg transition-colors border-b border-gray-100 dark:border-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-auto">
            <Button 
              className="btn-primary w-full justify-center text-lg py-4" 
              onClick={() => {
                setAppointmentOpen(true);
                setIsMenuOpen(false);
              }}
            >
              {headerContent.appointment_button_text}
            </Button>
          </div>
        </nav>
      </div>

      <AppointmentModal 
        open={appointmentOpen} 
        onOpenChange={setAppointmentOpen}
      />
    </header>
  );
};

export default Header;