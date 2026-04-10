import createDOMPurify from "isomorphic-dompurify";

export function sanitizeHtml(dirty: string): string {
  const DOMPurify = createDOMPurify();
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "br", "strong", "em", "u", "s",
      "ul", "ol", "li",
      "blockquote", "code", "pre",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
      "hr", "div", "span",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel", "colspan", "rowspan"],
    ALLOW_DATA_ATTR: false,
    FORCE_BODY: false,
  });
}
