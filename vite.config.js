import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['localhost', '2f3f-102-89-69-76.ngrok-free.app'],
	}
});
