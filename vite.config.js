import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		allowedHosts: ['localhost', 'd4aa-102-89-85-136.ngrok-free.app'],
	}
});
