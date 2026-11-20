import React from 'react';
import { PaymentTransaction } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../ui/Modal';
import { Printer, Share2, CheckCircle2 } from 'lucide-react';
import { formatINR, formatDate, openWhatsApp } from '../../lib/utils';

interface PaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { settings } = useApp();

  if (!transaction) return null;

  const handleShareWhatsApp = () => {
    const text = `Namaste ${transaction.memberName}! Here is your payment receipt for ${transaction.planName} at ${settings.gymName}.\nAmount: ${formatINR(transaction.totalAmount)}\nInvoice: ${transaction.invoiceNumber}\nDate: ${formatDate(transaction.date)}\nThank you for choosing ${settings.gymName}! 🏋️‍♂️`;
    openWhatsApp(transaction.memberPhone, text);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instant Payment Receipt"
      subtitle="Digital Slip & WhatsApp Shareable Copy"
      maxWidth="sm"
    >
      <div className="space-y-4">
        {/* Thermal Slip Style Card */}
        <div className="p-6 bg-dark-850 border border-slate-700/80 rounded-2xl relative text-center">
          <div className="w-12 h-12 rounded-full bg-[#C6FF00]/15 text-[#C6FF00] flex items-center justify-center mx-auto mb-2 border border-[#C6FF00]/30">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <h3 className="text-base font-extrabold text-white font-display uppercase tracking-wide">
            {settings.gymName}
          </h3>
          <p className="text-[11px] text-slate-400">{settings.address}, {settings.city}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">GSTIN: {settings.gstNumber}</p>

          <div className="my-4 border-t border-b border-dashed border-slate-700 py-3 space-y-1.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Invoice No:</span>
              <span className="font-mono font-bold text-white">{transaction.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Date & Time:</span>
              <span className="text-white">{formatDate(transaction.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member:</span>
              <span className="font-semibold text-white">{transaction.memberName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Member ID:</span>
              <span className="font-mono text-slate-300">{transaction.memberId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Membership:</span>
              <span className="text-[#C6FF00] font-semibold">{transaction.planName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Payment Mode:</span>
              <span className="text-white">{transaction.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ref Code:</span>
              <span className="font-mono text-[10px] text-slate-400">{transaction.transactionRef}</span>
            </div>
          </div>

          <div className="space-y-1 text-right text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Base Subtotal:</span>
              <span className="font-mono">{formatINR(transaction.baseAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>GST 18% (CGST+SGST):</span>
              <span className="font-mono">{formatINR(transaction.gstAmount)}</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-700">
              <span>Amount Paid:</span>
              <span className="font-mono text-[#C6FF00]">{formatINR(transaction.totalAmount)}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-slate-700 text-[10px] text-slate-500">
            Thank you for being part of TECHLIFAA GYM! Keep training hard!
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <Share2 className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 bg-dark-750 hover:bg-dark-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Slip</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
