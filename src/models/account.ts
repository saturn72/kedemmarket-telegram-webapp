
export interface UserProfile {
    userId: any;
    billingAddress: Address
}

export interface Address {
    firstName: string | undefined;
    lastName: string | undefined;
    company: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    address1: string | undefined;
    address2: string | undefined;
    zipPostalCode: string | undefined;
    city: string | undefined;
}