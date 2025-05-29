import { motion } from 'framer-motion';

const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  color = 'blue', 
  showLabel = true,
  className = '',
  animate = true
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500'
  };

  const textColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    indigo: 'text-indigo-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400'
  };

  const ProgressComponent = animate ? motion.div : 'div';

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className={`${textColorClasses[color]}`}>
            {label || `${value}/${max}`}
          </span>
          <span className="text-gray-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
        <ProgressComponent
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full ${colorClasses[color]}`}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
