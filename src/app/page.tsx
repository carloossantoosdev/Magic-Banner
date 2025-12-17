import Link from 'next/link';
import { Code2, Zap, Clock, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function HomePage() {
  const features = [
    {
      icon: Code2,
      title: 'Script Simples',
      description: 'Uma única linha de código para integrar em qualquer site.',
    },
    {
      icon: Zap,
      title: 'Exibição por URL',
      description: 'Banners aparecem automaticamente baseados na página atual.',
    },
    {
      icon: Clock,
      title: 'Agendamento',
      description: 'Configure horários específicos para exibição dos banners.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge
            variant="outline"
            className="border-primary text-primary gap-2 px-4 py-2"
          >
            <Sparkles className="w-4 h-4" />
            Plugin de Banners Dinâmicos
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Exiba banners{' '}
            <span className="text-primary">personalizados</span>
            <br />
            em qualquer e-commerce
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Crie banners dinâmicos que aparecem automaticamente com base na URL e
            horário de exibição. Basta adicionar um script.
          </p>

          <div className="flex justify-center">
            <Link href="/admin">
              <Button size="lg" className="gap-2 text-lg px-8 py-6">
                Acessar Painel
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 3L11 8L6 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 hover:border-primary transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Magic Banner Plugin</p>
            <p>
              Desafio Técnico{' '}
              <a
                href="https://futuriza.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Futuriza
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
