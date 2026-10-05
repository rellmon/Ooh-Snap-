import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Booth from './pages/Booth'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Review from './pages/Review'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/booth" element={<Booth />} />
        <Route path="/review" element={<Review />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App