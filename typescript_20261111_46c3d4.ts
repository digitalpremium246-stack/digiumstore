// src/lib/integrations/payment.ts
export interface PaymentGateway {
  createTransaction(orderId: string, amount: number): Promise<{ token: string; redirectUrl: string }>;
}

export class MidtransAdapter implements PaymentGateway {
  private serverKey: string;
  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || "";
  }
  
  async createTransaction(orderId: string, amount: number) {
    if (!this.serverKey) throw new Error("Midtrans Server Key is missing.");
    // Logika pemanggilan API Midtrans (Snap)
    // const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', ...)
    return { token: "dummy-snap-token", redirectUrl: "https://app.sandbox.midtrans.com/snap/v2/vtweb/dummy" };
  }
}

// src/lib/integrations/shipping.ts
export interface ShippingProvider {
  calculateCost(destinationId: string, weight: number): Promise<number>;
}

export class BiteshipAdapter implements ShippingProvider {
  private apiKey: string;
  constructor() {
    this.apiKey = process.env.BITESHIP_API_KEY || "";
  }

  async calculateCost(destinationId: string, weight: number) {
    if (!this.apiKey) throw new Error("Biteship API Key is missing");
    // Logika fetch ke API Biteship
    return 15000; // Return dummy cost untuk development
  }
}