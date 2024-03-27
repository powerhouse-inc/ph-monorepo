import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react';
import '../src/globals.css';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
    decorators: [
        withThemeByDataAttribute<ReactRenderer>({
            themes: {
                light: 'ph-light',
                dark: 'ph-dark',
            },
            defaultTheme: 'light',
            attributeName: 'data-theme',
        }),
    ],
};

export default preview;
