export function getImageUrl(imageName: string): string {
    return `/image/${encodeURIComponent(imageName)}`;
}
