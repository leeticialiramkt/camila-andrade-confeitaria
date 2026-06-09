// =============================================================
// CATÁLOGO CAMILA ANDRADE CONFEITARIA - Linha Festa 2025
// Fonte: Especificacao_Mestre_Camila_Andrade_V2.pdf +
//        Catálogo Linha Festa 2025 (2).pdf
// =============================================================

export const ADICIONAIS_BOLO = [
  { id: 'uvas', label: 'Uvas', pricePerKg: 20 },
  { id: 'pessegos', label: 'Pêssegos', pricePerKg: 20 },
  { id: 'morangos', label: 'Morangos', pricePerKg: 20 },
  { id: 'chocolate', label: 'Pedaços de Chocolate', pricePerKg: 20 },
]

export const PERSONALIZACOES_BOLO = [
  { id: 'scrap', label: 'Topo em Scrap', price: 30.00 },
  { id: 'balao', label: 'Topo com Balão', price: 35.00 },
  { id: 'glow', label: 'GlowCake', price: 29.99 },
]

export const BOLOS = [
  {
    id: 'trad',
    linha: 'Tradicionais',
    pricePerKg: 95.00,
    minKg: 1.6,
    image: '/images/dois-amores.png',
    altText: 'Naked Cake Tradicional para aniversário em Mauá',
    description: 'Naked Cakes artesanais com recheios clássicos irresistíveis. A partir de 1,6 kg.',
    sabores: [
      'Dois Amores',
      'Ninho com Laka',
      'Rum Trufado',
      'Sensação',
      'Charge',
      'Prestígio',
      'Laka Oreo',
      'Nuvem de Uva',
      'Brigadeiro de Chocolate Belga',
      'Abacaxi com Doce de Leite e Creme Belga',
      'Ninho',
      'Delícia de Abacaxi',
      'Creme Belga com Abacaxi',
      'Brigadeiro com Maracujá',
      'Brigadeiro Tradicional',
    ],
    nakedCakeOnly: false,
  },
  {
    id: 'esp',
    linha: 'Especiais',
    pricePerKg: 99.00,
    minKg: 1.6,
    image: '/images/ninho-com-nutella.png',
    altText: 'Naked Cake Especial sabor Ninho com Morango para aniversário em Mauá',
    description: 'Sabores sofisticados com frutas e combinações exclusivas. A partir de 1,6 kg.',
    sabores: [
      'Olho de Sogra (Doce de Leite, Ameixa e Coco)',
      'Ninho com Morango',
      'Choconinho com Morango',
      'Brigadeiro com Morango',
    ],
    saboresNakedOnly: [
      'Ninho com Frutas Vermelhas',
      'Red Velvet',
    ],
    nakedCakeOnly: false,
  },
  {
    id: 'prem',
    linha: 'Premium',
    pricePerKg: 115.00,
    minKg: 1.6,
    image: '/images/laka-com-morango.png',
    altText: 'Naked Cake Premium sabor Laka com Morango para festa em Mauá',
    description: 'A experiência máxima em sabor. Combinações gourmets com ingredientes selecionados.',
    sabores: [
      'Laka com Morango',
      'Ninho com Nutella',
      'Ninho com Morango e Nutella',
      'Ovomaltine',
      'Ovomaltine com Morango (consultar disponibilidade)',
    ],
    nakedCakeOnly: false,
  },
  {
    id: 'pistache',
    linha: 'Premium Pistache',
    pricePerKg: 130.00,
    minKg: 1.6,
    image: '/images/brigadeiro-gourmet.png',
    altText: 'Naked Cake Premium Pistache Brigadeiro Belga para festa em Mauá',
    description: 'O requinte do pistache com o intenso sabor do chocolate belga. Produto exclusivo.',
    sabores: [
      'Brigadeiro Belga com Pistache (consultar disponibilidade)',
    ],
    nakedCakeOnly: false,
  },
]

