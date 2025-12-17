import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

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

