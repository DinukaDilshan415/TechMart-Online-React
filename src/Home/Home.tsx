import MainNav from "../Components/MainNav"
import Footer from "../Footer/Footer"
import Header from "../Header/Header"
import HomeProducts from "./HomeProducts"

const Home = () => {

  return (
    <>
      <Header />
      <MainNav />
      <div className="container mx-auto px-4">
        <HomeProducts/>
      </div>
      <Footer />
    </>
  )
}

export default Home