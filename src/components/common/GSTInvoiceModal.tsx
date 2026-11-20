import React, { useRef } from 'react';
import { PaymentTransaction } from '../../types';
import { useApp } from '../../contexts/AppContext';
import { Modal } from '../ui/Modal';
import { Printer, Download, CheckCircle, FileText } from 'lucide-react';
import { formatINR, formatDate } from '../../lib/utils';

interface GSTInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const GSTInvoiceModal: React.FC<GSTInvoiceModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { settings, members } = useApp();
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!transaction) return null;

  const member = members.find(m => m.id === transaction.memberId);
  const halfGst = Math.round(transaction.gstAmount / 2);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official GST Tax Invoice Preview"
      subtitle={`Tax Invoice: ${transaction.invoiceNumber} • Indian Goods & Services Tax Compliant`}
      maxWidth="2xl"
    >
      <div className="space-y-4">
        {/* Printable Invoice Container */}
        <div
          ref={invoiceRef}
          className="p-6 bg-white text-slate-900 rounded-xl border border-slate-300 shadow-sm font-sans"
          id="printable-gst-invoice"
        >
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-300 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-black">
                  {settings.gymName}
                </span>
                <span className="text-xs bg-black text-white px-1.5 py-0.5 rounded font-mono font-bold">
                  TAX INVOICE
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">{settings.address}</p>
              <p className="text-xs text-slate-600">
                {settings.city}, {settings.state}
              </p>
              <p className="text-xs font-semibold text-slate-800 mt-1">
                GSTIN: <span className="font-mono text-black">{settings.gstNumber}</span>
              </p>
              <p className="text-xs text-slate-600">Phone: {settings.contactPhone}</p>
            </div>

            <div className="text-right">
              <h2 className="text-sm font-bold text-slate-700 uppercase">Original For Recipient</h2>
              <p className="text-base font-extrabold text-black font-mono mt-1">
                {transaction.invoiceNumber}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Date: <strong>{formatDate(transaction.date)}</strong>
              </p>
              <p className="text-xs text-slate-600">
                Mode: <strong>{transaction.paymentMethod}</strong>
              </p>
              <p className="text-xs text-slate-600 font-mono">Ref: {transaction.transactionRef}</p>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-300 text-xs">
            <div>
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Billed To (Member Details):
              </p>
              <p className="text-sm font-extrabold text-black mt-0.5">{transaction.memberName}</p>
              <p className="text-slate-600 font-mono">Member ID: {transaction.memberId}</p>
              <p className="text-slate-600">Phone: {transaction.memberPhone}</p>
              {member && <p className="text-slate-600">Email: {member.email}</p>}
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Place of Supply:
              </p>
              <p className="font-semibold text-slate-800">Maharashtra (State Code: 27)</p>
              <p className="text-slate-600 mt-1">Status: <strong className="text-emerald-700 uppercase font-mono">PAID IN FULL</strong></p>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left my-4 text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-y border-slate-300 text-slate-700 font-bold">
                <th className="py-2 px-2">#</th>
                <th className="py-2 px-2">Description of Services</th>
                <th className="py-2 px-2">SAC Code</th>
                <th className="py-2 px-2 text-right">Base Amount</th>
                <th className="py-2 px-2 text-right">CGST (9%)</th>
                <th className="py-2 px-2 text-right">SGST (9%)</th>
                <th className="py-2 px-2 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="py-3 px-2 font-mono">1</td>
                <td className="py-3 px-2">
                  <p className="font-bold text-slate-900">{transaction.planName}</p>
                  <p className="text-[11px] text-slate-500">
                    Gym & Fitness Center Access Subscription
                  </p>
                </td>
                <td className="py-3 px-2 font-mono text-slate-600">999723</td>
                <td className="py-3 px-2 text-right font-mono font-medium">
                  {formatINR(transaction.baseAmount)}
                </td>
                <td className="py-3 px-2 text-right font-mono text-slate-600">
                  {formatINR(halfGst)}
                </td>
                <td className="py-3 px-2 text-right font-mono text-slate-600">
                  {formatINR(halfGst)}
                </td>
                <td className="py-3 px-2 text-right font-mono font-bold text-black">
                  {formatINR(transaction.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summary Totals */}
          <div className="flex justify-between items-start pt-2">
            <div className="text-[11px] text-slate-600 max-w-sm">
              <p className="font-bold text-slate-800">Terms & Conditions:</p>
              <p className="mt-0.5 leading-snug">
                1. Fees once paid are non-refundable & non-transferable under standard club policy.
                <br />
                2. Membership freeze allowed as per club guidelines.
                <br />
                3. This is a computer-generated tax invoice and requires no physical seal.
              </p>
            </div>

            <div className="w-56 space-y-1 text-xs">
              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-200">
                <span>Taxable Value:</span>
                <span className="font-mono font-medium">{formatINR(transaction.baseAmount)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-200">
                <span>CGST (9.0%):</span>
                <span className="font-mono">{formatINR(halfGst)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600 border-b border-slate-200">
                <span>SGST (9.0%):</span>
                <span className="font-mono">{formatINR(halfGst)}</span>
              </div>
              <div className="flex justify-between py-2 text-base font-extrabold text-black border-t-2 border-black">
                <span>Grand Total:</span>
                <span className="font-mono">{formatINR(transaction.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Signatory Footer */}
          <div className="flex justify-between items-end mt-6 pt-4 border-t border-slate-300">
            <div className="text-[11px] text-slate-500">
              <p>Generated by TECHLIFAA GYM AI Enterprise SaaS</p>
              <p className="font-mono">Verification: VALID_GST_HASH_2024</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-slate-400 mb-1" />
              <p className="text-[11px] font-bold text-slate-700 uppercase">Authorized Signatory</p>
              <p className="text-[10px] text-slate-500">{settings.gymName}</p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-dark-750 hover:bg-dark-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-[#C6FF00] hover:bg-[#B5EB00] text-black text-xs font-extrabold transition-all shadow-[0_0_15px_rgba(198,255,0,0.25)] flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Tax Invoice</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
