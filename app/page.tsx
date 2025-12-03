// app/page.tsx
'use client';

import { FormEvent, useState } from 'react';

export default function HomePage() {
  const [protocolStatus, setProtocolStatus] = useState<string | null>(null);
  const [oracleLoading, setOracleLoading] = useState(false);
  const [oracleAnswer, setOracleAnswer] = useState('Awaiting query...');
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultError, setVaultError] = useState<string | null>(null);
  const [accessKey, setAccessKey] = useState('');

  async function handleProtocol(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    if (!email) return;

    setProtocolStatus('Transmitting...');
    try {
      const res = await fetch('/api/protocol', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Protocol failed');
      setProtocolStatus('Acknowledged. Consideration logged.');
    } catch (err) {
      setProtocolStatus('Transmission failed. Try again.');
    }
  }

  async function handleOracle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const question = formData.get('question') as string;
    if (!question) return;
    setOracleLoading(true);
    setOracleAnswer('Consulting the stream...');

    try {
      const res = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Oracle error');
      setOracleAnswer(data.answer);
    } catch (err) {
      setOracleAnswer('The signal is weak. Try again later.');
    } finally {
      setOracleLoading(false);
    }
  }

  async function handleAccessVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setVaultError(null);
    try {
      const res = await fetch('/api/access/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: accessKey })
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setVaultUnlocked(false);
        setVaultError('Invalid key. Access denied.');
      } else {
        setVaultUnlocked(true);
        setVaultError(null);
      }
    } catch (err) {
      setVaultError('Verification failed. Try again later.');
    }
  }

  async function handleStripeCheckout() {
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error('Stripe error');
      window.location.href = data.url;
    } catch (err) {
      alert('Checkout failed. Try again.');
    }
  }

  return (
    <>
      {/* HERO */}
      <header className="hero" id="home">
        <div className="container">
          <div className="hero__content">
            <h1>Lowkey. Subtlety is the New Status.</h1>
          </div>
        </div>
      </header>

      <main>
        {/* MANIFESTO */}
        <section className="manifesto stealth-section" id="philosophy">
          <div className="container">
            <div className="manifesto__item">
              <h2>Volume is a weakness.</h2>
            </div>
            <div className="manifesto__item">
              <h2>Legacy is built in silence.</h2>
            </div>
            <div className="manifesto__item">
              <h2>The only signal that matters is the one they can&apos;t see.</h2>
            </div>
          </div>
        </section>

        {/* OBJECTS */}
        <section className="product-teaser stealth-section" id="objects">
          <div className="container">
            <div className="section-heading">
              <h3>Objects of Intent</h3>
              <p>
                Ideology manifested. Each object is a tool, a statement, and a key, crafted not for display but for
                purpose.
              </p>
            </div>
            <div className="product-teaser__grid">
              <div className="product-teaser__item">
                <span>Object 001: The Veil</span>
              </div>
              <div className="product-teaser__item">
                <span>Object 002: The Ghost</span>
              </div>
              <div className="product-teaser__item">
                <span>Object 003: The Key</span>
              </div>
            </div>
          </div>
        </section>

        {/* ACCESS GATE / PROTOCOL */}
        <section className="stealth-section" id="access">
          <div className="container" style={{ display: 'grid', gap: '2.5rem' }}>
            <div className="glass-panel">
              <h3>The Protocol</h3>
              <p>
                Influence is not requested; it is recognized. Provide your identifier. Consideration is the only
                promise.
              </p>
              <form onSubmit={handleProtocol} style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Secure Identifier (Email)"
                  required
                />
                <button type="submit" className="btn">
                  Initiate Protocol
                </button>
              </form>
              {protocolStatus && (
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#ccc' }}>{protocolStatus}</p>
              )}
            </div>

            {/* STRIPE FOUNDER KEY */}
            <div className="glass-panel">
              <h3>Founder Key</h3>
              <p>
                A single access primitive. Acquire once. Unlock forever. Limited, audited, and bound to the holder, not
                the hype.
              </p>
              <button className="btn" onClick={handleStripeCheckout}>
                Acquire Founder Key
              </button>
              <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: '#777' }}>
                Processed via Stripe. No screenshots. No second chances.
              </p>
            </div>

            {/* ACCESS KEY INPUT / VAULT GATE */}
            <div className="glass-panel">
              <h3>The Gate</h3>
              <p>Possession is proven in silence. Present your key. No resets, no reminders.</p>
              <form
                onSubmit={handleAccessVerify}
                style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <input
                  type="text"
                  name="accessKey"
                  className="form-input"
                  placeholder="Access Key"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  required
                />
                <button type="submit" className="btn">
                  Verify
                </button>
              </form>
              {vaultError && (
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#f66' }}>{vaultError}</p>
              )}
            </div>

            {/* ORACLE */}
            <div className="glass-panel">
              <h3>The Oracle</h3>
              <p>The channel is open. Ask a question. Receive a reflection.</p>
              <form
                onSubmit={handleOracle}
                style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
              >
                <input
                  type="text"
                  name="question"
                  className="form-input"
                  placeholder="Pose your query..."
                  required
                />
                <button type="submit" className="btn" disabled={oracleLoading}>
                  {oracleLoading ? 'Consulting...' : 'Consult'}
                </button>
              </form>
              {oracleLoading && <div className="loader" />}
              <div id="oracle-response">{oracleAnswer}</div>
            </div>

            {/* VAULT */}
            {vaultUnlocked && <VaultSection />}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__content">
          <p className="footer__copyright">
            &copy; {new Date().getFullYear()} Lowkey. All rights reserved. Operate in silence.
          </p>
          <div className="footer__socials">
            <a href="#">[Redacted]</a>
            <a href="#">[Redacted]</a>
          </div>
        </div>
      </footer>
    </>
  );
}

function VaultSection() {
  const [items, setItems] = useState<{ id: string; name: string; description: string; url?: string }[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchVault() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vault');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Vault error');
      setItems(data.items);
    } catch (err) {
      setError('Vault unavailable. Try again later.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-panel">
      <h3>The Vault</h3>
      <p>Objects of consequence. Delivered quietly. Logged nowhere public.</p>
      <button className="btn" onClick={fetchVault} disabled={loading}>
        {loading ? 'Decrypting...' : 'Reveal Contents'}
      </button>
      {error && <p style={{ marginTop: '1rem', color: '#f66', fontSize: '0.9rem' }}>{error}</p>}
      {items && (
        <ul style={{ marginTop: '1.5rem', textAlign: 'left', listStyle: 'none', padding: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: '1rem' }}>
              <strong style={{ color: '#fff' }}>{item.name}</strong>
              <p style={{ fontSize: '0.9rem', color: '#bbb' }}>{item.description}</p>
              {item.url && (
                <a
                  href={item.url}
                  style={{ fontSize: '0.85rem', color: '#c9b07a', textDecoration: 'underline' }}
                >
                  Download
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
