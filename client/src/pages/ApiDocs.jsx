import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import spec from '../api/openapi';

export default function ApiDocs() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{
        background: '#1d4ed8',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <span style={{ fontSize: '20px' }}>📡</span>
        <div>
          <div style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>API Reference</div>
          <div style={{ color: '#bfdbfe', fontSize: '12px' }}>QR Attendance System — OpenAPI 3.0</div>
        </div>
      </div>
      <SwaggerUI
        spec={spec}
        docExpansion="list"
        defaultModelsExpandDepth={1}
        displayRequestDuration
        filter
        tryItOutEnabled={false}
      />
    </div>
  );
}
