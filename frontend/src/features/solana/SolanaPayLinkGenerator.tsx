import React, { useState } from 'react';
import { Copy, ExternalLink, Leaf, CheckCircle2, AlertCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const SolanaPayLinkGenerator = () => {
  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [message, setMessage] = useState('');
  const [memo, setMemo] = useState('');
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock function to simulate Solana Pay link generation
  const generateLink = async () => {
    setIsGenerating(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const params = new URLSearchParams();
      if (amount) params.append('amount', amount);
      if (label) params.append('label', label);
      if (message) params.append('message', message);
      if (memo) params.append('memo', memo);

      const mockLink = `solana:ATyUm1txZfZCxnomxXQDWMhfXVGSwpQfuB5oup2qYrG7?${params.toString()}`;
      setLink(mockLink);
    } catch (err) {
      setError('Failed to generate Solana Pay link. Please try again.');
      console.error('Error generating Solana Pay link:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (link) {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Farmer-inspired styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2f4f4f, #556b2f, #8fbc8f)', // Earthy green gradient
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  };

  const cardStyle = {
    background: 'rgba(245, 245, 220, 0.9)', // Parchment-like background
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    border: '1px solid #6b8e23', // Olive green border
    width: '100%',
    maxWidth: '512px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255, 245, 220, 0.5)', // Light beige for inputs
    border: '1px solid #6b8e23', // Olive green border
    borderRadius: '12px',
    color: '#2f4f4f', // Dark green text
    fontSize: '16px',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  };

  const buttonStyle = {
    width: '100%',
    background: 'linear-gradient(135deg, #6b8e23, #9acd32)', // Olive to lime green
    color: '#fff',
    fontWeight: '600',
    padding: '16px 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  };

  const resultCardStyle = {
    ...cardStyle,
    marginTop: '24px',
    animation: 'slideIn 0.5s ease-out',
  };

  return (
      <div style={containerStyle}>
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #6b8e23, #9acd32)',
              borderRadius: '16px',
              marginBottom: '16px',
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
            }}>
              <Leaf size={32} color="#fff" />
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5f5dc', margin: '0 0 8px 0' }}>
              Farmer's Solana Pay
            </h1>
            <p style={{ color: '#d2b48c', margin: 0, fontSize: '16px' }}>
              Generate payment links with a rustic touch
            </p>
          </div>

          {/* Main Card */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Amount Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#556b2f', marginBottom: '8px' }}>
                  Amount (SOL)
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      style={inputStyle}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b8e23',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}>
                    SOL
                  </div>
                </div>
              </div>

              {/* Label Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#556b2f', marginBottom: '8px' }}>
                  Label
                </label>
                <input
                    type="text"
                    placeholder="Payment for..."
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    style={inputStyle}
                />
              </div>

              {/* Message Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#556b2f', marginBottom: '8px' }}>
                  Message
                </label>
                <input
                    type="text"
                    placeholder="Thank you for your payment"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={inputStyle}
                />
              </div>

              {/* Memo Input */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#556b2f', marginBottom: '8px' }}>
                  Memo
                </label>
                <input
                    type="text"
                    placeholder="Additional notes"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    style={inputStyle}
                />
              </div>

              {/* Generate Button */}
              <button
                  onClick={generateLink}
                  disabled={isGenerating}
                  style={{
                    ...buttonStyle,
                    opacity: isGenerating ? 0.5 : 1,
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                  }}
                  onMouseOver={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'scale(1.02)';
                    target.style.background = 'linear-gradient(135deg, #556b2f, #8fbc8f)';
                  }}
                  onMouseOut={(e) => {
                    const target = e.target as HTMLButtonElement;
                    target.style.transform = 'scale(1)';
                    target.style.background = 'linear-gradient(135deg, #6b8e23, #9acd32)';
                  }}

              >
                {isGenerating ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid #fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}></div>
                      <span>Generating...</span>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                      <Leaf size={20} color="#fff" />
                      <span>Generate Payment Link</span>
                    </div>
                )}
              </button>

              {/* Error Message */}
              {error && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    background: 'rgba(139, 69, 19, 0.2)', // Brown for error
                    border: '1px solid rgba(139, 69, 19, 0.3)',
                    borderRadius: '12px',
                  }}>
                    <AlertCircle size={20} color="#8b4513" />
                    <p style={{ color: '#deb887', fontSize: '14px', margin: 0, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                      {error}
                    </p>
                  </div>
              )}
            </div>
          </div>

          {/* Result Card */}
          {link && (
              <div style={resultCardStyle}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                  }}>
                    <CheckCircle2 size={24} color="#6b8e23" />
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#2f4f4f', margin: 0 }}>
                      Payment Link Generated!
                    </h3>
                  </div>

                  {/* QR Code */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                    <div style={{
                      background: '#fff',
                      border: '4px solid #d2b48c', // Tan border for QR code
                      borderRadius: '16px',
                      padding: '8px',
                      display: 'inline-block',
                    }}>
                      <QRCodeCanvas
                          value={link}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#2f4f4f" // Dark green for QR code
                          level="H"
                          includeMargin={false}
                      />
                    </div>
                  </div>

                  {/* Link Display */}
                  <div style={{ marginBottom: '24px' }}>
                    <p style={{ fontSize: '14px', color: '#556b2f', marginBottom: '12px' }}>
                      Payment Link:
                    </p>
                    <div style={{
                      background: 'rgba(255, 245, 220, 0.5)', // Light beige
                      border: '1px solid #6b8e23',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '12px',
                    }}>
                      <p style={{
                        color: '#2f4f4f',
                        fontSize: '14px',
                        wordBreak: 'break-all',
                        fontFamily: 'monospace',
                        margin: 0,
                      }}>
                        {link}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                          onClick={copyToClipboard}
                          style={{
                            flex: 1,
                            background: 'rgba(245, 245, 220, 0.5)',
                            color: '#2f4f4f',
                            fontWeight: '500',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #6b8e23',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                          }}
                          onMouseOver={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = 'rgba(245, 245, 220, 0.7)';
                          }}
                          onMouseOut={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = 'rgba(245, 245, 220, 0.5)';
                          }}

                      >
                        {copied ? (
                            <>
                              <CheckCircle2 size={16} color="#6b8e23" />
                              <span style={{ color: '#6b8e23' }}>Copied!</span>
                            </>
                        ) : (
                            <>
                              <Copy size={16} color="#6b8e23" />
                              <span>Copy Link</span>
                            </>
                        )}
                      </button>

                      <button
                          onClick={() => window.open(link, '_blank')}
                          style={{
                            flex: 1,
                            background: 'rgba(245, 245, 220, 0.5)',
                            color: '#2f4f4f',
                            fontWeight: '500',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            border: '1px solid #6b8e23',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s ease',
                            fontFamily: "'Georgia', 'Times New Roman', serif",
                          }}
                          onMouseOver={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = 'rgba(245, 245, 220, 0.7)';
                          }}
                          onMouseOut={(e) => {
                            const target = e.target as HTMLButtonElement;
                            target.style.background = 'rgba(245, 245, 220, 0.5)';
                          }}

                      >
                        <ExternalLink size={16} color="#6b8e23" />
                        <span>Open Link</span>
                      </button>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: '#6b8e23', margin: 0, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                    Scan the QR code with Phantom, Solflare, or any Solana wallet
                  </p>
                </div>
              </div>
          )}

          <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          input::placeholder {
            color: rgba(47, 79, 79, 0.5); /* Dark green placeholder */
          }
          
          input:focus {
            border-color: #6b8e23;
            box-shadow: 0 0 0 2px rgba(107, 142, 35, 0.3);
          }
        `}</style>
        </div>
      </div>
  );
};

export default SolanaPayLinkGenerator;