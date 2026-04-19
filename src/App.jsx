import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ChatWidget from './components/ChatWidget.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ArticlesProvider } from './context/ArticlesContext.jsx'
import Home from './pages/Home.jsx'
import Articles from './pages/Articles.jsx'
import Detail from './pages/Detail.jsx'
import Categories from './pages/Categories.jsx'

const Admin = lazy(() => import('./pages/Admin.jsx'))

function AdminFallback() {
  return (
    <div className="container">
      <div className="glass skeleton" style={{ height: 320 }} />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ArticlesProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<Detail />} />
              <Route path="/categories" element={<Categories />} />
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <Admin />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
          <ChatWidget />
        </ArticlesProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
