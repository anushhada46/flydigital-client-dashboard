'use client';

import { useRef, useState } from 'react';
import { WorkspacePage } from './workspace-page';
import styles from './billing-view.module.css';

type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue';
type Invoice = { id: string; service: string; description: string; phase: string; issued: string; due: string; amount: number; status: InvoiceStatus };
const invoices: Invoice[] = [
  { id: 'FD-26-1004', service: 'Website Development', description: 'One-Time Project', phase: 'Website Development · Phase 2', issued: '2026-10-01', due: '2026-10-15', amount: 90000, status: 'Paid' },
  { id: 'FD-26-1005', service: 'Website Development', description: 'One-Time Project', phase: 'Website Development · Phase 2', issued: '2026-10-01', due: '2026-10-15', amount: 60000, status: 'Pending' },
];
const filters = ['All', 'Pending', 'Paid', 'Overdue'] as const;
const money = (amount: number) => `NPR ${new Intl.NumberFormat('en-NP').format(amount)}`;
const dateLabel = (date: string) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kathmandu' }).format(new Date(`${date}T12:00:00+05:45`));

export function BillingView() {
  const [filter, setFilter] = useState<typeof filters[number]>('All');
  const [selected, setSelected] = useState<Invoice | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const unpaid = invoices.filter(invoice => invoice.status !== 'Paid');
  const outstanding = unpaid.reduce((total, invoice) => total + invoice.amount, 0);
  const visible = invoices.filter(invoice => filter === 'All' || invoice.status === filter);

  function openInvoice(invoice: Invoice) {
    setSelected(invoice);
    dialog.current?.showModal();
  }

  return <WorkspacePage title="Billing & Invoices" subtitle="View and manage your invoices">
    {unpaid.length > 0 && <section className={styles.banner} aria-label="Outstanding invoices">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v6m0 3v1" /></svg>
      <div><h2>{unpaid.length} Invoice{unpaid.length === 1 ? '' : 's'} Pending</h2><p>Outstanding: {money(outstanding)}</p></div>
    </section>}
    <div className={styles.filters} role="group" aria-label="Filter invoices by status">
      {filters.map(item => <button key={item} type="button" aria-pressed={filter === item} className={`${styles.filter} ${styles[`${item.toLowerCase()}Filter`]}`} onClick={() => setFilter(item)}>{item}</button>)}
    </div>
    <section className={styles.list} aria-label="Invoices">
      {visible.map(invoice => <article className={styles.card} key={invoice.id}>
        <div className={styles.invoiceCopy}>
          <h2><button className={styles.openInvoice} type="button" onClick={() => openInvoice(invoice)} aria-label={`Open invoice ${invoice.id}`}>{invoice.id}</button></h2>
          <p>{invoice.description} · {invoice.service}</p>
          <p className={styles.phase}>{invoice.phase}</p>
          <p className={styles.dates}>Issued: <time dateTime={invoice.issued}>{dateLabel(invoice.issued)}</time> <span>|</span> Due: <time dateTime={invoice.due}>{dateLabel(invoice.due)}</time></p>
        </div>
        <div className={styles.payment}><strong>{money(invoice.amount)}</strong><span className={`${styles.tag} ${styles[invoice.status.toLowerCase()]}`}>{invoice.status}</span></div>
      </article>)}
      {visible.length === 0 && <p className={styles.empty} role="status">No {filter.toLowerCase()} invoices.</p>}
    </section>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="invoice-dialog-heading">
      <header className={styles.dialogHeading}><h2 id="invoice-dialog-heading">Invoice {selected?.id}</h2><button type="button" className={styles.close} aria-label="Close invoice" onClick={() => dialog.current?.close()}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" /></svg></button></header>
      {selected && <div className={styles.invoiceDetails}>
        <div className={styles.invoiceBrand}><div><h3>FlyDigital</h3><p>Client invoice</p></div><span className={`${styles.tag} ${styles[selected.status.toLowerCase()]}`}>{selected.status}</span></div>
        <div className={styles.billingParties}><div><h4>From</h4><p>FlyDigital</p></div><div><h4>Bill to</h4><p>ABC Restaurant</p><p>Rahul Sharma</p><p>rahul@abc.com</p></div></div>
        <dl className={styles.invoiceDates}><div><dt>Invoice number</dt><dd>{selected.id}</dd></div><div><dt>Issued</dt><dd><time dateTime={selected.issued}>{dateLabel(selected.issued)}</time></dd></div><div><dt>Due</dt><dd><time dateTime={selected.due}>{dateLabel(selected.due)}</time></dd></div></dl>
        <div className={styles.lineItem}><div><h4>{selected.service}</h4><p>{selected.description}</p><p>{selected.phase}</p></div><strong>{money(selected.amount)}</strong></div>
        <dl className={styles.totals}><div><dt>Invoice total</dt><dd>{money(selected.amount)}</dd></div><div><dt>Amount paid</dt><dd>{money(selected.status === 'Paid' ? selected.amount : 0)}</dd></div><div className={styles.balance}><dt>Balance due</dt><dd>{money(selected.status === 'Paid' ? 0 : selected.amount)}</dd></div></dl>
      </div>}
    </dialog>
  </WorkspacePage>;
}
