import { Helmet } from 'react-helmet-async';
import { CheckCircleIcon } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { env } from '@/env';

export function Success() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          window.location.replace(env.VITE_REDIRECT_JELLYFIN);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet title="Pagamento confirmado" />

      <main className="flex min-h-full flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl" />
            <div className="relative rounded-full bg-purple-600/10 p-6 ring-1 ring-purple-500/30">
              <CheckCircleIcon
                weight="fill"
                className="h-16 w-16 text-purple-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-accent-foreground text-2xl font-semibold tracking-tight">
              Pagamento confirmado!
            </h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              Sua conta está sendo criada. Em breve você receberá um e-mail com
              as instruções de acesso à plataforma Jellyfin.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative h-12 w-12">
              <svg className="-rotate-90" viewBox="0 0 36 36" fill="none">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-purple-600/20"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100"
                  strokeDashoffset={100 - (countdown / 10) * 100}
                  strokeLinecap="round"
                  className="text-purple-500 transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-purple-400">
                {countdown}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Redirecionando para a plataforma...
            </p>
          </div>
        </div>

        <Button
          onClick={() => window.location.replace(env.VITE_REDIRECT_JELLYFIN)}
          className="cursor-pointer bg-zinc-900 text-white hover:border-2 hover:border-purple-600 hover:bg-zinc-800 hover:text-purple-500"
        >
          Abrir imediatamente
        </Button>
      </main>
    </>
  );
}
