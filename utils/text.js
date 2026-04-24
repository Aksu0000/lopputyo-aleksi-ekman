import he from "he";

export const stripHtml = (html) => {
  if (!html) return "";

  const withoutTags = html.replace(/<[^>]*>?/gm, "");
  return he.decode(withoutTags);
};