export const DOCINHOS = [
  {
    id: 'trad-doce',
    nome: 'Doces Tradicionais',
    image: '/images/brigadeiro.png',
    altText: 'Docinhos tradicionais artesanais - Brigadeiro, Beijinho e Ninho em Mauá',
    description: 'Feitos artesanalmente com ingredientes de alta qualidade. Pesam em média 17g cada.',
    sabores: ['Ninho', 'Beijinho', 'Brigadeiro com Granulado', 'Brigadeiro com Cacau'],
    precos: { 25: 40.00, 50: 70.00, 100: 125.00 },
  },
  {
    id: 'esp1-doce',
    nome: 'Doce Especial — Ninho com Nutella',
    image: '/images/ninho-nutella.png',
    altText: 'Docinho Especial Ninho com Nutella artesanal em Mauá',
    description: 'A combinação favorita: ninho cremoso com Nutella derretida. Pesam ~20g cada.',
    sabores: ['Ninho com Nutella'],
    precos: { 25: 55.00, 50: 90.00, 100: 150.00 },
  },
  {
    id: 'esp2-doce',
    nome: 'Doce Especial — Churros',
    image: '/images/pudim.png',
    altText: 'Docinho de Churros artesanal em Mauá',
    description: 'Sabor irresistível de churros em formato de docinho gourmet. Pesam ~20g cada.',
    sabores: ['Churros'],
    precos: { 25: 50.00, 50: 85.00, 100: 140.00 },
  },
  {
    id: 'prem-doce',
    nome: 'Doces Premium',
    image: '/images/bombom-uva.png',
    altText: 'Docinhos Premium Ferrero e Surpresinha de Uva artesanais em Mauá',
    description: 'Ferrero e Surpresinha de Uva — o toque de luxo para sua festa.',
    sabores: ['Ferrero', 'Surpresinha de Uva'],
    precos: { 25: 60.00, 50: 95.00, 100: 160.00 },
  },
  {
    id: 'nobre-doce',
    nome: 'Brigadeiro Nobre',
    image: '/images/brigadeiro-gourmet.png',
    altText: 'Brigadeiro Nobre de Chocolate artesanal em Mauá',
    description: 'Brigadeiro de Chocolate Nobre com acabamento sofisticado. O campeão das festas.',
    sabores: ['Brigadeiro Chocolate Nobre'],
    precos: { 25: 65.00, 50: 120.00, 100: 220.00 },
  },
]

export const CAIXAS_MISTAS = [
  {
    id: 'cx50-trad',
    nome: 'Caixa Mista 50un — 2 Sabores Tradicionais',
    image: '/images/pudim-praline.png',
    altText: 'Caixa Mista com 50 doces tradicionais para festa em Mauá',
    description: 'Caixa com 50 unidades de 2 sabores tradicionais à sua escolha.',
    quantidade: 50,
    numSabores: 2,
    tipoSabores: 'tradicionais',
    preco: 70.00,
    saboresDisponiveis: ['Ninho', 'Beijinho', 'Brigadeiro com Granulado', 'Brigadeiro com Cacau'],
  },
  {
    id: 'cx50-esp',
    nome: 'Caixa Mista 50un — 2 Sabores Especiais/Mistos',
    image: '/images/franui.png',
    altText: 'Caixa Mista com 50 doces especiais para festa em Mauá',
    description: 'Caixa com 50 unidades. Escolha 2 sabores especiais ou misture especial + tradicional.',
    quantidade: 50,
    numSabores: 2,
    tipoSabores: 'especiais',
    preco: 99.00,
    saboresDisponiveis: ['Ninho com Nutella', 'Churros', 'Ferrero', 'Surpresinha de Uva', 'Brigadeiro Nobre', 'Ninho', 'Beijinho'],
  },
  {
    id: 'cx100-trad',
    nome: 'Caixa Mista 100un — 3 Sabores Tradicionais',
    image: '/images/brownie-morango.png',
    altText: 'Caixa Mista com 100 doces tradicionais para festa em Mauá',
    description: 'Caixa com 100 unidades de 3 sabores tradicionais. Ideal para festas grandes.',
    quantidade: 100,
    numSabores: 3,
    tipoSabores: 'tradicionais',
    preco: 130.00,
    saboresDisponiveis: ['Ninho', 'Beijinho', 'Brigadeiro com Granulado', 'Brigadeiro com Cacau'],
  },
  {
    id: 'cx100-esp',
    nome: 'Caixa Mista 100un — 3 Sabores Especiais/Mistos',
    image: '/images/cake5.png',
    altText: 'Caixa Mista com 100 doces especiais para festa em Mauá',
    description: 'Caixa com 100 unidades. 3 sabores especiais ou combinação de especiais e tradicionais.',
    quantidade: 100,
    numSabores: 3,
    tipoSabores: 'especiais',
    preco: 160.00,
    saboresDisponiveis: ['Ninho com Nutella', 'Churros', 'Ferrero', 'Surpresinha de Uva', 'Brigadeiro Nobre', 'Ninho', 'Beijinho'],
  },
]

// Business rules constants
export const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || ''
export const WHATSAPP_NUMBER = '5511945908134'
export const PICKUP_ADDRESS = 'Rua Amaro Corrêa, 43 - Jd Luzitano, Mauá - SP'
export const MIN_BUSINESS_DAYS_ADVANCE = 3
