import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importa o toast do React Toastify

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
    // Inicializa o estado com base no valor do sessionStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("loginRealizado") === "true";
    });

    const navigate = useNavigate();

    // Função para login
    const login = (username, password) => {
        if (username === "abc" && password === "bolinhas") {
            setIsAuthenticated(true);
            sessionStorage.setItem("loginRealizado", "true");
            navigate("/home");
            return true; // Retorna true para indicar sucesso
        } else {
            return false; // Retorna false para indicar falha
        }
    };

    // Função para logout
    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("loginRealizado");
        navigate("/login");
        toast.info("Logout realizado com sucesso!"); // Notificação de logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);