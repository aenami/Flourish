import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowRight, KeyRound, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

import { AuthBrand } from '../components/AuthBrand'
import { AuthField } from '../components/AuthField'
import { AuthPasswordToggle } from '../components/AuthPasswordToggle'
import { register, saveAuthSession } from '../services/authService'

export function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit: ComponentPropsWithoutRef<'form'>['onSubmit'] = async (event) => {
    event.preventDefault()
    setErrorMessage('')

    if (!username || !email || !password) {
      setErrorMessage('Completa tu nombre, correo y llave de acceso.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('La llave de acceso debe tener minimo 8 caracteres.')
      return
    }

    setIsSubmitting(true)

    try {
      const session = await register({ username, email, password })
      saveAuthSession(session.token, session.user)
      await navigate({ to: '/Home' })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No fue posible crear tu cuenta.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="grid min-h-screen overflow-hidden bg-surface font-sans text-on-surface lg:grid-cols-[1fr_1fr]">
      <section className="relative min-h-120 overflow-hidden bg-[radial-gradient(circle_at_35%_44%,rgba(172,206,191,0.1),transparent_18rem),linear-gradient(90deg,var(--color-surface-container-lowest)_0%,var(--color-surface)_100%)] p-5 lg:min-h-screen lg:p-10">
        <AuthBrand compact />

        <div className="absolute -left-8 -top-10 h-136 w-136 rounded-t-full border border-white/5 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.045)_0,rgba(255,255,255,0.045)_2px,transparent_2px,transparent_13px),linear-gradient(90deg,rgba(12,14,16,0.8),rgba(40,42,44,0.32))]" />
        <div className="absolute bottom-[30%] left-[9%] h-36 w-100 max-w-[70vw] -rotate-12 rounded-[58%_14%_58%_16%] bg-[linear-gradient(145deg,transparent_15%,rgba(51,53,55,0.44)_16%,rgba(26,28,30,0.72)_58%,transparent_59%)] shadow-[0_32px_44px_rgba(0,0,0,0.36)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,14,16,0.5),transparent_50%,rgba(12,14,16,0.35))]" />

        <article className="absolute bottom-9 left-5 right-5 z-10 lg:bottom-16 lg:left-10 lg:right-20">
          <h1 className="max-w-160 font-sans text-[2.3rem] font-bold leading-[1.08] tracking-normal text-on-surface md:text-[3rem] lg:text-[3.25rem]">
            Construye tu <span className="text-primary">Habitacion.</span>
            <br />
            Forja tus <span className="text-primary">Identidades.</span>
          </h1>
          <p className="mt-5 max-w-140 font-sans text-base leading-7 text-on-surface-variant">
            Mas que una lista de tareas, un refugio digital para tu introspeccion. Comienza el viaje para alinear tus
            acciones diarias con la persona en la que deseas convertirte.
          </p>
        </article>
      </section>

      <section className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_50%_62%,rgba(247,187,126,0.08),transparent_21rem),linear-gradient(120deg,var(--color-surface)_0%,var(--color-surface-container-low)_100%)] px-5 py-10 lg:px-10">
        <div className="w-full max-w-104 rounded-2xl border border-white/10 bg-surface-container/90 p-8 shadow-[0_28px_80px_rgba(0,0,0,0.38),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
          <header className="mb-6">
            <h2 className="font-sans text-[1.55rem] font-bold leading-tight tracking-normal text-on-surface">
              Bienvenido a tu Espacio
            </h2>
            <p className="mt-2 font-sans text-sm text-on-surface-variant">Inicia tu proceso de evolucion personal.</p>
          </header>

          <form className="grid gap-5" onSubmit={handleSubmit}>
            <AuthField
              compact
              autoComplete="name"
              icon={<UserRound size={18} />}
              label="Nombre de usuario"
              onChange={setUsername}
              placeholder="Tu nombre"
              type="text"
              value={username}
            />

            <AuthField
              compact
              autoComplete="email"
              icon={<Mail size={18} />}
              inputMode="email"
              label="Correo electronico"
              onChange={setEmail}
              placeholder="tu@correo.com"
              type="email"
              value={email}
            />

            <AuthField
              compact
              autoComplete="new-password"
              helperText="Minimo 8 caracteres para asegurar tu habitacion."
              icon={<KeyRound size={18} />}
              label="Llave de acceso"
              onChange={setPassword}
              placeholder="********"
              trailing={
                <AuthPasswordToggle
                  isVisible={showPassword}
                  labelWhenHidden="Mostrar llave de acceso"
                  labelWhenVisible="Ocultar llave de acceso"
                  onToggle={() => setShowPassword((currentValue) => !currentValue)}
                  size={18}
                />
              }
              type={showPassword ? 'text' : 'password'}
              value={password}
            />

            {errorMessage ? (
              <p className="rounded-lg border border-error/30 bg-error-container/20 p-3 font-sans text-sm leading-5 text-on-error-container">
                {errorMessage}
              </p>
            ) : null}

            <button
              className="mt-1 inline-flex min-h-13 w-full items-center justify-center gap-3 rounded-lg bg-primary px-4 font-label text-[15px] font-bold text-on-primary shadow-[0_18px_40px_rgba(247,187,126,0.16)] transition hover:-translate-y-0.5 hover:bg-primary-fixed disabled:translate-y-0 disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? 'Creando...' : 'Comenzar mi Evolucion'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-5 text-center font-sans text-sm text-on-surface-variant">
            Ya tienes una habitacion?{' '}
            <Link className="font-bold text-primary transition hover:text-primary-fixed" to="/login">
              Ingresar
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
