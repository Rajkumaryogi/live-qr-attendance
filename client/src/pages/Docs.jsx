import { Link } from 'react-router-dom';

const Section = ({ id, title, children }) => (
  <section id={id} style={{ marginBottom: '48px' }}>
    <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#111827', borderBottom: '2px solid #e5e7eb', paddingBottom: '8px', marginBottom: '20px' }}>
      {title}
    </h2>
    {children}
  </section>
);

const Code = ({ children }) => (
  <code style={{ background: '#f3f4f6', padding: '2px 7px', borderRadius: '4px', fontSize: '13px', color: '#1d4ed8', fontFamily: 'monospace' }}>
    {children}
  </code>
);

const CodeBlock = ({ children }) => (
  <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '8px', fontSize: '13px', overflowX: 'auto', lineHeight: '1.6', margin: '12px 0' }}>
    <code>{children}</code>
  </pre>
);

const Step = ({ num, title, children }) => (
  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1d4ed8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
      {num}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{title}</div>
      <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: '1.6' }}>{children}</div>
    </div>
  </div>
);

const Badge = ({ label, color = '#1d4ed8', bg = '#eff6ff' }) => (
  <span style={{ background: bg, color, padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', marginRight: '6px' }}>
    {label}
  </span>
);

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'flow', label: 'How It Works' },
  { id: 'roles', label: 'User Roles' },
  { id: 'setup', label: 'Setup' },
  { id: 'env', label: 'Environment' },
  { id: 'security', label: 'Security' },
  { id: 'endpoints', label: 'Endpoints' },
];

