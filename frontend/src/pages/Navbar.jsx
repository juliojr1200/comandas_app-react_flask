import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Hook para obter a rota atual

    // Não exibir a Navbar na página de login
    if (location.pathname === '/login') return null;

    // Não exibir a Navbar se o usuário não estiver autenticado
    if (!isAuthenticated) return null;

    return (
        <AppBar position="static" sx={{ mb: 2 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Comandas App
                </Typography>
                <Box>
                    <Button color="inherit" onClick={() => navigate('/')}>Home</Button>
                    <Button color="inherit" onClick={() => navigate('/funcionarios')}>Funcionário</Button>
                    <Button color="inherit" onClick={() => navigate('/clientes')}>Cliente</Button>
                    <Button color="inherit" onClick={() => navigate('/produtos')}>Produto</Button>
                    {/* <Button color="inherit" onClick={() => navigate('/login')}>Login</Button> */}
                    <Button color="inherit" onClick={() => { logout(); navigate('/login'); }}>Sair</Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;