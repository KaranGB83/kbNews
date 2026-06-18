export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        mont: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}