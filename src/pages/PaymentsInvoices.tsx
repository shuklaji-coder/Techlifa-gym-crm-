import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { PaymentTransaction, PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import {
  Receipt,
  CreditCard,
  Download,
  Search,
  Filter,
  Printer,
  Share2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Plus,
  Eye,
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { Modal } from '../components/ui/Modal';
import { formatINR, formatDate, exportToCSV, openWhatsApp } from '../lib/utils';
import { GSTInvoiceModal } from '../components/common/GSTInvoiceModal';
import { PaymentReceiptModal } from '../components/common/PaymentReceiptModal';

export const PaymentsInvoices: React.FC = () => {
  const { payments, members, plans, recordPayment, addToast } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentTransaction | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  // Collect payment modal
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);
  const [collectMemberId, setCollectMemberId] = useState(members[0]?.id || '');
  const [collectPlanId, setCollectPlanId] = useState(plans[0]?.id || '');
  const [collectAmount, setCollectAmount] = useState(plans[0]?.price || 2499);
  const [collectMethod, setCollectMethod] = useState<PaymentMethod>('UPI');
  const [collectNotes, setCollectNotes] = useState('Subscription renewal via front desk UPI');

  // Metrics
  const paidPayments = payments.filter(p => p.status === 'paid');
  const totalCollected = paidPayments.reduce((acc, p) => acc + p.totalAmount, 0);
  const totalBase = paidPayments.reduce((acc, p) => acc + p.baseAmount, 0);
  const totalGST = paidPayments.reduce((acc, p) => acc + p.gstAmount, 0);
  const totalDues = members.reduce((acc, m) => acc + (m.outstandingBalance || 0), 0);

  const filteredPayments = payments.filter(p => {
    const matchesSearch =
      p.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.memberPhone.includes(searchTerm) ||
      p.planName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'all' || p.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleOpenCollect = () => {
    setIsCollectModalOpen(true);
  };

  const handlePlanChange = (pId: string) => {
    setCollectPlanId(pId);
    const p = plans.find(plan => plan.id === pId);
    if (p) setCollectAmount(p.price);
  };

  const handleCollectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectMemberId || collectAmount <= 0) {
      alert('Please select member and valid amount.');
      return;
    }

    const createdTxn = recordPayment({
      memberId: collectMemberId,
      planId: collectPlanId,
      amount: Number(collectAmount),
      paymentMethod: collectMethod,
      notes: collectNotes,
    });

    setIsCollectModalOpen(false);
    setSelectedReceipt(createdTxn);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#C6FF00', '#10B981', '#ffffff'],
    });
  };

  const handleExportCSV = () => {
    exportToCSV('techlifaa_gst_payments_ledger', filteredPayments, [
      { key: 'invoiceNumber', label: 'Invoice No' },
      { key: 'date', label: 'Invoice Date' },
      { key: 'memberName', label: 'Member Name' },
      { key: 'memberPhone', label: 'Phone' },
      { key: 'planName', label: 'Plan' },
      { key: 'paymentMethod', label: 'Payment Method' },
      { key: 'baseAmount', label: 'Taxable Base Amount (INR)' },
      { key: 'gstAmount', label: 'GST 18% (INR)' },
      { key: 'totalAmount', label: 'Total Amount (INR)' },
      { key: 'status', label: 'Status' },
      { key: 'transactionRef', label: 'Reference Ref' },
    ]);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight font-display">
              Payments, Invoices & GST Ledger
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-dark-800 text-[#C6FF00] border border-slate-700">
              SAC: 999723
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Official Indian Goods & Services Tax (GST) receipts, pending balance collections, and settlement records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-[#C6FF00]" />
            <span>Export GST Ledger</span>
          </button>

          <button
            onClick={handleOpenCollect}
            className="px-4 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Collect New Payment</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Gross Revenue"
          value={formatINR(totalCollected, true)}
          change="+14.8% MoM"
          changeType="positive"
          subtitle={`${paidPayments.length} paid invoices`}
          icon={<CreditCard className="w-5 h-5 text-[#C6FF00]" />}
        />

        <StatCard
          title="Taxable Base"
          value={formatINR(totalBase, true)}
          change="Excludes GST"
          changeType="neutral"
          subtitle="Net Club Earnings"
          icon={<Receipt className="w-5 h-5 text-cyan-400" />}
        />

        <StatCard
          title="GST Output (18%)"
          value={formatINR(totalGST, true)}
          change="CGST + SGST"
          changeType="neutral"
          subtitle="Tax Liability Accrued"
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          title="Pending Dues"
          value={formatINR(totalDues, true)}
          change="12 Members"
          changeType="negative"
          subtitle="Past Due"
          icon={<AlertCircle className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Ledger Table */}
      <div className="bg-dark-800/90 border border-slate-700/70 rounded-2xl shadow-lg overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 border-b border-slate-700/70 bg-dark-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by member name, invoice INV-XXXX, or phone..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-[#C6FF00] w-full max-w-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="all">All Payment Modes</option>
              <option value="UPI">UPI (GooglePay / PhonePe / Paytm)</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash at Desk</option>
              <option value="Net Banking">Net Banking</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-dark-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-[#C6FF00]"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-800 border-b border-slate-700 text-slate-400 font-semibold uppercase text-[11px] sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Member Info</th>
                <th className="py-3 px-4">Plan / Package</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Base Amount</th>
                <th className="py-3 px-4 text-right">GST (18%)</th>
                <th className="py-3 px-4 text-right">Total (₹)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Documents</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-750 text-slate-200">
              {filteredPayments.map(p => (
                <tr key={p.id} className="hover:bg-dark-750/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-white">{p.invoiceNumber}</td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-white">{p.memberName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.memberPhone}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{p.planName}</td>
                  <td className="py-3 px-4 text-slate-400">{formatDate(p.date)}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white">{p.paymentMethod}</span>
                    <span className="block text-[10px] text-slate-500 font-mono truncate max-w-[120px]">
                      {p.transactionRef}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-300">
                    {formatINR(p.baseAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-400">
                    {formatINR(p.gstAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#C6FF00]">
                    {formatINR(p.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${p.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                    >
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReceipt(p)}
                        className="p-1.5 rounded-lg bg-dark-750 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors"
                        title="Print Quick Slip"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedInvoice(p)}
                        className="px-2 py-1 rounded-lg bg-dark-750 hover:bg-[#C6FF00] hover:text-black text-slate-300 font-semibold text-[11px] transition-colors border border-slate-700 inline-flex items-center gap-1"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>GST Bill</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      <Modal
        isOpen={isCollectModalOpen}
        onClose={() => setIsCollectModalOpen(false)}
        title="Record New Counter Payment"
        subtitle="Collect membership fee, generate GST invoice, and settle balance."
        maxWidth="md"
      >
        <form onSubmit={handleCollectSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-300 block mb-1">Select Member</label>
            <select
              value={collectMemberId}
              onChange={e => setCollectMemberId(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            >
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.id}) {m.outstandingBalance > 0 ? `• Dues: ${formatINR(m.outstandingBalance)}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Membership Plan</label>
            <select
              value={collectPlanId}
              onChange={e => handlePlanChange(e.target.value)}
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — {formatINR(p.price)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Amount to Collect (₹)</label>
              <input
                type="number"
                required
                value={collectAmount}
                onChange={e => setCollectAmount(Number(e.target.value))}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00] font-mono font-bold text-sm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-300 block mb-1">Payment Method</label>
              <select
                value={collectMethod}
                onChange={e => setCollectMethod(e.target.value as PaymentMethod)}
                className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash at Desk</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-300 block mb-1">Transaction Notes</label>
            <input
              type="text"
              value={collectNotes}
              onChange={e => setCollectNotes(e.target.value)}
              placeholder="e.g. Cleared quarterly fees via QR scanner"
              className="w-full bg-dark-800 border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-[#C6FF00]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setIsCollectModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-dark-750 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#C6FF00] text-black font-extrabold hover:bg-[#B5EB00]"
            >
              Process & Generate Invoice
            </button>
          </div>
        </form>
      </Modal>

      {/* GST Invoice Preview Modal */}
      <GSTInvoiceModal
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        transaction={selectedInvoice}
      />

      {/* Thermal Receipt Modal */}
      <PaymentReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </div>
  );
};
