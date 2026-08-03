'use client';

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */

import { ArrowLeft, ArrowRight, Star, Trash2, UploadCloud } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { resolveImageUrl, uploadApi } from '@/lib/api';
import { T } from './theme';
import { Spinner } from './ui';

export interface DropImage {
  url: string;
  alt?: string;
}

const MAX_MB = 5;
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

export function ImageDropzone({
  images,
  onChange,
  onError,
}: {
  images: DropImage[];
  onChange: (next: DropImage[]) => void;
  onError?: (msg: string) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (!list.length) return;
      setUploading(true);
      const added: DropImage[] = [];
      for (const file of list) {
        if (!ACCEPT.includes(file.type)) {
          onError?.(`${file.name}: unsupported type (use JPG, PNG, WebP, GIF, or AVIF)`);
          continue;
        }
        if (file.size > MAX_MB * 1024 * 1024) {
          onError?.(`${file.name}: exceeds ${MAX_MB}MB`);
          continue;
        }
        try {
          const { url } = await uploadApi.image(file);
          added.push({ url, alt: '' });
        } catch (e) {
          onError?.(e instanceof Error ? e.message : `Failed to upload ${file.name}`);
        }
      }
      if (added.length) onChange([...images, ...added]);
      setUploading(false);
    },
    [images, onChange, onError]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const setPrimary = (i: number) => move(i, 0);
  const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

  return (
    <div>
      {/* Drop area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="flex w-full flex-col items-center justify-center rounded-[12px] border-2 border-dashed px-6 py-8 transition-colors"
        style={{
          borderColor: dragging ? T.accent : T.line,
          background: dragging ? 'rgba(139,94,60,.06)' : T.surfaceAlt,
        }}
      >
        {uploading ? (
          <Spinner size={24} />
        ) : (
          <UploadCloud className="h-7 w-7" style={{ color: T.accent }} />
        )}
        <p className="mt-2 font-body text-[13px] font-semibold" style={{ color: T.ink }}>
          {uploading ? 'Uploading…' : 'Drop images here or click to browse'}
        </p>
        <p className="mt-0.5 font-body text-[11px]" style={{ color: T.muted }}>
          JPG, PNG, WebP, GIF, AVIF · up to {MAX_MB}MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT.join(',')}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) void uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </button>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, i) => (
            <div
              key={`${img.url}-${i}`}
              className="group relative overflow-hidden rounded-[10px] border"
              style={{ borderColor: T.line, background: T.surfaceAlt }}
            >
              <div className="aspect-square w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(img.url)}
                  alt={img.alt || `Product image ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
              {i === 0 && (
                <span
                  className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-[0.5px]"
                  style={{ background: T.ink, color: T.bg }}
                >
                  <Star className="h-2.5 w-2.5" fill={T.bg} /> Primary
                </span>
              )}
              {/* Controls */}
              <div
                className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 py-1.5 opacity-0 transition-opacity group-hover:opacity-100"
                style={{ background: 'rgba(44,31,20,0.72)' }}
              >
                <IconBtn label="Move left" disabled={i === 0} onClick={() => move(i, i - 1)}>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Set as primary" disabled={i === 0} onClick={() => setPrimary(i)}>
                  <Star className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  label="Move right"
                  disabled={i === images.length - 1}
                  onClick={() => move(i, i + 1)}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Remove image" danger onClick={() => remove(i)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  disabled = false,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 disabled:opacity-30"
      style={danger ? { color: '#f4a3a3' } : undefined}
    >
      {children}
    </button>
  );
}
