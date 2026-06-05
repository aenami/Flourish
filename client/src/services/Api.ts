import { tokenManager } from "../utils/tokenManager";

// URL base sobre la cual construiremos la direccion de nuestras peticiones.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type ApiErrorResponse = {
    message?: unknown;
};

const getReadableMessage = (message: unknown, fallback: string) => {
    if (typeof message === "string" && message.trim()) return message;

    if (message instanceof Error) return message.message;

    return fallback;
};

// Funcion que se encarga de crear todos los headers necesarios para cada peticion.
const buildHeaders = (isPublic = false): Record<string, string> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (!isPublic) {
        const token = tokenManager.getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
};

const handleResponse = async (response: Response) => {
    // Verificamos si la respuesta del servidor fue 2xx u otra distinta.
    if (!response.ok) {
        // Si el backend responde 401, limpiamos la sesion y enviamos al login.
        if (response.status === 401) {
            tokenManager.clearSession();
            window.location.href = "/login";
        }

        const error = (await response.json().catch(() => ({}))) as ApiErrorResponse;
        throw new Error(getReadableMessage(error.message, `Error ${response.status}`));
    }

    return response.json();
};

export const api = {
    get: (endpoint: string, isPublic = false) =>
        fetch(`${BASE_URL}${endpoint}`, {
            method: "GET",
            headers: buildHeaders(isPublic),
        }).then(handleResponse),

    post: (endpoint: string, body: Record<string, unknown>, isPublic = false) =>
        fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: buildHeaders(isPublic),
            body: JSON.stringify(body),
        }).then(handleResponse),

    put: (endpoint: string, body: Record<string, unknown>) =>
        fetch(`${BASE_URL}${endpoint}`, {
            method: "PUT",
            headers: buildHeaders(),
            body: JSON.stringify(body),
        }).then(handleResponse),

    patch: (endpoint: string, body: Record<string, unknown>) =>
        fetch(`${BASE_URL}${endpoint}`, {
            method: "PATCH",
            headers: buildHeaders(),
            body: JSON.stringify(body),
        }).then(handleResponse),

    delete: (endpoint: string) =>
        fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
            headers: buildHeaders(),
        }).then(handleResponse),
};
