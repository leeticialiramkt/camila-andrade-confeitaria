import { PICKUP_ADDRESS } from '../data/catalog'

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="inline-block text-gold text-sm font-sans font-bold uppercase tracking-widest mb-3">
              ✦ Nossa História
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-marsala mb-6">
              Amor aos Detalhes em Cada Receita
            </h2>
            <p className="font-sans text-gray-600 leading-relaxed mb-4">
              Procurando onde <strong>encomendar bolo de festa em Mauá</strong>? Nosso ateliê
              localizado no Jd. Luzitano prepara receitas exclusivas para sua celebração,
              com ingredientes de alta qualidade e muito carinho em cada detalhe.
            </p>
            <p className="font-sans text-gray-600 leading-relaxed mb-6">
              Especializados em <strong>Naked Cakes artesanais</strong> — bolos de aniversário
              com visual rústico e sofisticado, recheios irresistíveis e acabamento impecável.
              Cada bolo é pesado e preparado individualmente para garantir o padrão que você merece.
            </p>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '📍', title: 'Localização', text: 'Jd. Luzitano, Mauá - SP' },
                { icon: '📱', title: 'WhatsApp', text: '(11) 94590-8134' },
                { icon: '📸', title: 'Instagram', text: '@camilaandradeconfeitaria' },
                { icon: '⏰', title: 'Antecedência', text: 'Mín. 3 dias úteis' },
              ].map(info => (
                <div key={info.title} className="bg-white rounded-xl p-4 border border-cream/50 shadow-sm">
                  <div className="text-2xl mb-1.5">{info.icon}</div>
                  <p className="font-sans text-xs text-gray-400 uppercase tracking-wide">{info.title}</p>
                  <p className="font-sans text-sm text-gray-700 font-medium">{info.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Product gallery */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { src: '/images/cake1.jpg', alt: 'Bolo de aniversário Naked Cake em Mauá' },
              { src: '/images/cake2.jpg', alt: 'Naked Cake artesanal com morango em Mauá' },
              { src: '/images/cake3.jpg', alt: 'Bolo de festa personalizado em Mauá' },
              { src: '/images/brigadeiro-gourmet.png', alt: 'Docinhos gourmet artesanais em Mauá' },
            ].map((img, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}>
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  onError={e => {
                    e.target.src = '/logo-marsala.png'
                    e.target.className = 'w-full h-full object-contain p-8 opacity-20'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
