export const parseRecordId = (url: string): string | null => {
  const parts = url.split('/')
  const id = parts.slice(-2).shift()
  if (id) {
    return id
  }
  return null
}