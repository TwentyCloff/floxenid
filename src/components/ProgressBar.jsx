import { motion } from "framer-motion";
import Tooltip from "./Tooltip";

const ProgressBar = ({ 
  value, 
  max = 100, 
  label, 
  color = "blue", 
  showTooltip = true,
  height = "h-2",
  borderRadius = "rounded-full"
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    red: "from-red-500 to-red-600",
    yellow: "from-yellow-500 to-yellow-600",
    indigo: "from-indigo-500 to-indigo-600",
    pink: "from-pink-500 to-pink-600"
  };
  
  const progressBar = (
    <div className={`w-full ${height} bg-gray-800 ${borderRadius} overflow-hidden`}>
      <motion.div
        className={`h-full ${colorClasses[color]} ${borderRadius}`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, type: "spring", damping: 10 }}
      />
    </div>
  );
  
  return showTooltip ? (
    <Tooltip 
      content={`${value}/${max} (${Math.round(percentage)}%) - ${label}`}
      position="top"
      delay={100}
    >
      <div className="w-full">
        {progressBar}
      </div>
    </Tooltip>
  ) : progressBar;
};

export default ProgressBar;
