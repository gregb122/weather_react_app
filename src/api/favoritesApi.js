const API_BASE = import.meta.env.VITE_API_URL || '/api';

const handleJson = async response => {
    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Request failed');
    }
    return response.json();
};

export const fetchFavorites = async () => {
    const response = await fetch(`${API_BASE}/favorites`);
    return handleJson(response);
};

export const toggleFavorite = async cityId => {
    const response = await fetch(`${API_BASE}/favorites/toggle`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({cityId}),
    });
    return handleJson(response);
};
