import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export function createBrowserSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export async function uploadBannerImage(
  file: File,
  bannerId: string
): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${bannerId}.${fileExt}`;
  const filePath = `banners/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('banner-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('banner-images').getPublicUrl(filePath);

  return publicUrl;
}

export async function deleteBannerImage(imageUrl: string): Promise<void> {
  try {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('banners')).join('/');

    await supabase.storage.from('banner-images').remove([filePath]);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
  }
}

