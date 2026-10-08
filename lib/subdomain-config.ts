/**
 * Subdomain Architecture & DNS Configuration Guide
 * 
 * Subdomains configured:
 * 1. Admin Panel:     admin.yourdomain.com      -> Routes to /admin
 * 2. Seller Center:   seller.yourdomain.com     -> Routes to /seller
 * 3. Affiliate Hub:   affiliate.yourdomain.com  -> Routes to /affiliate
 * 4. Main Store:      yourdomain.com            -> Routes to /
 * 
 * DNS Configuration (in your Domain Provider / Cloudflare / cPanel):
 * -------------------------------------------------------------
 * Record Type: CNAME
 * Name / Host: admin
 * Target:      yourdomain.com (or your hosting app URL)
 * 
 * Record Type: CNAME
 * Name / Host: seller
 * Target:      yourdomain.com
 * 
 * Record Type: CNAME
 * Name / Host: affiliate
 * Target:      yourdomain.com
 * 
 * Or Wildcard DNS Record:
 * Record Type: CNAME
 * Name / Host: *
 * Target:      yourdomain.com
 */

export interface SubdomainConfig {
  subdomain: string;
  targetPath: string;
  title: string;
  description: string;
}

export const SUBDOMAIN_CONFIGS: SubdomainConfig[] = [
  {
    subdomain: 'admin',
    targetPath: '/admin',
    title: 'Admin Control Center',
    description: 'Master platform management, user moderation, order oversight, and settings.'
  },
  {
    subdomain: 'seller',
    targetPath: '/seller',
    title: 'Seller Center Portal',
    description: 'Merchant dashboard for product catalog, inventory, shop profile, and payouts.'
  },
  {
    subdomain: 'affiliate',
    targetPath: '/affiliate',
    title: 'Affiliate Partner Hub',
    description: 'Affiliate dashboard for custom tracking links, commissions, and withdrawal requests.'
  }
];
