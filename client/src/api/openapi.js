const spec = {
  openapi: '3.0.3',
  info: {
    title: 'QR Attendance System API',
    version: '1.0.0',
    description:
      'REST API for the Dynamic QR-Based Attendance System. Professors create sessions and display rotating QR codes. Students scan and verify via OTP email to mark attendance.',
    contact: { name: 'QR Attendance System' },
  },
  servers: [{ url: import.meta.env.VITE_API_URL || 'http://localhost:4000', description: 'Development server' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT issued on professor login or after student OTP verification.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Something went wrong' },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
          email: { type: 'string', example: 'student@college.edu' },
          name: { type: 'string', example: 'Raj Kumar' },
          role: { type: 'string', enum: ['student', 'professor'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Session: {
        type: 'object',
        properties: {
          sessionId: { type: 'string', format: 'uuid', example: 'cc4d27a7-f97d-4db9-9068-d780d541a81c' },
          subjectCode: { type: 'string', example: 'CS301' },
          subjectName: { type: 'string', example: 'Data Structures' },
          date: { type: 'string', format: 'date-time' },
          isActive: { type: 'boolean', example: true },
          attendanceCount: { type: 'integer', example: 18 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AttendanceRecord: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          sessionId: { type: 'string' },
          studentEmail: { type: 'string', example: 'student@college.edu' },
          studentName: { type: 'string', example: 'Raj Kumar' },
          markedAt: { type: 'string', format: 'date-time' },
          tokenUsed: { type: 'string' },
        },
      },
      JwtResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'JWT bearer token' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Authentication and OTP flow' },
    { name: 'Session', description: 'Attendance session management (professor only)' },
    { name: 'Attendance', description: 'Attendance records' },
    { name: 'User', description: 'User profile' },
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a student',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'name'],
                properties: {
                  email: { type: 'string', example: 'student@college.edu' },
                  name: { type: 'string', example: 'Raj Kumar' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Student registered successfully' },
          409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/auth/professor-login': {
      post: {
        tags: ['Auth'],
        summary: 'Professor login',
        description: 'Returns a JWT for the professor. Use credentials: professor@college.edu / Prof@1234 (seeded default).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'professor@college.edu' },
                  password: { type: 'string', example: 'Prof@1234' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/JwtResponse' } } } },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/exchange-scan-token': {
      post: {
        tags: ['Auth'],
        summary: 'Exchange 10s QR scan token for a 5-minute session entry token',
        description: 'Called automatically on page load when a student opens the /attend URL. Validates the short-lived QR JWT and returns a longer-lived token so the student has time to enter email + OTP.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['scanToken'],
                properties: {
                  scanToken: { type: 'string', description: '10-second QR JWT from the URL' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: '5-minute session entry token',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { sessionEntryToken: { type: 'string' } },
                },
              },
            },
          },
          400: { description: 'QR code expired or session ended' },
        },
      },
    },
    '/auth/send-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Send OTP to student email',
        description: 'Rate limited to 1 request per email per 30 seconds. Requires a valid session entry token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'sessionToken'],
                properties: {
                  email: { type: 'string', example: 'student@college.edu' },
                  name: { type: 'string', example: 'Raj Kumar' },
                  sessionToken: { type: 'string', description: '5-minute session entry token' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'OTP sent successfully' },
          400: { description: 'Invalid or expired session token' },
          409: { description: 'Attendance already marked for this session' },
          429: { description: 'Rate limit: wait 30 seconds before requesting another OTP' },
        },
      },
    },
    '/auth/verify-otp': {
      post: {
        tags: ['Auth'],
        summary: 'Verify OTP and mark attendance',
        description: 'Verifies the 6-digit OTP, marks attendance, and returns a student JWT.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'otp', 'sessionToken'],
                properties: {
                  email: { type: 'string', example: 'student@college.edu' },
                  otp: { type: 'string', example: '482910' },
                  sessionToken: { type: 'string', description: '5-minute session entry token' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Attendance marked successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/JwtResponse' } } } },
          400: { description: 'Invalid OTP or expired token' },
          409: { description: 'Attendance already marked for this session' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/session/create': {
      post: {
        tags: ['Session'],
        summary: 'Create a new attendance session',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['subjectCode', 'subjectName'],
                properties: {
                  subjectCode: { type: 'string', example: 'CS301' },
                  subjectName: { type: 'string', example: 'Data Structures' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Session created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { sessionId: { type: 'string', format: 'uuid' } },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
          403: { description: 'Professor access required' },
        },
      },
    },
    '/session/refresh-token/{sessionId}': {
      post: {
        tags: ['Session'],
        summary: 'Generate a new 10-second QR token',
        description: 'Called by the QRDisplay component every 9 seconds to rotate the displayed QR code.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          200: {
            description: 'New QR token',
            content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } } } } },
          },
          400: { description: 'Session has ended' },
          404: { description: 'Session not found' },
        },
      },
    },
    '/session/history': {
      get: {
        tags: ['Session'],
        summary: 'Get all sessions created by this professor',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of sessions with attendance count',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Session' } } } },
          },
        },
      },
    },
    '/session/{sessionId}/attendance': {
      get: {
        tags: ['Session'],
        summary: 'Get all attendance records for a session',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Attendance records',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/AttendanceRecord' } } } },
          },
          404: { description: 'Session not found' },
        },
      },
    },
    '/session/{sessionId}/export-csv': {
      get: {
        tags: ['Session'],
        summary: 'Export attendance as CSV',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'CSV file download', content: { 'text/csv': { schema: { type: 'string' } } } },
          404: { description: 'Session not found' },
        },
      },
    },
    '/session/{sessionId}/end': {
      patch: {
        tags: ['Session'],
        summary: 'End an active session',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Session ended successfully' },
          404: { description: 'Session not found' },
        },
      },
    },
    '/session/{sessionId}/reactivate': {
      patch: {
        tags: ['Session'],
        summary: 'Reactivate an ended session (within 2-hour window)',
        description: 'Re-opens attendance for a previously ended session. Existing attendance records are preserved. Students who already marked get a 409. Only available within 2 hours of session creation.',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Session reactivated' },
          400: { description: '2-hour window has passed' },
          404: { description: 'Session not found' },
        },
      },
    },
    '/user/me': {
      get: {
        tags: ['User'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
      patch: {
        tags: ['User'],
        summary: 'Update current user name',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object', properties: { name: { type: 'string', example: 'Raj Kumar' } } },
            },
          },
        },
        responses: {
          200: { description: 'Updated user profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        },
      },
    },
    '/attendance/session/{sessionId}': {
      get: {
        tags: ['Attendance'],
        summary: 'Get attendance records with total count',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'sessionId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Attendance data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    count: { type: 'integer' },
                    records: { type: 'array', items: { $ref: '#/components/schemas/AttendanceRecord' } },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default spec;
