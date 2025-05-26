import axios from 'axios';
const PROXY_URL = import.meta.env.VITE_PROXY_BASE_URL + "cliente/";

export async function verificarCpf(cpf) {
    try {
        const response = await axios.get(`${PROXY_URL}cpf`, {
        params: { cpf }
    });
    return response.data;
    } catch (error) {
        console.error("Erro ao verificar CPF:", error);
        return null;
    }
}