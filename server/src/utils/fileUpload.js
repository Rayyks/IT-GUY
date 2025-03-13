export const getImageUrl = (file) => {
  if (!file) return null;
  return `/uploads/${file.filename}`;
};
