export interface MediaItem {
    alt: string;
    displayOrder: number;
    src: string;
    title: string;
    type: "image" | "thumbnail" | "video";
    url: string;
}

export type ErrorResponse = {
    code?: number | string | undefined;
    message?: string | undefined;
}

