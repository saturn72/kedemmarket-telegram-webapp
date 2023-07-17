export interface mediaItem {
    src: string;
    url: string;
    alt: any;
    title: string;
}

export interface Product {
    id: any;
    name: string;
    description: string;
    price: number;
    image: mediaItem;
}

export interface Store {
    id: any;
    name: string;
    logo?: mediaItem;
}

export interface Vendor {
    id: any;
    name: string;
    image?: string;
    store: Store;
    products?: Product[];
}