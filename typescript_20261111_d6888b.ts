// src/tests/cart.test.ts
import { describe, it, expect } from 'vitest';
import { useCartStore } from '@/store/useCartStore';

describe('Shopping Cart Logic', () => {
  it('harus menghitung total harga dengan benar', () => {
    const store = useCartStore.getState();
    store.clearCart();
    store.addItem({ variantId: '1', price: 100000, quantity: 2, productId: '1', name: 'Test', image: '', size: 'M', color: 'Black' });
    
    const total = useCartStore.getState().getTotalPrice();
    expect(total).toBe(200000);
  });
});