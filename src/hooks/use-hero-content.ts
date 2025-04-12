import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  primary_button_text: string;
  secondary_button_text: string;
  img_type: 'video' | 'image';
  img_url: string;
  stats_users_count: number;
  stats_rating: number;
  active: boolean;
  order_index: number;
}

export function useHeroContent() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToHeroContent = () => {
    const subscription = supabase
      .channel('hero_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_1'
        },
        () => {
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['heroContent'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch hero content
  const { data: heroContent, isLoading, error } = useQuery({
    queryKey: ["heroContent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_1")
        .select("*")
        .eq("active", true)
        .order("order_index")
        .single();

      if (error) throw error;
      return data as HeroContent;
    },
  });

  return {
    heroContent,
    isLoading,
    error,
    subscribeToHeroContent,
  };
}