const fs = require('fs')
const path = require('path')

const TARGET_DIR = path.join(__dirname, '../src/app/(frontend)/posts')
const TARGET_FILENAME = 'page.tsx'
const FORCE_DYNAMIC_LINE = `export const dynamic = 'force-dynamic'\n`

function addForceDynamicToFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  if (content.includes(FORCE_DYNAMIC_LINE.trim())) {
    return // Already present
  }
  const newContent = FORCE_DYNAMIC_LINE + content
  fs.writeFileSync(filePath, newContent, 'utf8')
  console.log(`Updated: ${filePath}`)
}

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      walk(fullPath)
    } else if (entry.isFile() && entry.name === TARGET_FILENAME) {
      addForceDynamicToFile(fullPath)
    }
  })
}

walk(TARGET_DIR)
console.log('Done!')
