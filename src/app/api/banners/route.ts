import { NextRequest, NextResponse } from 'next/server';
import { supabase, uploadBannerImage, deleteBannerImage } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * Verifica se o banner está dentro do horário configurado
 */
function isWithinTimeRange(banner: Record<string, unknown>): boolean {
  if (!banner.start_time || !banner.end_time) {
    return true;
  }

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const normalizeTime = (time: string): string => {
    const parts = time.split(':');
    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
  };

  const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
  const startTime = normalizeTime(String(banner.start_time));
  const endTime = normalizeTime(String(banner.end_time));

  const isWithinTime = currentTime >= startTime && currentTime <= endTime;

  return isWithinTime;
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

    // IMPORTANTE:
    // `.single()` estoura PGRST116 quando não existe registro OU quando existe mais de 1.
    // Em produção é comum acontecer (ex: concorrência ao ativar/desativar). Aqui escolhemos
    // de forma determinística o banner ativo mais recente.
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('url', url)
      .eq('active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return NextResponse.json(null, { headers: corsHeaders });
    }

    if (!isWithinTimeRange(data)) {
      return NextResponse.json(null, { headers: corsHeaders });
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

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(imageFile.type)) {
        return NextResponse.json(
          { error: 'Invalid image type. Accepted: jpg, png, gif, webp' },
          { status: 400, headers: corsHeaders }
        );
      }

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

    const { error: deactivateError } = await supabase
      .from('banners')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .update({ active: false })
      .eq('url', url)
      .eq('active', true);

    if (deactivateError) {
      console.error('Erro ao desativar banners existentes:', deactivateError);
    }

    const bannerData = {
      url,
      image_url: imageUrl,
      image_type: imageType,
      active: true,
      start_time: startTime || null,
      end_time: endTime || null,
    };

    const { data, error } = await supabase
      .from('banners')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Supabase type inference limitation
      .insert(bannerData)
      .select()
      .single();

    if (error) {
      if (imageType === 'upload') {
        await deleteBannerImage(imageUrl);
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

    const { data: banner, error: fetchError } = await supabase
      .from('banners')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const { error: deleteError } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (deleteError) {
      throw deleteError;
    }

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

