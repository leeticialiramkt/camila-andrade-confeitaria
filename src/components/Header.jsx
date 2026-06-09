import { useCart } from '../store/CartContext'

export default function Header() {
  const { itemCount, setIsCartOpen } = useCart()

  return (
    <header className="sticky top-0 z-50 bg-offwhite/95 backdrop-blur-sm border-b border-gold/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" aria-label="Camila Andrade Confeitaria - Página inicial">
          <img
            src="/logo-submake.png"
            alt="Camila Andrade Confeitaria - Logo"
            className="h-12 md:h-14 w-auto object-contain"
          />
        </a>

        {/* Nav Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-marsala font-medium">
          <a href="#catalogo" className="hover:text-gold transition-colors">Catálogo</a>
          <a href="#sobre" className="hover:text-gold transition-colors">Sobre</a>
          <a
            href="https://www.instagram.com/camilaandradeconfeitaria"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors"
          >
            Instagram
          </a>
        </nav>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center gap-2 bg-marsala text-white px-4 py-2 rounded-full text-sm font-sans font-medium hover:bg-marsala-light transition-colors"
          aria-label={`Carrinho com ${itemCount} itens`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span className="hidden sm:inline">Carrinho</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gold text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
