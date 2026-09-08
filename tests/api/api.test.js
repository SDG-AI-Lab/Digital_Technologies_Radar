jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn()
}));

const { createClient } = require('@supabase/supabase-js');

const ALLOWED_ORIGIN = 'https://drrtechradar.org';

function createThenable(result) {
  const builder = {
    select: jest.fn(() => builder),
    eq: jest.fn(() => builder),
    neq: jest.fn(() => builder),
    order: jest.fn(() => builder),
    limit: jest.fn(() => builder),
    single: jest.fn(() => builder),
    maybeSingle: jest.fn(() => Promise.resolve(result)),
    csv: jest.fn(() => builder),
    insert: jest.fn(() => builder),
    update: jest.fn(() => builder),
    delete: jest.fn(() => builder),
    then: (onFulfilled, onRejected) =>
      Promise.resolve(result).then(onFulfilled, onRejected)
  };
  return builder;
}

function createMockClient({
  tables = {},
  getUser = async () => ({ data: { user: null }, error: null }),
  signInWithPassword = async () => ({ data: { session: null, user: null }, error: null }),
  createUser = async () => ({ data: { user: null }, error: null }),
  deleteUser = async () => ({ data: null, error: null })
} = {}) {
  return {
    from: jest.fn((table) => {
      const result =
        typeof tables[table] === 'function' ? tables[table]() : tables[table] || {
          data: null,
          error: null
        };
      return createThenable(result);
    }),
    auth: {
      getUser: jest.fn(getUser),
      signInWithPassword: jest.fn(signInWithPassword),
      admin: {
        createUser: jest.fn(createUser),
        deleteUser: jest.fn(deleteUser)
      }
    }
  };
}

function loadHandler() {
  jest.resetModules();
  // Re-apply mock after resetModules
  jest.doMock('@supabase/supabase-js', () => ({
    createClient: createClient
  }));
  return require('../../netlify/functions/api').handler;
}

function makeEvent({
  method = 'GET',
  path = '/api/health',
  origin,
  authorization,
  body
} = {}) {
  const headers = {};
  if (origin !== undefined) headers.origin = origin;
  if (authorization) headers.authorization = authorization;
  return {
    httpMethod: method,
    path,
    headers,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body)
  };
}

