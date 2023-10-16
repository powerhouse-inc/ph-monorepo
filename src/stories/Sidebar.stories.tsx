import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { ConnectSidebar } from '../connect/components/sidebar';

const meta = {
    title: 'Connect/Components',
    component: ConnectSidebar,
    decorators: [
        Story => (
            <div className="relative h-screen">
                <Story />
            </div>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        header: {
            control: {
                disable: true,
            },
        },
        footer: {
            control: {
                disable: true,
            },
        },
        children: {
            control: {
                disable: true,
            },
        },
    },
} satisfies Meta<typeof ConnectSidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sidebar: Story = {
    decorators: [
        function Component(Story, ctx) {
            const [, setArgs] = useArgs<typeof ctx.args>();

            const onToggle = () => {
                ctx.args.onToggle?.();
                setArgs({ collapsed: !ctx.args.collapsed });
            };

            return <Story args={{ ...ctx.args, onToggle }} />;
        },
    ],
    args: {
        collapsed: false,
        username: 'Willow.eth',
        address: '0x8343...3u432u32',
        children: (
            <ul className="p-4">
                {Array(10)
                    .fill('')
                    .map((_, i) => (
                        <li key={i}>Item {i + 1}</li>
                    ))}
            </ul>
        ),
    },
};
