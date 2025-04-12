import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface FooterContent {
  id: string;
  logo_url: string;
  company_description: string;
  quick_links: {
    name: string;
    href: string;
  }[];
  services_links: {
    name: string;
    href: string;
  }[];
  social_media: {
    facebook: string;
    instagram: string;
    linkedin: string;
    twitter: string;
  };
  privacy_policy_url: string;
  terms_of_use_url: string;
  copyright_text: string;
  active: boolean;
}

export function useFooterContent() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToFooterContent = () => {
    const subscription = supabase
      .channel('footer_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'baseboard_site'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['footerContent'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch footer content
  const { data: footerContent, isLoading, error } = useQuery({
    queryKey: ["footerContent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("baseboard_site")
        .select("*")
        .eq("active", true)
        .single();

      if (error) throw error;
      return data as FooterContent;
    },
  });

  return {
    footerContent,
    isLoading,
    error,
    subscribeToFooterContent,
  };
}