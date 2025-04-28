import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Toolbar } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function ProdutoList() {
    const navigate = useNavigate();

    // Dados mockados para simular a lista de produtos
    const produtos = [
        { id: 1, nome: 'Café', descricao: 'Café preto 200ml', preco: 5.00, estoque: 100 },
        { id: 2, nome: 'Suco de Laranja', descricao: 'Suco natural 300ml', preco: 7.50, estoque: 50 },
        { id: 3, nome: 'Sanduíche', descricao: 'Sanduíche de frango', preco: 12.00, estoque: 30 },
    ];

    return (
        <TableContainer component={Paper}>
            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Produtos</Typography>
                <Button color="primary" onClick={() => navigate('/produto')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Preço</TableCell>
                        <TableCell>Estoque</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {produtos.map((produto) => (
                        <TableRow key={produto.id}>
                            <TableCell>{produto.id}</TableCell>
                            <TableCell>{produto.nome}</TableCell>
                            <TableCell>{produto.descricao}</TableCell>
                            <TableCell>{produto.preco.toFixed(2)}</TableCell>
                            <TableCell>{produto.estoque}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => navigate(`/produto/${produto.id}`)}>
                                    <Visibility color="primary" />
                                </IconButton>
                                <IconButton onClick={() => navigate(`/produto/${produto.id}`)}>
                                    <Edit color="secondary" />
                                </IconButton>
                                <IconButton onClick={() => alert(`Deletar produto ${produto.id}`)}>
                                    <Delete color="error" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default ProdutoList;