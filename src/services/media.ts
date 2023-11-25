import { MediaItem } from "models/common";

type MediaItemSlim = { alt: string, src: string, title: string };

export async function getMediaUrlOrDefault(src: string, type: "thumbnail" | "image"): Promise<string> {

    if (!src) {
        return useAppConfig().defaults.thumbnail;
    }

    const url = await useNuxtApp().$storage.getDownloadUrl(src);

    if (!url) {
        switch (type) {
            case "thumbnail":
                return useAppConfig().defaults.thumbnail;

            default:
                break;
        }
    }
    return url as string;
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
        url
    }
}