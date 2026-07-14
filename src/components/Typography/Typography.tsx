import React from 'react';
import { cn } from '../../utils/cn';

// Type definitions
type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
type TextSize = 'hero' | 'h2' | 'h3' | 'h4' | 'h5' | 'body-lg' | 'body' | 'small' | 'caption';
type FontFamily = 'heading' | 'body' | 'numbers';

interface BaseTypographyProps {
  className?: string;
  children: React.ReactNode;
}

interface HeadingProps extends BaseTypographyProps {
  as?: HeadingLevel;
  size?: TextSize;
}

interface TextProps extends BaseTypographyProps {
  as?: keyof JSX.IntrinsicElements;
  size?: TextSize;
  font?: FontFamily;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

// Heading Component
export const Heading: React.FC<HeadingProps> = ({
  as = 'h2',
  size,
  className,
  children,
  ...props
}) => {
  const Component = as;

  const sizeMap: Record<HeadingLevel, string> = {
    h1: 'text-hero',
    h2: 'text-h2',
    h3: 'text-h3',
    h4: 'text-h4',
    h5: 'text-h5',
    h6: 'text-h5',
  };

  const defaultSize = size || sizeMap[as];

  return (
    <Component
      className={cn(
        'font-heading',
        defaultSize,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Hero Heading (H1)
export const Hero: React.FC<Omit<HeadingProps, 'as' | 'size'>> = (props) => (
  <Heading as="h1" size="hero" {...props} />
);

// H2 Heading
export const H2: React.FC<Omit<HeadingProps, 'as' | 'size'>> = (props) => (
  <Heading as="h2" size="h2" {...props} />
);

// H3 Heading
export const H3: React.FC<Omit<HeadingProps, 'as' | 'size'>> = (props) => (
  <Heading as="h3" size="h3" {...props} />
);

// H4 Heading
export const H4: React.FC<Omit<HeadingProps, 'as' | 'size'>> = (props) => (
  <Heading as="h4" size="h4" {...props} />
);

// H5 Heading
export const H5: React.FC<Omit<HeadingProps, 'as' | 'size'>> = (props) => (
  <Heading as="h5" size="h5" {...props} />
);

// Text Component
export const Text: React.FC<TextProps> = ({
  as = 'p',
  size = 'body',
  font = 'body',
  weight = 'regular',
  className,
  children,
  ...props
}) => {
  const Component = as;

  return (
    <Component
      className={cn(
        `font-${font}`,
        `text-${size}`,
        `font-${weight}`,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

// Body Text Variants
export const BodyLarge: React.FC<Omit<TextProps, 'size'>> = (props) => (
  <Text size="body-lg" {...props} />
);

export const Body: React.FC<Omit<TextProps, 'size'>> = (props) => (
  <Text size="body" {...props} />
);

export const Small: React.FC<Omit<TextProps, 'size'>> = (props) => (
  <Text size="small" {...props} />
);

export const Caption: React.FC<Omit<TextProps, 'size'>> = (props) => (
  <Text size="caption" {...props} />
);

// Number Component (for tabular numbers)
export const Number: React.FC<TextProps> = (props) => (
  <Text font="numbers" className="tabular-nums" {...props} />
);

// Display Component (for large marketing text)
export const Display: React.FC<BaseTypographyProps> = ({
  className,
  children,
  ...props
}) => (
  <h1
    className={cn(
      'font-heading text-hero font-bold tracking-tight',
      'sm:text-[6rem] md:text-[8rem]',
      className
    )}
    {...props}
  >
    {children}
  </h1>
);

// Export all components
export const Typography = {
  Heading,
  Hero,
  H2,
  H3,
  H4,
  H5,
  Text,
  BodyLarge,
  Body,
  Small,
  Caption,
  Number,
  Display,
};

export default Typography;