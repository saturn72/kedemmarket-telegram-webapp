import type { MediaItem } from "@/models/common";

type MediaItemSlim = { alt: string, src: string, title: string };

export async function getMediaUrlOrDefault(src: string, defaultMedia: string): Promise<string> {
    if (!src) {
        return defaultMedia;
    }
    const url = await useNuxtApp().$storage.getDownloadUrl(src);
    return url ? url as string : defaultMedia;
}

export async function getMediaItemOrDefault(
    mediaItem: MediaItemSlim & { uri: string },
    mediaType: "thumbnail" | "image",
    defaultValues: MediaItemSlim): Promise<MediaItem> {

    const url = await getMediaUrlOrDefault(mediaItem?.uri, mediaType);
    return {
        alt: mediaItem?.alt || defaultValues.alt,
        src: mediaItem?.uri || defaultValues.src,
        title: mediaItem?.title || defaultValues.title,
        uri: url
    }
}