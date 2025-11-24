import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Erro ao processar requisição';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Produtos externos (FakeStore)
export const searchProducts = async (category = null) => {
  try {
    const url = category 
      ? `/external/produtos?category=${category}`
      : '/external/produtos';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`/external/produtos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const trackProduct = async (externalId) => {
  try {
    const response = await api.post(`/external/produtos/${externalId}/track`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/external/categorias');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Favoritos
export const getFavorites = async (params = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoria = null,
      preco_min = null,
      preco_max = null,
      sort_by = 'created_at',
      order = 'desc'
    } = params;

    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    queryParams.append('sort_by', sort_by);
    queryParams.append('order', order);
    
    if (categoria) queryParams.append('categoria', categoria);
    if (preco_min !== null) queryParams.append('preco_min', preco_min);
    if (preco_max !== null) queryParams.append('preco_max', preco_max);

    const response = await api.get(`/produtos?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addFavorite = async (externalId) => {
  try {
    const response = await api.post('/produtos', { external_id: externalId });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const removeFavorite = async (id) => {
  try {
    await api.delete(`/produtos/${id}`);
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateFavorite = async (id, data) => {
  try {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFavoriteById = async (id) => {
  try {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Histórico e alertas
export const getPriceHistory = async (productId) => {
  try {
    const response = await api.get(`/produtos/${productId}/historico`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAlerts = async (productId) => {
  try {
    const response = await api.get(`/produtos/${productId}/alertas`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAlert = async (productId, targetPrice) => {
  try {
    const response = await api.post(`/produtos/${productId}/alertas`, {
      preco_alvo: targetPrice
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAlert = async (productId, alertId) => {
  try {
    await api.delete(`/produtos/${productId}/alertas/${alertId}`);
    return true;
  } catch (error) {
    throw error;
  }
};

// Estatísticas
export const getStatistics = async () => {
  try {
    const response = await api.get('/produtos/estatisticas');
    return response.data;
  } catch (error) {
    throw error;
  }
};

