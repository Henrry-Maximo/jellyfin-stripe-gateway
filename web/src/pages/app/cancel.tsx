import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function Cancel() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Helmet title="Pagamento cancelado" />

      <main className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
            <div className="relative rounded-full bg-red-500/10 p-6 ring-1 ring-red-500/30">
              <XCircleIcon weight="fill" className="h-16 w-16 text-red-500" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-accent-foreground text-2xl font-semibold tracking-tight">
              Pagamento cancelado
            </h1>
            <p className="text-muted-foreground max-w-sm text-sm">
              Seu pagamento foi cancelado. Nenhuma cobrança foi realizada. Tente
              novamente quando quiser.
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="relative h-12 w-12">
              <svg className="-rotate-90" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="2" className="text-red-500/20" />
                <circle
                  cx="18" cy="18" r="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="100"
                  strokeDashoffset={100 - (countdown / 10) * 100}
                  strokeLinecap="round"
                  className="text-red-500 transition-all duration-1000"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-red-400">
                {countdown}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Voltando ao início...
            </p>
          </div>
        </div>

        <Button
          onClick={() => navigate('/')}
          className="cursor-pointer bg-zinc-900 text-white hover:border-2 hover:border-purple-600 hover:bg-zinc-800 hover:text-purple-500"
        >
          Voltar agora
        </Button>
      </main>
    </>
  );
}
