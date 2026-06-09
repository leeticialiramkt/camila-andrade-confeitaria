export default function HeroSection() {
  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="inicio"
      className="relative w-full min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Camila Andrade Confeitaria - Banner Principal"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/banner-site.png')" }}
        role="img"
        aria-label="Naked Cakes artesanais da Camila Andrade Confeitaria em Mauá"
      />

      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <span className="inline-block bg-gold/90 text-white text-xs font-sans font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          ✦ Amor aos Detalhes
        </span>

        {/* H1 — SEO primary */}
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-white leading-tight mb-4 drop-shadow-lg">
          A Melhor Opção para{' '}
          <span className="text-gold italic">Encomendar Bolo de Festa</span>{' '}
          em Mauá
        </h1>

        {/* H2 — SEO secondary */}
        <h2 className="font-serif text-lg md:text-2xl text-cream/90 font-normal mb-8 leading-relaxed drop-shadow-md">
          Seu Bolo de Aniversário em Mauá: Naked Cakes Artesanais e Docinhos Irresistíveis
        </h2>

        <p className="font-sans text-white/80 text-sm md:text-base mb-10 max-w-xl mx-auto">
          Encomende seu bolo de festa e doces finos artesanais com acabamento impecável no ABC Paulista.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToCatalog}
            className="bg-marsala hover:bg-marsala-light text-white font-sans font-bold py-4 px-8 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Ver Catálogo Completo
          </button>
          <a
            href="https://wa.me/5511945908134?text=Oi%2C+estava+no+site+de+encomenda+da+linha+festa+e+quero+tirar+d%C3%BAvidas."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 border-2 border-white/70 hover:bg-white/20 text-white font-sans font-bold py-4 px-8 rounded-full text-base transition-all duration-200 backdrop-blur-sm"
          >
            💬 Falar pelo WhatsApp
          </a>
        </div>

        {/* Trust signals */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-white/70 text-xs font-sans">
          <span className="flex items-center gap-1.5">
            <span className="text-gold">✓</span> Receitas exclusivas
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-gold">✓</span> Entrega em Mauá e região
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-gold">✓</span> Ingredientes de alta qualidade
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToCatalog}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Rolar para o catálogo"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWi