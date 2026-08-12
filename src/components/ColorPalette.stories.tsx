import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from './ColorPalette';
import '../styles/colors.css';

const meta: Meta<typeof ColorPalette> = {
  title: 'Design System/Color Palette',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# SRM Bats Color System

A comprehensive, accessible color palette designed for premium baseball equipment branding.

## Features
- WCAG 2.1 AA/AAA compliant contrast ratios
- Dark mode support
- Semantic color tokens
- Status color system
- Premium gold accent palette

## Usage

Import the color system CSS:
\`\`\`css
@import '../styles/colors.css';
\`\`\`

Use Tailwind classes or CSS custom properties:
\`\`\`jsx
<div className="bg-primary-midnight text-accent-gold">
  Championship Quality
</div>

<div style={{
  backgroundColor: 'var(--color-background-primary)',
  color: 'var(--color-text-accent)'
}}>
  Premium Bats
</div>
\`\`\`
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const LightMode: Story = {
  render: () => <ColorPalette />,
};

export const DarkMode: Story = {
  render: () => (
    <div className="dark">
      <ColorPalette />
    </div>
  ),
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const ContrastExamples: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Light Mode Combinations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
            <div className="text-primary-midnight text-xl font-bold mb-2">
              Midnight on White
            </div>
            <p className="text-neutral-dark-gray">
              Primary text color for light backgrounds. Passes AAA for normal text.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border-2 border-accent-gold">
            <div className="text-accent-gold text-xl font-bold mb-2">
              Gold on White
            </div>
            <p className="text-neutral-dark-gray">
              Accent color for emphasis. Passes AA for large text.
            </p>
          </div>

          <div className="bg-primary-midnight p-6 rounded-lg">
            <div className="text-white text-xl font-bold mb-2">
              White on Midnight
            </div>
            <p className="text-neutral-soft-gray">
              High contrast combination. Passes AAA.
            </p>
          </div>

          <div className="bg-primary-midnight p-6 rounded-lg">
            <div className="text-accent-gold text-xl font-bold mb-2">
              Gold on Midnight
            </div>
            <p className="text-neutral-warm-white">
              Premium brand combination. Passes AA.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Dark Mode Combinations</h2>
        <div className="dark">
          <div className="grid grid-cols-2 gap-4 bg-primary-midnight p-6 rounded-lg">
            <div className="bg-primary-rich p-6 rounded-lg">
              <div className="text-white text-xl font-bold mb-2">
                White on Rich Black
              </div>
              <p className="text-neutral-soft-gray">
                Primary text in dark mode. Passes AAA.
              </p>
            </div>

            <div className="bg-primary-rich p-6 rounded-lg border-2 border-accent-gold-light">
              <div className="text-accent-gold-light text-xl font-bold mb-2">
                Light Gold on Rich Black
              </div>
              <p className="text-neutral-soft-gray">
                Accent color for dark mode. Enhanced visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Status Colors</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-success p-6 rounded-lg">
            <div className="text-white text-xl font-bold mb-2">
              Success State
            </div>
            <p className="text-white opacity-90">
              Used for positive actions and confirmations.
            </p>
          </div>

          <div className="bg-warning p-6 rounded-lg">
            <div className="text-primary-midnight text-xl font-bold mb-2">
              Warning State
            </div>
            <p className="text-primary-midnight opacity-90">
              Used for caution and important notices.
            </p>
          </div>

          <div className="bg-danger p-6 rounded-lg">
            <div className="text-white text-xl font-bold mb-2">
              Danger State
            </div>
            <p className="text-white opacity-90">
              Used for errors and destructive actions.
            </p>
          </div>

          <div className="bg-info p-6 rounded-lg">
            <div className="text-white text-xl font-bold mb-2">
              Info State
            </div>
            <p className="text-white opacity-90">
              Used for informational messages.
            </p>
          </div>
        </div>
      </div>
    </div>
  ),
};