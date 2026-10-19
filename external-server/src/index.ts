import { serve } from '@hono/node-server';
import { swaggerUI } from '@hono/swagger-ui';
import { Hono } from 'hono';
// import { cors } from "hono/cors";
import { homeResponse } from './home.js';
import { openApiDocument } from './openapi.js';
import { getPhotoResponse } from './photo.js';

const app = new Hono();

// app.use("*", cors({ origin: "http://localhost:3000" }));

app.get('/api/openapi.json', (c) => c.json(openApiDocument));
app.get('/api/docs', swaggerUI({ url: '/api/openapi.json' }));
app.get('/api/health', (c) => c.text('ok'));
app.get('/api/home', (c) => c.json(homeResponse));
app.get('/api/photo/:photoId', (c) => {
  const photoId = c.req.param('photoId');
  const photo = getPhotoResponse(photoId);

  if (!photo) {
    return c.json(
      { message: `Photo with id "${photoId}" was not found` },
      404
    );
  }

  return c.json(photo);
});

const port = Number(process.env.PORT ?? 4000);

serve({ fetch: app.fetch, port }, () => {
  console.log(`external-server listening on http://localhost:${port}`);
});
