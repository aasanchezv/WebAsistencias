'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './colorpicker.module.css';

interface ColorPickerProps {
  label?:    string;
  value?:    string;
  onChange?: (hex: string) => void;
}

export default function ColorPicker({
  label    = '',
  value    = 'FF0000',
  onChange = () => {},
}: ColorPickerProps) {

  const gradRef  = useRef<HTMLCanvasElement>(null);
  const curRef   = useRef<HTMLCanvasElement>(null);
  const wrapRef  = useRef<HTMLDivElement>(null);

  const [hue,      setHue]      = useState(0);
  const [hex,      setHex]      = useState(value.replace('#', '').toUpperCase());
  const [cursor,   setCursor]   = useState({ x: 1, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const drawGradient = useCallback(() => {
    const canvas = gradRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const { width: w, height: h } = canvas;
    ctx.fillStyle = `hsl(${hue},100%,50%)`;
    ctx.fillRect(0, 0, w, h);
    const wg = ctx.createLinearGradient(0, 0, w, 0);
    wg.addColorStop(0, '#fff'); wg.addColorStop(1, 'transparent');
    ctx.fillStyle = wg; ctx.fillRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, 'transparent'); bg.addColorStop(1, '#000');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  }, [hue]);

  const drawCursor = useCallback((x: number, y: number) => {
    const canvas = curRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1; ctx.stroke();
  }, []);

  const pickColor = useCallback((x: number, y: number) => {
    const canvas = gradRef.current;
    if (!canvas) return;
    const w = canvas.width, h = canvas.height;
    const cx = Math.max(0, Math.min(x, w));
    const cy = Math.max(0, Math.min(y, h));
    const data = canvas.getContext('2d')!.getImageData(cx, cy, 1, 1).data;
    const newHex = [data[0], data[1], data[2]]
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    setCursor({ x: cx / w, y: cy / h });
    setHex(newHex);
    onChange(newHex);
    drawCursor(cx, cy);
  }, [drawCursor, onChange]);

  // Resize canvases
  useEffect(() => {
    const resize = () => {
      const wrap = wrapRef.current;
      if (!wrap || !gradRef.current || !curRef.current) return;
      const { width, height } = wrap.getBoundingClientRect();
      gradRef.current.width  = curRef.current.width  = width;
      gradRef.current.height = curRef.current.height = height;
      drawGradient();
      drawCursor(cursor.x * width, cursor.y * height);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [hue, drawGradient, drawCursor, cursor.x, cursor.y]);

  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true);
    const r = gradRef.current!.getBoundingClientRect();
    pickColor(e.clientX - r.left, e.clientY - r.top);
  }

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging || !gradRef.current) return;
      const r = gradRef.current.getBoundingClientRect();
      pickColor(e.clientX - r.left, e.clientY - r.top);
    };
    const onUp = () => setDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [dragging, pickColor]);

  function handleHueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setHue(Number(e.target.value));
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    setHex(val);
    if (val.length === 6) onChange(val);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={styles.container}>
      {label && <p className={styles.label}>{label}</p>}

      <div className={styles.preview} style={{ background: `#${hex}` }} />

      <div ref={wrapRef} className={styles.gradientWrap} onMouseDown={handleMouseDown}>
        <canvas ref={gradRef} className={styles.canvas} />
        <canvas ref={curRef}  className={styles.cursorCanvas} />
      </div>

      <input
        type="range"
        className={styles.hue}
        min={0} max={360}
        value={hue}
        onChange={handleHueChange}
      />

      <div className={styles.row}>
        <span className={styles.hash}>#</span>
        <input
          className={styles.hexInput}
          value={hex}
          maxLength={6}
          onChange={handleHexInput}
        />
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? 'Copiado ✓' : 'Copiar'}
        </button>
      </div>
    </div>
  );
}