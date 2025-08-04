export class StorageService {
  constructor(private key: string) {}

  save(items: string[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  load(): string[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  clear(): void {
    localStorage.removeItem(this.key);
  }
}
