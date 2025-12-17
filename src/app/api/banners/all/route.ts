import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * GET /api/banners/all
 * Lista todos os banners ordenados por data de criação
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Erro ao listar banners:', error);
    return NextResponse.json(
      { error: 'Erro ao listar banners' },
      { status: 500 }
    );
  }
}

