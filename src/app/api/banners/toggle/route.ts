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

