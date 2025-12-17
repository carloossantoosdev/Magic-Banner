/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Code2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BannerForm } from '@/components/BannerForm';
import { BannerList } from '@/components/BannerList';

export default function AdminPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://your-domain.vercel.app');

  const scriptCode = `<script src="${origin}/magic-banner.js"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col hover:opacity-80 transition">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Magic Banner</span>
            </div>
            <span className="text-xs text-muted-foreground ml-12">
              Plugin de banners dinâmicos
            </span>
          </Link>

          <div className="flex items-center gap-2 text-sm text-primary">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Painel Admin
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Script Embutível */}
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5" />
                  Script Embutível
                </CardTitle>
                <CardDescription className="mt-2">
                  Adicione este script em qualquer página para exibir banners
                  automaticamente.
                </CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <code className="text-primary">{scriptCode}</code>
            </div>
          </CardContent>
        </Card>

        {/* Layout em 2 Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Coluna Esquerda - Formulário (40%) */}
          <div className="lg:col-span-2">
            <BannerForm onSuccess={handleSuccess} />
          </div>

          {/* Coluna Direita - Lista (60%) */}
          <div className="lg:col-span-3">
            <BannerList refresh={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

