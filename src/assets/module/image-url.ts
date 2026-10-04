const imageUrls = import.meta.glob<string>("../image/*", {
    eager: true,
    query: "?url",
    import: "default",
});

export function getImageUrl(imageName: string): string {
    const imageUrl = imageUrls[`../image/${imageName}`];

    if (!imageUrl) {
        console.error(`Image file not found: ${imageName}`);
        return "";
    }

    return imageUrl;
}
