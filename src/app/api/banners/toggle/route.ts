import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * PATCH /api/banners/toggle
 * Atualiza o status ativo/inativo de um banner
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, active } = body;

    if (!id || typeof active !== 'boolean') {
      return NextResponse.json(
        { error: 'ID e active (boolean) são obrigatórios' },
        { status: 400 }
      );
    }

    if (active) {
      const { data: currentBanner } = await supabase
        .from('banners')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .select('url')
        .eq('id', id)
        .single();

      if (currentBanner) {
        await supabase
          .from('banners')
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .update({ active: false })
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          .eq('url', currentBanner.url)
          .neq('id', id)
          .eq('active', true);
      }
    }

    const { data, error } = await supabase
      .from('banners')
      // @ts-expect-error: ignore type error due to Supabase generated types
      .update({ active: Boolean(active) })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao atualizar status do banner:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar status do banner' },
      { status: 500 }
    );
  }
}

