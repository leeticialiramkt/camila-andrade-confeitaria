import { useState } from 'react'
import { CartProvider } from './store/CartContext'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import ProductCatalog from './components/ProductCatalog'
import ProductModal from './components/ProductModal'
import CartDrawer from './components/CartDrawer'
import CheckoutForm from './components/CheckoutForm'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'

function AppInner() {
  const [modalProduct, setModalProduct] = useState(null)
  const [modalType, setModalType] = useState(null)

  const handleConfigure = (product, type) => {
    setModalProduct(product)
    setModalType(type)
  }

  const handleCloseModal = () => {
    setModalProduct(null)
    setModalType(null)
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <Header />
      <main>
        <HeroSection />
        <ProductCatalog onConfigure={(p, t) => handleConfigure(p, t)} />
        <AboutSection />
      </main>
      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <CheckoutForm />
      {modalProduct && (
        <ProductModal
          product={modalProduct}
          type={modalType}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
