'use client';

import { useEffect, useState } from 'react';
import { BannerCard } from './BannerCard';
import { Banner } from '@/lib/types';

interface BannerListProps {
  refresh: number;
}

export function BannerList({ refresh }: BannerListProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/banners/all');
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, [refresh]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Banners Cadastrados</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted/50 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Banners Cadastrados</h2>
        <span className="text-sm text-muted-foreground">
          {banners.length} {banners.length === 1 ? 'banner' : 'banners'}
        </span>
      </div>

      {banners.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            Nenhum banner cadastrado ainda.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Crie seu primeiro banner usando o formulário ao lado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onDelete={loadBanners}
              onUpdate={loadBanners}
            />
          ))}
        </div>
      )}
    </div>
  );
}

