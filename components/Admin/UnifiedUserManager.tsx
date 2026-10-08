'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Store,
  UserCheck,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  CreditCard,
  MapPin,
  ShoppingBag,
  Copy,
  AlertCircle,
  Coins
} from 'lucide-react';
import { useMarketplace } from '@/lib/store/marketplace-store';
import { fetchAllUsersFromFirestore, updateUserInFirestore, UnifiedUserData } from '@/lib/firebase/services';
import { cleanQAId } from '@/lib/utils/id-generator';

export const UnifiedUserManager: React.FC = () => {
  const { showToast, formatPrice, sellers, affiliates } = useMarketplace();

  const [usersList, setUsersList] = useState<UnifiedUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState<'ALL' | 'CUSTOMER' | 'SELLER' | 'AFFILIATE' | 'PENDING_SELLER'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UnifiedUserData | null>(null);

  // Load users from Firestore and API
  const loadUsers = async () => {
    try {
      setRefreshing(true);
      // 1. Try fetching from Firestore Web SDK directly
      const firestoreUsers = await fetchAllUsersFromFirestore('ALL');

      // 2. Fetch from backend API
      const res = await fetch('/api/admin/users?role=ALL');
      const data = await res.json();

      let merged: UnifiedUserData[] = [];
      if (data.success && Array.isArray(data.users)) {
        merged = [...data.users];
      }

      // Add any unique from firestoreUsers
      firestoreUsers.forEach((fu) => {
        if (!merged.some((m) => m.id === fu.id)) {
          merged.push(fu);
        }
      });

      // Synchronize with existing active sellers in marketplace store
      sellers.forEach((s) => {
        if (!merged.some((m) => m.id === s.userId || m.email === s.email)) {
          merged.push({
            id: s.userId || `usr-${s.id}`,
            name: s.shopName,
            email: s.email,
            phone: s.phone,
            role: 'SELLER',
            shopName: s.shopName,
            shopAddress: s.shopAddress,
            nidTradeLicense: s.nidTradeLicense,
            payoutMethod: s.payoutMethod,
            payoutAccount: s.payoutAccount,
            status: s.status as any,
            createdAt: s.joinedDate || new Date().toISOString()
          });
        }
      });

      // Synchronize with active affiliates in marketplace store
      affiliates.forEach((a) => {
        if (!merged.some((m) => m.id === a.userId || m.email === a.email)) {
          merged.push({
            id: a.userId || `usr-aff-${a.id}`,
            name: a.name,
            email: a.email,
            phone: a.phone,
            role: 'AFFILIATE' as any,
            payoutMethod: a.payoutMethod,
            payoutAccount: a.payoutAccount,
            status: a.status as any,
            createdAt: a.createdAt || new Date().toISOString()
          });
        }
      });

      // Clean state: Only real users from Firestore or active sessions
      // No hardcoded mock/dummy users

      // Guarantee each user has their distinct 8-digit numeric ID (no text prefix)
      merged = merged.map((u, idx) => {
        if (u.role === 'SELLER') {
          const defaultNum = (81049280 + idx).toString();
          const sId = cleanQAId(u.sellerIdNumber || u.customerId || u.id || defaultNum);
          return { ...u, sellerIdNumber: sId, customerId: sId };
        } else {
          const defaultNum = (48291040 + idx).toString();
          const cId = cleanQAId(u.customerId || u.id || defaultNum);
          return { ...u, customerId: cId };
        }
      });

      setUsersList(merged);
    } catch (err) {
      console.warn('Error loading users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [sellers]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!', 'info');
  };

  // Status Updater
  const handleUpdateStatus = async (
    userId: string,
    newStatus: 'Active' | 'Approved' | 'Suspended' | 'Blocked' | 'Pending'
  ) => {
    try {
      // 1. Update in Firestore
      await updateUserInFirestore(userId, { status: newStatus });

      // 2. Call API
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates: { status: newStatus } })
      });

      // 3. Update local state
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );

      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }

      showToast(`User status updated to ${newStatus}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  // Filtered List
  const filteredUsers = usersList.filter((u) => {
    // Role filter
    if (selectedRoleTab === 'CUSTOMER' && u.role !== 'CUSTOMER') return false;
    if (selectedRoleTab === 'SELLER' && u.role !== 'SELLER') return false;
    if (selectedRoleTab === 'AFFILIATE' && (u.role as any) !== 'AFFILIATE') return false;
    if (selectedRoleTab === 'PENDING_SELLER' && (u.role !== 'SELLER' || u.status !== 'Pending')) {
      return false;
    }

    // Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.toLowerCase().includes(q) ||
      u.shopName?.toLowerCase().includes(q) ||
      u.id?.toLowerCase().includes(q) ||
      u.customerId?.toLowerCase().includes(q) ||
      u.sellerIdNumber?.toLowerCase().includes(q)
    );
  });

  const totalCustomers = usersList.filter((u) => u.role === 'CUSTOMER').length;
  const totalSellers = usersList.filter((u) => u.role === 'SELLER').length;
  const totalAffiliates = usersList.filter((u) => (u.role as any) === 'AFFILIATE').length;
  const pendingSellers = usersList.filter(
    (u) => u.role === 'SELLER' && u.status === 'Pending'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Firebase Notice */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0284c7]/10 text-[#0284c7] font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-[#0284c7]/20">
                <Users className="w-3.5 h-3.5" />
                <span>Single Central Database (`users` collection)</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firebase Live Synced</span>
              </span>
            </div>
            <h3 className="font-black text-xl text-gray-900 mt-2">
              Users &amp; Sellers Directory
            </h3>
          </div>

          <button
            onClick={loadUsers}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Refresh Firebase Data'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-gray-100">
          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <span className="text-[11px] font-bold text-gray-500 block uppercase">
              Total Database Users
            </span>
            <span className="text-xl font-black text-gray-900 block mt-1">{usersList.length}</span>
            <span className="text-[10px] text-gray-400">All registered accounts</span>
          </div>

          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
            <span className="text-[11px] font-bold text-blue-700 block uppercase">
              Frontend Customers
            </span>
            <span className="text-xl font-black text-blue-900 block mt-1">{totalCustomers}</span>
            <span className="text-[10px] text-blue-600">Buyers &amp; shoppers</span>
          </div>

          <div className="bg-sky-50/70 p-3.5 rounded-xl border border-sky-200">
            <span className="text-[11px] font-bold text-sky-700 block uppercase">
              Merchant Sellers
            </span>
            <span className="text-xl font-black text-sky-900 block mt-1">{totalSellers}</span>
            <span className="text-[10px] text-sky-600">Store owners</span>
          </div>

          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-200">
            <span className="text-[11px] font-bold text-indigo-700 block uppercase">
              Affiliates (10%)
            </span>
            <span className="text-xl font-black text-indigo-900 block mt-1">{totalAffiliates}</span>
            <span className="text-[10px] text-indigo-600">Partner network</span>
          </div>

          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200">
            <span className="text-[11px] font-bold text-amber-700 block uppercase">
              Pending Sellers
            </span>
            <span className="text-xl font-black text-amber-900 block mt-1">{pendingSellers}</span>
            <span className="text-[10px] text-amber-600">Awaiting Approval</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => setSelectedRoleTab('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleTab === 'ALL'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Users ({usersList.length})
            </button>
            <button
              onClick={() => setSelectedRoleTab('CUSTOMER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleTab === 'CUSTOMER'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Customers ({totalCustomers})
            </button>
            <button
              onClick={() => setSelectedRoleTab('SELLER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleTab === 'SELLER'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sellers ({totalSellers})
            </button>
            <button
              onClick={() => setSelectedRoleTab('AFFILIATE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleTab === 'AFFILIATE'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Affiliates ({totalAffiliates})
            </button>
            <button
              onClick={() => setSelectedRoleTab('PENDING_SELLER')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedRoleTab === 'PENDING_SELLER'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              Pending Approval ({pendingSellers})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, phone, shop, ID..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-300 focus:border-[#0284c7] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#0284c7] mx-auto" />
            <p className="font-semibold">Loading users directly from Firebase Firestore...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500 space-y-2">
            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="font-bold text-gray-700">No users found matching your filters.</p>
            <p className="text-[11px] text-gray-400">Try changing your search keywords or tab.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50/90 text-gray-600 font-bold uppercase tracking-wider text-[10.5px] border-b border-gray-200">
                  <th className="py-3 px-3.5 whitespace-nowrap">User &amp; Role</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Contact Details</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Account Type / Shop Details</th>
                  <th className="py-3 px-3.5 text-center whitespace-nowrap">Status &amp; Verification</th>
                  <th className="py-3 px-3.5 whitespace-nowrap">Registered Date</th>
                  <th className="py-3 px-3.5 text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800 bg-white">
                {filteredUsers.map((u) => {
                  const isSeller = u.role === 'SELLER';
                  const isAffiliate = (u.role as any) === 'AFFILIATE';
                  return (
                    <tr key={u.id} className="hover:bg-sky-50/30 transition-colors">
                      {/* Name & Role in ONE clean line */}
                      <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-gray-900 text-xs">{u.name}</span>
                          <span
                            className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                              isSeller
                                ? 'bg-sky-100 text-sky-800 border border-sky-200'
                                : isAffiliate
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isAffiliate ? (
                              <>
                                <Coins className="w-2.5 h-2.5 text-indigo-600" />
                                <span>Affiliate</span>
                              </>
                            ) : isSeller ? (
                              <>
                                <Store className="w-2.5 h-2.5" />
                                <span>Seller</span>
                              </>
                            ) : (
                              <>
                                <Users className="w-2.5 h-2.5" />
                                <span>Customer</span>
                              </>
                            )}
                          </span>

                          <span className="font-mono text-[10.5px] font-bold text-sky-900 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                            <span>ID: {cleanQAId(u.customerId || u.sellerIdNumber || u.id)}</span>
                            <button
                              onClick={() => copyToClipboard(cleanQAId(u.customerId || u.sellerIdNumber || u.id))}
                              className="text-gray-400 hover:text-sky-600 cursor-pointer p-0.5 transition-colors"
                              title="Copy 8-Digit ID"
                            >
                              <Copy className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        </div>
                      </td>

                      {/* Contact Info: Phone & Email in ONE single line */}
                      <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="inline-flex items-center gap-1 text-gray-800 font-semibold bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                            <Phone className="w-3 h-3 text-[#0284c7] shrink-0" />
                            <span>{u.phone || 'N/A'}</span>
                            {u.phone && (
                              <a
                                href={`https://wa.me/${u.phone.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 ml-0.5"
                                title="Message on WhatsApp"
                              >
                                💬
                              </a>
                            )}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span className="inline-flex items-center gap-1 text-gray-600 font-medium bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                            <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                            <span>{u.email || 'N/A'}</span>
                          </span>
                        </div>
                      </td>

                      {/* Specific Details in ONE single line */}
                      <td className="py-3 px-3.5 align-middle whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {isSeller ? (
                            <>
                              <span className="font-extrabold text-gray-900 inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                                <Building className="w-3 h-3 text-sky-600 shrink-0" />
                                <span>{u.shopName || 'Shop'}</span>
                              </span>
                              {u.payoutMethod && (
                                <span className="text-gray-600 inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md font-medium">
                                  <CreditCard className="w-3 h-3 text-gray-400" />
                                  <span>
                                    {u.payoutMethod}: {u.payoutAccount}
                                  </span>
                                </span>
                              )}
                            </>
                          ) : (
                            <>
                              <span className="text-gray-700 inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                <span className="truncate max-w-[150px]">
                                  {u.shippingAddress || 'Dhaka, BD'}
                                </span>
                              </span>
                              <span className="text-gray-600 inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md font-medium">
                                Orders: <strong>{u.ordersCount || 0}</strong> ({formatPrice(u.totalSpent || 0)})
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 align-middle text-center whitespace-nowrap">
                        <span
                          className={`text-[10.5px] font-black uppercase px-2.5 py-1 rounded-full inline-flex items-center gap-1 ${
                            u.status === 'Approved' || u.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : u.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse border border-amber-200'
                              : 'bg-red-100 text-red-800 border border-red-200'
                          }`}
                        >
                          {u.status === 'Approved' || u.status === 'Active' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : u.status === 'Pending' ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{u.status || 'Active'}</span>
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3.5 px-3.5 align-middle text-gray-500 text-[11px] whitespace-nowrap">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : 'Recently'}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 align-middle text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="h-7 px-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0284c7] font-bold text-[10.5px] inline-flex items-center gap-1 transition-colors cursor-pointer border border-sky-200"
                            title="View Full User Profile"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Details</span>
                          </button>

                          {/* Quick Approval for Pending Seller */}
                          {isSeller && u.status === 'Pending' && (
                            <button
                              onClick={() => handleUpdateStatus(u.id, 'Approved')}
                              className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] shadow-2xs cursor-pointer inline-flex items-center gap-1 transition-all active:scale-95"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Suspend / Activate toggle */}
                          {u.status === 'Suspended' ? (
                            <button
                              onClick={() => handleUpdateStatus(u.id, isSeller ? 'Approved' : 'Active')}
                              className="h-7 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10.5px] font-bold cursor-pointer border border-emerald-200 inline-flex items-center transition-all"
                              title="Activate Account"
                            >
                              Activate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(u.id, 'Suspended')}
                              className="h-7 px-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[10.5px] font-bold cursor-pointer border border-red-200 inline-flex items-center transition-all"
                              title="Suspend User"
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 overflow-hidden space-y-4 p-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                    selectedUser.role === 'SELLER'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedUser.role} Account
                </span>
                <h4 className="font-extrabold text-base text-gray-900">User Profile Details</h4>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Info Cards */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-gray-900">{selectedUser.name}</span>
                  <span
                    className={`font-black text-[10px] px-2 py-0.5 rounded-full ${
                      selectedUser.status === 'Approved' || selectedUser.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedUser.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedUser.status || 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-gray-600 pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">
                      Email Address
                    </span>
                    <span className="font-semibold text-gray-800 break-all">{selectedUser.email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase">Phone Number</span>
                    <span className="font-semibold text-gray-800">{selectedUser.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">
                      {selectedUser.role === 'SELLER' ? 'Seller ID (৮ ডিজিট)' : 'Customer ID (৮ ডিজিট)'}
                    </span>
                    <span className="font-mono font-black text-sm text-sky-900 tracking-wider">
                      {cleanQAId(selectedUser.customerId || selectedUser.sellerIdNumber || selectedUser.id)}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(cleanQAId(selectedUser.customerId || selectedUser.sellerIdNumber || selectedUser.id))}
                    className="px-2.5 py-1 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy ID</span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-gray-400">
                  Firebase User ID: {selectedUser.id}
                </div>
              </div>

              {/* Seller Specifics */}
              {selectedUser.role === 'SELLER' && (
                <div className="p-3.5 bg-sky-50/60 rounded-xl border border-sky-200 space-y-2">
                  <h5 className="font-bold text-sky-900 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-sky-600" />
                    <span>Seller Store &amp; Banking Details</span>
                  </h5>

                  <div className="space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shop Name:</span>
                      <strong className="text-gray-900">{selectedUser.shopName || 'N/A'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shop Address:</span>
                      <span className="font-medium text-right text-gray-800">
                        {selectedUser.shopAddress || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">NID / Trade License:</span>
                      <span className="font-mono font-bold text-gray-800">
                        {selectedUser.nidTradeLicense || 'Verified Document'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payout Method:</span>
                      <span className="font-bold text-emerald-700">
                        {selectedUser.payoutMethod || 'bKash'} ({selectedUser.payoutAccount})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Specifics */}
              {selectedUser.role === 'CUSTOMER' && (
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2">
                  <h5 className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Customer Delivery &amp; Purchase Stats</span>
                  </h5>

                  <div className="space-y-1.5 text-gray-700">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delivery Address:</span>
                      <span className="font-medium text-right text-gray-800">
                        {selectedUser.shippingAddress || 'Dhaka, Bangladesh'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Completed Orders:</span>
                      <strong className="text-gray-900">{selectedUser.ordersCount || 0} orders</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Purchase Value:</span>
                      <strong className="text-emerald-800 font-black">
                        {formatPrice(selectedUser.totalSpent || 0)}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons inside Modal */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  {selectedUser.phone && (
                    <a
                      href={`https://wa.me/${selectedUser.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                  {selectedUser.email && (
                    <a
                      href={`mailto:${selectedUser.email}`}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {selectedUser.status === 'Pending' && selectedUser.role === 'SELLER' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, 'Approved')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                    >
                      Approve Seller
                    </button>
                  )}
                  {selectedUser.status === 'Suspended' ? (
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedUser.id, selectedUser.role === 'SELLER' ? 'Approved' : 'Active')
                      }
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs cursor-pointer"
                    >
                      Unsuspend Account
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedUser.id, 'Suspended')}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-200 cursor-pointer"
                    >
                      Suspend Account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
