import { parse } from 'url'

export function parseUrl (url: string): { track: string, playlist: string, author: string } {
  const parsed = parse(url, true)
  switch (parsed.hostname) {
    case 'www.soundcloud.com':
    case 'soundcloud.com':
    case 'm.soundcloud.com': {
      if (parsed.path.lastIndexOf('/') === parsed.path.length - 1) {
        parsed.path = parsed.path.substring(0, parsed.path.length - 1)
      }

      if (parsed.path.includes('/sets/')) {
        return { playlist: parsed.path.substring(parsed.path.indexOf('/sets/') + 6), track: null, author: parsed.path.substring(1, parsed.path.indexOf('/', 1)) }
      } else {
        if (parsed.path.lastIndexOf('/') === parsed.path.length - 1) {
          parsed.path = parsed.path.substring(0, parsed.path.length - 1)
        }

        const track = parsed.path.substring(parsed.path.lastIndexOf('/') + 1)
        const response: { track: string, playlist: string, author: string } = { track, playlist: null, author: parsed.path.substring(1, parsed.path.indexOf('/', 1)) }

        if (parsed.query.in) {
          const isIn = parsed.query.in as string
          response.playlist = isIn.substring(isIn.lastIndexOf('/') + 1)
        }

        return response
      }
    }
    default:
      return { track: null, playlist: null, author: null }
  }
}

export function parseTags (str: string) {
  let tags: string[] = []

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === '"') {
      const nextQuote = str.indexOf('"', i + 1)
      tags.push(str.substring(i + 1, nextQuote !== -1 ? nextQuote : str.length))
      i = nextQuote !== -1 ? nextQuote + 1 : str.length - 1
      continue
    }

    const nextSpace = str.indexOf(' ', i + 1)
    tags.push(str.substring(i, nextSpace !== -1 ? nextSpace : str.length))
    i = nextSpace !== -1 ? nextSpace : str.length - 1
  }

  return tags
}
