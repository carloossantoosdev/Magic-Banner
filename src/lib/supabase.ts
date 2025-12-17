import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client para API routes (server-side)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Cria um client Supabase para uso em componentes client-side
 * com suporte a autenticação
 */
export function createBrowserSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

/**
 * Upload de imagem para o Supabase Storage
 * @param file - Arquivo de imagem
 * @param bannerId - ID único para o arquivo
 * @returns URL pública da imagem
 */
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

/**
 * Remove imagem do Supabase Storage
 * @param imageUrl - URL da imagem a ser removida
 */
export async function deleteBannerImage(imageUrl: string): Promise<void> {
  try {
    // Extrair o path do storage da URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('banners')).join('/');

    await supabase.storage.from('banner-images').remove([filePath]);
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    // Não lançar erro para não bloquear a deleção do banner
  }
}

