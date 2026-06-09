import { useState } from 'react'
import { BOLOS, DOCINHOS, CAIXAS_MISTAS } from '../data/catalog'
import ProductCard from './ProductCard'

const TABS = [
  { id: 'bolos', label: '🎂 Bolos por Quilo' },
  { id: 'docinhos', label: '🍫 Docinhos Individuais' },
  { id: 'caixas', label: '🎁 Caixas Mistas' },
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
          <div>
            <div className="bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 mb-8 flex items-start gap-3">
              <span className="text-gold text-xl mt-0.5">ⓘ</span>
              <p className="font-sans text-sm text-gray-600">
                <strong className="text-marsala">Apenas Naked Cakes.</strong> De ter. a sex., produzimos exclusivamente o modelo Naked Cake Padrão.
                Bolos confeitados/personalizados estão disponíveis <strong>somente aos sábados</strong>.
                Pedido mínimo: 1,6 kg.
              </p>
            </div>
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
          </div>
        )}

        {/* Docinhos */}
        {activeTab === 'docinhos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Caixas Mistas */}
        {activeTab === 'caixas' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAIXAS_MISTAS.map(cx => (
              <ProductCard
                key={cx.id}
                product={cx}
                type="caixa"
                onConfigure={(p) => onConfigure(p, 'caixa')}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
