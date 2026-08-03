import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import EntryDetail from './components/EntryDetail';
import AddEntry from './components/AddEntry';
import EditEntry from './components/EditEntry';
import SearchPage from './components/SearchPage';
import GenerateEntry from './components/GenerateEntry';
import CategoryEntry from './components/CategoryEntry';
import AllCategories from './components/AllCategories';
import AllEntries from './components/AllEntries';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entries/add" element={<AddEntry />} />
        <Route path="/entries/:id" element={<EntryDetail />} />
        <Route path="/entries/:id/edit" element={<EditEntry />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/entries/generate" element={<GenerateEntry />} />
        <Route path="/categories/:id" element={<CategoryEntry />} />
        <Route path="/entries" element={<AllEntries />} />
        <Route path="/categories" element={<AllCategories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
