import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Brain, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { AuthBrand } from '../components/AuthBrand'
import { AuthField } from '../components/AuthField'
import { AuthPasswordToggle } from '../components/AuthPasswordToggle'
import { login, saveAuthSession } from '../services/authService'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit: ComponentPropsWithoutRef<'form'>['onSubmit'] = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Ingresa tu correo y contrasena para continuar.')
      return
    }

    setIsSubmitting(true)

    try {
      const session = await login({ email, password })
      saveAuthSession(session.token, session.user, remember)
      await navigate({ to: '/Home' })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No fue posible iniciar sesion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen overflow-hidden bg-surface font-sans text-on-surface lg:grid-cols-[1.45fr_0.95fr]">
      <section className="relative flex min-h-[42vh] items-end overflow-hidden border-white/10 bg-[radial-gradient(circle_at_62%_34%,rgba(172,206,191,0.13),transparent_22rem),linear-gradient(125deg,var(--color-surface-container-lowest)_0%,var(--color-surface)_48%,var(--color-surface-container-low)_100%)] p-5 lg:min-h-screen lg:border-r lg:p-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,14,16,0.62),transparent_48%,rgba(12,14,16,0.7)),repeating-linear-gradient(90deg,rgba(255,255,255,0.025)_0,rgba(255,255,255,0.025)_1px,transparent_1px,transparent_9px)]" />
        <div className="absolute right-[8%] top-[12%] hidden h-[68%] w-[42%] rounded-[3rem] border border-white/5 bg-secondary/[0.035] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_0_90px_rgba(172,206,191,0.09)] lg:block" />
        <div className="absolute bottom-0 right-[7%] hidden h-28 w-[42%] rounded-t-2xl border-t border-white/5 bg-surface-container-lowest/70 lg:block" />

        <article className="relative z-10 w-full max-w-156 rounded-2xl border border-white/10 bg-surface-container-low/75 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl lg:p-8">
          <Brain className="mb-5 text-primary" fill="currentColor" size={38} strokeWidth={2.2} />
          <h1 className="max-w-136 font-sans text-[2rem] font-bold leading-[1.12] tracking-normal text-on-surface md:text-[2.35rem]">
            Tu espacio para la introspeccion.
          </h1>
          <p className="mt-5 max-w-140 font-sans text-base leading-7 text-on-surface-variant">
            Un refugio digital enfocado en construir habitos duraderos y alcanzar una transformacion personal progresiva.
          </p>
        </article>
      </section>

      <section className="grid min-h-screen place-items-start bg-surface-container-lowest px-5 py-10 lg:px-10 lg:py-12">
        <div className="mx-auto w-full max-w-102">
          <AuthBrand />

          <header className="mt-9 mb-8">
            <h2 className="font-sans text-[2.25rem] font-bold leading-none tracking-normal text-on-surface">
              Bienvenido
            </h2>
            <p className="mt-3 font-sans text-base text-primary">Transformacion personal progresiva.</p>
          </header>

          <form className="grid gap-6" onSubmit={handleSubmit}>
            <AuthField
              autoComplete="email"
              icon={<Mail size={21} />}
              inputMode="email"
              label="Correo electronico"
              onChange={setEmail}
              placeholder="tu@correo.com"
              type="email"
              value={email}
            />

            <AuthField
              autoComplete="current-password"
              icon={<LockKeyhole size={21} />}
              label="Contrasena"
              onChange={setPassword}
              placeholder="********"
              trailing={
                <AuthPasswordToggle
                  isVisible={showPassword}
                  labelWhenHidden="Mostrar contrasena"
                  labelWhenVisible="Ocultar contrasena"
                  onToggle={() => setShowPassword((currentValue) => !currentValue)}
                />
              }
              type={showPassword ? 'text' : 'password'}
              value={password}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 font-sans text-sm text-on-surface-variant">
              <label className="inline-flex items-center gap-2">
                <input
                  checked={remember}
                  className="size-5 accent-primary"
                  onChange={(event) => setRemember(event.target.checked)}
                  type="checkbox"
                />
                <span>Recordarme</span>
              </label>
              <a className="font-bold text-primary transition hover:text-primary-fixed" href="mailto:soporte@flourish.local">
                Olvidaste tu contrasena?
              </a>
            </div>

            {errorMessage ? (
              <p className="rounded-lg border border-error/30 bg-error-container/20 p-3 font-sans text-sm leading-5 text-on-error-container">
                {errorMessage}
              </p>
            ) : null}

            <button
              className="inline-flex min-h-14 w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 font-label text-base font-bold text-on-primary shadow-[0_18px_40px_rgba(247,187,126,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-fixed disabled:translate-y-0 disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <p className="mt-8 text-center font-sans text-sm text-on-surface-variant">
            No tienes una cuenta?{' '}
            <Link className="font-bold text-primary transition hover:text-primary-fixed" to="/register">
              Registrate
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
