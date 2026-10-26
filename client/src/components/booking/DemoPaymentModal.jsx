import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Modal from '../common/Modal';

const DemoPaymentModal = ({
  isOpen,
  onClose,
  totalAmount = 0,
  selectedSeatsCount = 0,
  onConfirmPayment,
  loading = false,
  error = '',
}) => {
  const [method, setMethod] = useState('demo_card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState('Alex Morgan');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [upiId, setUpiId] = useState('cinema.fan@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('Chase Bank');

  const handleFillDemoData = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder('Alex Morgan');
    setExpiry('12/28');
    setCvv('888');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirmPayment({
      paymentMethod: method,
      paymentDetails: {
        method,
        cardNumber: method === 'demo_card' ? cardNumber.slice(-4) : '',
        upiId: method === 'demo_upi' ? upiId : '',
        bank: method === 'demo_netbanking' ? selectedBank : '',
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Secure Demo Payment"
      maxWidth="500px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Demo Mode Notice */}
        <div
          style={{
            backgroundColor: 'rgba(255, 183, 3, 0.1)',
            border: '1px solid rgba(255, 183, 3, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Sparkles size={18} color="#ffb703" />
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
            <strong style={{ color: '#ffb703' }}>DEMO SIMULATION: </strong>
            No real card or bank details are required. Test transaction will instantly complete.
          </div>
        </div>

        {/* Order Preview */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Tickets ({selectedSeatsCount})</div>
            <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Standard & VIP Seats</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Amount to Pay</div>
            <div style={{ fontSize: '1.35rem', color: '#ffb703', fontWeight: 800 }}>${totalAmount}</div>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>
            Select Payment Method
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            {[
              { id: 'demo_card', label: 'Card', icon: CreditCard },
              { id: 'demo_upi', label: 'UPI / Instant', icon: Smartphone },
              { id: 'demo_netbanking', label: 'NetBanking', icon: Building },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.75rem 0.5rem',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid #e50914' : '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected ? 'rgba(229, 9, 20, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#ff4d58' : '#94a3b8',
                    transition: 'all 150ms',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={18} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Fields for Card */}
        {method === 'demo_card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Simulated Card Details</span>
              <button
                type="button"
                onClick={handleFillDemoData}
                style={{ fontSize: '0.78rem', color: '#ffb703', textDecoration: 'underline' }}
              >
                Auto-fill test card
              </button>
            </div>

            <div>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Name on card"
                className="form-input"
              />
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/YY"
                className="form-input"
              />
            </div>
          </div>
        )}

        {/* Form Fields for UPI */}
        {method === 'demo_upi' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Virtual Payment Address (VPA)</label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="username@bank"
              className="form-input"
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Simulates instant UPI push notification approval.
            </span>
          </div>
        )}

        {/* Form Fields for NetBanking */}
        {method === 'demo_netbanking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label className="form-label">Select Bank</label>
            <select
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="form-select"
            >
              <option value="Chase Bank">Chase Bank</option>
              <option value="Bank of America">Bank of America</option>
              <option value="Wells Fargo">Wells Fargo</option>
              <option value="Citibank">Citibank</option>
              <option value="HDFC Bank">HDFC Bank</option>
            </select>
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '0.65rem',
              color: '#ef4444',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
        >
          {loading ? (
            <span>Processing Demo Booking...</span>
          ) : (
            <>
              <ShieldCheck size={18} />
              <span>Authorize & Confirm (${totalAmount})</span>
            </>
          )}
        </button>
      </form>
    </Modal>
  );
};

export default DemoPaymentModal;
