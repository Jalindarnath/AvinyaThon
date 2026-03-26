// src/components/StatCard.jsx
import PropTypes from 'prop-types';

export default function StatCard({ title, value, subtitle, trend, icon: Icon, colorClass, badge }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        {/* The icon: Icon rename happens here to allow <Icon /> usage */}
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon size={24} className="text-gray-700" />
        </div>
        {badge && (
          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
            badge === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
          }`}>
            {badge}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold mt-1">{value}</h3>
      <div className="mt-4 flex items-center gap-2">
        {trend && <span className="text-emerald-500 text-xs font-bold">{trend}</span>}
        <span className="text-gray-400 text-xs">{subtitle}</span>
      </div>
    </div>
  );
}

// This block tells the linter that these variables are expected and valid
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.string,
  icon: PropTypes.elementType.isRequired, // 'elementType' is used for components like Lucide icons
  colorClass: PropTypes.string,
  badge: PropTypes.string,
};