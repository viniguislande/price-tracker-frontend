import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatPrice, formatDate } from '../utils/helpers';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ priceHistory = [], alertPrice = null }) {
  if (!priceHistory || priceHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Nenhum histórico disponível</p>
      </div>
    );
  }

  // Ordenar por data (mais antigo primeiro para o gráfico)
  const sortedHistory = [...priceHistory].sort((a, b) => 
    new Date(a.data_consulta) - new Date(b.data_consulta)
  );

  const labels = sortedHistory.map(item => formatDate(item.data_consulta));
  const prices = sortedHistory.map(item => item.preco);
  
  // Cor da linha baseada na variação
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const lineColor = lastPrice >= firstPrice ? '#ef4444' : '#22c55e';

  const data = {
    labels,
    datasets: [
      {
        label: 'Preço',
        data: prices,
        borderColor: lineColor,
        backgroundColor: lineColor + '20',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      ...(alertPrice ? [{
        label: 'Preço Alvo',
        data: Array(labels.length).fill(alertPrice),
        borderColor: '#f59e0b',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
      }] : [])
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Preço: ${formatPrice(context.parsed.y)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return formatPrice(value);
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Histórico de Preços</h3>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

