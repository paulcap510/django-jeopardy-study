import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
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
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/entries"
          element={
            <PageWrapper>
              <AllEntries />
            </PageWrapper>
          }
        />
        <Route
          path="/entries/add"
          element={
            <PageWrapper>
              <AddEntry />
            </PageWrapper>
          }
        />
        <Route
          path="/entries/:id"
          element={
            <PageWrapper>
              <EntryDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/entries/:id/edit"
          element={
            <PageWrapper>
              <EditEntry />
            </PageWrapper>
          }
        />
        <Route
          path="/categories"
          element={
            <PageWrapper>
              <AllCategories />
            </PageWrapper>
          }
        />
        <Route
          path="/categories/:id"
          element={
            <PageWrapper>
              <CategoryEntry />
            </PageWrapper>
          }
        />
        <Route
          path="/search"
          element={
            <PageWrapper>
              <SearchPage />
            </PageWrapper>
          }
        />
        <Route
          path="/generate"
          element={
            <PageWrapper>
              <GenerateEntry />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="transition-backdrop" />
      <Navbar />
      <AnimatedRoutes />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
