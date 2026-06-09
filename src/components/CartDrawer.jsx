import { useCart } from '../store/CartContext'

export default function CartDrawer() {
  const { items, total, isCartOpen, setIsCartOpen, setIsCheckoutOpen, removeItem } = useCart()

  if (!isCartOpen) return null

  const handleProceedToCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative bg-offwhite w-full max-w-sm h-full flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream bg-marsala text-white">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="font-serif text-xl font-semibold">Seu Carrinho</h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Fechar carrinho"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-serif text-lg text-gray-500 mb-2">Carrinho vazio</p>
              <p className="font-sans text-sm text-gray-400">
                Explore nosso catálogo e escolha seus produtos!
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-6 btn-outline text-sm py-2 px-5"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.cartId} className="bg-white rounded-xl p-4 border border-cream shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans font-bold text-sm text-gray-800 truncate">{item.name}</p>
                      <p className="font-sans text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-3">{item.description}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                      aria-label={`Remover ${item.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-cream flex justify-between items-center">
                    <span className="font-sans text-xs text-gray-400 uppercase tracking-wide">Subtotal</span>
                    <span className="font-serif text-base font-bold text-marsala">
                      R$ {item.subtotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream px-5 py-4 bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans font-bold text-gray-700">Total Estimado</span>
              <span className="font-serif text-2xl font-bold text-marsala">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <p className="font-sans text-xs text-gray-400 mb-4 text-center">
              ⚠️ Valor sujeito a confirmação via WhatsApp após o agendamento.
            </p>
            <button
              onClick={handleProceedToCheckout}
              className="w-full btn-primary text-base py-3.5"
            >
              Avançar para Agendamento →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
