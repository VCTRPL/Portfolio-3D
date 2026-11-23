import { useLang, ui } from '../i18n'
import { profile } from '../data/profile'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="container footer-in">
        <p>© {new Date().getFullYear()} {profile.name}. {t(ui.footer.made)}</p>
        <p>
          <a href="/?3d">{t(ui.footer.retro)}</a>
          <span aria-hidden="true"> · </span>
          <a href="#inicio">{t(ui.footer.top)}</a>
        </p>
      </div>
    </footer>
  )
}
