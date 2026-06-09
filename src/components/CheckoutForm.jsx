import { useState, useMemo } from 'react'
import { useCart } from '../store/CartContext'
import { PICKUP_ADDRESS, WHATSAPP_NUMBER, WEBHOOK_URL, MIN_BUSINESS_DAYS_ADVANCE, FRETE_FIXO } from '../data/catalog'

// --- Date helpers ---
function addBusinessDays(date, days) {
  let count = 0
  const d = new Date(date)
  while (count < days) {
    d.setDate(d.getDate() + 1)
    const day = d.getDay()
    if (day !== 0 && day !== 1) count++ // skip Sun(0) Mon(1)
  }
  return d
}

function isDisabledDate(dateStr) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  return day === 0 || day === 1 // Sunday or Monday
}

function getMinDate() {
  const minDate = addBusinessDays(new Date(), MIN_BUSINESS_DAYS_ADVANCE)
  return minDate.toISOString().split('T')[0]
}

function formatDatePT(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function removeAccents(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function isAllowedCity(cidade, bairro) {
  const c = removeAccents((cidade || '').toLowerCase().trim())
  const b = removeAccents((bairro || '').toLowerCase().trim())
  const isMaua = c.includes('maua') || c.includes('mauá')
  const isParqueMarajoara = (c.includes('santo andre') || c.includes('santo andré')) && b.includes('marajoara')
  return isMaua || isParqueMarajoara
}

const HORARIOS = [
  { id: '12h-15h', label: '12h às 15h' },
  { id: '15h-18h', label: '15h às 18h' },
]

const PAYMENT_OPTIONS = [
  { id: 'pix', label: 'PIX', icon: '⚡' },
  { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'debito', label: 'Cartão de Débito', icon: '🏦' },
]

const STEPS = ['Seus Dados', 'Data e Local', 'Pagamento']

export default function CheckoutForm() {
  const { items, total, isCheckoutOpen, setIsCheckoutOpen, setIsCartOpen, clearCart } = useCart()

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    data: '',
    horario: '',
    observacaoHorario: '',
    logistica: 'retirada',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    complemento: '',
    pagamento: '',
    ciente: false,
  })

  const minDate = useMemo(() => getMinDate(), [])

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const frete = form.logistica === 'entrega' ? FRETE_FIXO : 0
  const totalComFrete = total + frete

  const cidadeInvalida = form.logistica === 'entrega' && form.cidade.trim().length > 0 && !isAllowedCity(form.cidade, form.bairro)

  // Step 0 validation
  const step0Valid = form.nome.trim().length >= 2 && form.whatsapp.replace(/\D/g, '').length >= 10

  // Step 1 validation
  const step1Valid = form.data &&
    !isDisabledDate(form.data) &&
    form.data >= minDate &&
    form.horario &&
    (form.logistica === 'retirada' || (
      form.cep && form.rua && form.numero && form.bairro && form.cidade &&
      !cidadeInvalida
    ))

  // Step 2 validation
  const step2Valid = form.pagamento && form.ciente

  const canSubmit = step0Valid && step1Valid && step2Valid

  const buildCartSummary = () =>
    items.map(i => `• ${i.name}: ${i.description} — R$ ${i.subtotal.toFixed(2).replace('.', ',')}`).join('\n')

  const buildWhatsAppMsg = () => {
    const endereco = form.logistica === 'retirada'
      ? PICKUP_ADDRESS
      : `${form.rua}, ${form.numero}${form.complemento ? `, ${form.complemento}` : ''} — ${form.bairro}, ${form.cidade} — CEP ${form.cep}`

    const horarioLine = form.observacaoHorario
      ? `${form.horario} (obs: ${form.observacaoHorario})`
      : form.horario

    const msg = `*NOVA ENCOMENDA - CAMILA ANDRADE CONFEITARIA*

*DADOS DO CLIENTE:*
• Nome: ${form.nome}
• WhatsApp: ${form.whatsapp}

*DETALHES DO AGENDAMENTO:*
• Data: ${formatDatePT(form.data)}
• Horário: ${horarioLine}
• Modo: ${form.logistica === 'retirada' ? 'Retirada no Ateliê' : 'Entrega em Domicílio'}
• Endereço/Retirada: ${endereco}

*ITENS DA ENCOMENDA:*
${buildCartSummary()}

*FINANCEIRO:*
• Subtotal: R$ ${total.toFixed(2).replace('.', ',')}${frete > 0 ? `\n• Frete: R$ ${frete.toFixed(2).replace('.', ',')}` : ''}
• Total Estimado: R$ ${totalComFrete.toFixed(2).replace('.', ',')}
• Pagamento Preferencial: ${form.pagamento}

_Estou ciente de que meu pedido só será confirmado após a validação final neste WhatsApp._`
    return msg
  }

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)

    const payload = {
      Data_Registro: new Date().toISOString(),
      Cliente_Nome: form.nome,
      Cliente_WhatsApp: form.whatsapp,
      Data_Evento: form.data,
      Horario_Evento: form.horario,
      Observacao_Horario: form.observacaoHorario,
      Logistica_Tipo: form.logistica === 'retirada' ? 'Retirada' : 'Entrega',
      Endereco_Completo: form.logistica === 'retirada'
        ? PICKUP_ADDRESS
        : `${form.rua}, ${form.numero}, ${form.complemento}, ${form.bairro}, ${form.cidade}, CEP ${form.cep}`,
      Lista_Itens_Carrinho: buildCartSummary(),
      Subtotal_Pedido: total,
      Frete: frete,
      Total_Pedido: totalComFrete,
      Metodo_Pagamento: form.pagamento,
    }

    // Fire webhook (non-blocking)
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } catch (e) {
        console.error('Webhook error:', e)
      }
    }

    // Redirect to WhatsApp
    const msg = buildWhatsAppMsg()
    const encoded = encodeURIComponent(msg)
    clearCart()
    setIsCheckoutOpen(false)
    window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`
  }

  if (!isCheckoutOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-offwhite rounded-t-3xl md:rounded-2xl w-full md:max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Handle */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-offwhite z-10 border-b border-cream">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="font-sans text-xs text-gold uppercase tracking-widest font-bold mb-0.5">Agendamento</p>
              <h2 className="font-serif text-xl text-marsala font-semibold">Finalizar Encomenda</h2>
            </div>
            <button
              onClick={() => { setIsCheckoutOpen(false); setIsCartOpen(true) }}
              className="text-gray-400 hover:text-marsala p-1"
              aria-label="Voltar ao carrinho"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex px-6 pb-4 gap-2">
            {STEPS.map((s, i) => (
              <div key={i} className={`flex-1 text-center ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`h-1.5 rounded-full mb-1.5 ${i <= step ? 'bg-marsala' : 'bg-gray-200'}`} />
                <p className="font-sans text-xs text-gray-500 truncate">{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* === STEP 0: Dados do cliente === */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block font-sans text-sm font-bold text-gray-700 mb-1.5">
                  Seu nome completo *
                </label>
                <input
                  type="text"
                  value={form.nome}
                  onChange={e => setField('nome', e.target.value)}
                  placeholder="Maria da Silva"
                  className="input-field"
                  autoComplete="name"
                />
              </div>
              <div>
                <label className="block font-sans text-sm font-bold text-gray-700 mb-1.5">
                  WhatsApp para contato *
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={e => setField('whatsapp', e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="input-field"
                  autoComplete="tel"
                />
              </div>

              {/* Cart summary */}
              <div className="bg-cream rounded-xl p-4">
                <p className="font-sans text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Resumo do Pedido</p>
                {items.map(i => (
                  <div key={i.cartId} className="flex justify-between text-sm mb-1">
                    <span className="font-sans text-gray-600 truncate flex-1 pr-2">{i.name}</span>
                    <span className="font-sans font-bold text-marsala flex-shrink-0">R$ {i.subtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
                <div className="border-t border-gold/20 mt-2 pt-2 flex justify-between">
                  <span className="font-sans font-bold text-gray-700">Total Estimado</span>
                  <span className="font-serif font-bold text-marsala text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          )}

          {/* === STEP 1: Data e Local === */}
          {step === 1 && (
            <div className="space-y-5">
              {/* Date picker */}
              <div>
                <label className="block font-sans text-sm font-bold text-gray-700 mb-1.5">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={form.data}
                  onChange={e => {
                    const v = e.target.value
                    if (!isDisabledDate(v)) setField('data', v)
                  }}
                  className="input-field"
                />
                {form.data && isDisabledDate(form.data) && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Não atendemos às Domingos e Segundas-feiras. Por favor escolha outra data.
                  </p>
                )}
                {form.data && !isDisabledDate(form.data) && (
                  <p className="mt-1.5 text-xs text-gray-500">{formatDatePT(form.data)}</p>
                )}
              </div>

              {/* Horário */}
              <div>
                <label className="block font-sans text-sm font-bold text-gray-700 mb-1.5">
                  Horário preferido *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {HORARIOS.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setField('horario', h.label)}
                      className={`py-3 rounded-xl text-sm font-sans font-medium border-2 transition-all ${
                        form.horario === h.label
                          ? 'border-marsala bg-marsala text-white'
                          : 'border-gray-200 text-gray-600 hover:border-marsala/40'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <label className="block font-sans text-xs font-bold text-gray-600 mb-1">
                    Precisa de horário específico? <span className="font-normal text-gray-400">(opcional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.observacaoHorario}
                    onChange={e => setField('observacaoHorario', e.target.value)}
                    placeholder="Ex: preciso receber antes das 14h..."
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Logistica */}
              <div>
                <p className="font-sans text-sm font-bold text-gray-700 mb-2">Modo de Entrega *</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'retirada', label: 'Retirar no Ateliê', icon: '🏠' },
                    { id: 'entrega', label: 'Entrega em Domicílio', icon: '🚗' },
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setField('logistica', opt.id)}
                      className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all font-sans text-sm font-medium ${
                        form.logistica === opt.id
                          ? 'border-marsala bg-marsala/5 text-marsala'
                          : 'border-gray-200 text-gray-600 hover:border-marsala/30'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      {opt.label}
                      {opt.id === 'entrega' && (
                        <span className="text-xs text-gray-400 font-normal">+ R$ {FRETE_FIXO.toFixed(2).replace('.', ',')}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup address */}
              {form.logistica === 'retirada' && (
                <div className="bg-marsala/5 border border-marsala/20 rounded-xl p-4">
                  <p className="font-sans text-xs text-gold font-bold uppercase tracking-wide mb-1">Endereço de Retirada</p>
                  <p className="font-sans text-sm text-marsala font-medium">{PICKUP_ADDRESS}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(PICKUP_ADDRESS)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs text-gold hover:underline mt-1.5 inline-block"
                  >
                    Ver no Google Maps →
                  </a>
                </div>
              )}

              {/* Delivery form */}
              {form.logistica === 'entrega' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-xs font-bold text-gray-600 mb-1">CEP *</label>
                      <input type="text" value={form.cep} onChange={e => setField('cep', e.target.value)} placeholder="00000-000" className="input-field text-sm" maxLength={9} />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-bold text-gray-600 mb-1">Número *</label>
                      <input type="text" value={form.numero} onChange={e => setField('numero', e.target.value)} placeholder="123" className="input-field text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold text-gray-600 mb-1">Rua *</label>
                    <input type="text" value={form.rua} onChange={e => setField('rua', e.target.value)} placeholder="Rua das Flores" className="input-field text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-sans text-xs font-bold text-gray-600 mb-1">Bairro *</label>
                      <input type="text" value={form.bairro} onChange={e => setField('bairro', e.target.value)} className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-bold text-gray-600 mb-1">Cidade *</label>
                      <input
                        type="text"
                        value={form.cidade}
                        onChange={e => setField('cidade', e.target.value)}
                        className={`input-field text-sm ${cidadeInvalida ? 'border-red-400 focus:ring-red-300' : ''}`}
                      />
                    </div>
                  </div>

                  {/* City validation warning */}
                  {cidadeInvalida && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="font-sans text-sm text-red-700 mb-3">
                        ⚠️ Aparentemente sua região não tem entrega disponível.
                        Entregamos em <strong>Mauá</strong> e <strong>Parque Marajoara (Santo André)</strong>.
                        Fale no WhatsApp para validar a informação.
                      </p>
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('estava fazendo um pedido da linha festa e meu endereço não entrou.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-marsala text-white text-sm font-sans font-medium py-2 px-4 rounded-full hover:bg-marsala/90 transition-colors"
                      >
                        💬 Verificar pelo WhatsApp
                      </a>
                    </div>
                  )}

                  <div>
                    <label className="block font-sans text-xs font-bold text-gray-600 mb-1">Complemento</label>
                    <input type="text" value={form.complemento} onChange={e => setField('complemento', e.target.value)} placeholder="Apto, bloco..." className="input-field text-sm" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === STEP 2: Pagamento === */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="font-sans text-sm font-bold text-gray-700 mb-3">Forma de Pagamento preferencial *</p>
                <div className="space-y-2">
                  {PAYMENT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setField('pagamento', opt.label)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        form.pagamento === opt.label
                          ? 'border-marsala bg-marsala/5'
                          : 'border-gray-200 hover:border-marsala/30'
                      }`}
                    >
                      <span className="text-2xl">{opt.icon}</span>
                      <span className={`font-sans font-medium text-sm ${form.pagamento === opt.label ? 'text-marsala' : 'text-gray-700'}`}>
                        {opt.label}
                      </span>
                      {form.pagamento === opt.label && (
                        <svg className="w-5 h-5 text-marsala ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Final summary */}
              <div className="bg-cream rounded-xl p-4 space-y-2">
                <p className="font-sans text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">Resumo Final</p>
                <div className="grid grid-cols-2 gap-1 text-sm">
                  <span className="font-sans text-gray-500">Cliente</span>
                  <span className="font-sans text-gray-800 font-medium">{form.nome}</span>
                  <span className="font-sans text-gray-500">Data</span>
                  <span className="font-sans text-gray-800 font-medium">{form.data ? new Date(form.data + 'T12:00:00').toLocaleDateString('pt-BR') : '—'}</span>
                  <span className="font-sans text-gray-500">Horário</span>
                  <span className="font-sans text-gray-800 font-medium">{form.horario || '—'}</span>
                  <span className="font-sans text-gray-500">Modo</span>
                  <span className="font-sans text-gray-800 font-medium capitalize">{form.logistica}</span>
                </div>
                <div className="border-t border-gold/20 mt-2 pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-gray-500">Subtotal</span>
                    <span className="font-sans text-gray-800">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {frete > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="font-sans text-gray-500">Frete</span>
                      <span className="font-sans text-gray-800">R$ {frete.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1">
                    <span className="font-sans font-bold text-gray-700">Total</span>
                    <span className="font-serif font-bold text-marsala text-xl">R$ {totalComFrete.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              {/* Consent checkbox */}
              <label className="flex items-start gap-3 p-4 bg-white rounded-2xl border-2 border-marsala/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.ciente}
                  onChange={e => setField('ciente', e.target.checked)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  form.ciente ? 'bg-marsala border-marsala' : 'border-gray-300'
                }`}>
                  {form.ciente && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                <span className="font-sans text-sm text-gray-600 leading-relaxed">
                  Estou ciente que meu pedido só será confirmado após a validação final e disponibilidade via WhatsApp.
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Footer navigation */}
        <div className="sticky bottom-0 bg-offwhite border-t border-cream px-6 py-4">
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="btn-outline flex-1 text-sm py-3"
              >
                ← Voltar
              </button>
            )}

            {step < 2 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 ? !step0Valid : !step1Valid}
                className="btn-primary flex-1 text-sm py-3"
              >
                Avançar →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="btn-primary flex-1 text-sm py-3 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>💬 Finalizar pelo WhatsApp</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
