// frontend/src/services/clienteService.jsx
import axios from 'axios';

const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "cliente/";

// Obter todos os clientes (READ - All)
export const getClientes = async () => {
  const response = await axios.get(`${PROXY_URL}all`);
  return response.data;
};

// Obter um cliente por ID (READ - One)
export const getClienteById = async (id) => {
  const response = await axios.get(`${PROXY_URL}one`, {
    params: { id_cliente: id }
  });
  // Supondo que a API externa retorne um array de um único objeto, pegamos [0]
  return Array.isArray(response.data) ? response.data[0] : response.data;
};

// Criar novo cliente (CREATE)
export const createCliente = async (cliente) => {
  const response = await axios.post(`${PROXY_URL}`, cliente);
  return response.data;
};

// Atualizar cliente existente (UPDATE)
export const updateCliente = async (id, cliente) => {
  // Montamos o corpo incluindo id_cliente
  const payload = { id_cliente: id, ...cliente };
  const response = await axios.put(`${PROXY_URL}`, payload);
  return response.data;
};

// Deletar cliente (DELETE)
export const deleteCliente = async (id) => {
  const response = await axios.delete(`${PROXY_URL}`, {
    params: { id_cliente: id }
  });
  return response.data;
};

// Validar se CPF já existe (GET /cpf?cpf=…)
export const verificarCpf = async (cpf) => {
  try {
    const response = await axios.get(`${PROXY_URL}cpf`, {
      params: { cpf }
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao verificar CPF:", error.response?.data || error.message);
    return null;
  }
};
