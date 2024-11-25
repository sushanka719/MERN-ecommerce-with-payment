import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:4000/api/auth";

axios.defaults.withCredentials = true;

const initialState = {
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
};

// Reducer to manage state transitions
const authReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: true, error: null };
        case 'SET_AUTH':
            return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'SET_MESSAGE':
            return { ...state, message: action.payload, isLoading: false };
        case 'LOGOUT':
            return { ...initialState, isCheckingAuth: false };
        case 'SET_CHECKING_AUTH':
            return { ...state, isCheckingAuth: true };
        case 'CHECK_AUTH':
            return { ...state, user: action.payload, isAuthenticated: true, isCheckingAuth: false };
        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Actions

    const signup = async (email, password, name) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password, name });
            dispatch({ type: 'SET_AUTH', payload: response.data.user });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || "Error signing up" });
        }
    };

    const login = async (email, password) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            dispatch({ type: 'SET_AUTH', payload: response.data.user });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || "Error logging in" });
        }
    };

    const logout = async () => {
        dispatch({ type: 'SET_LOADING' });
        try {
            await axios.post(`${API_URL}/logout`);
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: "Error logging out" });
        }
    };

    const verifyEmail = async (code) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            dispatch({ type: 'SET_AUTH', payload: response.data.user });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || "Error verifying email" });
        }
    };

    const checkAuth = async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        dispatch({ type: 'SET_CHECKING_AUTH' });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            dispatch({ type: 'CHECK_AUTH', payload: response.data.user });
        } catch {
            dispatch({ type: 'LOGOUT' });
        }
    };

    const forgotPassword = async (email) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(`${API_URL}/forgot-password`, { email });
            dispatch({ type: 'SET_MESSAGE', payload: response.data.message });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || "Error sending reset password email" });
        }
    };

    const resetPassword = async (token, password) => {
        dispatch({ type: 'SET_LOADING' });
        try {
            const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            dispatch({ type: 'SET_MESSAGE', payload: response.data.message });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.response?.data?.message || "Error resetting password" });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signup,
                login,
                logout,
                verifyEmail,
                checkAuth,
                forgotPassword,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
