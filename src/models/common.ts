export interface MediaItem {
    alt: string;
    displayOrder: number;
    src: string;
    title: string;
    type: "image" | "thumbnail" | "video";
    url: string;
}

