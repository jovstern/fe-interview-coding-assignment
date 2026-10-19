const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const image = (extra = {}) => ({
  type: 'object',
  required: ['url', 'width', 'height'],
  properties: {
    url: { type: 'string', format: 'uri' },
    width: { type: 'integer' },
    height: { type: 'integer' },
  },
  ...extra,
});

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'External Server API',
    version: '1.0.0',
    description: 'Mock photo feed API used by the frontend assignment.',
  },
  servers: [{ url: 'http://localhost:4000' }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        operationId: 'getHealth',
        responses: {
          '200': {
            description: 'Server is up',
            content: {
              'text/plain': { schema: { type: 'string', example: 'ok' } },
            },
          },
        },
      },
    },
    '/api/home': {
      get: {
        summary: 'Home feed',
        operationId: 'getHome',
        responses: {
          '200': {
            description: 'Home feed',
            content: { 'application/json': { schema: ref('HomeResponse') } },
          },
        },
      },
    },
    '/api/photo/{photoId}': {
      get: {
        summary: 'Photo details',
        operationId: 'getPhoto',
        parameters: [
          {
            name: 'photoId',
            in: 'path',
            required: true,
            schema: { type: 'string', example: 'p_001' },
          },
        ],
        responses: {
          '200': {
            description: 'Photo details',
            content: { 'application/json': { schema: ref('PhotoResponse') } },
          },
          '404': {
            description: 'Photo not found',
            content: { 'application/json': { schema: ref('Error') } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Error: {
        type: 'object',
        required: ['message'],
        properties: { message: { type: 'string' } },
      },
      Image: image(),
      HomeResponse: {
        type: 'object',
        required: [
          'user',
          'headline',
          'subheadline',
          'filters',
          'items',
          'pagination',
        ],
        properties: {
          user: {
            type: 'object',
            required: ['id', 'name', 'avatarUrl'],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              avatarUrl: { type: 'string', format: 'uri' },
            },
          },
          headline: { type: 'string' },
          subheadline: { type: 'string' },
          filters: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'label', 'active'],
              properties: {
                id: { type: 'string' },
                label: { type: 'string' },
                active: { type: 'boolean' },
              },
            },
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'title', 'author', 'image', 'tags'],
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                author: {
                  type: 'object',
                  required: ['id', 'name'],
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
                image: ref('Image'),
                tags: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          pagination: {
            type: 'object',
            required: ['total', 'nextCursor'],
            properties: {
              total: { type: 'integer' },
              nextCursor: { type: 'string', nullable: true },
            },
          },
        },
      },
      PhotoResponse: {
        type: 'object',
        required: [
          'id',
          'position',
          'total',
          'title',
          'category',
          'badges',
          'image',
          'description',
          'author',
          'details',
          'tags',
          'related',
        ],
        properties: {
          id: { type: 'string' },
          position: { type: 'integer' },
          total: { type: 'integer' },
          title: { type: 'string' },
          category: { type: 'string' },
          badges: { type: 'array', items: { type: 'string' } },
          image: ref('Image'),
          description: { type: 'string' },
          author: {
            type: 'object',
            required: [
              'id',
              'name',
              'role',
              'city',
              'avatarUrl',
              'isFollowing',
            ],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              role: { type: 'string' },
              city: { type: 'string' },
              avatarUrl: { type: 'string', format: 'uri' },
              isFollowing: { type: 'boolean' },
            },
          },
          details: {
            type: 'object',
            required: ['location', 'lensMm', 'aperture', 'capturedAt'],
            properties: {
              location: {
                type: 'object',
                required: ['city', 'country'],
                properties: {
                  city: { type: 'string' },
                  country: { type: 'string' },
                },
              },
              lensMm: { type: 'number' },
              aperture: { type: 'number' },
              capturedAt: { type: 'string', format: 'date-time' },
            },
          },
          tags: { type: 'array', items: { type: 'string' } },
          related: {
            type: 'array',
            items: {
              type: 'object',
              required: ['id', 'thumbnailUrl'],
              properties: {
                id: { type: 'string' },
                thumbnailUrl: { type: 'string', format: 'uri' },
              },
            },
          },
        },
      },
    },
  },
} as const;
