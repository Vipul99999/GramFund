'use client';
import { useMemo, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { usePaymentFlow } from '../hooks/usePaymentFlow';

const addHours = (isoDate: string, hours: number) => {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  d.setHours(d.getHours() + hours);
  return d.toISOString().slice(0, 16);
};

export default function HandlerPaymentForm() {
  const { submitPayment, quality } = usePaymentFlow();
  const [fromFamilyId, setFrom] = useState('');
  const [toFamilyId, setTo] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [customDurationHours, setCustomDurationHours] = useState(3);

  const qualityTone = useMemo(() => quality === 'GOOD' ? 'good' : quality === 'FAIR' ? 'fair' : 'poor', [quality]);

  const applyCustomDuration = () => {
    if (!eventStart) return;
    const safeHours = Math.max(2, customDurationHours);
    setEventEnd(addHours(eventStart, safeHours));
  };

  return <Card title="Collect Payment & Event Context">
    <p className={`status-badge ${qualityTone}`}>Network quality: <b>{quality}</b></p>

    <div className="grid-two">
      <label>From family<input placeholder="e.g. fam_001" value={fromFamilyId} onChange={(e) => setFrom(e.target.value)} /></label>
      <label>To family<input placeholder="e.g. fam_077" value={toFamilyId} onChange={(e) => setTo(e.target.value)} /></label>
    </div>

    <label>Amount (₹)<input type="number" min={1} placeholder="Enter amount" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></label>

    <h4 style={{ margin: '14px 0 6px' }}>Optional event scheduling context</h4>
    <label>Event title<input placeholder="Wedding contribution / Medical aid" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} /></label>

    <div className="grid-two">
      <label>Event start<input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} /></label>
      <label>Event end<input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} /></label>
    </div>

    <div className="duration-box">
      <label>Custom duration (hours, minimum 2)
        <input type="number" min={2} value={customDurationHours} onChange={(e) => setCustomDurationHours(Number(e.target.value))} />
      </label>
      <button type="button" className="pill active" onClick={applyCustomDuration}>Apply duration from start time</button>
    </div>

    <Button onClick={async () => {
      const result = await submitPayment({ fromFamilyId, toFamilyId, amount, mode: 'CASH' });
      setMessage(result.queued
        ? 'Queued offline due to network condition. Will auto-sync when network improves.'
        : `Payment submitted${eventTitle ? ` for ${eventTitle}` : ''}.`);
    }}>Submit Payment</Button>
    <p>{message}</p>
  </Card>;
}
