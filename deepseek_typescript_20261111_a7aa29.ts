import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/useCartStore';

describe('Cart Store (Phase 10 QA)', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('harus bisa menambahkan item dan menghitung total', () => {
    const store = useCartStore.getState();
    store.addItem({ 
      variantId: 'v1', productId: 'p1', name: 'Test', price: 100000, 
      image: '', size: 'M', color: 'Black', quantity: 1 
    });
    
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().getTotalPrice()).toBe(100000);
  });
});