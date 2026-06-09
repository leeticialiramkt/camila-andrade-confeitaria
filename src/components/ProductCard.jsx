export default function ProductCard({ product, onConfigure, type }) {
  const isBoloCard = type === 'bolo'
  const isCaixaCard = type === 'caixa'
  const isBolo1kg = isBoloCard && product.isFixedPrice

  const getPrice = () => {
    if (isBoloCard) {
      if (isBolo1kg) return `R$ ${product.preco.toFixed(2).replace('.', ',')}`
      if (product.saboresPistache?.length) return `a partir de R$ ${product.pricePerKg.toFixed(2).replace('.', ',')}/kg`
      return `R$ ${product.pricePerKg.toFixed(2).replace('.', ',')}/kg`
    }
    if (isCaixaCard) {
      return `R$ ${product.preco.toFixed(2).replace('.', ',')}`
    }
    // doce
    if (product.saboresComPreco) {
      const minPrice = Math.min(...product.saboresComPreco.flatMap(s => Object.values(s.precos)))
      return `a partir de R$ ${minPrice.toFixed(2).replace('.', ',')}`
    }
    const minPrice = Math.min(...Object.values(product.precos))
    return `a partir de R$ ${minPrice.toFixed(2).replace('.', ',')}`
  }

  const getSaboresCount = () => {
    if (product.sabores) return product.sabores.length
    if (product.saboresComPreco) return product.saboresComPreco.length
    return 0
  }

  const getSaboresPreview = () => {
    if (product.sabores) return product.sabores
    if (product.saboresComPreco) return product.saboresComPreco.map(s => s.nome)
    return []
  }

  return (
    <article className="card flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden bg-cream aspect-[4/3]">
        <img
          src={product.image}
          alt={product.altText}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/logo-submake.png'
            e.target.className = 'w-full h-full object-contain p-8 opacity-30'
          }}
        />
        {/* Linha badge */}
        {isBoloCard && (
          <span className="absolute top-3 left-3 bg-marsala text-white text-xs font-sans font-bold px-3 py-1 rounded-full">
            {product.linha}
          </span>
        )}
        {isCaixaCard && (
          <span className="absolute top-3 left-3 bg-gold text-white text-xs font-sans font-bold px-3 py-1 rounded-full">
            {product.quantidade} un.
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-serif text-lg text-marsala font-semibold mb-2 leading-tight">
          {isBoloCard ? `Linha ${product.linha}` : product.nome}
        </h3>
        <p className="font-sans text-gray-500 text-sm leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Sabores preview */}
        {(isBoloCard || type === 'doce') && getSaboresCount() > 0 && (
          <div className="mb-4">
            <p className="text-xs font-sans text-gray-400 uppercase tracking-wide mb-1.5">
              {getSaboresCount()} sabores disponíveis
            </p>
            <p className="text-xs text-gray-500 line-clamp-2">
              {getSaboresPreview().slice(0, 4).join(', ')}{getSaboresCount() > 4 ? ' e mais...' : ''}
            </p>
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-cream">
          <div>
            <p className="font-sans text-xs text-gray-400 uppercase tracking-wide">Preço</p>
            <p className="font-serif text-xl text-marsala font-bold">{getPrice()}</p>
            {isBoloCard && isBolo1kg && (
              <p className="font-sans text-xs text-gray-400">15cm · até 8 fatias</p>
            )}
            {isBoloCard && !isBolo1kg && (
              <p className="font-sans text-xs text-gray-400">mín. {product.minKg} kg</p>
            )}
          </div>
          <button
            onClick={() => onConfigure(product)}
            className="btn-primary text-sm py-2.5 px-5"
            aria-label={`Escolher sabores — ${isBoloCard ? 'Linha ' + product.linha : product.nome}`}
          >
            Escolher sabores
          </button>
        </div>
      </div>
    </article>
  )
}
