import { readdir, readFile, stat } from 'node:fs/promises'
import { execSync } from 'node:child_process'
import path from 'node:path'

const repoRoot = process.cwd()
const scanRoots = ['app', 'components']
const allowedExtensions = new Set(['.ts', '.tsx', '.css'])
const forbiddenClasses = ['text-white/40', 'text-white/25']
const rawHexRegex = /#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?\b/g
const lbtaClassRegex = /\blbta-[a-z0-9-]+\b/g
const deprecatedLbtaClasses = new Set(['lbta-primary', 'lbta-coral', 'lbta-coral-dark', 'lbta-bone'])
const rawHexSkipFiles = new Set(['app/globals.css', 'app/embedded-forms.css'])

type Hit = {
  file: string
  line: number
  value: string
}

async function walkFiles(dirPath: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(dirPath)

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry)
    const entryStat = await stat(absolutePath)

    if (entryStat.isDirectory()) {
      await walkFiles(absolutePath, files)
      continue
    }

    const extension = path.extname(entry)
    if (allowedExtensions.has(extension)) {
      files.push(absolutePath)
    }
  }

  return files
}

function getEditedFiles(): string[] {
  try {
    const output = execSync('git diff --name-only -- app components', {
      cwd: repoRoot,
      stdio: ['ignore', 'pipe', 'ignore'],
      encoding: 'utf8',
    })

    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .filter((relativePath) => allowedExtensions.has(path.extname(relativePath)))
      .map((relativePath) => path.join(repoRoot, relativePath))
  } catch {
    return []
  }
}

function gatherLineHits(contents: string, file: string, matcher: RegExp, skip: Set<string> = new Set()): Hit[] {
  const hits: Hit[] = []
  const lines = contents.split('\n')

  lines.forEach((line, index) => {
    const matches = line.match(matcher)
    if (!matches) return

    for (const value of matches) {
      if (skip.has(value.toLowerCase())) continue
      hits.push({
        file,
        line: index + 1,
        value,
      })
    }
  })

  return hits
}

function printHits(title: string, level: 'WARN' | 'ERROR', hits: Hit[], limit = 120) {
  if (hits.length === 0) return

  console.log(title)
  const visible = hits.slice(0, limit)

  for (const hit of visible) {
    console.log(`  ${level} ${hit.file}:${hit.line} -> ${hit.value}`)
  }

  if (hits.length > visible.length) {
    console.log(`  ... ${hits.length - visible.length} more`)
  }

  console.log('')
}

async function main() {
  const scanAll = process.argv.includes('--all')
  const editedFiles = scanAll ? [] : getEditedFiles()
  const files: string[] = []

  if (editedFiles.length > 0) {
    files.push(...editedFiles)
  } else {
    for (const root of scanRoots) {
      const absoluteRoot = path.join(repoRoot, root)
      const rootFiles = await walkFiles(absoluteRoot)
      files.push(...rootFiles)
    }
  }

  const forbiddenHits: Hit[] = []
  const rawHexHits: Hit[] = []
  const legacyLbtaHits: Hit[] = []

  for (const file of files) {
    const relativeFile = path.relative(repoRoot, file)
    const contents = await readFile(file, 'utf8')
    const extension = path.extname(relativeFile)

    for (const forbiddenClass of forbiddenClasses) {
      const escaped = forbiddenClass.replace('/', '\\/')
      const matcher = new RegExp(`\\b${escaped}\\b`, 'g')
      forbiddenHits.push(...gatherLineHits(contents, relativeFile, matcher))
    }

    if (!rawHexSkipFiles.has(relativeFile)) {
      rawHexHits.push(
        ...gatherLineHits(contents, relativeFile, rawHexRegex, new Set(['#fff', '#ffffff', '#000', '#000000'])),
      )
    }

    if (extension !== '.css') {
      legacyLbtaHits.push(...gatherLineHits(contents, relativeFile, lbtaClassRegex))
    }
  }

  const filteredLegacyLbtaHits = legacyLbtaHits.filter((hit) => deprecatedLbtaClasses.has(hit.value))

  printHits('Legacy lbta-* classes found (warning):', 'WARN', filteredLegacyLbtaHits)
  printHits('Raw hex usage found (warning):', 'WARN', rawHexHits)
  printHits('Forbidden low-contrast white text classes found (error):', 'ERROR', forbiddenHits)

  const isStrict = process.env.STRICT_BRAND_CHECK === '1'
  if (isStrict && forbiddenHits.length > 0) {
    process.exitCode = 1
    return
  }

  if (forbiddenHits.length > 0) {
    console.log('Brand usage checks completed with warnings. Set STRICT_BRAND_CHECK=1 to enforce blocking mode.')
    return
  }

  if (editedFiles.length > 0 && !scanAll) {
    console.log(`Brand usage checks passed for ${editedFiles.length} edited files.`)
    return
  }

  console.log('Brand usage checks passed.')
}

main().catch((error) => {
  console.error('Brand usage check failed unexpectedly.')
  console.error(error)
  process.exitCode = 1
})
