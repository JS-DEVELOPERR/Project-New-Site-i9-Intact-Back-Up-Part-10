import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface ContactContent {
  id: string;
  title: string;
  subtitle: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  whatsapp_message: string;
  social_media: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  active: boolean;
}

export function useContactContent() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToContactContent = () => {
    const subscription = supabase
      .channel('section_5_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_5'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['contactContent'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch contact content
  const { data: contactContent, isLoading, error } = useQuery({
    queryKey: ["contactContent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_5")
        .select("*")
        .eq("active", true)
        .single();

      if (error) throw error;
      return data as ContactContent;
    },
  });

  return {
    contactContent,
    isLoading,
    error,
    subscribeToContactContent,
  };
}