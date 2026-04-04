import React from 'react';

const StatCard = ({ title, value, icon, trend, isCritical = false }) => {
  return (
    <div className={`glass-panel p-4 md:p-6 transition-all duration-500 hover:translate-y-[-4px] ${isCritical ? 'border-red-500/50 bg-red-500/5 status-glow-red' : 'hover:border-sl-accent/30'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 md:p-3 rounded-xl ${isCritical ? 'bg-red-500/10' : 'bg-sl-border/50'}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] md:text-xs font-medium text-green-400 bg-green-400/10 px-2 py-0.5 md:py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sl-muted text-[10px] md:text-sm font-medium mb-1 uppercase tracking-wider">{title}</p>
        <h3 className={`text-2xl md:text-4xl font-jetbrains font-bold tracking-tight ${isCritical ? 'text-red-400 animate-pulse' : 'text-white'}`}>
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};

export default StatCard;
