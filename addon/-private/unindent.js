export default function unindent(src) {
  let match, min, lines = src.split("\n").filter(l => l !== '');
  for (let i = 0; i < lines.length; i++) {
    match = /^[ \t]*/.exec(lines[i]);
    if (match && (typeof min === 'undefined' || min > match[0].length)) {
      min = match[0].length;
    }
  }
  if (typeof min !== 'undefined' && min > 0) {
    src = src.replace(new RegExp("^[ \t]{" + min + "}", 'gm'), "");
  }
  return src;
}
