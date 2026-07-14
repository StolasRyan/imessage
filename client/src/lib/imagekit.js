export function isImageKitUrl(url) {
    return typeof url === "string" && url.includes("ik.imagekit.io");
};

export function withTransform(url, transform) {
    if(!isImageKitUrl(url)) return url;
    const [path, query = ""] = url.split("?");
    const searchParams = new URLSearchParams(query);
    searchParams.set("tr", transform);
    return `${path}?${searchParams.toString()}`
}