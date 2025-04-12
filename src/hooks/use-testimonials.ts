import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  image: string;
  content: string;
  rating: number;
  full_testimonial: string;
  active: boolean;
  order_index: number;
}

export function useTestimonials() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToTestimonials = () => {
    const subscription = supabase
      .channel('testimonials_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'depoimentos_i9'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['testimonials'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch testimonials
  const { data: testimonials, isLoading, error } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("depoimentos_i9")
        .select("*")
        .eq("active", true)
        .order("order_index");

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  return {
    testimonials,
    isLoading,
    error,
    subscribeToTestimonials,
  };
}