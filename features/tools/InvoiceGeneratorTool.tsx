'use client';

import React, { useState } from 'react';
import { Download, Plus, Trash2, FileText, CheckCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export function InvoiceGeneratorTool() {
  const [invoiceNumber, setInvoiceNumber] = useState('INV-1001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState('');
  const [businessName, setBusinessName] = useState('My Studio / Business');
  const [businessAddress, setBusinessAddress] = useState('123 Main Street, City');
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientAddress, setClientAddress] = useState('456 Corporate Ave');
  const [taxRate, setTaxRate] = useState(10);

  const [items, setItems] = useState<LineItem[]>([
    { description: 'Web Design & Development Services', quantity: 1, unitPrice: 850 },
    { description: 'SEO Optimization & Performance Tuneup', quantity: 1, unitPrice: 350 },
  ]);

  const addItem = () => {
    setItems((prev) => [...prev, { description: 'New Item / Service', quantity: 1, unitPrice: 100 }]);
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof LineItem, value: any) => {
    const copy = [...items];
    copy[idx] = { ...copy[idx], [field]: value };
    setItems(copy);
  };

  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  const downloadPdfInvoice = () => {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text('INVOICE', 14, 20);

    doc.setFontSize(10);
    doc.text(`Invoice #: ${invoiceNumber}`, 14, 28);
    doc.text(`Date: ${invoiceDate}`, 14, 34);
    if (dueDate) doc.text(`Due Date: ${dueDate}`, 14, 40);

    doc.setFontSize(12);
    doc.text(businessName, 130, 20);
    doc.setFontSize(9);
    doc.text(businessAddress, 130, 26);

    doc.setFontSize(10);
    doc.text('Billed To:', 14, 55);
    doc.text(clientName, 14, 61);
    doc.text(clientAddress, 14, 67);

    // Items table header
    let y = 80;
    doc.setFillColor(240, 240, 240);
    doc.rect(14, y, 180, 8, 'F');
    doc.setFontSize(9);
    doc.text('Description', 16, y + 5.5);
    doc.text('Qty', 120, y + 5.5);
    doc.text('Unit Price', 145, y + 5.5);
    doc.text('Amount', 175, y + 5.5);

    y += 12;
    items.forEach((item) => {
      doc.text(item.description, 16, y);
      doc.text(item.quantity.toString(), 120, y);
      doc.text(`$${item.unitPrice.toFixed(2)}`, 145, y);
      doc.text(`$${(item.quantity * item.unitPrice).toFixed(2)}`, 175, y);
      y += 8;
    });

    y += 10;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 145, y);
    y += 6;
    doc.text(`Tax (${taxRate}%): $${taxAmount.toFixed(2)}`, 145, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Total Due: $${total.toFixed(2)}`, 145, y);

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Your Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Number</label>
            <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Date</label>
            <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full p-2 border rounded text-sm dark:bg-slate-800 dark:text-white" />
          </div>
        </div>

        {/* Line items section */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">Line Items</div>
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                placeholder="Item description"
                className="flex-1 p-2 border rounded text-xs dark:bg-slate-800 dark:text-white"
              />
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value, 10) || 0)}
                placeholder="Qty"
                className="w-16 p-2 border rounded text-xs dark:bg-slate-800 dark:text-white"
              />
              <input
                type="number"
                value={item.unitPrice}
                onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                placeholder="Price"
                className="w-24 p-2 border rounded text-xs dark:bg-slate-800 dark:text-white"
              />
              <button onClick={() => removeItem(idx)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button onClick={addItem} className="btn-secondary text-xs flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Line Item
          </button>
        </div>

        {/* Summary */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-sm text-right">
          <div>Subtotal: ${subtotal.toFixed(2)}</div>
          <div>Tax ({taxRate}%): ${taxAmount.toFixed(2)}</div>
          <div className="text-lg font-bold text-slate-900 dark:text-white">Total: ${total.toFixed(2)}</div>
        </div>

        <button onClick={downloadPdfInvoice} className="w-full btn-primary py-3 text-sm flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700">
          <Download className="w-4 h-4" /> Download PDF Invoice
        </button>
      </div>
    </div>
  );
}
