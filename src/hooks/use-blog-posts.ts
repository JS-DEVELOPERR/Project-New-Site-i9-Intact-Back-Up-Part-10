import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { BlogPost } from "@/types/BlogPost";

export function useBlogPosts() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToBlogPosts = () => {
    const subscription = supabase
      .channel('blog_posts_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'section_4'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch blog posts
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("section_4")
        .select("*")
        .eq("active", true)
        .order("order_index");

      if (error) throw error;
      return data as BlogPost[];
    },
  });

  return {
    blogPosts,
    isLoading,
    error,
    subscribeToBlogPosts,
  };
}