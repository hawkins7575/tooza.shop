import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Breadcrumb } from './components/Breadcrumb'
import { HomePage } from './pages/HomePage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'

// Lazy loading으로 성능 최적화
const BlogPage = lazy(() => import('./pages/BlogPage').then(module => ({ default: module.BlogPage })))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage').then(module => ({ default: module.BlogPostPage })))
const BoardsPage = lazy(() => import('./pages/BoardsPage').then(module => ({ default: module.BoardsPage })))
const BoardPage = lazy(() => import('./pages/BoardPage').then(module => ({ default: module.BoardPage })))
const BoardPostPage = lazy(() => import('./pages/BoardPostPage').then(module => ({ default: module.BoardPostPage })))
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(module => ({ default: module.DashboardPage })))
const AdminPage = lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })))
const ImportantInfoPage = lazy(() => import('./pages/ImportantInfoPage').then(module => ({ default: module.ImportantInfoPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })))
const TermsPage = lazy(() => import('./pages/TermsPage').then(module => ({ default: module.TermsPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })))

// 로딩 컴포넌트
const LoadingFallback = () => (
  <div style={{
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    color: '#6b7280',
    fontSize: '14px'
  }}>
    로딩 중...
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div style={{minHeight: '100vh', backgroundColor: 'var(--background)'}}>
            <Header />
            <main className="main-content" style={{maxWidth: '80rem', margin: '0 auto', padding: '2rem 1rem'}}>
              <Breadcrumb />
              <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/boards" element={<BoardsPage />} />
                    <Route path="/boards/:boardType" element={<BoardPage />} />
                    <Route path="/boards/:boardType/:postId" element={<BoardPostPage />} />
                    <Route path="/important-info" element={<ImportantInfoPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin" 
                      element={
                        <ProtectedRoute>
                          <AdminPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App;
