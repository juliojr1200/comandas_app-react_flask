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
    const login = async (username, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();

                sessionStorage.setItem("loginRealizado", "true");
                sessionStorage.setItem("user", JSON.stringify(data));
            
                setIsAuthenticated(true);
                navigate("/home");
                return true;
            } else {
                return false; // Login falhou
            }
        } catch (error) {
            console.error("Erro no login:", error);
            return false;
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