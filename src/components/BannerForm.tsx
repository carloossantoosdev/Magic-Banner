/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { Link2, Image as ImageIcon, Clock, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BannerFormProps {
  onSuccess: () => void;
}

export function BannerForm({ onSuccess }: BannerFormProps) {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [useUpload, setUseUpload] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (useUpload && imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (!useUpload && imageUrl) {
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile, imageUrl, useUpload]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      setError('URL deve começar com https:// ou http://');
      return;
    }

    if (!useUpload && !imageUrl) {
      setError('Informe a URL da imagem');
      return;
    }

    if (useUpload && !imageFile) {
      setError('Selecione uma imagem para upload');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('url', url);
      formData.append('image_type', useUpload ? 'upload' : 'url');

      if (useUpload && imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('image', imageUrl);
      }

      if (startTime) formData.append('start_time', startTime);
      if (endTime) formData.append('end_time', endTime);

      const response = await fetch('/api/banners', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar banner');
      }

      setUrl('');
      setImageUrl('');
      setImageFile(null);
      setStartTime('');
      setEndTime('');
      setUseUpload(false);

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Novo Banner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              URL de Destino
            </Label>
            <Input
              id="url"
              type="url"
              placeholder="https://lojaexemplo.com/produto/123"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              URL completa da página onde o banner será exibido
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              {useUpload ? 'Upload de Imagem' : 'URL da Imagem'}
            </Label>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="useUpload"
                checked={useUpload}
                onChange={(e) => {
                  setUseUpload(e.target.checked);
                  setImageUrl('');
                  setImageFile(null);
                }}
                className="rounded"
              />
              <label htmlFor="useUpload" className="text-sm cursor-pointer">
                Usar upload de arquivo
              </label>
            </div>

            {useUpload ? (
              <Input
                key="file-input"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                required={useUpload}
              />
            ) : (
              <Input
                key="url-input"
                type="url"
                placeholder="https://exemplo.com/banner.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required={!useUpload}
              />
            )}
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horário de Exibição (opcional)
            </Label>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="text-xs">
                  Início (opcional)
                </Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endTime" className="text-xs">
                  Fim (opcional)
                </Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Deixe em branco para exibir o dia todo
            </p>
          </div>

          {previewUrl && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Preview do Banner
              </Label>
              <div className="border border-border rounded-lg overflow-hidden bg-gray-900/50 p-4 space-y-3">
                <div className="relative rounded-md overflow-hidden shadow-lg">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-auto"
                    onError={() => setPreviewUrl(null)}
                  />
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {url && (
                    <div className="flex items-center gap-2">
                      <Link2 className="w-3 h-3" />
                      <span className="truncate">{url}</span>
                    </div>
                  )}
                  {(startTime || endTime) && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        {startTime || '--:--'} até {endTime || '--:--'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full gap-2"
            size="lg"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'Criando...' : 'Criar Banner'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

