// Production data store for MT5 bot data
// Stores ONLY real data received from MT5 Expert Advisors

import type { BotInstance, Trade, AlertNotification, Client } from "./types"

interface StoredBot extends Partial<BotInstance> {
  id: string
  updatedAt: Date
}

interface StoredTrade extends Partial<Trade> {
  id: string
  updatedAt: Date
}

interface StoredAlert extends AlertNotification {
  id: string
}

// In-memory storage class
class InMemoryStore<T extends { id: string }> {
  private data: Map<string, T> = new Map()

  getAll(): T[] {
    return Array.from(this.data.values())
  }

  get(id: string): T | undefined {
    return this.data.get(id)
  }

  upsert(id: string, item: T): void {
    this.data.set(id, item)
  }

  add(item: T): void {
    this.data.set(item.id, item)
  }

  delete(id: string): boolean {
    return this.data.delete(id)
  }

  clear(): void {
    this.data.clear()
  }

  size(): number {
    return this.data.size
  }
}

// Alert storage with additional methods
class AlertStore extends InMemoryStore<StoredAlert> {
  markRead(id: string): void {
    const alert = this.get(id)
    if (alert) {
      this.upsert(id, { ...alert, read: true })
    }
  }

  markAllRead(): void {
    for (const alert of this.getAll()) {
      this.upsert(alert.id, { ...alert, read: true })
    }
  }
}

// Export singleton stores - EMPTY by default, populated only by MT5 API calls
export const botStorage = new InMemoryStore<StoredBot>()
export const tradeStorage = new InMemoryStore<StoredTrade>()
export const alertStorage = new AlertStore()
export const clientStorage = new InMemoryStore<Client>()

// NO demo data initialization - stores start empty
// Data is ONLY added when MT5 EA sends updates via API
