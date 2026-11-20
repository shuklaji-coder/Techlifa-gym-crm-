import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Indian Rupee currency formatter (e.g. ₹12,500 or ₹1.5L)
export function formatINR(amount: number, compact: boolean = false): string {
  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    if (Math.abs(amount) >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date to readable string (e.g., 20 Nov 2024)
export function formatDate(dateString?: string, formatStr: string = 'dd MMM yyyy'): string {
  if (!dateString) return 'N/A';
  try {
    const parsed = parseISO(dateString);
    if (!isValid(parsed)) {
      const d = new Date(dateString);
      return isValid(d) ? format(d, formatStr) : dateString;
    }
    return format(parsed, formatStr);
  } catch {
    return dateString;
  }
}

// Generate direct WhatsApp link (clean phone to +91 and encode message)
export function getWhatsAppUrl(phone: string, message: string = ''): string {
  // Strip non-numeric characters
  const clean = phone.replace(/[^0-9]/g, '');
  const formattedPhone = clean.startsWith('91') && clean.length === 12 
    ? clean 
    : clean.length === 10 
      ? `91${clean}` 
      : clean;

  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

// Open WhatsApp in new tab
export function openWhatsApp(phone: string, message: string = ''): void {
  const url = getWhatsAppUrl(phone, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Export data to CSV file with automatic browser download
export function exportToCSV<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
): void {
  if (!rows || !rows.length) {
    alert('No data available to export.');
    return;
  }

  let keys: (keyof T)[] = [];
  let headerLabels: string[] = [];

  if (headers && headers.length) {
    keys = headers.map(h => h.key);
    headerLabels = headers.map(h => h.label);
  } else {
    keys = Object.keys(rows[0]) as (keyof T)[];
    headerLabels = keys.map(k => String(k));
  }

  const csvRows = [
    headerLabels.join(','),
    ...rows.map(row =>
      keys
        .map(key => {
          let val: any = row[key];
          if (val === null || val === undefined) return '""';
          if (typeof val === 'object') val = JSON.stringify(val);
          // Escape quotes
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper to calculate days between dates
export function getDaysRemaining(targetDateStr: string): number {
  try {
    const target = new Date(targetDateStr);
    const now = new Date();
    // Normalize to midnight
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

export function getDaysAgo(dateStr: string): number {
  try {
    const target = new Date(dateStr);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - target.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  } catch {
    return 0;
  }
}
