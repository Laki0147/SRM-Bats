import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

// Typography Scale Story
export const Scale: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div>
        <Typography.Hero>Hero H1 - 72px / 700</Typography.Hero>
        <p className="text-small text-gray-600 mt-2">font-heading, Canela</p>
      </div>

      <div>
        <Typography.H2>Heading H2 - 56px / 700</Typography.H2>
        <p className="text-small text-gray-600 mt-2">font-heading, Canela</p>
      </div>

      <div>
        <Typography.H3>Heading H3 - 42px / 600</Typography.H3>
        <p className="text-small text-gray-600 mt-2">font-heading, Canela</p>
      </div>

      <div>
        <Typography.H4>Heading H4 - 32px / 600</Typography.H4>
        <p className="text-small text-gray-600 mt-2">font-heading, Canela</p>
      </div>

      <div>
        <Typography.H5>Heading H5 - 24px / 600</Typography.H5>
        <p className="text-small text-gray-600 mt-2">font-heading, Canela</p>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div>
          <Typography.BodyLarge>
            Body Large - 20px / 400 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography.BodyLarge>
          <p className="text-small text-gray-600 mt-2">font-body, Inter</p>
        </div>

        <div>
          <Typography.Body>
            Body - 16px / 400 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography.Body>
          <p className="text-small text-gray-600 mt-2">font-body, Inter</p>
        </div>

        <div>
          <Typography.Small>
            Small - 14px / 400 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography.Small>
          <p className="text-small text-gray-600 mt-2">font-body, Inter</p>
        </div>

        <div>
          <Typography.Caption>
            Caption - 12px / 400 - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography.Caption>
          <p className="text-small text-gray-600 mt-2">font-body, Inter</p>
        </div>
      </div>
    </div>
  ),
};

// Number Typography
export const Numbers: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Typography.Number className="text-h2">
          $1,234,567.89
        </Typography.Number>
        <p className="text-small text-gray-600 mt-2">font-numbers, Space Grotesk - Tabular</p>
      </div>

      <div className="space-y-2">
        <Typography.Number className="text-h4">123.45</Typography.Number>
        <Typography.Number className="text-h4">1,234.56</Typography.Number>
        <Typography.Number className="text-h4">12,345.67</Typography.Number>
        <p className="text-small text-gray-600 mt-2">Aligned tabular numbers</p>
      </div>
    </div>
  ),
};

// Content Example
export const ContentExample: StoryObj = {
  render: () => (
    <article className="max-w-3xl space-y-6">
      <Typography.Hero>
        The Future of Design Systems
      </Typography.Hero>

      <Typography.BodyLarge className="text-gray-600">
        A comprehensive approach to building scalable, maintainable design systems
        that work across platforms and teams.
      </Typography.BodyLarge>

      <Typography.H3>
        Introduction
      </Typography.H3>

      <Typography.Body>
        Design systems have become essential for modern product development. They provide
        a single source of truth for design decisions, ensuring consistency across all
        touchpoints while enabling teams to move faster.
      </Typography.Body>

      <Typography.Body>
        This typography system is built on three core principles: hierarchy, readability,
        and performance. Each font choice serves a specific purpose in the visual hierarchy.
      </Typography.Body>

      <Typography.H4>
        Typography Hierarchy
      </Typography.H4>

      <Typography.Body>
        The system uses three font families strategically:
      </Typography.Body>

      <ul className="space-y-2 ml-6">
        <li className="text-body">
          <strong className="font-semibold">Canela</strong> for headings - elegant serif that commands attention
        </li>
        <li className="text-body">
          <strong className="font-semibold">Inter</strong> for body text - highly readable sans-serif
        </li>
        <li className="text-body">
          <strong className="font-semibold">Space Grotesk</strong> for numbers - monospaced for alignment
        </li>
      </ul>

      <Typography.Caption className="text-gray-500">
        Last updated: January 2026
      </Typography.Caption>
    </article>
  ),
};

// Responsive Behavior
export const Responsive: StoryObj = {
  render: () => (
    <div className="space-y-8">
      <div className="p-6 bg-blue-50 rounded-lg">
        <Typography.Small className="text-blue-600 font-semibold mb-2 block">
          DESKTOP (default)
        </Typography.Small>
        <Typography.Hero>72px Hero</Typography.Hero>
      </div>

      <div className="p-6 bg-green-50 rounded-lg">
        <Typography.Small className="text-green-600 font-semibold mb-2 block">
          TABLET (≤768px)
        </Typography.Small>
        <Typography.Body>Hero scales to 48px</Typography.Body>
      </div>

      <div className="p-6 bg-orange-50 rounded-lg">
        <Typography.Small className="text-orange-600 font-semibold mb-2 block">
          MOBILE (≤480px)
        </Typography.Small>
        <Typography.Body>Hero scales to 36px</Typography.Body>
      </div>
    </div>
  ),
};