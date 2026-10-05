'use client';
import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Plus, Trash2, Save } from 'lucide-react';

export const FooterLinksManager: React.FC = () => {
  const { settings, updateSettings, showToast } = useMarketplace();
  const [links, setLinks] = useState(settings.footerLinks || []);

  const handleUpdate = () => {
    updateSettings({ footerLinks: links });
    showToast('Footer links updated successfully!', 'success');
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm text-gray-900">Manage Footer Links</h4>
        <button
          onClick={handleUpdate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded flex items-center gap-1.5 text-xs font-bold transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save Changes
        </button>
      </div>
      
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              value={link.label}
              onChange={(e) => {
                const newLinks = [...links];
                newLinks[index].label = e.target.value;
                setLinks(newLinks);
              }}
              placeholder="Label (e.g. About Us)"
              className="p-2 border rounded text-xs flex-1 outline-none focus:border-[#0284c7]"
            />
            <input
              value={link.url}
              onChange={(e) => {
                const newLinks = [...links];
                newLinks[index].url = e.target.value;
                setLinks(newLinks);
              }}
              placeholder="URL (e.g. /about)"
              className="p-2 border rounded text-xs flex-1 outline-none focus:border-[#0284c7]"
            />
            <button
              onClick={() => {
                setLinks(links.filter((_, i) => i !== index));
              }}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <button
        onClick={() => setLinks([...links, { label: '', url: '' }])}
        className="flex items-center gap-1 text-xs font-bold text-[#0284c7] mt-3 hover:underline"
      >
        <Plus className="w-4 h-4" /> Add New Footer Link
      </button>
    </div>
  );
};
