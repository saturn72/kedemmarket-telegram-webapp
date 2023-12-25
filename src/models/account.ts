
export interface UserProfile {
    userId: any;
    billingInfo: Address
}

export interface Address {
    valid?: boolean;
    fullName: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    address: string | undefined;
    zipPostalCode: string | undefined;
    city: string | undefined;
}