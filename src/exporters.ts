import { EXPORT_SIZE, WEBM_DURATION_MS, WEBM_FRAME_RATE, type IllusionDefinition, type ParamValues, type RenderFrame } from './types';

export function downloadPng(definition: IllusionDefinition, params: ParamValues, fileName: string): void {
  const canvas = document.createElement('canvas');
  canvas.width = EXPORT_SIZE;
  canvas.height = EXPORT_SIZE;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas is not available.');
  }

  definition.renderCanvas(ctx, params, {
    width: EXPORT_SIZE,
    height: EXPORT_SIZE,
    time: 0,
    progress: 0
  });

  canvas.toBlob((blob) => {
    if (blob) {
      downloadBlob(blob, `${fileName}.png`);
    }
  }, 'image/png');
}

export function downloadSvg(definition: IllusionDefinition, params: ParamValues, fileName: string): void {
  const blob = new Blob([definition.renderSvg(params)], { type: 'image/svg+xml;charset=utf-8' });
  downloadBlob(blob, `${fileName}.svg`);
}

export async function downloadWebM(
  canvas: HTMLCanvasElement,
  renderFrame: (frame: RenderFrame) => void,
  fileName: string,
  duration = WEBM_DURATION_MS
): Promise<void> {
  if (!canvas.captureStream || typeof MediaRecorder === 'undefined') {
    throw new Error('WebM recording is not supported in this browser.');
  }

  const mimeType = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
    .find((candidate) => MediaRecorder.isTypeSupported(candidate)) ?? '';
  const stream = canvas.captureStream(WEBM_FRAME_RATE);
  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const startedAt = performance.now();

  recorder.addEventListener('dataavailable', (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  });

  const finished = new Promise<void>((resolve) => {
    recorder.addEventListener('stop', () => resolve(), { once: true });
  });

  recorder.start();

  await new Promise<void>((resolve) => {
    const tick = (now: number) => {
      const elapsed = Math.min(duration, now - startedAt);
      renderFrame({
        width: canvas.width,
        height: canvas.height,
        time: elapsed,
        progress: elapsed / duration
      });

      if (elapsed >= duration) {
        resolve();
        return;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });

  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());
  await finished;
  downloadBlob(new Blob(chunks, { type: mimeType || 'video/webm' }), `${fileName}.webm`);
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
