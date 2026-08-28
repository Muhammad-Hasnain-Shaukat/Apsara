import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';
import { FilterState, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  categories: ProductCategory[];
  materials: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories,
  materials,
}) => {
  return (
    <aside className="w-full bg-white rounded-[8px] border border-[#E8DFD3] p-5 space-y-6 text-[#231B15]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-apsara-camel" />
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#231B15]">
            Filters
          </h4>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#8E7F74] hover:text-apsara-camel font-semibold transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#231B15] mb-2.5">
          Category
        </h5>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: 'All' })}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-between ${
              filters.category === 'All'
                ? 'bg-apsara-camel text-white font-semibold'
                : 'text-[#6B5E54] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-between ${
                filters.category === cat
                  ? 'bg-apsara-camel text-white font-semibold'
                  : 'text-[#6B5E54] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <h5 className="text-[11px] font-bold uppercase tracking-wider text-[#231B15] mb-2.5">
          Material
        </h5>
        <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
          <button
            onClick={() => onFilterChange({ material: 'All' })}
            className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-between ${
              filters.material === 'All'
                ? 'bg-apsara-camel text-white font-semibold'
                : 'text-[#6B5E54] hover:bg-[#FAF7F2]'
            }`}
          >
            <span>All Materials</span>
          </button>
          {materials.map((mat) => (
            <button
              key={mat}
              onClick={() => onFilterChange({ material: mat })}
              className={`w-full text-left px-2.5 py-1.5 text-xs rounded-[3px] transition-colors flex items-center justify-between ${
                filters.material === mat
                  ? 'bg-apsara-camel text-white font-semibold'
                  : 'text-[#6B5E54] hover:bg-[#FAF7F2]'
              }`}
            >
              <span className="truncate">{mat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-3 border-t border-[#E8DFD3]">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="w-4 h-4 accent-apsara-camel rounded"
          />
          <span className="text-xs text-[#231B15] font-medium">
            In Stock Only
          </span>
        </label>
      </div>

    </aside>
  );
};