export default function Docs() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <aside style={{
        width: '220px',
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #e5e7eb',
        padding: '24px 0',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 20px 20px', borderBottom: '1px solid #e5e7eb', marginBottom: '16px' }}>
          <div style={{ fontWeight: '700', color: '#111827', fontSize: '15px' }}>QR Attendance</div>
          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '2px' }}>Documentation</div>
        </div>
        <nav style={{ padding: '0 12px' }}>
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{ display: 'block', padding: '7px 10px', borderRadius: '6px', color: '#374151', textDecoration: 'none', fontSize: '14px', marginBottom: '2px' }}
              onMouseEnter={(e) => (e.target.style.background = '#f3f4f6')}
              onMouseLeave={(e) => (e.target.style.background = 'transparent')}
            >
              {item.label}
            </a>
          ))}
          <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '16px', paddingTop: '16px' }}>
            <Link
              to="/api"
              style={{ display: 'block', padding: '7px 10px', borderRadius: '6px', color: '#1d4ed8', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}
            >
              📡 API Reference →
            </Link>
          </div>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '860px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827', margin: '0 0 8px' }}>
            QR Attendance System
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px', margin: 0, lineHeight: '1.6' }}>
            A MERN stack system for contactless, OTP-verified classroom attendance using rotating QR codes.
          </p>
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Badge label="MongoDB" bg="#dcfce7" color="#16a34a" />
            <Badge label="Express" bg="#f3f4f6" color="#374151" />
            <Badge label="React" bg="#dbeafe" color="#1d4ed8" />
            <Badge label="Node.js" bg="#dcfce7" color="#15803d" />
            <Badge label="JWT" bg="#fef3c7" color="#d97706" />
            <Badge label="Nodemailer" bg="#ede9fe" color="#7c3aed" />
          </div>
        </div>

        <Section id="overview" title="Overview">
          <p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '15px' }}>
            Professors display a QR code that rotates every 9 seconds — each code encodes a JWT that expires in 10 seconds,
            preventing screenshot sharing between students. When a student scans the QR their phone camera, they are taken to
            a web page where they enter their college email and receive a 6-digit OTP. Verifying the OTP marks their attendance
            for that session. No app installation is required.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '24px' }}>
            {[
              { icon: '📱', title: 'No App Required', desc: 'Students use their phone camera and browser — nothing to install.' },
              { icon: '🔄', title: 'Rotating QR', desc: 'QR refreshes every 9s to prevent screenshot-based proxy attendance.' },
              { icon: '✉️', title: 'OTP Verification', desc: 'Email OTP proves the student is present and owns their college email.' },
            ].map((card) => (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>{card.icon}</div>
                <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', fontSize: '14px' }}>{card.title}</div>
                <div style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.5' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="flow" title="How It Works">
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px' }}>
            <p style={{ fontWeight: '600', color: '#374151', marginTop: 0, marginBottom: '20px' }}>Professor Flow</p>
            <Step num="1" title="Login">Sign in at <Code>/login</Code> with professor credentials.</Step>
            <Step num="2" title="Create Session">Enter subject code and name on the Dashboard → click Start Session.</Step>
            <Step num="3" title="Display QR">Project the QR code on a screen. It auto-rotates every 9 seconds.</Step>
            <Step num="4" title="Monitor">Watch the live attendance table update as students scan and verify.</Step>
            <Step num="5" title="End Session">Click End Session when done, or export attendance as CSV anytime.</Step>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', marginTop: '20px' }}>
            <p style={{ fontWeight: '600', color: '#374151', marginTop: 0, marginBottom: '20px' }}>Student Flow</p>
            <Step num="1" title="Scan QR">Point phone camera at the QR code — no app needed, opens in browser.</Step>
            <Step num="2" title="Token Exchange">Page instantly exchanges the 10s QR token for a 5-minute session token.</Step>
            <Step num="3" title="Enter Email">Type your college email address and optionally your name.</Step>
            <Step num="4" title="Check Email">Receive a 6-digit OTP in your inbox (valid for 3 minutes).</Step>
            <Step num="5" title="Verify OTP">Enter the OTP — attendance is marked and a success screen is shown.</Step>
          </div>
        </Section>

        <Section id="roles" title="User Roles">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#1d4ed8', fontSize: '15px', marginBottom: '12px' }}>🎓 Professor</div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', fontSize: '14px', lineHeight: '2' }}>
                <li>Login with email + password</li>
                <li>Create and manage sessions</li>
                <li>Display and rotate QR codes</li>
                <li>View live attendance</li>
                <li>Export CSV reports</li>
                <li>End or restart sessions</li>
              </ul>
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: '700', color: '#16a34a', fontSize: '15px', marginBottom: '12px' }}>👨‍🎓 Student</div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: '#374151', fontSize: '14px', lineHeight: '2' }}>
                <li>No account required to start</li>
                <li>Scan QR with phone camera</li>
                <li>Verify via email OTP</li>
                <li>Mark attendance once per session</li>
                <li>Works on any mobile browser</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section id="setup" title="Setup">
          <Step num="1" title="Install dependencies">
            <CodeBlock>{`cd server && npm install
cd ../client && npm install`}</CodeBlock>
          </Step>
          <Step num="2" title="Configure environment">
            Copy <Code>server/.env.example</Code> to <Code>server/.env</Code> and fill in values. Copy <Code>client/.env.example</Code> to <Code>client/.env</Code>.
          </Step>
          <Step num="3" title="Seed professor account">
            <CodeBlock>{`cd server && npm run seed
# Creates: professor@college.edu / Prof@1234`}</CodeBlock>
          </Step>
          <Step num="4" title="Start development servers">
            <CodeBlock>{`# Terminal 1 — Backend (port 4000)
cd server && npm run dev

# Terminal 2 — Frontend (port 5173)
cd client && npm run dev`}</CodeBlock>
          </Step>
          <Step num="5" title="Mobile access (same Wi-Fi)">
            Run <Code>ipconfig getifaddr en0</Code> to get your local IP. Set <Code>VITE_API_URL</Code> and <Code>VITE_CLIENT_URL</Code> to that IP, and add <Code>host: true</Code> to <Code>vite.config.js</Code>.
          </Step>
        </Section>

        <Section id="env" title="Environment Variables">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  {['Variable', 'Default', 'Description'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['PORT', '4000', 'Express server port'],
                  ['MONGO_URI', '—', 'MongoDB connection string'],
                  ['JWT_SECRET', '—', 'Secret for signing all JWTs'],
                  ['JWT_EXPIRES_IN', '7d', 'User JWT expiry'],
                  ['OTP_HASH_SECRET', '—', 'HMAC-SHA256 key for OTP hashing'],
                  ['OTP_TTL_MINUTES', '3', 'OTP validity window in minutes'],
                  ['QR_TOKEN_TTL_SECONDS', '10', 'QR JWT lifetime in seconds'],
                  ['SESSION_ENTRY_TOKEN_TTL_SECONDS', '300', '5-minute token after QR scan exchange'],
                  ['SMTP_HOST', 'smtp.gmail.com', 'SMTP server host'],
                  ['SMTP_PORT', '587', 'SMTP server port'],
                  ['SMTP_USER', '—', 'Gmail address for sending OTPs'],
                  ['SMTP_PASS', '—', 'Gmail App Password (not account password)'],
                  ['CLIENT_ORIGIN', 'http://localhost:5173', 'CORS allowed origin'],
                  ['VITE_API_URL', 'http://localhost:4000', 'Backend URL (client env)'],
                  ['VITE_CLIENT_URL', '—', 'Frontend network URL for QR encoding'],
                ].map(([key, def, desc]) => (
                  <tr key={key} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '10px 12px' }}><Code>{key}</Code></td>
                    <td style={{ padding: '10px 12px', color: '#6b7280', fontFamily: 'monospace' }}>{def}</td>
                    <td style={{ padding: '10px 12px', color: '#4b5563' }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="security" title="Security">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '🔄', title: 'Rotating QR tokens', desc: 'JWT-signed tokens expire in 10 seconds. Client rotates every 9s (1s buffer). Expired tokens return HTTP 400.' },
              { icon: '🔀', title: 'Token exchange', desc: 'On scan, the 10s token is immediately exchanged for a 5-minute session entry token, giving students enough time to enter email + OTP.' },
              { icon: '#️⃣', title: 'OTP hashing', desc: 'OTPs are HMAC-SHA256 hashed with a random 8-byte salt (format: salt:hash). Comparison uses crypto.timingSafeEqual to prevent timing attacks.' },
              { icon: '🚦', title: 'Rate limiting', desc: 'Global: 200 req/min per IP. OTP send: 1 per email per 30 seconds via express-rate-limit.' },
              { icon: '🔒', title: 'Professor passwords', desc: 'bcryptjs with cost factor 12. Students authenticate solely via email OTP — no password required.' },
              { icon: '🚫', title: 'Duplicate prevention', desc: 'AttendanceRecord unique check on (sessionId, studentEmail). Duplicate attempts return HTTP 409.' },
              { icon: '🌐', title: 'CORS', desc: 'Restricted to CLIENT_ORIGIN env var. All secrets in environment variables, never hardcoded.' },
            ].map((item) => (
              <div key={item.title} style={{ display: 'flex', gap: '14px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px 18px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <span style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>{item.title} — </span>
                  <span style={{ color: '#4b5563', fontSize: '14px' }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="endpoints" title="Endpoints Summary">
          <p style={{ color: '#6b7280', fontSize: '14px', marginTop: 0 }}>
            See the full interactive reference at <Link to="/api" style={{ color: '#1d4ed8' }}>/api</Link>.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f3f4f6' }}>
                  {['Method', 'Path', 'Auth', 'Description'].map((h) => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['POST', '/auth/register', 'None', 'Register a new student'],
                  ['POST', '/auth/professor-login', 'None', 'Professor login → returns JWT'],
                  ['POST', '/auth/exchange-scan-token', 'None', 'Exchange 10s QR token for 5-min entry token'],
                  ['POST', '/auth/send-otp', 'None', 'Send OTP to student email (rate limited)'],
                  ['POST', '/auth/verify-otp', 'None', 'Verify OTP → mark attendance → return JWT'],
                  ['GET', '/auth/me', 'JWT', 'Get current user profile'],
                  ['POST', '/session/create', 'Professor', 'Create new attendance session'],
                  ['POST', '/session/refresh-token/:id', 'Professor', 'Generate new 10s QR token'],
                  ['GET', '/session/history', 'Professor', 'All sessions with attendance count'],
                  ['GET', '/session/:id/attendance', 'Professor', 'All records for a session'],
                  ['GET', '/session/:id/export-csv', 'Professor', 'Download attendance as CSV'],
                  ['PATCH', '/session/:id/end', 'Professor', 'Mark session as ended'],
                  ['PATCH', '/session/:id/reactivate', 'Professor', 'Re-open session (within 2 hours)'],
                  ['GET', '/user/me', 'JWT', 'Get profile'],
                  ['PATCH', '/user/me', 'JWT', 'Update name'],
                ].map(([method, path, auth, desc]) => {
                  const methodColor = { POST: '#16a34a', GET: '#1d4ed8', PATCH: '#d97706', DELETE: '#dc2626' }[method] || '#374151';
                  const methodBg = { POST: '#dcfce7', GET: '#dbeafe', PATCH: '#fef3c7', DELETE: '#fee2e2' }[method] || '#f3f4f6';
                  return (
                    <tr key={path + method} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '9px 12px' }}>
                        <span style={{ background: methodBg, color: methodColor, padding: '2px 8px', borderRadius: '4px', fontWeight: '700', fontSize: '11px', fontFamily: 'monospace' }}>{method}</span>
                      </td>
                      <td style={{ padding: '9px 12px', fontFamily: 'monospace', color: '#374151' }}>{path}</td>
                      <td style={{ padding: '9px 12px', color: '#6b7280' }}>{auth}</td>
                      <td style={{ padding: '9px 12px', color: '#4b5563' }}>{desc}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </div>
  );
}
