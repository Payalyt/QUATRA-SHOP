'use client';
import React, { useState } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { Plus, Trash2, Save, Truck, Key, ShieldCheck, Zap } from 'lucide-react';
import { DeliveryPartner } from '@/lib/types/ecommerce';

export const DeliveryPartnerManager: React.FC = () => {
  const { settings, updateSettings, showToast } = useMarketplace();
  const [partners, setPartners] = useState<DeliveryPartner[]>(settings.deliveryPartners || []);
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState('');

  // Courier API Keys
  const [steadfastApiKey, setSteadfastApiKey] = useState(settings.courierConfig?.steadfastApiKey || 'sf_api_live_982910482910');
  const [steadfastSecretKey, setSteadfastSecretKey] = useState(settings.courierConfig?.steadfastSecretKey || 'sf_secret_482910482910');
  const [pathaoClientId, setPathaoClientId] = useState(settings.courierConfig?.pathaoClientId || 'pth_client_81029384');
  const [pathaoClientSecret, setPathaoClientSecret] = useState(settings.courierConfig?.pathaoClientSecret || 'pth_sec_92019201');

  // bKash & Nagad Merchant Keys
  const [bkashAppKey, setBkashAppKey] = useState(settings.bkashConfig?.appKey || 'bkash_app_key_8201928301');
  const [bkashAppSecret, setBkashAppSecret] = useState(settings.bkashConfig?.appSecret || 'bkash_app_secret_91029384');
  const [bkashUsername, setBkashUsername] = useState(settings.bkashConfig?.username || 'quatro_merchant_017');
  const [nagadMerchantId, setNagadMerchantId] = useState(settings.nagadConfig?.merchantId || 'NAGAD_MCH_82910481');

  const handleUpdate = () => {
    updateSettings({
      deliveryPartners: partners,
      courierConfig: {
        ...settings.courierConfig,
        steadfastApiKey,
        steadfastSecretKey,
        pathaoClientId,
        pathaoClientSecret
      },
      bkashConfig: {
        ...settings.bkashConfig,
        appKey: bkashAppKey,
        appSecret: bkashAppSecret,
        username: bkashUsername
      },
      nagadConfig: {
        ...settings.nagadConfig,
        merchantId: nagadMerchantId
      }
    });
    showToast('Delivery partners & API Gateway keys updated successfully!', 'success');
  };

  const addPartner = () => {
    if (!newName) return;
    const partner: DeliveryPartner = {
      id: `p-${Date.now()}`,
      name: newName,
      logoUrl: newLogo
    };
    setPartners([...partners, partner]);
    setNewName('');
    setNewLogo('');
  };

  return (
    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <Truck className="w-4 h-4 text-sky-600" />
          <span>Manage Delivery Partners</span>
        </h4>
        <button
          onClick={handleUpdate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 px-3 rounded flex items-center gap-1.5 text-xs font-bold transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          Save Partners
        </button>
      </div>
      
      <div className="space-y-2 mb-4">
        {partners.map((partner, index) => (
          <div key={partner.id} className="flex items-center justify-between bg-white border rounded-lg p-2 gap-3 group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded border bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {partner.logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={partner.logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                ) : (
                  <Truck className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-gray-900 truncate">{partner.name}</p>
                <p className="text-[9px] text-gray-400 truncate">{partner.logoUrl || 'No logo URL'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setPartners(partners.filter((_, i) => i !== index));
              }}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-white border-2 border-dashed border-gray-200 rounded-lg space-y-2">
        <p className="text-[10px] font-bold text-gray-500 uppercase">Add New Partner</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Partner Name (e.g. RedX)"
            className="p-2 border rounded text-xs outline-none focus:border-[#0284c7]"
          />
          <input
            value={newLogo}
            onChange={(e) => setNewLogo(e.target.value)}
            placeholder="Logo URL (optional)"
            className="p-2 border rounded text-xs outline-none focus:border-[#0284c7]"
          />
        </div>
        <button
          onClick={addPartner}
          disabled={!newName}
          className="w-full bg-sky-50 text-[#0284c7] border border-sky-200 p-2 rounded text-xs font-bold hover:bg-sky-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add to List
        </button>
      </div>

      {/* Steadfast & Pathao Courier API Keys Section */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3 mt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            <h5 className="font-extrabold text-xs">Steadfast & Pathao Courier API Settings</h5>
          </div>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded">
            Live Booking API
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Steadfast API Key
            </label>
            <input
              type="text"
              value={steadfastApiKey}
              onChange={(e) => setSteadfastApiKey(e.target.value)}
              placeholder="sf_api_live_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Steadfast Secret Key
            </label>
            <input
              type="password"
              value={steadfastSecretKey}
              onChange={(e) => setSteadfastSecretKey(e.target.value)}
              placeholder="sf_secret_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Pathao Client ID
            </label>
            <input
              type="text"
              value={pathaoClientId}
              onChange={(e) => setPathaoClientId(e.target.value)}
              placeholder="pth_client_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Pathao Client Secret
            </label>
            <input
              type="password"
              value={pathaoClientSecret}
              onChange={(e) => setPathaoClientSecret(e.target.value)}
              placeholder="pth_sec_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* bKash & Nagad Merchant Credentials Section */}
      <div className="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-3 mt-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-pink-400" />
            <h5 className="font-extrabold text-xs">bKash & Nagad Direct Gateway API Settings</h5>
          </div>
          <span className="text-[10px] bg-pink-500/20 text-pink-300 font-mono font-bold px-2 py-0.5 rounded">
            PGW Online Pay
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              bKash App Key
            </label>
            <input
              type="text"
              value={bkashAppKey}
              onChange={(e) => setBkashAppKey(e.target.value)}
              placeholder="bkash_app_key_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-pink-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              bKash App Secret
            </label>
            <input
              type="password"
              value={bkashAppSecret}
              onChange={(e) => setBkashAppSecret(e.target.value)}
              placeholder="bkash_app_secret_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-pink-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              bKash Merchant Username
            </label>
            <input
              type="text"
              value={bkashUsername}
              onChange={(e) => setBkashUsername(e.target.value)}
              placeholder="quatro_merchant_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-pink-400"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
              Nagad Merchant ID
            </label>
            <input
              type="text"
              value={nagadMerchantId}
              onChange={(e) => setNagadMerchantId(e.target.value)}
              placeholder="NAGAD_MCH_..."
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded text-slate-100 font-mono text-[11px] outline-none focus:border-orange-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
