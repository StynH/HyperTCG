import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const lanOnly = process.env.HYPERVERSE_LAN_ONLY === '1';

function isLocalAddress(remoteAddress: string | undefined): boolean {
  if (!remoteAddress) return false;

  const address = remoteAddress.toLowerCase().split('%')[0];
  if (address === '::1') return true;
  if (address.startsWith('::ffff:')) {
    return isLocalAddress(address.slice('::ffff:'.length));
  }

  const octets = address.split('.').map(Number);
  if (
    octets.length === 4 &&
    octets.every((octet) => Number.isInteger(octet) && octet >= 0 && octet <= 255)
  ) {
    const [first, second] = octets;
    return (
      first === 10 ||
      first === 127 ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168)
    );
  }

  const firstGroup = Number.parseInt(address.split(':')[0], 16);
  return (
    Number.isInteger(firstGroup) &&
    ((firstGroup & 0xfe00) === 0xfc00 || (firstGroup & 0xffc0) === 0xfe80)
  );
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'lan-only-access',
      apply: 'serve',
      configureServer(server) {
        if (!lanOnly) return;

        server.httpServer?.prependListener('upgrade', (request, socket) => {
          if (!isLocalAddress(request.socket.remoteAddress)) socket.destroy();
        });

        server.middlewares.use((request, response, next) => {
          if (isLocalAddress(request.socket.remoteAddress)) {
            next();
            return;
          }

          response.statusCode = 403;
          response.setHeader('Content-Type', 'text/plain; charset=utf-8');
          response.end('Forbidden: this server only accepts local network connections.');
        });
      },
    },
  ],
  server: {
    host: lanOnly ? '0.0.0.0' : '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
});
