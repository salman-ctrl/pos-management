import { TrendingUp, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, isAlert }) => {
  return (
    <div className="card-base p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${isAlert ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-500'}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className="flex items-center text-sm">
        {trend === 'up' && <TrendingUp size={16} className="text-green-500 mr-1" />}
        {trend === 'down' && <TrendingUp size={16} className="text-red-500 mr-1 rotate-180" />}
        
        {/* Fallback icon if trend is strictly for alert but uses different icon logic */}
        {isAlert && trend === 'down' && <AlertTriangle size={16} className="text-red-500 mr-1" />}

        <span className={trend === 'up' ? 'text-green-600 font-medium' : trend === 'down' ? 'text-red-500 font-medium' : 'text-gray-400'}>
          {trendValue}
        </span>
        <span className="text-gray-400 ml-1">{subtitle}</span>
      </div>
    </div>
  );
};

export default StatCard;