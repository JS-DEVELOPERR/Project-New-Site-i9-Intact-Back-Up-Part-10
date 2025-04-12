import { supabase } from './supabase';

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

export async function fetchServices() {
  const { data, error } = await supabase
    .from('nossos_servicos')
    .select('*')
    .eq('active', true)
    .order('order');

  if (error) {
    console.error('Error fetching services:', error);
    throw error;
  }

  return data;
}

export async function createService(service: Omit<Service, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('nossos_servicos')
    .insert([service])
    .select()
    .single();

  if (error) {
    console.error('Error creating service:', error);
    throw error;
  }

  return data;
}

export async function updateService(id: string, service: Partial<Service>) {
  const { data, error } = await supabase
    .from('nossos_servicos')
    .update(service)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating service:', error);
    throw error;
  }

  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase
    .from('nossos_servicos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}