import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import EntryDetail from './components/EntryDetail'
import AddEntry from './components/AddEntry'
import EditEntry from './components/EditEntry'
import SearchComponent from './components/SearchComponent'
import SearchPage from './components/SearchPage'
import GenerateEntry from './components/GenerateEntry'


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


      </Routes>
    </BrowserRouter>
  )
}

export default App