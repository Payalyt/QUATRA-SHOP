'use client';
import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Plus, Trash2, Save, ShieldCheck, Truck, RotateCcw, CreditCard } from 'lucide-react';

const ICON_OPTIONS = ['ShieldCheck', 'Truck', 'RotateCcw', 'CreditCard'];

export const FooterFeaturesManager: React.FC = () => {
  const { settings, updateSettings, showToast } = useMarketplace();
  const [features, setFeatures] = useState(settings.footerFeatures || []);

  const handleUpdate = () => {
    updateSettings({ footerFeatures: features });
    showToast('Footer features updated successfully!', 'success');
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm text-gray-900">Manage Footer Feature Props</h4>
        <button
          onClick={handleUpdate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded flex items-center gap-1.5 text-xs font-bold transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save Features
        </button>
      </div>
      
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={feature.id} className="p-3 bg-white border rounded-lg space-y-2">
            <div className="flex gap-2">
              <input
                value={feature.title}
                onChange={(e) => {
                  const newFeatures = [...features];
                  newFeatures[index].title = e.target.value;
                  setFeatures(newFeatures);
                }}
                placeholder="Feature Title (e.g. 100% Authentic)"
                className="p-2 border rounded text-xs flex-1 outline-none focus:border-[#0284c7] font-bold"
              />
              <select
                value={feature.iconName}
                onChange={(e) => {
                  const newFeatures = [...features];
                  newFeatures[index].iconName = e.target.value;
                  setFeatures(newFeatures);
                }}
                className="p-2 border rounded text-xs outline-none bg-gray-50 font-medium"
              >
                {ICON_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  setFeatures(features.filter((_, i) => i !== index));
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={feature.description}
              onChange={(e) => {
                const newFeatures = [...features];
                newFeatures[index].description = e.target.value;
                setFeatures(newFeatures);
              }}
              placeholder="Short description..."
              className="w-full p-2 border rounded text-xs outline-none focus:border-[#0284c7] resize-none"
              rows={2}
            />
          </div>
        ))}
      </div>
      
      <button
        onClick={() => setFeatures([...features, { id: `f-${Date.now()}`, title: '', description: '', iconName: 'ShieldCheck' }])}
        className="flex items-center gap-1 text-xs font-bold text-[#0284c7] mt-3 hover:underline"
      >
        <Plus className="w-4 h-4" /> Add New Feature Prop
      </button>
    </div>
  );
};
