import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface HeaderContent {
  id: string;
  logo_url: string;
  nav_links: {
    name: string;
    href: string;
  }[];
  appointment_button_text: string;
  active: boolean;
  order_index: number;
}

export function useHeaderContent() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToHeaderContent = () => {
    const subscription = supabase
      .channel('header_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'header_site'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['headerContent'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch header content
  const { data: headerContent, isLoading, error } = useQuery({
    queryKey: ["headerContent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("header_site")
        .select("*")
        .eq("active", true)
        .order("order_index")
        .single();

      if (error) throw error;
      return data as HeaderContent;
    },
  });

  return {
    headerContent,
    isLoading,
    error,
    subscribeToHeaderContent,
  };
}