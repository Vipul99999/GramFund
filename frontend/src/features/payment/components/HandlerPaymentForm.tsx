'use client';
import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { usePaymentFlow } from '../hooks/usePaymentFlow';

export default function HandlerPaymentForm() {
  const { submitPayment, quality } = usePaymentFlow();
  const [fromFamilyId, setFrom] = useState('');
  const [toFamilyId, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');

  return <Card title="Collect Payment">
    <p>Network: <b>{quality}</b></p>
    <input placeholder="From family" value={fromFamilyId} onChange={(e) => setFrom(e.target.value)} />
    <input placeholder="To family" value={toFamilyId} onChange={(e) => setTo(e.target.value)} />
    <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
    <Button onClick={async () => {
      const result = await submitPayment({ fromFamilyId, toFamilyId, amount, mode: 'CASH' });
      setMessage(result.queued ? 'Queued offline due to poor network' : 'Payment submitted');
    }}>Submit</Button>
    <p>{message}</p>
  </Card>;
}
