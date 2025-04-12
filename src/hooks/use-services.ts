import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Service {
  id: string;
  title: string;
  short_description: string;
  detailed_description: string;
  features: string[];
  price_range: string;
  base_price?: number;
  price_type?: 'fixed' | 'hourly' | 'monthly' | 'project';
  minimum_contract_months?: number;
  setup_fee?: number;
  delivery_time?: string;
  active: boolean;
  order?: number;
  icon?: string;
  category?: string;
  seo_keywords?: string[];
  recommended_for?: string[];
  requirements?: string[];
}

export function useServices() {
  const queryClient = useQueryClient();

  // Subscribe to realtime changes
  const subscribeToServices = () => {
    const subscription = supabase
      .channel('services_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'nossos_servicos'
        },
        () => {
          // Invalidate and refetch when data changes
          queryClient.invalidateQueries({ queryKey: ['services'] });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  // Fetch all active services
  const { data: services, isLoading, error } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nossos_servicos")
        .select("*")
        .eq("active", true)
        .order("order");

      if (error) throw error;
      return data as Service[];
    },
  });

  // Create new service
  const createService = useMutation({
    mutationFn: async (newService: Omit<Service, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("nossos_servicos")
        .insert([newService])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  // Update service
  const updateService = useMutation({
    mutationFn: async ({ id, ...service }: Partial<Service> & { id: string }) => {
      const { data, error } = await supabase
        .from("nossos_servicos")
        .update(service)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  // Delete service
  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("nossos_servicos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return {
    services,
    isLoading,
    error,
    createService,
    updateService,
    deleteService,
    subscribeToServices,
  };
}