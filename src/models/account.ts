
export interface UserProfile {
    userId: any;
    billingAddress: Address
}

export interface Address {
    verified: boolean;
    fullName: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    address: string | undefined;
    zipPostalCode: string | undefined;
    city: string | undefined;
}