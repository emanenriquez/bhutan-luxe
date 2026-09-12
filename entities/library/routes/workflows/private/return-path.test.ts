import { describe, expect, it } from 'vitest'
import { safeReturnPath, unlockRedirectTarget } from './return-path'

// The `next` parameter is attacker-controlled (it is in the URL bar), so the
// validator is tested as a boundary: everything that could leave the site or
// climb the tree is rejected, and plain library paths pass through untouched.
describe('safeReturnPath', () => {
  it('accepts a plain document path inside the library', () => {
    expect(safeReturnPath('/workflows/private/e8/company-os-core-strategy.html')).toBe(
      '/workflows/private/e8/company-os-core-strategy.html',
    )
    expect(safeReturnPath('/workflows/private/e8/open-source-system')).toBe(
      '/workflows/private/e8/open-source-system',
    )
  })

  it('rejects empty and non-library paths', () => {
    expect(safeReturnPath(null)).toBeNull()
    expect(safeReturnPath(undefined)).toBeNull()
    expect(safeReturnPath('')).toBeNull()
    expect(safeReturnPath('/admin')).toBeNull()
    expect(safeReturnPath('workflows/private/e8/x.html')).toBeNull()
  })

  it('rejects anything that could leave the site', () => {
    expect(safeReturnPath('//evil.example/workflows/private/')).toBeNull()
    expect(safeReturnPath('https://evil.example/workflows/private/')).toBeNull()
    expect(safeReturnPath('/workflows/private/\\evil.example')).toBeNull()
  })

  it('rejects traversal segments', () => {
    expect(safeReturnPath('/workflows/private/../admin')).toBeNull()
    expect(safeReturnPath('/workflows/private/./e8')).toBeNull()
  })
})

describe('unlockRedirectTarget', () => {
  it('carries a valid requested path as an encoded next parameter', () => {
    expect(unlockRedirectTarget('/workflows/private/e8/', '/workflows/private/e8/a-doc.html')).toBe(
      '/workflows/private/e8/?next=%2Fworkflows%2Fprivate%2Fe8%2Fa-doc.html',
    )
  })

  it('drops an invalid requested path and returns the bare index', () => {
    expect(unlockRedirectTarget('/workflows/private/', '//evil.example/x')).toBe('/workflows/private/')
  })
})
