import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Headers CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handler OPTIONS para CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data || [], { headers: corsHeaders });
  } catch (error) {
    console.error('Erro ao listar banners:', error);
    return NextResponse.json(
      { error: 'Erro ao listar banners' },
      { status: 500, headers: corsHeaders }
    );
  }
}

