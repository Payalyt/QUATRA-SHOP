import mongoose, { Schema, Document, Model } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/daraz_commission';

// Global caching of mongoose connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// -------------------------------------------------------------
// SELLER WALLET SCHEMA
// -------------------------------------------------------------
export interface ISellerWallet extends Document {
  sellerId: string;
  shopName: string;
  totalIncome: number;
  totalCommission: number;
  netEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  withdrawnAmount: number;
  updatedAt: Date;
}

const SellerWalletSchema = new Schema<ISellerWallet>({
  sellerId: { type: String, required: true, unique: true, index: true },
  shopName: { type: String, required: true },
  totalIncome: { type: Number, default: 0 },
  totalCommission: { type: Number, default: 0 },
  netEarnings: { type: Number, default: 0 },
  availableBalance: { type: Number, default: 0 },
  pendingBalance: { type: Number, default: 0 },
  withdrawnAmount: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const SellerWalletModel: Model<ISellerWallet> =
  mongoose.models.SellerWallet || mongoose.model<ISellerWallet>('SellerWallet', SellerWalletSchema);

// -------------------------------------------------------------
// ADMIN REVENUE SCHEMA
// -------------------------------------------------------------
export interface IAdminRevenue extends Document {
  totalGrossSales: number;
  totalCommissionEarned: number;
  totalSellerPayouts: number;
  updatedAt: Date;
}

const AdminRevenueSchema = new Schema<IAdminRevenue>({
  totalGrossSales: { type: Number, default: 0 },
  totalCommissionEarned: { type: Number, default: 0 },
  totalSellerPayouts: { type: Number, default: 0 },
}, {
  timestamps: true,
});

export const AdminRevenueModel: Model<IAdminRevenue> =
  mongoose.models.AdminRevenue || mongoose.model<IAdminRevenue>('AdminRevenue', AdminRevenueSchema);

// -------------------------------------------------------------
// SELLER TRANSACTION SCHEMA
// -------------------------------------------------------------
export interface ISellerTransaction extends Document {
  sellerId: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  commission: number;
  netAmount: number;
  type: 'CREDIT' | 'DEBIT';
  description: string;
  status: 'Pending' | 'Available' | 'Withdrawn';
  createdAt: Date;
}

const SellerTransactionSchema = new Schema<ISellerTransaction>({
  sellerId: { type: String, required: true, index: true },
  orderId: { type: String, required: true },
  orderNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  commission: { type: Number, required: true },
  netAmount: { type: Number, required: true },
  type: { type: String, enum: ['CREDIT', 'DEBIT'], required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Available', 'Withdrawn'], default: 'Available' },
}, {
  timestamps: true,
});

export const SellerTransactionModel: Model<ISellerTransaction> =
  mongoose.models.SellerTransaction || mongoose.model<ISellerTransaction>('SellerTransaction', SellerTransactionSchema);
