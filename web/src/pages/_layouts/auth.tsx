import cinemaVideo from '@/assets/cinema.mp4';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="grid h-screen grid-cols-1 overflow-hidden antialiased">
      <div className="relative flex-col items-center justify-center overflow-hidden bg-zinc-950 lg:flex">
        <video
          src={cinemaVideo}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-100 blur-sm"
        />
        <div className="absolute inset-0 bg-zinc-950/60" />
        <div className="relative z-10 flex h-full w-full flex-col px-2">
          <header>
            <p className="text-sm text-zinc-600">Jelly Gateway Web.</p>
          </header>
          <main className="z-10 flex flex-1 flex-col items-center justify-center">
            <Outlet />
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
    </div>
  );
}
