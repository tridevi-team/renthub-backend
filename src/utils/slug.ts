export const createSlug = (str: string) => {
    return str
        .normalize("NFD") // Normalize to separate base characters and diacritics
        .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
        .replace(/đ/g, "d") // Replace lowercase 'đ' with 'd'
        .replace(/Đ/g, "D") // Replace uppercase 'Đ' with 'D'
        .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
        .trim() // Remove extra spaces
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
};
