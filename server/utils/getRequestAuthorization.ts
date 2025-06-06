import type { H3Event } from 'h3'

export function getRequestAuthorization(event: H3Event) {
  const Authorization = getHeader(event, 'Authorization')
  if (!Authorization || Authorization === 'undefined') {
    const accessToken = getCookie(event, 'accessToken')
    return `Bearer ${accessToken}`
  }
  return Authorization
}
