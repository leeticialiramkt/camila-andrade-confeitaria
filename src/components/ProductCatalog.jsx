import { useState } from 'react'
import { BOLOS, DOCINHOS, CAIXAS_MISTAS } from '../data/catalog'
import ProductCard from './ProductCard'

const TABS = [
  { id: 'bolos', label: '🎂 Bolo de Festa' },
  { id: 'docinhos', label: '🍫 Docinhos' },
  { id: 'kits', label: '🎁 Kits de Festa' },
]

export default function ProductCatalog({ onConfigure }) {
  const [activeTab, setActiveTab] = useState('bolos')

  return (
    <section id="catalogo" className="py-16 md:py-24 bg-offwhite">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-block text-gold text-sm font-sans font-bold uppercase tracking-widest mb-3">
            ✦ Linha Festa 2025
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-marsala mb-4">
            Nosso Catálogo de Encomendas
          </h2>
          <p className="font-sans text-gray-500 max-w-lg mx-auto text-sm md:text-base">
            Tudo feito artesanalmente com ingredientes selecionados.
            Escolha, configure e agende sua encomenda.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-sans font-medium text-sm px-5 py-2.5 rounded-full transition-all duration-200 ${
                activeTab === tab.id ? 'tab-active shadow-md' : 'tab-inactive'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bolos */}
        {activeTab === 'bolos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BOLOS.map(bolo => (
              <ProductCard
                key={bolo.id}
                product={bolo}
                type="bolo"
                onConfigure={(p) => onConfigure(p, 'bolo')}
              />
            ))}
          </div>
        )}

        {/* Docinhos */}
        {activeTab === 'docinhos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {DOCINHOS.map(doce => (
              <ProductCard
                key={doce.id}
                product={doce}
                type="doce"
                onConfigure={(p) => onConfigure(p, 'doce')}
              />
            ))}
          </div>
        )}

        {/* Kits de Festa */}
        {activeTab === 'kits' && (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Single photo on left */}
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="overflow-hidden rounded-2xl aspect-[4/3]">
                <img
                  src="/images/brownie-morango.png"
                  alt="Kits de Festa Camila Andrade Confeitaria"
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.target.src = '/logo-submake.png'
                    e.target.className = 'w-full h-full object-contain p-8 opacity-30'
                  }}
                />
              </div>
            </div>

            {/* Kit options on right */}
            <div className="flex-1">
              <h3 className="font-serif text-2xl text-marsala font-semibold mb-2">Kits de Festa</h3>
              <p className="font-sans text-sm text-gray-500 mb-6 leading-relaxed">
                Caixas mistas com doces artesanais. Escolha a quantidade e seus sabores favoritos para montar o kit perfeito.
              </p>
              <div className="space-y-3">
                {CAIXAS_MISTAS.map(cx => (
                  <div
                    key={cx.id}
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border-2 border-cream hover:border-marsala/30 transition-all shadow-sm"
                  >
                    <div className="flex-1 pr-4">
                      <p className="font-serif text-base text-marsala font-semibold leading-tight">{cx.nome}</p>
                      <p className="font-sans text-xs text-gray-500 mt-0.5 leading-relaxed">{cx.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <p className="font-serif text-xl font-bold text-marsala whitespace-nowrap">
                        R$ {cx.preco.toFixed(2).replace('.', ',')}
                      </p>
                      <button
                        onClick={() => onConfigure(cx, 'caixa')}
                        className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
                      >
                        Escolher sabores
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
