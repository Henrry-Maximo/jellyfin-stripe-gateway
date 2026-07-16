import { useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { checkout as checkoutApi } from '@/api/checkout';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  CircleNotchIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@phosphor-icons/react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

const checkoutForm = z.object({
  email: z.email('E-mail inválido'),
  username: z
    .string()
    .min(1, 'Username obrigatório')
    .max(38, 'Username deve ter no máximo 38 caracteres.')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username só pode conter letras, números e _'),
  password: z
    .string()
    .min(4, 'Senha deve ter no mínimo 4 caracteres')
    .max(32, 'Senha deve ter no máximo 32 caracteres.')
    .regex(/^\S+$/, 'Senha não pode conter espaços'),
});

type CheckoutForm = z.infer<typeof checkoutForm>;

export function Checkout() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutForm),
  });

  const fields = watch();
  const isFormEmpty = !fields.email || !fields.username || !fields.password;

  const { mutateAsync: handleCheckOut } = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const { url } = await checkoutApi(data);

      toast.success('Redirecionando para plataforma Stripe.');

      new Promise((resolve) => setTimeout(resolve, 2000)); // aguardar por 2 segundos

      window.location.href = url;
    },

    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error('Username já está em uso.');
      } else {
        toast.error('Erro ao realizar checkout.');
      }
    },
  });

  return (
    <>
      <Helmet title="Checkout" />

      <main className="flex h-full flex-col items-center justify-center p-8 lg:p-20">
        <div className="flex w-full max-w-100 flex-col gap-8">
          <header className="flex flex-col gap-2 text-left">
            <div className="flex justify-end">
              <ThemeToggle />
            </div>

            <h1 className="text-accent-foreground p-4 text-3xl font-semibold tracking-tight">
              Assine agora!
            </h1>
            <p className="text-muted-foreground text-sm">
              Bem-vindo! Insira seus dados para solicitar acesso à plataforma
              Jellyfin.
            </p>
          </header>

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit((data) => handleCheckOut(data))}
          >
            <div className="space-y-4">
              <Field className="space-y-2">
                <FieldLabel className="text-accent-foreground font-medium">
                  Usuário
                </FieldLabel>
                <Input
                  {...register('username')}
                  type="text"
                  placeholder="Usuário"
                  className="text-accent-foreground h-11 transition-all focus:ring-blue-600"
                />
                {errors.username && (
                  <span className="text-xs text-red-500">
                    {errors.username.message}
                  </span>
                )}
              </Field>

              <Field className="space-y-2">
                <FieldLabel className="text-accent-foreground font-medium">
                  E-mail
                </FieldLabel>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="exemplo@email.com"
                  className="text-accent-foreground h-11 transition-all focus:ring-blue-600"
                />
                {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </Field>

              <Field className="space-y-2">
                <FieldLabel className="text-accent-foreground font-medium">
                  Senha
                </FieldLabel>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    placeholder="••••••••"
                    className="text-accent-foreground h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? 'Ocultar senha' : 'Mostrar senha'
                    }
                    title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    className="text-muted-foreground hover:text-accent-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
                  >
                    <div className="relative h-4 w-4">
                      <EyeIcon
                        className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${showPassword ? 'scale-50 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
                      />
                      <EyeSlashIcon
                        className={`absolute inset-0 h-4 w-4 transition-all duration-200 ${showPassword ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-90 opacity-0'}`}
                      />
                    </div>
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </Field>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isFormEmpty}
              className="flex h-11 w-full flex-row items-center justify-center gap-2 bg-zinc-900 text-white shadow-sm transition-all hover:cursor-pointer hover:border-2 hover:border-purple-600 hover:bg-zinc-800 hover:text-purple-500 active:scale-[0.98] dark:hover:border-purple-800 dark:hover:text-purple-600"
            >
              {isSubmitting && (
                <CircleNotchIcon className="h-4 w-4 animate-spin" />
              )}
              Assinar agora
            </Button>
          </form>
          <div className="relative overflow-hidden rounded-xl border border-purple-600/30 to-transparent p-4">
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-purple-600/10 blur-2xl" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground text-xs tracking-widest uppercase">
                  Plano mensal
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-muted-foreground text-sm">R$</span>
                  <span className="text-2xl leading-none font-bold tracking-tight text-purple-400">
                    5
                  </span>
                  <span className="text-muted-foreground text-sm">/mês</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon
                    weight="fill"
                    className="h-3.5 w-3.5 text-purple-500"
                  />
                  <span className="text-muted-foreground text-xs">
                    Filmes e séries
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon
                    weight="fill"
                    className="h-3.5 w-3.5 text-purple-500"
                  />
                  <span className="text-muted-foreground text-xs">
                    Animes e desenhos
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircleIcon
                    weight="fill"
                    className="h-3.5 w-3.5 text-purple-500"
                  />
                  <span className="text-muted-foreground text-xs">
                    Acesso imediato
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
