import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-blend-lighten bg-linear-30 from-blue-400 to-slate-300'> 
      <Navbar/>
      <Header/>
    </div>
  )
}

export default Home
