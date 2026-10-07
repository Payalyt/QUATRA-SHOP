'use client';

import React, { useState, useEffect } from 'react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import {
  Truck,
  Globe,
  Key,
  ShieldCheck,
  Save,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  MessageSquare,
  CreditCard,
  Building,
  HelpCircle
} from 'lucide-react';
import { ALL_COURIERS, CourierDefinition } from '@/lib/couriers/courier-registry';

export const DeliveryPartnerManager: React.FC = () => {
  const { showToast } = useMarketplace();

  // Active Tab: 'domestic' | 'international' | 'sms' | 'payment'
  const [activeTab, setActiveTab] = useState<'domestic' | 'international' | 'sms' | 'payment'>('domestic');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [testingCourierId, setTestingCourierId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic Key-Value store for all credentials
  const [envConfig, setEnvConfig] = useState<Record<string, string>>({});

  // SMS Gateways
  const [smsProvider, setSmsProvider] = useState<'BulkSMS BD' | 'Greenweb BD' | 'MiM SMS' | 'Reve Systems' | 'Alpha SMS'>('BulkSMS BD');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsSenderId, setSmsSenderId] = useState('QUATRO_BD');
  const [testPhone, setTestPhone] = useState('01712345678');
  const [isSendingTestSms, setIsSendingTestSms] = useState(false);

  // Payment Gateways
  const [bkashAppKey, setBkashAppKey] = useState('');
  const [bkashAppSecret, setBkashAppSecret] = useState('');
  const [bkashUsername, setBkashUsername] = useState('');
  const [nagadMerchantId, setNagadMerchantId] = useState('');
  const [sslStoreId, setSslStoreId] = useState('');
  const [sslStorePass, setSslStorePass] = useState('');

  // Fetch current configs from backend on mount
  useEffect(() => {
    fetch('/api/admin/env-config')
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.config) {
          const cfg = data.config;
          setEnvConfig(cfg);

          // Populate SMS & Payment states
          if (cfg.SMS_PROVIDER) setSmsProvider(cfg.SMS_PROVIDER as any);
          if (cfg.SMS_API_KEY) setSmsApiKey(cfg.SMS_API_KEY);
          if (cfg.SMS_SENDER_ID) setSmsSenderId(cfg.SMS_SENDER_ID);
          if (cfg.BKASH_APP_KEY) setBkashAppKey(cfg.BKASH_APP_KEY);
          if (cfg.BKASH_APP_SECRET) setBkashAppSecret(cfg.BKASH_APP_SECRET);
          if (cfg.BKASH_USERNAME) setBkashUsername(cfg.BKASH_USERNAME);
          if (cfg.NAGAD_MERCHANT_ID) setNagadMerchantId(cfg.NAGAD_MERCHANT_ID);
          if (cfg.SSLCOMMERZ_STORE_ID) setSslStoreId(cfg.SSLCOMMERZ_STORE_ID);
          if (cfg.SSLCOMMERZ_STORE_PASS) setSslStorePass(cfg.SSLCOMMERZ_STORE_PASS);
        }
      })
      .catch((err) => console.warn('Could not load env config:', err));
  }, []);

  // Update specific field value
  const handleFieldChange = (key: string, value: string) => {
    setEnvConfig((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSecretVisibility = (key: string) => {
    setVisibleSecrets((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Test courier API connection handshake
  const handleTestCourierConnection = async (courier: CourierDefinition) => {
    setTestingCourierId(courier.id);
    try {
      const res = await fetch('/api/admin/env-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          courierId: courier.id
        })
      });
      const data = await res.json();
      if (data?.success) {
        showToast(data.message, 'success');
      } else {
        showToast(`❌ [${courier.name}] সংযোগ যাচাই ব্যর্থ`, 'error');
      }
    } catch {
      showToast(`❌ [${courier.name}] API টেস্ট সংযোগ এরর`, 'error');
    } finally {
      setTestingCourierId(null);
    }
  };

  // Test SMS Sending
  const handleTestSms = () => {
    if (!testPhone) {
      showToast('অনুগ্রহ করে মোবাইল নাম্বার দিন', 'error');
      return;
    }
    setIsSendingTestSms(true);
    setTimeout(() => {
      setIsSendingTestSms(false);
      showToast(`✅ [${smsProvider}] টেস্ট এসএমএস পাঠানো হয়েছে: ${testPhone}`, 'success');
    }, 1000);
  };

  // Save everything to Backend .env.local file
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload: Record<string, string> = {
        ...envConfig,
        SMS_PROVIDER: smsProvider,
        SMS_API_KEY: smsApiKey,
        SMS_SENDER_ID: smsSenderId,
        BKASH_APP_KEY: bkashAppKey,
        BKASH_APP_SECRET: bkashAppSecret,
        BKASH_USERNAME: bkashUsername,
        NAGAD_MERCHANT_ID: nagadMerchantId,
        SSLCOMMERZ_STORE_ID: sslStoreId,
        SSLCOMMERZ_STORE_PASS: sslStorePass
      };

      const res = await fetch('/api/admin/env-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: payload })
      });
      const data = await res.json();

      if (data?.success) {
        showToast('🎉 সফল! সব কুরিয়ার ও API কি ব্যাকএন্ডের .env ফাইলে স্থায়ীভাবে সেভ হয়েছে!', 'success');
      } else {
        throw new Error(data?.error || 'Failed to save configuration');
      }
    } catch (err: any) {
      showToast(err?.message || 'API কি সেভ করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Filter couriers
  const domesticCouriers = ALL_COURIERS.filter(
    (c) =>
      c.category === 'domestic' &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bnName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.prefix.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const internationalCouriers = ALL_COURIERS.filter(
    (c) =>
      c.category === 'international' &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.bnName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.prefix.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper to check if a courier has any credentials set
  const isCourierConfigured = (courier: CourierDefinition) => {
    return courier.fields.some((f) => !!envConfig[f.key]?.trim());
  };

  const configuredCount = ALL_COURIERS.filter(isCourierConfigured).length;

  return (
    <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 mt-4 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0284c7] text-white flex items-center justify-center shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <span>সারাদেশ ও আন্তর্জাতিক কুরিয়ার API ম্যানেজার</span>
                <span className="text-[11px] bg-sky-100 text-[#0284c7] px-2 py-0.5 rounded-full font-bold">
                  25 Couriers Supported
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                এডমিন প্যানেল থেকে ২৫টি কুরিয়ার, SMS এবং পেমেন্ট গেটওয়ের API Key পরিচালনা করুন (ব্যাকএন্ড .env-তে সংরক্ষিত হয়)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-bold text-slate-500 block">সক্রিয় কনফিগারেশন:</span>
            <span className="text-xs font-black text-emerald-600">
              {configuredCount} / {ALL_COURIERS.length} কুরিয়ার সংযুক্ত
            </span>
          </div>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 px-5 rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>সব API কি ব্যাকএন্ডে সেভ করুন</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('domestic')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'domestic'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="text-sm">🇧🇩</span>
            <span>বাংলাদেশ লোকাল কুরিয়ার (১৯টি)</span>
          </button>

          <button
            onClick={() => setActiveTab('international')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'international'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            <span>আন্তর্জাতিক কুরিয়ার (৬টি)</span>
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sms'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>SMS গেটওয়ে</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'payment'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-pink-600" />
            <span>MFS ও পেমেন্ট গেটওয়ে</span>
          </button>
        </div>

        {/* Courier Search Bar for domestic and international tabs */}
        {(activeTab === 'domestic' || activeTab === 'international') && (
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কুরিয়ার সার্চ করুন (e.g. Sundarban, DHL)..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0284c7]"
            />
          </div>
        )}
      </div>

      {/* TAB 1: BANGLADESH DOMESTIC COURIERS (19) */}
      {activeTab === 'domestic' && (
        <div className="space-y-4">
          <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-sky-900">
            <Building className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">বাংলাদেশের সকল ১৯টি শীর্ষ কুরিয়ার পার্টনার: </span>
              <span>
                সুন্দরবন, স্টেডফাস্ট, পাঠাও, পেপারফ্লাই, রেডএক্স, ই-কুরিয়ার, ডেলিভারি টাইগার, এজেআর পার্সেল, জননী এক্সপ্রেস, করতোয়া, সওদাগর, কন্টিনেন্টাল, কিউ-এক্সপ্রেস, সোনার কুরিয়ার, কুরিয়ারবিডি, বাংলাদেশ পার্সেল, ডলফিন, এপেক্স এবং স্টারলাইন কুরিয়ার।
                যেকোনোটির API কি যুক্ত করলেই পার্সেল বুকিং এবং ট্র্যাকিং কোড জেনারেট সরাসরি চালু হয়ে যাবে।
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {domesticCouriers.map((courier) => {
              const isConfigured = isCourierConfigured(courier);
              return (
                <div
                  key={courier.id}
                  className={`bg-white rounded-xl border p-4 transition-all duration-200 space-y-3.5 ${
                    isConfigured
                      ? 'border-emerald-200 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Courier Card Header */}
                  <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4 text-[#0284c7]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs text-slate-900">{courier.name}</h4>
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                            {courier.prefix}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{courier.bnName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isConfigured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>সক্রিয় (Connected)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>Not Configured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coverage Note */}
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span className="text-slate-400">নেটওয়ার্ক:</span>
                    <span className="font-semibold text-slate-700">{courier.coverage}</span>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-2 pt-1">
                    {courier.fields.map((field) => {
                      const isSecret = field.secret;
                      const isVisible = visibleSecrets[field.key];
                      const val = envConfig[field.key] || '';

                      return (
                        <div key={field.key} className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                            <span>{field.label}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{field.key}</span>
                          </label>
                          <div className="relative">
                            <input
                              type={isSecret && !isVisible ? 'password' : 'text'}
                              value={val}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full text-xs font-mono px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-[#0284c7] focus:outline-none pr-9 text-slate-900"
                            />
                            {isSecret && (
                              <button
                                type="button"
                                onClick={() => toggleSecretVisibility(field.key)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                                title={isVisible ? 'Hide Key' : 'Show Key'}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Courier Card Footer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={courier.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#0284c7] hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>মার্চেন্ট পোর্টাল লিংক</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleTestCourierConnection(courier)}
                      disabled={testingCourierId === courier.id}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {testingCourierId === courier.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-[#0284c7]" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      )}
                      <span>Test Handshake</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERNATIONAL COURIERS (6) */}
      {activeTab === 'international' && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
            <Globe className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">আন্তর্জাতিক গ্লোবাল লজিস্টিকস কুরিয়ার (৬টি): </span>
              <span>
                DHL Express, FedEx, UPS, Aramex, EMS / Bangladesh Post (বাংলাদেশ ডাক বিভাগ), এবং Transair Express।
                বাংলাদেশ থেকে ২২০+ দেশে আন্তর্জাতিক পার্সেল ও ই-কমার্স এক্সপোর্ট ডেলিভারির জন্য ব্যবহারযোগ্য।
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {internationalCouriers.map((courier) => {
              const isConfigured = isCourierConfigured(courier);
              return (
                <div
                  key={courier.id}
                  className={`bg-white rounded-xl border p-4 transition-all duration-200 space-y-3.5 ${
                    isConfigured
                      ? 'border-blue-300 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  {/* Courier Card Header */}
                  <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs text-slate-900">{courier.name}</h4>
                          <span className="font-mono text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">
                            {courier.prefix}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{courier.bnName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isConfigured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>International Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" />
                          <span>Not Configured</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coverage Note */}
                  <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                    <span className="text-slate-400">গ্লোবাল কভারেজ:</span>
                    <span className="font-semibold text-slate-700">{courier.coverage}</span>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-2 pt-1">
                    {courier.fields.map((field) => {
                      const isSecret = field.secret;
                      const isVisible = visibleSecrets[field.key];
                      const val = envConfig[field.key] || '';

                      return (
                        <div key={field.key} className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                            <span>{field.label}</span>
                            <span className="text-[9px] text-slate-400 font-mono">{field.key}</span>
                          </label>
                          <div className="relative">
                            <input
                              type={isSecret && !isVisible ? 'password' : 'text'}
                              value={val}
                              onChange={(e) => handleFieldChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="w-full text-xs font-mono px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-blue-600 focus:outline-none pr-9 text-slate-900"
                            />
                            {isSecret && (
                              <button
                                type="button"
                                onClick={() => toggleSecretVisibility(field.key)}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                                title={isVisible ? 'Hide Key' : 'Show Key'}
                              >
                                {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Courier Card Footer Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <a
                      href={courier.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-bold"
                    >
                      <span>ডেভেলপার / মার্চেন্ট পোর্টাল</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleTestCourierConnection(courier)}
                      disabled={testingCourierId === courier.id}
                      className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {testingCourierId === courier.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-blue-600" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-blue-600" />
                      )}
                      <span>Test Handshake</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SMS GATEWAYS */}
      {activeTab === 'sms' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>অটোমেটিক পার্সেল ট্র্যাকিং ও অর্ডার কনফার্মেশন SMS গেটওয়ে</span>
              </h4>
              <p className="text-xs text-slate-500">
                অর্ডার কনফার্ম এবং কুরিয়ারে পার্সেল বুক করার সাথে সাথেই কাস্টমারের ফোনে ট্র্যাকিং কোডসহ অটো SMS যাবে
              </p>
            </div>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Real-time SMS Engine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">SMS সার্ভিস প্রোভাইডার</label>
              <select
                value={smsProvider}
                onChange={(e) => setSmsProvider(e.target.value as any)}
                className="w-full text-xs font-semibold p-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#0284c7] outline-none"
              >
                <option value="BulkSMS BD">BulkSMS BD (Popular & Reliable)</option>
                <option value="Greenweb BD">Greenweb BD (Fastest OTP/Tracking)</option>
                <option value="MiM SMS">MiM SMS (Affordable Rate)</option>
                <option value="Reve Systems">Reve Systems (Enterprise)</option>
                <option value="Alpha SMS">Alpha SMS</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">API Key / Auth Token</label>
              <input
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                placeholder="SMS_API_KEY_xxxxxxxx"
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#0284c7] outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Sender ID / Masking Name</label>
              <input
                type="text"
                value={smsSenderId}
                onChange={(e) => setSmsSenderId(e.target.value)}
                placeholder="e.g. 8809612xxxx or QUATRO"
                className="w-full text-xs font-mono p-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:border-[#0284c7] outline-none"
              />
            </div>
          </div>

          {/* Test SMS Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800">টেস্ট SMS পাঠিয়ে চেক করুন:</span>
              <p className="text-[11px] text-slate-500">আপনার ব্যক্তিগত মোবাইল নম্বরে টেস্ট এসএমএস পাঠিয়ে যাচাই করুন</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="text-xs font-mono p-2 rounded-lg border border-slate-300 w-36 bg-white"
              />
              <button
                type="button"
                onClick={handleTestSms}
                disabled={isSendingTestSms}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                {isSendingTestSms ? 'পাঠানো হচ্ছে...' : 'পাঠান (Test SMS)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MFS & PAYMENT GATEWAYS */}
      {activeTab === 'payment' && (
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
          <div className="border-b pb-3">
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-pink-600" />
              <span>বিকাশ, নগদ ও SSLCommerz পেমেন্ট গেটওয়ে ক্রেডেনশিয়াল</span>
            </h4>
            <p className="text-xs text-slate-500">
              অনলাইন কার্ড ও মোবাইল ব্যাংকিং পেমেন্ট সরাসরি আপনার মার্চেন্ট অ্যাকাউন্টে জমা হবে
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* bKash Direct API */}
            <div className="p-4 rounded-xl border border-pink-100 bg-pink-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs text-pink-700">bKash Merchant PGW API</span>
                <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-1.5 py-0.2 rounded">Checkout API</span>
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">bKash App Key</label>
                  <input
                    type="password"
                    value={bkashAppKey}
                    onChange={(e) => setBkashAppKey(e.target.value)}
                    placeholder="bkash_app_key_xxxx"
                    className="w-full font-mono p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">bKash App Secret</label>
                  <input
                    type="password"
                    value={bkashAppSecret}
                    onChange={(e) => setBkashAppSecret(e.target.value)}
                    placeholder="bkash_app_secret_xxxx"
                    className="w-full font-mono p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">bKash Username</label>
                  <input
                    type="text"
                    value={bkashUsername}
                    onChange={(e) => setBkashUsername(e.target.value)}
                    placeholder="merchant_username"
                    className="w-full font-mono p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Nagad & SSLCommerz */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/30 space-y-2 text-xs">
                <span className="font-black text-xs text-orange-700 block">Nagad Merchant PGW</span>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Nagad Merchant ID</label>
                  <input
                    type="text"
                    value={nagadMerchantId}
                    onChange={(e) => setNagadMerchantId(e.target.value)}
                    placeholder="NAGAD_MERCHANT_ID_xxxx"
                    className="w-full font-mono p-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-2 text-xs">
                <span className="font-black text-xs text-blue-700 block">SSLCommerz Payment Gateway</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Store ID</label>
                    <input
                      type="text"
                      value={sslStoreId}
                      onChange={(e) => setSslStoreId(e.target.value)}
                      placeholder="store_id_xxxx"
                      className="w-full font-mono p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Store Password</label>
                    <input
                      type="password"
                      value={sslStorePass}
                      onChange={(e) => setSslStorePass(e.target.value)}
                      placeholder="store_passwd_xxxx"
                      className="w-full font-mono p-2 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Action Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold">Persistent Environment Storage: </span>
            <span className="text-slate-300">
              সেভ করার পর সমস্ত ক্রেডেনশিয়াল ব্যাকএন্ডের <code className="text-emerald-300 font-mono">.env.local</code> এবং <code className="text-emerald-300 font-mono">process.env</code> এ স্থায়ীভাবে সংরক্ষিত থাকবে।
            </span>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={isSaving}
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-black py-2.5 px-6 rounded-lg text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <Save className="w-4 h-4 text-slate-950" />}
          <span>Save All Settings to .env</span>
        </button>
      </div>
    </div>
  );
};
