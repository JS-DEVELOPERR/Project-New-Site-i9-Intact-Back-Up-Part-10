import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface AboutContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image_url: string;
  active: boolean;
  order_index: number;
  benefits: {
    id: string;
    benefit_text: string;
    order_index: number;
  }[];
}

export function useAboutContent() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToAboutContent = () => {
    // Subscribe to section_3 changes
    const section3Subscription = supabase
      .channel('section_3_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_3'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
        }
      )
      .subscribe();

    // Subscribe to section_3_benefits changes
    const benefitsSubscription = supabase
      .channel('section_3_benefits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_3_benefits'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['aboutContent'] });
        }
      )
      .subscribe();

    return () => {
      section3Subscription.unsubscribe();
      benefitsSubscription.unsubscribe();
    };
  };

  // Fetch about content
  const { data: aboutContent, isLoading, error } = useQuery({
    queryKey: ["aboutContent"],
    queryFn: async () => {
      // First get the main section content
      const { data: section3Data, error: section3Error } = await supabase
        .from("section_3")
        .select("*")
        .eq("active", true)
        .order("order_index")
        .single();

      if (section3Error) throw section3Error;

      if (!section3Data) return null;

      // Then get the benefits
      const { data: benefitsData, error: benefitsError } = await supabase
        .from("section_3_benefits")
        .select("*")
        .eq("active", true)
        .eq("section_3_id", section3Data.id)
        .order("order_index");

      if (benefitsError) throw benefitsError;

      return {
        ...section3Data,
        benefits: benefitsData || []
      } as AboutContent;
    },
  });

  return {
    aboutContent,
    isLoading,
    error,
    subscribeToAboutContent,
  };
}