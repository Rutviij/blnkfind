import React from 'react';
import { MapPin, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

export default function ItemCard({ item, onClaim }) {
  const categoryColors = {
    Electronics: 'bg-[#473472]/10 text-[#473472]',
    Clothing: 'bg-[#53629E]/10 text-[#53629E]',
    Books: 'bg-[#87BAC3]/20 text-[#473472]',
    Accessories: 'bg-[#473472]/10 text-[#473472]',
    'Sports Equipment': 'bg-[#53629E]/10 text-[#53629E]',
    Keys: 'bg-[#87BAC3]/20 text-[#473472]',
    'ID/Cards': 'bg-[#473472]/10 text-[#473472]',
    Other: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#87BAC3]/20 group">
      {item.photo_url && (
        <div className="h-48 overflow-hidden">
          <img 
            src={item.photo_url} 
            alt={item.item_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {!item.photo_url && (
        <div className="h-48 bg-gradient-to-br from-[#87BAC3]/20 to-[#53629E]/20 flex items-center justify-center">
          <Tag size={48} className="text-[#53629E]/40" />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-[#473472] text-lg">{item.item_name}</h3>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${categoryColors[item.category] || categoryColors.Other}`}>
            {item.category}
          </span>
        </div>
        
        {item.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} className="text-[#53629E]" />
            <span>{item.location_found}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar size={14} className="text-[#53629E]" />
            <span>{format(new Date(item.date_found), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        {onClaim && (
          <button
            onClick={() => onClaim(item)}
            className="w-full py-2.5 bg-[#473472] text-white rounded-xl font-medium hover:bg-[#53629E] transition-colors duration-300"
          >
            Claim This Item
          </button>
        )}
      </div>
    </div>
  );
}
