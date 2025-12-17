'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ExternalLink, Clock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Banner } from '@/lib/types';

interface BannerCardProps {
  banner: Banner;
  onDelete: () => void;
  onUpdate: () => void;
}

export function BannerCard({ banner, onDelete, onUpdate }: BannerCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [active, setActive] = useState(banner.active ?? true);
  const [updating, setUpdating] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/banners?id=${banner.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar banner');
      }

      onDelete();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Erro ao deletar banner:', error);
      alert('Erro ao deletar banner');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/banners/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: banner.id,
          active: checked,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar status');
      }

      setActive(checked);
      
      onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status do banner');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="shrink-0 w-32 h-20 bg-muted rounded overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={banner.image_url}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <a
                href={banner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:text-primary flex items-center gap-1 truncate group"
              >
                <span className="truncate">{banner.url}</span>
                <ExternalLink className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition" />
              </a>

              {banner.start_time && banner.end_time && (
                <Badge
                  variant="outline"
                  className="mt-2 text-xs gap-1"
                >
                  <Clock className="w-3 h-3" />
                  {banner.start_time} - {banner.end_time}
                </Badge>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Criado em{' '}
                {format(new Date(banner.created_at), 'dd/MM/yyyy', {
                  locale: ptBR,
                })}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {active ? 'Ativo' : 'Inativo'}
                </span>
                <Switch
                  checked={active}
                  onCheckedChange={handleToggleActive}
                  disabled={updating}
                />
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deletar Banner</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este banner? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium truncate">{banner.url}</p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deletando...' : 'Deletar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

