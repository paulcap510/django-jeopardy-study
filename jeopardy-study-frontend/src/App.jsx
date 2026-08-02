import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import EntryDetail from './components/EntryDetail'
import AddEntry from './components/AddEntry'
import EditEntry from './components/EditEntry'
import SearchPage from './components/SearchPage'
import GenerateEntry from './components/GenerateEntry'
import CategoryEntry from './components/CategoryEntry'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entries/add" element={<AddEntry />} />
        <Route path="/entries/:id" element={<EntryDetail />} />
        <Route path="/entries/:id/edit" element={<EditEntry />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/entries/generate" element={<GenerateEntry />} />
        <Route path="/categories/:id" element={<CategoryEntry />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App