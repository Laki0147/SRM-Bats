import React from 'react';
import { checkContrast } from '../utils/colorAccessibility';

interface ColorSwatchProps {
  name: string;
  hex: string;
  description?: string;
  textColor?: string;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, hex, description, textColor }) => {
  const contrast = checkContrast(textColor || '#FFFFFF', hex);

  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-md">
      <div
        className="h-32 flex items-end p-4"
        style={{ backgroundColor: hex, color: textColor || '#FFFFFF' }}
      >
        <div>
          <div className="font-bold text-lg">{name}</div>
          <div className="text-sm opacity-90">{hex}</div>
        </div>
      </div>
      <div className="bg-white p-3 text-sm">
        {description && <div className="text-gray-700 mb-2">{description}</div>}
        <div className="text-xs text-gray-500">
          Contrast: {contrast.ratio}:1
          {contrast.passesAA && <span className="ml-2 text-green-600">✓ AA</span>}
          {contrast.passesAAA && <span className="ml-2 text-green-600">✓ AAA</span>}
        </div>
      </div>
    </div>
  );
};

interface ColorGroupProps {
  title: string;
  colors: Array<{
    name: string;
    hex: string;
    description?: string;
    textColor?: string;
  }>;
}

const ColorGroup: React.FC<ColorGroupProps> = ({ title, colors }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colors.map((color) => (
          <ColorSwatch key={color.hex} {...color} />
        ))}
      </div>
    </div>
  );
};

export const ColorPalette: React.FC = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">SRM Bats Color System</h1>
          <p className="text-lg text-gray-600">
            A premium, accessible color palette designed for championship-level baseball equipment.
          </p>
        </div>

        <ColorGroup
          title="Primary Colors"
          colors={[
            {
              name: 'Midnight Black',
              hex: '#0D0D0D',
              description: 'Primary brand color, bold and powerful',
              textColor: '#FFFFFF',
            },
            {
              name: 'Rich Black',
              hex: '#151515',
              description: 'Secondary surfaces and backgrounds',
              textColor: '#FFFFFF',
            },
            {
              name: 'Charcoal',
              hex: '#222222',
              description: 'Tertiary surfaces and elevated elements',
              textColor: '#FFFFFF',
            },
          ]}
        />

        <ColorGroup
          title="Accent Colors"
          colors={[
            {
              name: 'Championship Gold',
              hex: '#C89B58',
              description: 'Primary accent, premium and distinctive',
              textColor: '#0D0D0D',
            },
            {
              name: 'Dark Gold',
              hex: '#A57A3D',
              description: 'Hover states and emphasis',
              textColor: '#FFFFFF',
            },
            {
              name: 'Light Gold',
              hex: '#E8D2A8',
              description: 'Subtle highlights and dark mode accent',
              textColor: '#0D0D0D',
            },
          ]}
        />

        <ColorGroup
          title="Neutral Colors"
          colors={[
            {
              name: 'White',
              hex: '#FFFFFF',
              description: 'Primary light background',
              textColor: '#0D0D0D',
            },
            {
              name: 'Warm White',
              hex: '#F8F6F3',
              description: 'Secondary light background',
              textColor: '#0D0D0D',
            },
            {
              name: 'Soft Gray',
              hex: '#E6E6E6',
              description: 'Borders and dividers',
              textColor: '#0D0D0D',
            },
            {
              name: 'Medium Gray',
              hex: '#8B8B8B',
              description: 'Secondary text and icons',
              textColor: '#FFFFFF',
            },
            {
              name: 'Dark Gray',
              hex: '#4A4A4A',
              description: 'Body text on light backgrounds',
              textColor: '#FFFFFF',
            },
          ]}
        />

        <ColorGroup
          title="Status Colors"
          colors={[
            {
              name: 'Success',
              hex: '#3DBE6C',
              description: 'Success states and positive actions',
              textColor: '#FFFFFF',
            },
            {
              name: 'Warning',
              hex: '#F6B73C',
              description: 'Warning states and caution',
              textColor: '#0D0D0D',
            },
            {
              name: 'Danger',
              hex: '#E04A4A',
              description: 'Error states and destructive actions',
              textColor: '#FFFFFF',
            },
            {
              name: 'Info',
              hex: '#338DFF',
              description: 'Informational messages',
              textColor: '#FFFFFF',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default ColorPalette;