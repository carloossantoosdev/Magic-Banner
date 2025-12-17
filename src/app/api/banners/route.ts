import { NextRequest, NextResponse } from 'next/server';
import { supabase, uploadBannerImage, deleteBannerImage } from '@/lib/supabase';

// Habilitar CORS para permitir requisições de qualquer origem
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * GET /api/banners?url=<URL_ENCODED>
 * Busca banner por URL exata
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('url', url)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum banner encontrado
        return NextResponse.json(null, { headers: corsHeaders });
      }
      throw error;
    }

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.error('Erro ao buscar banner:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar banner' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * POST /api/banners
 * Cria novo banner
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = formData.get('url') as string;
    const imageType = formData.get('image_type') as 'upload' | 'url';
    const startTime = formData.get('start_time') as string | null;
    const endTime = formData.get('end_time') as string | null;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    let imageUrl: string;

    if (imageType === 'upload') {
      const imageFile = formData.get('image') as File;
      if (!imageFile) {
        return NextResponse.json(
          { error: 'Image file is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Validar tipo de arquivo
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Accepted: jpg, png, gif, webp' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Gerar ID temporário para o upload
      const tempId = crypto.randomUUID();
      imageUrl = await uploadBannerImage(imageFile, tempId);
    } else {
      imageUrl = formData.get('image') as string;
      if (!imageUrl) {
        return NextResponse.json(
          { error: 'Image URL is required' },
          { status: 400, headers: corsHeaders }
        );
      }
    }

    const bannerData = {
      url,
      image_url: imageUrl,
      image_type: imageType,
      active: true, // Novo banner começa ativo
      start_time: startTime || null,
      end_time: endTime || null,
    };

    const { data, error } = await supabase
      .from('banners')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Supabase type inference limitation with dynamic tables
      .insert(bannerData)
      .select()
      .single();

    if (error) {
      // Se der erro, deletar a imagem que foi feita upload
      if (imageType === 'upload') {
        await deleteBannerImage(imageUrl);
      }
      
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Já existe um banner para esta URL' },
          { status: 409, headers: corsHeaders }
        );
      }
      throw error;
    }

    return NextResponse.json(data, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error('Erro ao criar banner:', error);
    return NextResponse.json(
      { error: 'Erro ao criar banner' },
      { status: 500, headers: corsHeaders }
    );
  }
}

/**
 * DELETE /api/banners?id=<ID>
 * Deleta banner por ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Buscar banner para pegar a URL da imagem antes de deletar
    const { data: banner, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Deletar banner do banco
    const { error: deleteError } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

    // Se era upload, deletar a imagem do storage
    type BannerData = {
      image_type: string;
      image_url: string;
    };
    
    if (banner && (banner as BannerData).image_type === 'upload') {
      await deleteBannerImage((banner as BannerData).image_url);
    }

    return NextResponse.json(
      { message: 'Banner deletado com sucesso' },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('Erro ao deletar banner:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar banner' },
      { status: 500, headers: corsHeaders }
    );
  }
}

