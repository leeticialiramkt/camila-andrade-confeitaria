import { useState, useEffect } from 'react'
import { ADICIONAIS_BOLO, PERSONALIZACOES_BOLO } from '../data/catalog'
import { useCart } from '../store/CartContext'

export default function ProductModal({ product, type, onClose }) {
  const { addItem } = useCart()
  const [config, setConfig] = useState({
    peso: 1.6,
    sabor: '',
    massa: '',
    adicionais: [],
    personalizacao: [],
    quantidade: 25,
    saboresCaixa: [],
    corForminhas: '',
  })

  const isBoloModal = type === 'bolo'
  const isDoceModal = type === 'doce'
  const isCaixaModal = type === 'caixa'
  const isBolo1kg = isBoloModal && product.isFixedPrice
  const isDoceEspecial = isDoceModal && !!product.saboresComPreco

  // Pre-select first option
  useEffect(() => {
    if (isBoloModal && product.sabores?.length > 0) {
      setConfig(c => ({
        ...c,
        sabor: product.sabores[0],
        massa: isBolo1kg ? product.massa[0] : c.massa,
      }))
    }
    if (isDoceEspecial && product.saboresComPreco?.length > 0) {
      setConfig(c => ({ ...c, sabor: product.saboresComPreco[0].nome }))
    }
    if (isDoceModal && !isDoceEspecial && product.sabores?.length > 0) {
      setConfig(c => ({ ...c, sabor: product.sabores[0] }))
    }
    if (isCaixaModal && product.saboresDisponiveis?.length > 0) {
      setConfig(c => ({ ...c, saboresCaixa: [product.saboresDisponiveis[0]] }))
    }
  }, [product])

  const getEffectivePricePerKg = () => {
    if (!isBoloModal || isBolo1kg) return product.pricePerKg || 0
    if (product.saboresPistache?.includes(config.sabor)) return product.pistachePrice
    return product.pricePerKg
  }

  const getDocePrecos = () => {
    if (isDoceEspecial) {
      const saborData = product.saboresComPreco.find(s => s.nome === config.sabor)
      return saborData?.precos || {}
    }
    return product.precos || {}
  }

  const calcSubtotal = () => {
    if (isBoloModal) {
      if (isBolo1kg) return product.preco || 90
      const pricePerKg = getEffectivePricePerKg()
      let base = pricePerKg * config.peso
      const adicionaisTotal = config.adicionais.length > 0 ? config.adicionais.length * 20 * config.peso : 0
      const persTotal = config.personalizacao.reduce((sum, id) => {
        const p = PERSONALIZACOES_BOLO.find(x => x.id === id)
        return sum + (p ? p.price : 0)
      }, 0)
      return base + adicionaisTotal + persTotal
    }
    if (isDoceModal) {
      const precos = getDocePrecos()
      return precos[config.quantidade] || 0
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
    if (isBoloModal) {
      if (isBolo1kg) return config.sabor !== '' && config.massa !== ''
      return config.sabor !== ''
    }
    if (isDoceModal) return config.sabor !== ''
    if (isCaixaModal) return config.saboresCaixa.length === product.numSabores
    return false
  }

  const handleAddToCart = () => {
    if (!canAddToCart()) return

    let description = ''
    let cartId = `${product.id}-${Date.now()}`

    if (isBoloModal) {
      if (isBolo1kg) {
        description = `Bolo Padrão 1Kg — Massa ${config.massa} — Recheio: ${config.sabor}`
      } else {
        const pricePerKg = getEffectivePricePerKg()
        const adicionaisLabels = config.adicionais.map(id => ADICIONAIS_BOLO.find(a => a.id === id)?.label).filter(Boolean).join(', ')
        const persLabels = config.personalizacao.map(id => PERSONALIZACOES_BOLO.find(p => p.id === id)?.label).filter(Boolean).join(', ')
        description = `Bolo ${product.linha} — ${config.sabor} — ${config.peso}kg (R$ ${pricePerKg}/kg)`
        if (adicionaisLabels) description += ` + ${adicionaisLabels}`
        if (persLabels) description += ` | ${persLabels}`
      }
    } else if (isDoceModal) {
      description = `${product.nome} — ${config.sabor} — ${config.quantidade} unidades`
      if (config.corForminhas) description += ` | Forminha: ${config.corForminhas}`
    } else if (isCaixaModal) {
      description = `${product.nome} — Sabores: ${config.saboresCaixa.join(', ')}`
    }

    addItem({
      cartId,
      productId: product.id,
      type,
      name: isBoloModal ? `Bolo ${product.linha}` : product.nome,
      description,
      subtotal: calcSubtotal(),
      config: { ...config },
    })

    onClose()
  }

  const allSabores = isBoloModal && !isBolo1kg
    ? [
        ...(product.sabores || []).map(s => ({ value: s, label: s })),
        ...(product.saboresPistache || []).map(s => ({
          value: s,
          label: `${s} — R$ ${product.pistachePrice}/kg`,
        })),
      ]
    : []

  const precoAtual = calcSubtotal()
  const docePrecos = getDocePrecos()

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Escolher sabores — ${isBoloModal ? product.linha : product.nome}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative bg-offwhite rounded-t-3xl md:rounded-2xl w-full md:max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl">
        {/* Handle bar mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-cream sticky top-0 bg-offwhite z-10">
          <div>
            <p className="font-sans text-xs text-gold uppercase tracking-widest font-bold mb-0.5">Escolher sabores</p>
            <h3 className="font-serif text-xl text-marsala font-semibold leading-tight">
              {isBoloModal ? `Bolo ${product.linha}` : product.nome}
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

          {/* === BOLO PADRÃO 1KG === */}
          {isBolo1kg && (
            <>
              <p className="font-sans text-sm text-gray-500 bg-cream rounded-xl p-3 text-center">
                15cm · até 8 fatias (aprox.) · 1 camada de recheio
              </p>

              {/* Massa */}
              <div>
                <p className="font-sans text-sm font-bold text-gray-700 mb-2">Massa *</p>
                <div className="grid grid-cols-2 gap-3">
                  {product.massa.map(m => (
                    <button
                      key={m}
                      onClick={() => setConfig(c => ({ ...c, massa: m }))}
                      className={`py-3 rounded-xl border-2 text-sm font-sans font-medium transition-all ${
                        config.massa === m
                          ? 'border-marsala bg-marsala text-white'
                          : 'border-gray-200 text-gray-600 hover:border-marsala/40'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recheio */}
              <div>
                <label htmlFor="recheio-1kg" className="block font-sans text-sm font-bold text-gray-700 mb-2">
                  Recheio *
                </label>
                <select
                  id="recheio-1kg"
                  value={config.sabor}
                  onChange={e => setConfig(c => ({ ...c, sabor: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Selecione o recheio...</option>
                  {product.sabores.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* === BOLO POR KG === */}
          {isBoloModal && !isBolo1kg && (
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
                  ~{Math.round(config.peso * 10)} fatias (aprox.)
                </p>
              </div>

              {/* Sabor */}
              <div>
                <label htmlFor="sabor-select" className="block font-sans text-sm font-bold text-gray-700 mb-2">
                  Sabor *
                </label>
                <select
                  id="sabor-select"
                  value={config.sabor}
                  onChange={e => setConfig(c => ({ ...c, sabor: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Selecione o sabor...</option>
                  {allSabores.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {product.saboresPistache?.includes(config.sabor) && (
                  <p className="mt-1.5 text-xs text-gold font-medium">
                    ★ Sabor Pistache — R$ {product.pistachePrice}/kg
                  </p>
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
              {/* Observação tradicionais */}
              {product.categoria === 'tradicional' && (
                <div className="bg-cream rounded-xl p-4 text-xs font-sans text-gray-600 leading-relaxed space-y-2">
                  <p>
                    Nossos Docinhos tradicionais são todos artesanais feitos com ingredientes de alta qualidade,
                    pesam em média 17g. Todos pesados um a um para manter um padrão e qualidade que as formigas merecem!! 🐜
                  </p>
                  <p>
                    <strong className="text-marsala">Embalagens:</strong> Você receberá seu pedido em uma caixa com os docinhos
                    muito bem organizados e as forminhas nas cores de sua preferência. Caso não solicitado cor no ato da encomenda,
                    o pedido será enviado nos tons de chocolate e/ou branca.
                  </p>
                </div>
              )}

              {/* Sabor */}
              <div>
                <label htmlFor="doce-sabor" className="block font-sans text-sm font-bold text-gray-700 mb-2">
                  Sabor *
                </label>
                <select
                  id="doce-sabor"
                  value={config.sabor}
                  onChange={e => setConfig(c => ({ ...c, sabor: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Selecione o sabor...</option>
                  {isDoceEspecial
                    ? product.saboresComPreco.map(s => (
               