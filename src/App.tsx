import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Booth from './pages/Booth'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/booth" element={<Booth />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App