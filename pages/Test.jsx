import React, { useState } from 'react';

export default function TestPage() {
  const [contactEmail, setContactEmail] = useState('');
  const [contactStatus, setContactStatus] = useState('');

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailText, setEmailText] = useState('');
  const [emailStatus, setEmailStatus] = useState('');

  const handleAddContact = async (e) => {
    e.preventDefault();
    setContactStatus('Sending...');

    try {
      const response = await fetch('/api/add-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: contactEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setContactStatus(`✅ Success: ${data.message}`);
        setContactEmail('');
      } else {
        setContactStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setContactStatus(`❌ Error: ${error.message}`);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setEmailStatus('Sending...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailTo,
          subject: emailSubject,
          text: emailText
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEmailStatus(`✅ Success: ${data.message}`);
        setEmailTo('');
        setEmailSubject('');
        setEmailText('');
      } else {
        setEmailStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setEmailStatus(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1 style={{ marginBottom: '40px' }}>API Test Page</h1>

      {/* Add Contact Form */}
      <div style={{ marginBottom: '60px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '20px' }}>Test Add Contact</h2>
        <form onSubmit={handleAddContact}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Email:
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="test@example.com"
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Contact
          </button>
        </form>
        {contactStatus && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            {contactStatus}
          </div>
        )}
      </div>

      {/* Send Email Form */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '20px' }}>Test Send Email</h2>
        <form onSubmit={handleSendEmail}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              To:
            </label>
            <input
              type="email"
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="recipient@example.com"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Subject:
            </label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              placeholder="Test Email"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Message:
            </label>
            <textarea
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
              required
              rows="5"
              style={{
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'inherit'
              }}
              placeholder="Email body text..."
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send Email
          </button>
        </form>
        {emailStatus && (
          <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            {emailStatus}
          </div>
        )}
      </div>
    </div>
  );
}
