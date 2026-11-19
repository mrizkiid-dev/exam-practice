/** App hash for a note path, e.g. "Folder/Note.md" → "#/notes/Folder/Note". */
export function noteHref(notePath) {
  return '#/notes/' + notePath.replace(/\.md$/i, '').split('/').map(encodeURIComponent).join('/')
}
