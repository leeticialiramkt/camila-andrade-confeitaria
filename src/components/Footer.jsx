import { PICKUP_ADDRESS } from '../data/catalog'

export default function Footer() {
  return (
    <footer className="bg-marsala text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <img src="/logo-branco.png" alt="Camila Andrade Confeitaria" className="h-14 w-auto mb-4" />
            <p className="font-sans text-white/70 text-sm leading-relaxed">
              Amor aos detalhes em cada bolo de aniversário em Mauá.
              Naked Cakes artesanais e docinhos gourmet para sua festa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold">Navegação</h3>
            <ul className="space-y-2">
              {[
                { href: '#inicio', label: 'Início' },
                { href: '#catalogo', label: 'Catálogo' },
                { href: '#sobre', label: 'Sobre' },
                { href: 'https://wa.me/5511945908134', label: 'WhatsApp', external: true },
              ].map(l => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="font-sans text-sm text-white/70 hover:text-gold transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-gold">Contato</h3>
            <div className="space-y-3 text-sm font-sans text-white/70">
              <p>📍 {PICKUP_ADDRESS}</p>
              <p>📱 (11) 94590-8134</p>
              <a
                href="https://www.instagram.com/camilaandradeconfeitaria"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-gold transition-colors"
              >
                📸 @camilaandradeconfeitaria
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs text-white/40">
            © 2025 Camila Andrade Confeitaria. Todos os direitos reservados.
          </p>
          <p className="font-sans text-xs text-white/40">
            Encomendar bolo de aniversário em Mauá · Naked Cakes · ABC Paulista
          </p>
        </div>
      </div>
    </footer>
  )
}
