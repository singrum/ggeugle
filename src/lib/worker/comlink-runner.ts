import { wrap } from "comlink";

export class ComlinkRunner<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, (...args: any[]) => any>,
> {
  private workerFactory: new () => Worker;
  private worker?: Worker;
  private pendingReject?: (reason?: unknown) => void;

  constructor(workerFactory: new () => Worker) {
    this.workerFactory = workerFactory;
  }

  terminate() {
    this.worker?.terminate();
    this.worker = undefined;

    if (this.pendingReject) {
      try {
        this.pendingReject();
      } catch {
        // 에러 무시
      }

      this.pendingReject = undefined;
    }
  }

  callAndTerminate<K extends keyof T>(
    method: K,
    args: Parameters<T[K]>,
    timeoutMillis?: number, // 명시적 timeout 매개변수
  ): Promise<Awaited<ReturnType<T[K]>>> {
    this.terminate(); // 이전 워커 종료
    this.worker = new this.workerFactory();

    return new Promise((resolve, reject) => {
      this.pendingReject = reject;

      const api = wrap<T>(this.worker!);
      const fn = api[method];

      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (timeoutMillis !== undefined) {
        timeoutId = setTimeout(() => {
          reject(new Error("Timeout exceeded"));
          this.terminate();
        }, timeoutMillis);
      }

      (fn(...args) as Promise<Awaited<ReturnType<T[K]>>>)
        .then((result) => {
          if (timeoutId) clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((err) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(err);
        })
        .finally(() => {
          this.terminate();
        });
    });
  }
}
