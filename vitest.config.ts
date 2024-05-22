import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        testTimeout: 5000,
        server: {
            deps: {
                inline: ['document-model-libs']
            }
        },
        setupFiles: './test/vitest-setup.ts',
        poolOptions: {
            threads: {
                singleThread: true
            }
        }
    }
});
