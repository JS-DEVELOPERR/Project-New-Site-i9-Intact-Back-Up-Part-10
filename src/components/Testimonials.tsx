import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTestimonials } from "@/hooks/use-testimonials";

// Create a new component for the Testimonials modal that will be used in contact form
export const TestimonialsModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(0);
  const { testimonials, isLoading, subscribeToTestimonials } = useTestimonials();

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToTestimonials();
    return () => {
      unsubscribe();
    };
  }, [subscribeToTestimonials]);

  const nextTestimonial = () => {
    if (!testimonials) return;
    setSelectedTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    if (!testimonials) return;
    setSelectedTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  if (isLoading || !testimonials) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl font-bold">Depoimentos de Clientes</DialogTitle>
          <DialogDescription>
            Confira o que nossos clientes dizem sobre os resultados que alcançaram
          </DialogDescription>
        </DialogHeader>
        
        {testimonials[selectedTestimonial] && (
          <div className="mt-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-i9-blue/20 flex-shrink-0">
                {testimonials[selectedTestimonial].image ? (
                  <img 
                    src={testimonials[selectedTestimonial].image} 
                    alt={testimonials[selectedTestimonial].name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-base font-semibold">{testimonials[selectedTestimonial].name}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonials[selectedTestimonial].position}</p>
                <div className="flex mt-1">
                  {[...Array(testimonials[selectedTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg mt-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm italic">
                "{testimonials[selectedTestimonial].full_testimonial}"
              </p>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              <Button 
                onClick={prevTestimonial}
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 rounded-full"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={nextTestimonial}
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 rounded-full"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TestimonialsModal;