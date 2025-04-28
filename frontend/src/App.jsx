import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import FuncionarioList from './pages/FuncionarioList';
import FuncionarioForm from './pages/FuncionarioForm';
import ClienteList from './pages/ClienteList';
import ClienteForm from './pages/ClienteForm';
import ProdutoList from './pages/ProdutoList';
import ProdutoForm from './pages/ProdutoForm';
import LoginForm from './pages/LoginForm';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    console.log('ProtectedRoute: isAuthenticated =', isAuthenticated); // Log para verificar
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => (
    <>
        <Navbar />
        <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/funcionarios" element={<ProtectedRoute><FuncionarioList /></ProtectedRoute>} />
            <Route path="/funcionario" element={<ProtectedRoute><FuncionarioForm /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><ClienteList /></ProtectedRoute>} />
            <Route path="/cliente" element={<ProtectedRoute><ClienteForm /></ProtectedRoute>} />
            <Route path="/produtos" element={<ProtectedRoute><ProdutoList /></ProtectedRoute>} />
            <Route path="/produto" element={<ProtectedRoute><ProdutoForm /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    </>
);

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;