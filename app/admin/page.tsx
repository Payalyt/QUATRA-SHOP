'use client';

import React from 'react';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <AdminDashboard />
    </div>
  );
}
