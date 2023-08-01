import { MediaItem } from "model";

type MediaType = "thumbnail" | "image";
type MediaItemSlim = { alt: string, src: string, title: string };

export async function getMediaUrlOrDefault(src: string, type: MediaType): Promise<string> {

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
    mediaType: MediaType,
    defaultValues: MediaItemSlim): Promise<MediaItem> {

    const url = await getMediaUrlOrDefault(mediaItem?.uri, mediaType);
    return {
        alt: mediaItem?.alt || defaultValues.alt,
        src: mediaItem?.uri || defaultValues.src,
        title: mediaItem?.title || defaultValues.title,
        url
    }
}