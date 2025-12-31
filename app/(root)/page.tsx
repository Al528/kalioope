
import { playfair } from "@/fonts"
import HomeClient from "./home/home-client"
const Home = () => {
  return (
  <div>
    <h1 className={`${playfair.className} text-5xl`}>Home</h1>
    <HomeClient />
  </div>
  )
}

export default Home
