-- Criação da tabela banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  image_type TEXT CHECK (image_type IN ('upload', 'url')),
  start_time TIME,
  end_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para busca rápida por URL
CREATE INDEX IF NOT EXISTS idx_banners_url ON banners(url);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON banners
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Permitir acesso público para leitura
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura pública de banners"
ON banners FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção pública de banners"
ON banners FOR INSERT
WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de banners"
ON banners FOR UPDATE
USING (true);

CREATE POLICY "Permitir deleção pública de banners"
ON banners FOR DELETE
USING (true);

