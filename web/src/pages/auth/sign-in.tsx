import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { CheckCircleIcon, EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Helmet title="Sign-In" />

      <div className="flex w-full max-w-100 flex-col gap-8">
        <header className="flex flex-col gap-2 text-left">
          <h1 className="p-4 text-3xl font-semibold tracking-tight text-white">
            Entre na sua conta!
          </h1>
          <p className="text-muted-foreground text-sm">
            Bem-vindo! Insira seus dados para acessar à plataforma Jelly
            Gateway.
          </p>
        </header>

        <form
          className="flex flex-col gap-6"
          // onSubmit={handleSubmit((data) => handleCheckOut(data))}
        >
          <div className="space-y-4">
            <Field className="space-y-2">
              <FieldLabel className="font-medium text-white">E-mail</FieldLabel>
              <Input
                // {...register('email')}
                type="email"
                placeholder="exemplo@email.com"
                className="h-11 text-white transition-all focus:ring-blue-600"
              />
              {/* {errors.email && (
                  <span className="text-xs text-red-500">
                    {errors.email.message}
                  </span>
                )} */}
            </Field>

            <Field className="space-y-2">
              <FieldLabel className="font-medium text-white">Senha</FieldLabel>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  // {...register('password')}
                  placeholder="••••••••"
                  className="h-11 pr-10 text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors hover:text-white"
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
              {/* {errors.password && (
                  <span className="text-xs text-red-500">
                    {errors.password.message}
                  </span>
                )} */}
            </Field>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              // disabled={isSubmitting || isFormEmpty || !paymentMethod}
              className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 bg-zinc-900 text-white shadow-sm transition-all hover:border-2 hover:border-purple-600 hover:bg-zinc-800 hover:text-purple-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:border-purple-800 dark:hover:text-purple-600"
            >
              {/* {isSubmitting && (
                  <CircleNotchIcon className="h-4 w-4 animate-spin" />
                )} */}
              Confirmar
            </Button>
            <p className="sticky flex justify-end gap-2 text-xs text-white">
              Não tem conta?{' '}
              <Link className="font-light text-blue-600 hover:underline" to="/">
                Checkout
              </Link>
            </p>
          </div>
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
    </>
  );
}
