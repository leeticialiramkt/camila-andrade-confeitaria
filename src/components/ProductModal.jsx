import { useState, useEffect } from 'react'
import { ADICIONAIS_BOLO, PERSONALIZACOES_BOLO } from '../data/catalog'
import { useCart } from '../store/CartContext'

export default function ProductModal({ product, type, onClose }) {
  const { addItem } = useCart()
  const [config, setConfig] = useState({
    peso: 1.6,
    sabor: '',
    saborNaked: false,
    adicionais: [],
    personalizacao: [],
    quantidade: 25,
    saboresCaixa: [],
  })

  const isBoloModal = type === 'bolo'
  const isDoceModal = type === 'doce'
  const isCaixaModal = type === 'caixa'

  // Pre-select first flavor
  useEffect(() => {
    if (isBoloModal && product.sabores?.length > 0) {
      setConfig(c => ({ ...c, sabor: product.sabores[0] }))
    }
    if (isCaixaModal && product.saboresDisponiveis?.length > 0) {
      setConfig(c => ({ ...c, saboresCaixa: [product.saboresDisponiveis[0]] }))
    }
  }, [product])

  const calcSubtotal = () => {
    if (isBoloModal) {
      let base = product.pricePerKg * config.peso
      const adicionaisTotal = config.adicionais.length > 0 ? config.adicionais.length * 20 * config.peso : 0
      const persTotal = config.personalizacao.reduce((sum, id) => {
        const p = PERSONALIZACOES_BOLO.find(x => x.id === id)
        return sum + (p ? p.price : 0)
      }, 0)
      return base + adicionaisTotal + persTotal
    }
    if (isDoceModal) {
      return product.precos[config.quantidade] || 0
    }
    if (isCaixaModal) {
      return product.preco || 0
    }
    return 0
  }

  const toggleAdicional = (id) => {
    setConfig(c => ({
      ...c,
      adicionais: c.adicionais.includes(id)
        ? c.adicionais.filter(a => a !== id)
        : [...c.adicionais, id]
    }))
  }

  const togglePersonalizacao = (id) => {
    setConfig(c => ({
      ...c,
      personalizacao: c.personalizacao.includes(id)
        ? c.personalizacao.filter(p => p !== id)
        : [...c.personalizacao, id]
    }))
  }

  const toggleSaborCaixa = (sabor) => {
    setConfig(c => {
      const current = c.saboresCaixa
      if (current.includes(sabor)) {
        return { ...c, saboresCaixa: current.filter(s => s !== sabor) }
      }
      if (current.length >= product.numSabores) return c
      return { ...c, saboresCaixa: [...current, sabor] }
    })
  }

  const canAddToCart = () => {
    if (isBoloModal) return config.sabor !== '' || config.saborNaked
    if (isDoceModal) return true
    if (isCaixaModal) return config.saboresCaixa.length === product.numSabores
    return false
  }

  const handleAddToCart = () => {
    if (!canAddToCart()) return

    let description = ''
    let cartId = `${product.id}-${Date.now()}`

    if (isBoloModal) {
      const saborFinal = config.saborNaked
        ? config.sabor
        : config.sabor
      const adicionaisLabels = config.adicionais.map(id => ADICIONAIS_BOLO.find(a => a.id === id)?.label).join(', ')
      const persLabels = config.personalizacao.map(id => PERSONALIZACOES_BOLO.find(p => p.id === id)?.label).join(', ')
      description = `Naked Cake ${product.linha} — ${saborFinal} — ${config.peso}kg`
      if (adicionaisLabels) description += ` + ${adicionaisLabels}`
      if (persLabels) description += ` | ${persLabels}`
    } else if (isDoceModal) {
      description = `${product.nome} — ${config.quantidade} unidades`
    } else if (isCaixaModal) {
      description = `${product.nome} — Sabores: ${config.saboresCaixa.join(', ')}`
    }

    addItem({
      cartId,
      productId: product.id,
      type,
      name: isBoloModal ? `Naked Cake ${product.linha}` : product.nome,
      description,
      subtotal: calcSubtotal(),
      config: { ...config },
    })

    onClose()
  }

  const allSabores = isBoloModal
    ? [
        ...(product.sabores || []).map(s => ({ value: s, label: s, nakedOnly: false })),
        ...(product.saboresNakedOnly || []).map(s => ({ value: s, label: `${s} ★ (Naked Cake)`, nakedOnly: true })),
      ]
    : []

  const subtotal = calcSubtotal()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Configurar ${isBoloModal ? 'Bolo' : product.nome}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative bg-offwhite rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Handle bar mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-cream sticky top-0 bg-offwhite z-10">
          <div>
            <p className="font-sans text-xs text-gold uppercase tracking-widest font-bold mb-0.5">Configurar</p>
            <h3 className="font-serif text-xl text-marsala font-semibold leading-tight">
              {isBoloModal ? `Naked Cake ${product.linha}` : product.nome}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-marsala transition-colors p-1 mt-1"
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* === BOLO CONFIG === */}
          {isBoloModal && (
            <>
              {/* Peso */}
              <div>
                <label className="block font-sans text-sm font-bold text-gray-700 mb-2">
                  Peso do Bolo <span className="text-gold">(mín. 1,6 kg)</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConfig(c => ({ ...c, peso: Math.max(1.6, parseFloat((c.peso - 0.2).toFixed(1))) }))}
                    className="w-10 h-10 rounded-full border-2 border-marsala text-marsala font-bold text-lg hover:bg-marsala hover:text-white transition-colors flex-shrink-0"
                  >−</button>
                  <div className="flex-1 text-center">
                    <span className="font-serif text-2xl text-marsala font-bold">{config.peso.toFixed(1)}</span>
                    <span className="font-sans text-sm text-gray-500 ml-1">kg</span>
                  </div>
                  <button
                    onClick={() => setConfig(c => ({ ...c, peso: parseFloat((c.peso + 0.2).toFixed(1)) }))}
                    className="w-10 h-10 rounded-full border-2 border-marsala text-marsala font-bold text-lg hover:bg-marsala hover:text-white transition-colors flex-shrink-0"
                  >+</button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 text-center">
                  Aro 15cm · serve ~{Math.round(config.peso * 6)} fatias
                </p>
              </div>

              {/* Sabor */}
              <div>
                <label htmlFor="sabor-select" className="block font-sans text-sm font-bold text-gray-700 mb-2">
                  Sabor
                </label>
                <select
                  id="sabor-select"
                  value={config.sabor}
                  onChange={e => {
                    const opt = allSabores.find(s => s.value === e.target.value)
                    setConfig(c => ({ ...c, sabor: e.target.value, saborNaked: opt?.nakedOnly || false }))
                  }}
                  className="input-field"
                >
                  <option value="">Selecione o sabor...</option>
                  {allSabores.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {config.saborNaked && (
                  <p className="mt-1.5 text-xs text-gold font-medium">★ Este sabor é disponível apenas no modelo Naked Cake Padrão.</p>
                )}
              </div>

              {/* Adicionais */}
              <div>
                <p className="font-sans text-sm font-bold text-gray-700 mb-2">
                  Adicionais <span className="font-normal text-gray-400">(+R$ 20,00/kg cada)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {ADICIONAIS_BOLO.map(ad => (
                    <label
                      key={ad.id}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-sans ${
                        config.adicionais.includes(ad.id)
                          ? 'border-marsala bg-marsala/5 text-marsala font-medium'
                          : 'border-gray-200 text-gray-600 hover:border-marsala/40'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={config.adicionais.includes(ad.id)}
                        onChange={() => toggleAdicional(ad.id)}
                      />
                      <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                        config.adicionais.includes(ad.id) ? 'bg-marsala border-marsala' : 'border-gray-300'
                      }`}>
                        {config.adicionais.includes(ad.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      {ad.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Personalização */}
              <div>
                <p className="font-sans text-sm font-bold text-gray-700 mb-2">
                  Personalização Visual <span className="font-normal text-gray-400">(opcional)</span>
                </p>
                <div className="space-y-2">
                  {PERSONALIZACOES_BOLO.map(p => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all text-sm font-sans ${
                        config.personalizacao.includes(p.id)
                          ? 'border-gold bg-gold/5 text-gray-700'
                          : 'border-gray-200 text-gray-600 hover:border-gold/40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={config.personalizacao.includes(p.id)}
                          onChange={() => togglePersonalizacao(p.id)}
                        />
                        <span className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                          config.personalizacao.includes(p.id) ? 'bg-gold border-gold' : 'border-gray-300'
                        }`}>
                          {config.personalizacao.includes(p.id) && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </span>
                        {p.label}
                      </div>
                      <span className="text-gold font-bold">+R$ {p.price.toFixed(2).replace('.', ',')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* === DOCE CONFIG === */}
          {isDoceModal && (
            <>
              <div>
                <p className="font-sans text-sm font-bold text-gray-700 mb-3">Quantidade</p>
                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100].map(qty => (
                    product.precos[qty] && (
                      <button
                        key={qty}
                        onClick={() => setConfig(c => ({ ...c, quantidade: qty }))}
                        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                          config.quantidade === qty
                            ? 'border-marsala bg-marsala/5'
                            : 'border-gray-200 hover:border-marsala/40'
                        }`}
                      >
                        <span className={`font-serif text-2xl font-bold ${config.quantidade === qty ? 'text-marsala' : 'text-gray-700'}`}>
                          {qty}
                        </span>
                        <span className="font-sans text-xs text-gray-500 mt-0.5">unid.</span>
                        <span className={`font-sans text-sm font-bold mt-1 ${config.quantidade === qty ? 'text-marsala' : 'text-gray-600'}`}>
                          R$ {product.precos[qty].toFixed(2).replace('.', ',')}
                        </span>
                      </button>
                    )
                  ))}
                </div>
              </div>

              {product.sabores.length > 1 && (
                <div>
                  <p className="font-sans text-sm font-bold text-gray-700 mb-2">Sabor</p>
                  <select
                    value={config.sabor}
                    onChange={e => setConfig(c => ({ ...c, sabor: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Selecione...</option>
                    {product.sabores.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}

          {/* === CAIXA MISTA CONFIG === */}
          {isCaixaModal && (
            <div>
              <p className="font-sans text-sm font-bold text-gray-700 mb-1">
                Escolha {product.numSabores} sabores
              </p>
              <p className="font-sans text-xs text-gray-400 mb-3">
                {config.saboresCaixa.length}/{product.numSabores} selecionados
              </p>
              <div className="space-y-2">
                {product.saboresDisponiveis.map(sabor => (
                  <button
                    key={sabor}
                    onClick={() => toggleSaborCaixa(sabor)}
                    disabled={!config.saboresCaixa.includes(sabor) && config.saboresCaixa.length >= product.numSabores}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-sm font-sans text-left transition-all ${
                      config.saboresCaixa.includes(sabor)
                        ? 'border-marsala bg-marsala/5 text-marsala font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-marsala/40 disabled:opacity-40 disabled:cursor-not-allowed'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                      config.saboresCaixa.includes(sabor) ? 'bg-marsala border-marsala' : 'border-gray-300'
                    }`}>
                      {config.saboresCaixa.includes(sabor) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    {sabor}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer — subtotal + add to cart */}
        <div className="sticky bottom-0 bg-offwhite border-t border-cream px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans text-sm text-gray-500">Subtotal estimado</span>
            <span className="font-serif text-xl font-bold text-marsala">
              R$ {subtotal.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!canAddToCart()}
            className="w-full btn-primary text-base py-3.5"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  )
}