describe('netlify/functions/api', () => {
  let handler;
  let mockClient;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    process.env.SUPABASE_URL = 'https://example.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret';
    process.env.ALLOWED_ORIGINS = `${ALLOWED_ORIGIN},http://localhost:3000`;

    mockClient = createMockClient({
      tables: {
        dataset_version: { data: [{ id: 1 }], error: null },
        user_roles: { data: { role: 'admin' }, error: null },
        technologies: { data: [{ name: 'GIS', slug: 'gis' }], error: null },
        tr_projects: { data: { id: 1, uuid: 'proj-1' }, error: null },
        project_data: { data: null, error: null }
      },
      getUser: async () => ({
        data: { user: { id: 'admin-user', email: 'admin@example.com' } },
        error: null
      })
    });
    createClient.mockReset();
    createClient.mockReturnValue(mockClient);
    handler = loadHandler();
  });

  afterEach(() => {
    console.error.mockRestore();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
    delete process.env.ALLOWED_ORIGINS;
  });

  describe('CORS and origin gatekeeping', () => {
    it('rejects disallowed Origin on normal requests', async () => {
      const res = await handler(
        makeEvent({ path: '/api/health', origin: 'https://evil.example' })
      );
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.body).error).toBe('Origin is not allowed');
    });

    it('allows OPTIONS from an allowed origin', async () => {
      const res = await handler(
        makeEvent({ method: 'OPTIONS', path: '/api/health', origin: ALLOWED_ORIGIN })
      );
      expect(res.statusCode).toBe(204);
      expect(res.headers['Access-Control-Allow-Origin']).toBe(ALLOWED_ORIGIN);
      expect(res.headers['Access-Control-Allow-Methods']).toContain('GET');
    });

    it('rejects OPTIONS from a disallowed origin', async () => {
      const res = await handler(
        makeEvent({ method: 'OPTIONS', path: '/api/health', origin: 'https://evil.example' })
      );
      expect(res.statusCode).toBe(403);
    });

    it('allows health checks with no Origin header', async () => {
      const res = await handler(makeEvent({ path: '/.netlify/functions/api/health' }));
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toEqual({ status: 'ok' });
    });
  });

  describe('configuration and public routes', () => {
    it('returns 500 when server env is incomplete', async () => {
      delete process.env.SUPABASE_SECRET_KEY;
      handler = loadHandler();
      createClient.mockReturnValue(mockClient);

      const res = await handler(makeEvent({ path: '/api/health' }));
      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res.body).error).toBe('The request could not be completed');
    });

    it('lists a public resource', async () => {
      const res = await handler(
        makeEvent({
          path: '/api/public/technologies',
          origin: ALLOWED_ORIGIN
        })
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body).data).toEqual([{ name: 'GIS', slug: 'gis' }]);
      expect(res.headers['Access-Control-Allow-Origin']).toBe(ALLOWED_ORIGIN);
      expect(mockClient.from).toHaveBeenCalledWith('technologies');
    });

    it('returns 404 for unknown public resource', async () => {
      const res = await handler(
        makeEvent({ path: '/api/public/does-not-exist', origin: ALLOWED_ORIGIN })
      );
      expect(res.statusCode).toBe(404);
    });
  });

  describe('admin auth (requireAdmin)', () => {
    it('returns 401 when Bearer token is missing', async () => {
      const res = await handler(
        makeEvent({
          method: 'GET',
          path: '/api/admin/projects/pending',
          origin: ALLOWED_ORIGIN
        })
      );
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.body).error).toBe('Sign in is required');
    });

    it('returns 401 when the session token is invalid', async () => {
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'invalid' }
      });

      const res = await handler(
        makeEvent({
          method: 'GET',
          path: '/api/admin/projects/pending',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer bad-token'
        })
      );
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.body).error).toBe('Your session is no longer valid');
    });

    it('returns 403 when the user is not an admin', async () => {
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'user' }, error: null });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'GET',
          path: '/api/admin/projects/pending',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer good-token'
        })
      );
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.body).error).toBe('Administrator access is required');
    });

    it('allows an admin to list pending projects', async () => {
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'admin' }, error: null });
        }
        if (table === 'tr_projects') {
          return createThenable({
            data: [{ uuid: 'pending-1', approved: false }],
            error: null
          });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'GET',
          path: '/api/admin/projects/pending',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token'
        })
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body).data).toEqual([
        { uuid: 'pending-1', approved: false }
      ]);
    });
  });

  describe('body size and field allowlisting', () => {
    it('rejects oversized request bodies', async () => {
      const huge = 'x'.repeat(16 * 1024 + 1);
      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/info/technology',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: huge
        })
      );
      expect(res.statusCode).toBe(500);
      expect(JSON.parse(res.body).error).toBe('The request could not be completed');
    });

    it('strips unknown fields before inserting admin info', async () => {
      let insertedPayload = null;
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'admin' }, error: null });
        }
        if (table === 'technologies') {
          const builder = createThenable({
            data: { slug: 'gis', name: 'GIS' },
            error: null
          });
          builder.insert = jest.fn((payload) => {
            insertedPayload = payload;
            return builder;
          });
          return builder;
        }
        if (table === 'dataset_version') {
          return createThenable({ data: null, error: null });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/info/technology',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            name: 'GIS',
            img_url: 'https://example.com/g.png',
            description: 'desc',
            source: 'src',
            slug: 'gis',
            evil_field: 'should-be-stripped',
            admin: true
          }
        })
      );

      expect(res.statusCode).toBe(201);
      expect(insertedPayload).toEqual({
        name: 'GIS',
        img_url: 'https://example.com/g.png',
        description: 'desc',
        source: 'src',
        slug: 'gis'
      });
      expect(insertedPayload.evil_field).toBeUndefined();
    });
  });

  describe('auth sign-in', () => {
    it('requires email and password', async () => {
      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/sign-in',
          origin: ALLOWED_ORIGIN,
          body: { email: '' }
        })
      );
      expect(res.statusCode).toBe(400);
    });

    it('returns 401 for incorrect credentials', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid login' }
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/sign-in',
          origin: ALLOWED_ORIGIN,
          body: { email: 'user@example.com', password: 'wrong-password' }
        })
      );
      expect(res.statusCode).toBe(401);
      expect(JSON.parse(res.body).error).toBe('Incorrect email or password');
    });

    it('returns 403 when the account has no role', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          session: { access_token: 'tok', expires_at: 123 },
          user: { id: 'u1', email: 'user@example.com' }
        },
        error: null
      });
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: null, error: null });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/sign-in',
          origin: ALLOWED_ORIGIN,
          body: { email: 'user@example.com', password: 'secret-password' }
        })
      );
      expect(res.statusCode).toBe(403);
      expect(JSON.parse(res.body).error).toBe(
        'This account has not been granted access'
      );
    });

    it('returns a session for a user with a role', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          session: { access_token: 'tok', expires_at: 123 },
          user: { id: 'u1', email: 'user@example.com' }
        },
        error: null
      });
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'user' }, error: null });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/sign-in',
          origin: ALLOWED_ORIGIN,
          body: { email: 'user@example.com', password: 'secret-password' }
        })
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toMatchObject({
        access_token: 'tok',
        user: { id: 'u1', email: 'user@example.com', role: 'user' }
      });
    });
  });

  describe('public detail and filtered list routes', () => {
    it('returns a public detail resource', async () => {
      mockClient.from.mockImplementation((table) => {
        if (table === 'technologies') {
          return createThenable({
            data: { slug: 'gis', name: 'GIS' },
            error: null
          });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          path: '/api/public/details/technology/gis',
          origin: ALLOWED_ORIGIN
        })
      );
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body).data).toEqual({ slug: 'gis', name: 'GIS' });
    });

    it('returns 404 for unknown public detail resource', async () => {
      const res = await handler(
        makeEvent({
          path: '/api/public/details/unknown/x',
          origin: ALLOWED_ORIGIN
        })
      );
      expect(res.statusCode).toBe(404);
    });

    it('applies equals filters for home-help-needed', async () => {
      const builder = createThenable({
        data: [{ id: 9, help_needed: 1 }],
        error: null
      });
      mockClient.from.mockImplementation((table) => {
        if (table === 'disaster_events') return builder;
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          path: '/api/public/home-help-needed',
          origin: ALLOWED_ORIGIN
        })
      );
      expect(res.statusCode).toBe(200);
      expect(builder.eq).toHaveBeenCalledWith('help_needed', 1);
      expect(JSON.parse(res.body).data).toEqual([{ id: 9, help_needed: 1 }]);
    });
  });

  describe('admin user creation', () => {
    it('validates create-user payload', async () => {
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'admin' }, error: null });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/users',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: { email: 'a@b.com', password: 'short', role: 'user' }
        })
      );
      expect(res.statusCode).toBe(400);
    });

    it('creates a user and assigns a role', async () => {
      let roleInsert = null;
      mockClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'new-user', email: 'new@example.com' } },
        error: null
      });
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          const builder = createThenable({ data: { role: 'admin' }, error: null });
          builder.insert = jest.fn((payload) => {
            roleInsert = payload;
            return createThenable({ data: payload, error: null });
          });
          builder.maybeSingle = jest.fn(() =>
            Promise.resolve({ data: { role: 'admin' }, error: null })
          );
          return builder;
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/users',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            email: 'New@Example.com',
            password: 'long-enough-pass',
            role: 'user'
          }
        })
      );
      expect(res.statusCode).toBe(201);
      expect(mockClient.auth.admin.createUser).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'long-enough-pass',
        email_confirm: true
      });
      expect(roleInsert).toEqual({ user_id: 'new-user', role: 'user' });
      expect(JSON.parse(res.body).user).toEqual({
        id: 'new-user',
        email: 'new@example.com',
        role: 'user'
      });
    });

    it('returns 400 when Supabase cannot create the user', async () => {
      mockClient.auth.admin.createUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'User already registered' }
      });
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'admin' }, error: null });
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/users',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            email: 'dup@example.com',
            password: 'long-enough-pass',
            role: 'user'
          }
        })
      );
      expect(res.statusCode).toBe(400);
      expect(JSON.parse(res.body).error).toBe('User already registered');
    });

    it('rolls back the auth user when role insert fails', async () => {
      mockClient.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'orphan-user', email: 'orphan@example.com' } },
        error: null
      });
      let roleLookups = 0;
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          roleLookups += 1;
          if (roleLookups === 1) {
            // requireAdmin role check
            return createThenable({ data: { role: 'admin' }, error: null });
          }
          const builder = createThenable({
            data: null,
            error: { message: 'role insert failed' }
          });
          builder.insert = jest.fn(() =>
            createThenable({
              data: null,
              error: { message: 'role insert failed' }
            })
          );
          return builder;
        }
        return createThenable({ data: null, error: null });
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/auth/users',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            email: 'orphan@example.com',
            password: 'long-enough-pass',
            role: 'user'
          }
        })
      );
      expect(res.statusCode).toBe(500);
      expect(mockClient.auth.admin.deleteUser).toHaveBeenCalledWith('orphan-user');
    });
  });

  describe('admin project mutations', () => {
    function mockAdminFrom(handlers) {
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'admin' }, error: null });
        }
        if (handlers[table]) return handlers[table]();
        return createThenable({ data: null, error: null });
      });
    }

    it('requires a uuid to approve a project', async () => {
      mockAdminFrom({});
      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/projects/approve',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {}
        })
      );
      expect(res.statusCode).toBe(400);
    });

    it('approves a project and bumps dataset version', async () => {
      const updates = [];
      mockAdminFrom({
        tr_projects: () => {
          const builder = createThenable({ data: null, error: null });
          builder.update = jest.fn((payload) => {
            updates.push(['tr_projects', payload]);
            return builder;
          });
          return builder;
        },
        dataset_version: () => {
          const builder = createThenable({ data: null, error: null });
          builder.update = jest.fn((payload) => {
            updates.push(['dataset_version', payload]);
            return builder;
          });
          return builder;
        }
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/projects/approve',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: { uuid: 'proj-1' }
        })
      );
      expect(res.statusCode).toBe(200);
      expect(updates[0]).toEqual(['tr_projects', { approved: true }]);
      expect(updates[1][0]).toBe('dataset_version');
    });

    it('requires a title when creating a project', async () => {
      mockAdminFrom({});
      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/projects',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: { description: 'no title' }
        })
      );
      expect(res.statusCode).toBe(400);
    });

    it('creates a project with radar rows for disaster cycles', async () => {
      let projectInsert = null;
      let radarInsert = null;
      mockAdminFrom({
        tr_projects: () => {
          const builder = createThenable({
            data: { id: 42, uuid: 'new-proj' },
            error: null
          });
          builder.insert = jest.fn((payload) => {
            projectInsert = payload;
            return builder;
          });
          return builder;
        },
        project_data: () => {
          const builder = createThenable({ data: null, error: null });
          builder.insert = jest.fn((payload) => {
            radarInsert = payload;
            return builder;
          });
          return builder;
        },
        dataset_version: () => createThenable({ data: null, error: null })
      });

      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/projects',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            title: 'Flood early warning',
            disaster_cycles: '{Response,Recovery}'
          }
        })
      );
      expect(res.statusCode).toBe(201);
      expect(projectInsert).toEqual({ title: 'Flood early warning' });
      expect(radarInsert).toEqual([
        {
          title: 'Flood early warning',
          disaster_cycle: 'Response',
          tr_projects_id: 42
        },
        {
          title: 'Flood early warning',
          disaster_cycle: 'Recovery',
          tr_projects_id: 42
        }
      ]);
      expect(JSON.parse(res.body).data).toEqual({ id: 42, uuid: 'new-proj' });
    });

    it('updates a project and related radar rows', async () => {
      let projectUpdate = null;
      let radarUpdate = null;
      mockAdminFrom({
        tr_projects: () => {
          const builder = createThenable({
            data: { id: 7, uuid: 'proj-7' },
            error: null
          });
          builder.update = jest.fn((payload) => {
            projectUpdate = payload;
            return builder;
          });
          return builder;
        },
        project_data: () => {
          const builder = createThenable({ data: null, error: null });
          builder.update = jest.fn((payload) => {
            radarUpdate = payload;
            return builder;
          });
          return builder;
        },
        dataset_version: () => createThenable({ data: null, error: null })
      });

      const res = await handler(
        makeEvent({
          method: 'PUT',
          path: '/api/admin/projects/proj-7',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            title: 'Updated',
            id: 999,
            uuid: 'ignored',
            disaster_cycles: 'x',
            project_data: []
          }
        })
      );
      expect(res.statusCode).toBe(200);
      expect(projectUpdate).toEqual({ title: 'Updated' });
      expect(radarUpdate).toEqual({ title: 'Updated' });
    });

    it('deletes a project and its radar rows', async () => {
      const deleted = [];
      mockAdminFrom({
        tr_projects: () => {
          const builder = createThenable({ data: { id: 7 }, error: null });
          builder.delete = jest.fn(() => {
            deleted.push('tr_projects');
            return builder;
          });
          return builder;
        },
        project_data: () => {
          const builder = createThenable({ data: null, error: null });
          builder.delete = jest.fn(() => {
            deleted.push('project_data');
            return builder;
          });
          return builder;
        },
        dataset_version: () => createThenable({ data: null, error: null })
      });

      const res = await handler(
        makeEvent({
          method: 'DELETE',
          path: '/api/admin/projects/proj-7',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token'
        })
      );
      expect(res.statusCode).toBe(200);
      expect(deleted).toEqual(['project_data', 'tr_projects']);
    });
  });

  describe('admin info and disaster-event mutations', () => {
    function mockAdminFrom(handlers) {
      mockClient.from.mockImplementation((table) => {
        if (table === 'user_roles') {
          return createThenable({ data: { role: 'admin' }, error: null });
        }
        if (handlers[table]) return handlers[table]();
        return createThenable({ data: null, error: null });
      });
    }

    it('rejects incomplete info payloads', async () => {
      mockAdminFrom({});
      const res = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/info/technology',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: { name: 'Only name' }
        })
      );
      expect(res.statusCode).toBe(400);
    });

    it('updates info and related project fields', async () => {
      const projectUpdates = [];
      mockAdminFrom({
        technologies: () => {
          const builder = createThenable({
            data: { slug: 'gis', name: 'GIS 2' },
            error: null
          });
          builder.update = jest.fn(() => builder);
          return builder;
        },
        tr_projects: () => {
          const builder = createThenable({ data: null, error: null });
          builder.update = jest.fn((fields) => {
            projectUpdates.push(fields);
            return builder;
          });
          return builder;
        },
        dataset_version: () => createThenable({ data: null, error: null })
      });

      const res = await handler(
        makeEvent({
          method: 'PUT',
          path: '/api/admin/info/technology/gis',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: {
            name: 'GIS 2',
            relatedProjectUpdates: [
              { uuid: 'p1', technology: 'GIS 2', ignored: true },
              { not: 'a uuid' }
            ]
          }
        })
      );
      expect(res.statusCode).toBe(200);
      expect(projectUpdates).toEqual([{ technology: 'GIS 2' }]);
    });

    it('deletes an info resource by slug', async () => {
      let deletedSlug = null;
      mockAdminFrom({
        disaster_types: () => {
          const builder = createThenable({ data: null, error: null });
          builder.delete = jest.fn(() => builder);
          builder.eq = jest.fn((col, value) => {
            if (col === 'slug') deletedSlug = value;
            return builder;
          });
          return builder;
        },
        dataset_version: () => createThenable({ data: null, error: null })
      });

      const res = await handler(
        makeEvent({
          method: 'DELETE',
          path: '/api/admin/info/disaster-type/flood',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token'
        })
      );
      expect(res.statusCode).toBe(200);
      expect(deletedSlug).toBe('flood');
    });

    it('creates, updates, and deletes disaster events', async () => {
      const ops = [];
      mockAdminFrom({
        disaster_events: () => {
          const builder = createThenable({
            data: { uuid: 'evt-1', title: 'Flood' },
            error: null
          });
          builder.insert = jest.fn((payload) => {
            ops.push(['insert', payload]);
            return builder;
          });
          builder.update = jest.fn((payload) => {
            ops.push(['update', payload]);
            return builder;
          });
          builder.delete = jest.fn(() => {
            ops.push(['delete']);
            return builder;
          });
          return builder;
        },
        dataset_version: () => createThenable({ data: null, error: null })
      });

      const createRes = await handler(
        makeEvent({
          method: 'POST',
          path: '/api/admin/disaster-events',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: { title: 'Flood', secret: 'nope' }
        })
      );
      expect(createRes.statusCode).toBe(201);
      expect(ops[0]).toEqual(['insert', { title: 'Flood' }]);

      const updateRes = await handler(
        makeEvent({
          method: 'PUT',
          path: '/api/admin/disaster-events/evt-1',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token',
          body: { title: 'Flood updated' }
        })
      );
      expect(updateRes.statusCode).toBe(200);
      expect(ops[1]).toEqual(['update', { title: 'Flood updated' }]);

      const deleteRes = await handler(
        makeEvent({
          method: 'DELETE',
          path: '/api/admin/disaster-events/evt-1',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token'
        })
      );
      expect(deleteRes.statusCode).toBe(200);
      expect(ops[2]).toEqual(['delete']);
    });

    it('returns 404 for unknown admin routes', async () => {
      mockAdminFrom({});
      const res = await handler(
        makeEvent({
          method: 'GET',
          path: '/api/admin/unknown',
          origin: ALLOWED_ORIGIN,
          authorization: 'Bearer admin-token'
        })
      );
      expect(res.statusCode).toBe(404);
    });
  });

  describe('fallback routing', () => {
    it('returns 404 for unknown non-admin paths', async () => {
      const res = await handler(
        makeEvent({
          path: '/api/not-a-real-route',
          origin: ALLOWED_ORIGIN
        })
      );
      expect(res.statusCode).toBe(404);
    });
  });
});
