import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLang, ui } from '../i18n'
import { contacts, CONTACT_EMAIL } from '../data/contacts'
import { ICONS } from './Icons'
import Section from './Section'

const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const configured = Boolean(EMAILJS.service && EMAILJS.template && EMAILJS.key)

export default function Contact() {
  const { t } = useLang()
  const [result, setResult] = useState(null) // 'ok' | 'fail' | 'fallback'
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: '', email: '', message: '', website: '' },
  })

  const onSubmit = async (data) => {
    if (data.website) return // honeypot: robôs preenchem, pessoas não
    setResult(null)
    if (!configured) {
      // Sem EmailJS configurado, abre o app de e-mail já preenchido.
      const body = `${data.message}\n\n— ${data.name} (${data.email})`
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Contato pelo portfólio: ${data.name}`)}&body=${encodeURIComponent(body)}`
      setResult('fallback')
      return
    }
    try {
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(EMAILJS.service, EMAILJS.template, {
        from_name: data.name, from_email: data.email, reply_to: data.email, message: data.message,
      }, { publicKey: EMAILJS.key })
      setResult('ok')
      reset()
    } catch {
      setResult('fail')
    }
  }

  const err = (k) => errors[k] && <span className="field-error" id={`${k}-err`} role="alert">{t(ui.contact[errors[k].type === 'pattern' ? 'errEmail' : errors[k].type === 'minLength' ? 'errMin' : 'errRequired'])}</span>

  return (
    <Section id="contato" eyebrow={t(ui.contact.eyebrow)} title={t(ui.contact.title)} intro={t(ui.contact.intro)}>
      <div className="grid contact-grid">
        <div className="card">
          <h3>{t(ui.contact.direct)}</h3>
          <ul className="contact-list">
            {contacts.map((c) => {
              const Icon = ICONS[c.key]
              return (
                <li key={c.key}>
                  <a href={c.href} target={c.key === 'email' ? undefined : '_blank'} rel="noopener noreferrer" aria-label={`${c.label}: ${c.value}`}>
                    <span className="contact-ico"><Icon /></span>
                    <span><strong>{c.label}</strong><small>{c.value}</small></span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <form className="card form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="field">
            <label htmlFor="name">{t(ui.contact.name)}</label>
            <input id="name" autoComplete="name" placeholder={t(ui.contact.namePh)} aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-err' : undefined} {...register('name', { required: true, minLength: 2 })} />
            {err('name')}
          </div>
          <div className="field">
            <label htmlFor="email">{t(ui.contact.email)}</label>
            <input id="email" type="email" autoComplete="email" placeholder={t(ui.contact.emailPh)} aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-err' : undefined}
              {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/ })} />
            {err('email')}
          </div>
          <div className="field">
            <label htmlFor="message">{t(ui.contact.message)}</label>
            <textarea id="message" rows={5} placeholder={t(ui.contact.messagePh)} aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'message-err' : undefined} {...register('message', { required: true, minLength: 10 })} />
            {err('message')}
          </div>
          <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" {...register('website')} />
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t(ui.contact.sending) : t(ui.contact.send)}
          </button>
          <p className={`form-status ${result === 'fail' ? 'is-error' : result ? 'is-ok' : ''}`} role="status" aria-live="polite">
            {result === 'ok' && t(ui.contact.ok)}
            {result === 'fail' && t(ui.contact.fail)}
            {result === 'fallback' && t(ui.contact.fallback)}
          </p>
        </form>
      </div>
    </Section>
  )
}
