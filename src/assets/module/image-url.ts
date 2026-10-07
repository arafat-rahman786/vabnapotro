export function getImageUrl(image: string): string {
    if (/^(?:data:|blob:|https?:\/\/|\/)/i.test(image)) {
        return image;
    }

    return `/image/${encodeURIComponent(image)}`;
}
