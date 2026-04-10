import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()
const roots = ['app', 'components']
const extensions = new Set(['.ts', '.tsx'])

const replacements: Array<[RegExp, string]> = [
  [/\blbta-primary\b/g, 'brand-pacific-dusk'],
  [/\blbta-coral-dark\b/g, 'brand-thousand-steps'],
  [/\blbta-coral\b/g, 'brand-sunset-cliff'],
  [/\blbta-bone\b/g, 'brand-morning-light'],
]

async function walkFiles(targetDir: string, files: string[] = []): Promise<string[]> {
  const entries = await readdir(targetDir)
  for (const entry of entries) {
    const absolutePath = path.join(targetDir, entry)
    const entryStat = await stat(absolutePath)

    if (entryStat.isDirectory()) {
      await walkFiles(absolutePath, files)
      continue
    }

    if (extensions.has(path.extname(entry))) {
      files.push(absolutePath)
    }
  }
  return files
}

async function main() {
  const files: string[] = []
  for (const root of roots) {
    await walkFiles(path.join(repoRoot, root), files)
  }

  let changedFiles = 0
  let replacementCount = 0

  for (const file of files) {
    const original = await readFile(file, 'utf8')
    let next = original

    for (const [matcher, value] of replacements) {
      const matches = next.match(matcher)
      if (matches) {
        replacementCount += matches.length
        next = next.replace(matcher, value)
      }
    }

    if (next !== original) {
      changedFiles += 1
      await writeFile(file, next, 'utf8')
      console.log(`Updated ${path.relative(repoRoot, file)}`)
    }
  }

  console.log(`\nDone. Updated ${changedFiles} files with ${replacementCount} replacements.`)
}

main().catch((error) => {
  console.error('Failed to apply token replacements.')
  console.error(error)
  process.exitCode = 1
})
