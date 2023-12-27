
export interface UserProfile {
    userId: any;
    billingInfo?: BillingInfo;
    shipping?: ShippingInfo;
}

export interface BillingInfo extends Partial<Address> {
    valid?: boolean;
}

export interface ShippingInfo {
    useBillingAddress: boolean;
    addresses: [Address] | undefined;
}

export interface Address {
    fullName: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    address: string | undefined;
    zipPostalCode: string | undefined;
    city: string | undefined;
}