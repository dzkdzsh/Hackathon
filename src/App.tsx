import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MessagesProvider } from './context/MessagesContext'
import Layout from './Layout'
import HomePage from './pages/HomePage'
import WritePage from './pages/WritePage'
import MessageDetailPage from './pages/MessageDetailPage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <MessagesProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/message/:id" element={<MessageDetailPage />} />
          </Routes>
        </Layout>
      </MessagesProvider>
    </BrowserRouter>
  )
}
