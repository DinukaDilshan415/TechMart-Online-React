import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import LoginPage from "./LoginPage"

const Login = () => {
    return (
        <>
            <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">                
                <Header />
                <LoginPage />
                <Footer/>
                <h1 className="text-6xl text-amber-500">Login</h1>
            </div>
        </>
    )
}

export default Login