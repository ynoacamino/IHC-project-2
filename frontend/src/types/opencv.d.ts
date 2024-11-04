// src/types/opencv.d.ts
declare module 'opencv.js' {
  export function imread(src: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Mat;
  export function imshow(windowName: string, mat: Mat): void;
  export function threshold(src: Mat, dst: Mat, thresh: number, maxVal: number, type: number): void;
  export function cvtColor(src: Mat, dst: Mat, code: number): void;

  export class Mat {
    constructor(rows: number, cols: number, type: number);
    delete(): void;
  }

  declare global {
    const cv: {
      imread: typeof imread;
      imshow: typeof imshow;
      threshold: typeof threshold;
      cvtColor: typeof cvtColor;
      Mat: typeof Mat;
      CV_8UC4: number;
      CV_8UC1: number;
      COLOR_RGBA2GRAY: number;
      COLOR_GRAY2RGBA: number;
      THRESH_BINARY_INV: number;
    };
  }
}
