import Link from 'next/link';
import HandlerPaymentForm from '../../../../features/payment/components/HandlerPaymentForm';

export default function HandlerPaymentsPage() {
  return <main>
    <div className="page-head">
      <h1>Handler Payments</h1>
      <Link className="quick-link" href="/handler">Back to Dashboard</Link>
    </div>
    <p style={{ color: '#475569' }}>Record payment with event context and keep transparency strong for both sides.</p>
    <HandlerPaymentForm />
  </main>;
}
