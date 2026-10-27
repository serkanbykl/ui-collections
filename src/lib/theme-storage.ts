/** Storage keys for per-visitor theme dials; shared by the client store and the boot script. */
export const valuesKey = (collection: string) => `theme:${collection}:v2`;
export const appliedKey = (collection: string) => `theme:${collection}:v2:applied`;

/** Inline script for <head>: applies the stored dials before first paint. */
export function themeBootScript(collection: string) {
  return `try{var a=JSON.parse(localStorage.getItem(${JSON.stringify(appliedKey(collection))})||"null");if(a){var h=document.documentElement,s=a.style||{};for(var k in s)h.style.setProperty(k,s[k]);for(var n in a)if(n!=="style")h.setAttribute(n,a[n])}}catch(e){}`;
}
