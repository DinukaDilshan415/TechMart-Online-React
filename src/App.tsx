import { Bounce, ToastContainer } from 'react-toastify'
import './App.css'
import AppRouter from './Components/AppRouter'
import { CartProvider } from './Cart/useCart'

function App() {

  return (
    <>
      <CartProvider>
        <AppRouter />
      </CartProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  )
}

export default App
