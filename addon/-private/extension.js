export default function getExtension(name) {
  let m = /\.(\w+)$/i.exec(name);
  return m ? m[1].toLowerCase() : undefined;
}
