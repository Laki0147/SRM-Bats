import { describe, it, expect, beforeEach, vi } from 'vitest';
import { cache } from '../cache';

describe('Cache', () => {
  beforeEach(() => {
    cache.clear();
  });

  it('should store and retrieve values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should return null for non-existent keys', () => {
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('should expire values after TTL', async () => {
    cache.set('key1', 'value1', 100); // 100ms TTL

    expect(cache.get('key1')).toBe('value1');

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(cache.get('key1')).toBeNull();
  });

  it('should delete values', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');

    cache.delete('key1');
    expect(cache.get('key1')).toBeNull();
  });

  it('should delete values matching pattern', () => {
    cache.set('user:1', 'data1');
    cache.set('user:2', 'data2');
    cache.set('product:1', 'data3');

    cache.deletePattern('user:*');

    expect(cache.get('user:1')).toBeNull();
    expect(cache.get('user:2')).toBeNull();
    expect(cache.get('product:1')).toBe('data3');
  });

  it('should clear all values', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');

    cache.clear();

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
    expect(cache.size()).toBe(0);
  });

  it('should check if key exists', () => {
    cache.set('key1', 'value1');

    expect(cache.has('key1')).toBe(true);
    expect(cache.has('nonexistent')).toBe(false);
  });

  it('should return correct cache size', () => {
    expect(cache.size()).toBe(0);

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');

    expect(cache.size()).toBe(2);

    cache.delete('key1');

    expect(cache.size()).toBe(1);
  });
});
