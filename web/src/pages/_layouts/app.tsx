import { Outlet } from 'react-router-dom';

import logo from '@/assets/favicon.png';
import cinemaVideo from '@/assets/cinema.mp4';

export function AppLayout() {
  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden antialiased lg:grid-cols-2">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-zinc-950 lg:flex">
        <video
          src={cinemaVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-100 blur-sm"
        />
        <div className="absolute inset-0 bg-zinc-950/60" />
        <div className="relative z-10 flex h-full w-full flex-col gap-6 border-r-2 border-purple-600 px-4 py-2">
          <header>
            <p className="text-sm text-zinc-600">Jelly Gateway Web.</p>
          </header>
          <main className="z-10 flex flex-1 flex-col items-center justify-center gap-6">
            <img
              src={logo}
              className="h-62 w-62"
              alt="logo cycle finance app"
            />
            <div className="text-center">
              <h2 className="text-4xl font-medium tracking-tight text-zinc-200">
                Jelly <span className="text-purple-600">Gateway</span>
              </h2>
              <p className="text-md text-zinc-500">
                Sua plataforma de filmes, séries, animes e desenhos.
              </p>
            </div>
          </main>
          <footer className="flex justify-between">
            <p className="text-sm text-zinc-600">
              © {new Date().getFullYear()} Jelly Gateway.
            </p>
            <p className="text-sm text-zinc-600">
              Todos os direitos reservados.
            </p>
          </footer>
        </div>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
