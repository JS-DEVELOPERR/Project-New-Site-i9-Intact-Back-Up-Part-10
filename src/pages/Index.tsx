
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import BlogPreview from "@/components/BlogPreview";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { AppointmentModal } from "@/components/AppointmentModal";

// Define services in alphabetical order
const services = [
  { title: "Análise de Dados" },
  { title: "Aplicativos Móveis e Desenvolvimento de Soluções Digitais" },
  { title: "Automação de Marketing" },
  { title: "Branding Digital" },
  { title: "Consultoria de Marketing Digital" },
  { title: "Copywriting" },
  { title: "Desenvolvimento Web" },
  { title: "Desenvolvimento de Site e Landing Pages" },
  { title: "Design Gráfico e Criação Visual" },
  { title: "Email Marketing" },
  { title: "Estratégias de Expansão Internacional (Global Marketing)" },
  { title: "Facebook Ads" },
  { title: "Gestão de Campanhas de Publicidade em Vídeo" },
  { title: "Gestão de Comunidades Online" },
  { title: "Gestão de Reputação Online (ORM)" },
  { title: "Gestão de Tráfego Pago" },
  { title: "Google Ads" },
  { title: "Google Analytics e Relatórios de Dados" },
  { title: "Influencer Marketing" },
  { title: "Instagram Ads" },
  { title: "LinkedIn Ads" },
  { title: "Marketing de Afiliados" },
  { title: "Marketing de Conteúdo" },
  { title: "Marketing Imobiliário" },
  { title: "Marketing para eCommerce" },
  { title: "PPC (Pay-Per-Click) em Google e Bing" },
  { title: "Pesquisa de Mercado e Análise de Competidores" },
  { title: "Redes Sociais" },
  { title: "Remarketing/Retargeting" },
  { title: "SEO" },
  { title: "Vídeo Marketing" },
  { title: "Web Analytics & Conversion Optimization" },
];

const Index = () => {
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  
  // Handle opening appointment modal from other components
  useEffect(() => {
    const handleOpenAppointmentModal = (event: CustomEvent) => {
      if (event.detail?.serviceName) {
        setSelectedService(event.detail.serviceName);
        setAppointmentOpen(true);
      }
    };

    // Add event listener
    window.addEventListener('openAppointmentModal', handleOpenAppointmentModal as EventListener);
    
    // Cleanup
    return () => {
      window.removeEventListener('openAppointmentModal', handleOpenAppointmentModal as EventListener);
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <div id="home">
          <Hero onOpenAppointment={() => setAppointmentOpen(true)} />
        </div>
        <Services />
        <About />
        <BlogPreview />
        <ContactForm />
      </main>
      <Footer />
      
      {/* Modal de Agendamento */}
      <AppointmentModal 
        open={appointmentOpen} 
        onOpenChange={setAppointmentOpen} 
        services={services}
        selectedService={selectedService}
      />
    </div>
  );
};

export default Index;
