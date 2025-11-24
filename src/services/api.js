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
    // Não mostrar toast para erros 404 ou 422 em verificações silenciosas
    // O toast será mostrado apenas quando explicitamente necessário
    if (error.response?.status === 404 || error.response?.status === 422) {
      return Promise.reject(error);
    }
    const message = error.response?.data?.detail || error.message || 'Erro ao processar requisição';
    // Verificar se a mensagem é um array (erro de validação do Pydantic)
    if (Array.isArray(message)) {
      const firstError = message[0]?.msg || 'Erro de validação';
      toast.error(firstError);
    } else if (typeof message === 'string') {
      toast.error(message);
    }
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
    // ID é integer (produto da FakeStore)
    const response = await api.get(`/external/produtos/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getExternalProductById = async (externalId) => {
  try {
    // Alias para getProductById para clareza
    return await getProductById(externalId);
  } catch (error) {
    throw error;
  }
};

export const trackProduct = async (externalId) => {
  try {
    // externalId é integer (produto da FakeStore)
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
    if (error.response && error.response.status === 404) {
      return null; // Retorna null se não encontrar, sem lançar erro
    }
    throw error;
  }
};

export const getFavoriteByExternalId = async (externalId) => {
  try {
    // Buscar favorito por external_id (string)
    // Buscar todos os favoritos (com limite de 100) e filtrar
    const favorites = await getFavorites({ limit: 100 });
    const favorite = favorites.items?.find(f => f.external_id === externalId);
    return favorite || null;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    return null; // Retornar null em caso de erro para não quebrar a aplicação
  }
};

export const checkIfFavorite = async (externalId) => {
  try {
    const favorite = await getFavoriteByExternalId(externalId);
    return favorite !== null;
  } catch (error) {
    console.error("Erro ao verificar se é favorito:", error);
    return false;
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

