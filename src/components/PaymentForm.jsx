import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/PaymentForm.css';

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventDetails, registrationDetails, registrationId } = location.state || {};
  const [mpesaReference, setMpesaReference] = useState('');
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    paymentId: null
  });

  if (!eventDetails || !registrationDetails) {
    return (
      <div className="payment-page">
        <div className="payment-container">
          <h2>Payment Information Not Found</h2>
          <p>Please complete the registration form first.</p>
          <button onClick={() => navigate('/events')} className="back-button">
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Calculate registration fee (you can modify this based on your requirements)
  const registrationFee = 1000; // KES

  const createPayment = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/payments/create', {
        registrationId,
        amount: registrationFee
      });
      return response.data.paymentId;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create payment record');
    }
  };

  const confirmPayment = async (paymentId, mpesaRef) => {
    try {
      await axios.post('http://localhost:3001/api/payments/confirm', {
        paymentId,
        mpesaReference: mpesaRef
      });
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to confirm payment');
    }
  };

  const handlePayment = async () => {
    setStatus({ ...status, loading: true, error: '' });

    try {
      // Create payment record
      const paymentId = await createPayment();
      setStatus({ ...status, paymentId });

      // Show M-PESA instructions
      alert(
        'Please complete your payment using the following details:\n\n' +
        'Paybill Number: 247247\n' +
        'Account Number: KCCA2024\n' +
        'Amount: KES ' + registrationFee + '\n\n' +
        'After payment, enter the M-PESA reference number to confirm your payment.'
      );
    } catch (error) {
      setStatus({
        ...status,
        loading: false,
        error: error.message
      });
    }
  };

  const handleConfirmation = async (e) => {
    e.preventDefault();
    if (!mpesaReference) {
      alert('Please enter the M-PESA reference number');
      return;
    }

    setStatus({ ...status, loading: true, error: '' });

    try {
      await confirmPayment(status.paymentId, mpesaReference);
      alert('Payment confirmed successfully!');
      navigate('/registration-success');
    } catch (error) {
      setStatus({
        ...status,
        loading: false,
        error: error.message
      });
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h2>Registration Payment</h2>
        
        {status.error && <div className="error-message">{status.error}</div>}
        
        <div className="event-summary">
          <h3>{eventDetails.title}</h3>
          <p className="event-info">
            <span><i className="far fa-calendar-alt"></i> {eventDetails.date}</span>
            <span><i className="fas fa-map-marker-alt"></i> {eventDetails.location}</span>
          </p>
        </div>

        <div className="registration-summary">
          <h3>Registration Details</h3>
          <p><strong>Name:</strong> {registrationDetails.name}</p>
          <p><strong>Club/School:</strong> {registrationDetails.affiliation}</p>
          <p><strong>Email:</strong> {registrationDetails.email}</p>
          <p><strong>Phone:</strong> {registrationDetails.phone}</p>
        </div>

        <div className="payment-details">
          <h3>Payment Information</h3>
          <div className="payment-info">
            <div className="fee-details">
              <p><strong>Registration Fee:</strong> KES {registrationFee}</p>
            </div>
            <div className="payment-instructions">
              <h4>How to Pay:</h4>
              <ol>
                <li>Go to M-PESA on your phone</li>
                <li>Select Pay Bill</li>
                <li>Enter Business Number: <strong>247247</strong></li>
                <li>Enter Account Number: <strong>KCCA2024</strong></li>
                <li>Enter Amount: <strong>KES {registrationFee}</strong></li>
                <li>Enter your M-PESA PIN and confirm payment</li>
              </ol>
            </div>

            {status.paymentId && (
              <div className="payment-confirmation">
                <h4>Confirm Payment</h4>
                <form onSubmit={handleConfirmation}>
                  <div className="form-group">
                    <label htmlFor="mpesaReference">M-PESA Reference Number:</label>
                    <input
                      type="text"
                      id="mpesaReference"
                      value={mpesaReference}
                      onChange={(e) => setMpesaReference(e.target.value)}
                      placeholder="Enter M-PESA reference number"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="confirm-button"
                    disabled={status.loading}
                  >
                    {status.loading ? 'Confirming...' : 'Confirm Payment'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="payment-actions">
          {!status.paymentId && (
            <button 
              onClick={handlePayment} 
              className="payment-button"
              disabled={status.loading}
            >
              {status.loading ? 'Processing...' : 'Make Payment'}
            </button>
          )}
          <button 
            onClick={() => navigate(-1)} 
            className="back-button"
            disabled={status.loading}
          >
            Back to Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm; 