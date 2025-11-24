// Helper functions

export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const getVariationColor = (variation) => {
  if (!variation) return 'gray';
  if (variation > 0) return 'red';
  if (variation < 0) return 'green';
  return 'gray';
};

export const getVariationIcon = (variation) => {
  if (!variation) return null;
  if (variation > 0) return '↑';
  if (variation < 0) return '↓';
  return '→';
};

