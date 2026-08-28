import { Order } from '../types';
import { formatCurrency, formatDate } from './formatters';

export function generatePrintableInvoice(order: Order): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download and print your official APSARA Atelier Invoice.');
    return;
  }

  const itemsHtml = order.items
    ?.map(
      (item) => `
    <tr>
      <td style="padding: 16px 8px; border-bottom: 1px solid #EAE3D8;">
        <div style="font-weight: 600; font-family: 'Cormorant Garamond', serif; font-size: 18px; color: #1F1A17;">
          ${item.product_title}
        </div>
        <div style="font-size: 12px; color: #8C6D46; margin-top: 4px;">
          Finish: ${item.selected_finish}
        </div>
      </td>
      <td style="padding: 16px 8px; border-bottom: 1px solid #EAE3D8; text-align: center; color: #2D231E;">
        ${item.quantity}
      </td>
      <td style="padding: 16px 8px; border-bottom: 1px solid #EAE3D8; text-align: right; color: #2D231E;">
        ${formatCurrency(item.unit_price)}
      </td>
      <td style="padding: 16px 8px; border-bottom: 1px solid #EAE3D8; text-align: right; font-weight: 600; color: #1F1A17;">
        ${formatCurrency(item.unit_price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>APSARA Atelier — Invoice ${order.id}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            background-color: #FAF7F2;
            color: #1F1A17;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #D4AF37;
            padding-bottom: 24px;
            margin-bottom: 32px;
          }
          .brand {
            font-family: 'Cormorant Garamond', serif;
            font-size: 36px;
            letter-spacing: 0.25em;
            color: #1F1A17;
            text-transform: uppercase;
          }
          .subtitle {
            font-size: 11px;
            letter-spacing: 0.15em;
            color: #B8976C;
            text-transform: uppercase;
            margin-top: 4px;
          }
          .invoice-meta {
            text-align: right;
            font-size: 13px;
            color: #665C54;
          }
          .invoice-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 24px;
            color: #1F1A17;
            margin-bottom: 4px;
          }
          .columns {
            display: flex;
            justify-content: space-between;
            margin-bottom: 32px;
            font-size: 13px;
            line-height: 1.6;
          }
          .col-box {
            width: 48%;
            background: #F7F3EE;
            padding: 16px;
            border: 1px solid #EAE3D8;
            border-radius: 4px;
          }
          .col-title {
            font-size: 11px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #8C6D46;
            margin-bottom: 8px;
            font-weight: 600;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 32px;
          }
          th {
            font-size: 11px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #8C6D46;
            padding: 12px 8px;
            border-bottom: 1px solid #B8976C;
            text-align: left;
          }
          .summary {
            width: 320px;
            margin-left: auto;
            background: #F7F3EE;
            padding: 16px;
            border: 1px solid #EAE3D8;
            border-radius: 4px;
            font-size: 13px;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            color: #554A42;
          }
          .summary-total {
            border-top: 1px solid #B8976C;
            margin-top: 8px;
            padding-top: 10px;
            font-weight: 700;
            font-size: 18px;
            font-family: 'Cormorant Garamond', serif;
            color: #1F1A17;
          }
          .footer {
            margin-top: 48px;
            border-top: 1px solid #EAE3D8;
            padding-top: 16px;
            font-size: 11px;
            color: #8C6D46;
            text-align: center;
          }
          @media print {
            body { background: #FFFFFF; padding: 0; }
            .col-box, .summary { background: transparent; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="brand">APSARA</div>
            <div class="subtitle">Architectural Atelier & High Furniture</div>
          </div>
          <div class="invoice-meta">
            <div class="invoice-title">Official Atelier Invoice</div>
            <div><strong>Order ID:</strong> ${order.id}</div>
            <div><strong>Date:</strong> ${formatDate(order.created_at)}</div>
            <div><strong>Status:</strong> ${order.status.toUpperCase()}</div>
          </div>
        </div>

        <div class="columns">
          <div class="col-box">
            <div class="col-title">Client & Delivery Sanctuary</div>
            <div><strong>${order.shipping_address.fullName}</strong></div>
            <div>${order.shipping_address.street} ${order.shipping_address.apartment || ''}</div>
            <div>${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postalCode}</div>
            <div>${order.shipping_address.country}</div>
            <div>Tel: ${order.shipping_address.phone}</div>
          </div>

          <div class="col-box">
            <div class="col-title">Concierge Logistics Details</div>
            <div><strong>Payment Method:</strong> ${order.payment_method}</div>
            <div><strong>Logistics Tier:</strong> White-Glove Private Freight</div>
            <div><strong>Tracking Identifier:</strong> ${order.tracking_number || 'APS-ATELIER-QUEUED'}</div>
            ${order.special_instructions ? `<div><strong>Instructions:</strong> ${order.special_instructions}</div>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Sculptural Piece</th>
              <th style="text-align: center; width: 15%;">Quantity</th>
              <th style="text-align: right; width: 15%;">Atelier Price</th>
              <th style="text-align: right; width: 20%;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${formatCurrency(order.subtotal_amount)}</span>
          </div>
          <div class="summary-row">
            <span>White-Glove Installation</span>
            <span>${order.shipping_fee === 0 ? 'Complimentary' : formatCurrency(order.shipping_fee)}</span>
          </div>
          <div class="summary-row">
            <span>Atelier Luxury Tax</span>
            <span>Included</span>
          </div>
          <div class="summary-row summary-total">
            <span>Total Amount</span>
            <span>${formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <div class="footer">
          <p>APSARA Atelier — 740 Madison Avenue, New York, NY 10065 | concierge@apsara.com</p>
          <p>All pieces are handcrafted to order with a 10-year architectural integrity warranty.</p>
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
