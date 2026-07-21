import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillsRoot = path.join(__dirname, '../skills');

let hasError = false;
let checkedSkillsCount = 0;
const errors = [];
const warnings = [];

// Helper functions for logging
function logError(message) {
    console.error(`❌ ${message}`);
    errors.push(message);
    hasError = true;
}

function logWarning(message) {
    console.warn(`⚠️  ${message}`);
    warnings.push(message);
}

function logSuccess(message) {
    console.log(`✅ ${message}`);
}

function isValidName(name) {
    // 1-64 characters, lowercase alphanumeric and hyphens, no starting/ending hyphen, no consecutive hyphens
    if (name.length < 1 || name.length > 64) return false;
    return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

function isValidFileName(name) {
    // 1-100 characters, lowercase alphanumeric, hyphens, and dots allowed. Must not start/end with dot or hyphen.
    if (name.length < 1 || name.length > 100) return false;
    return /^[a-z0-9]+([.-][a-z0-9]+)*$/.test(name);
}

function extractMarkdownLinks(text) {
    const links = [];
    // Match [label](url) and ![alt](url)
    const regex = /!?\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        links.push(match[2].trim());
    }
    return links;
}

function validateMarkdownLinks(filePath, skillPath, fileContent, fileNameForLog) {
    const currentFileDir = path.dirname(filePath);
    const links = extractMarkdownLinks(fileContent);
    const relativePathToFile = path.relative(skillsRoot, filePath).replace(/\\/g, '/');
    
    links.forEach(link => {
        // Ignore external links and anchors
        if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('#')) {
            return;
        }
        
        if (link.includes('\\')) {
            logError(`Link "${link}" in "${relativePathToFile}" uses backslashes. Always use forward slashes for relative links.`);
            return;
        }
        
        // Resolve link relative to the containing file's directory
        let resolvedPath = path.resolve(currentFileDir, link);
        let normalizedResolved = resolvedPath.replace(/\\/g, '/');
        const normalizedSkillPath = skillPath.replace(/\\/g, '/');
        
        if (normalizedResolved !== normalizedSkillPath && !normalizedResolved.startsWith(normalizedSkillPath + '/')) {
            // Check fallback: resolve relative to skill root (for scripts/ or references/ referenced in deep folders)
            const fallbackPath = path.resolve(skillPath, link);
            const normalizedFallback = fallbackPath.replace(/\\/g, '/');
            if (normalizedFallback === normalizedSkillPath || normalizedFallback.startsWith(normalizedSkillPath + '/')) {
                resolvedPath = fallbackPath;
                normalizedResolved = normalizedFallback;
            } else {
                logError(`Link "${link}" in "${relativePathToFile}" resolves outside of the skill directory.`);
                return;
            }
        }
        
        if (!fs.existsSync(resolvedPath)) {
            // Check fallback: resolve relative to skill root if it was not resolved that way already
            const fallbackPath = path.resolve(skillPath, link);
            if (fs.existsSync(fallbackPath)) {
                resolvedPath = fallbackPath;
            } else {
                logError(`Link "${link}" in "${relativePathToFile}" points to a non-existent file: "${link}"`);
                return;
            }
        }
        
        // Warn if deeper than one level from skill root
        const relFromSkill = path.relative(skillPath, resolvedPath).replace(/\\/g, '/');
        const parts = relFromSkill.split('/');
        if (parts.length > 2) {
            logWarning(`Link "${link}" in "${relativePathToFile}" is nested ${parts.length - 1} levels deep. The specification recommends keeping file references one level deep from the skill root.`);
        }
    });
}

function checkInteractivePrompts(content, ext, fileLogName) {
    const matches = [];
    if (ext === '.py') {
        const regex = /\b(input|raw_input)\s*\(/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push(match[0]);
        }
    } else if (ext === '.sh') {
        const regex = /\b(read)\b/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push(match[0]);
        }
    } else if (ext === '.js' || ext === '.ts') {
        const regex = /\b(prompt|confirm)\s*\(|readline\.createInterface/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            matches.push(match[0]);
        }
    }
    
    if (matches.length > 0) {
        logError(`Script "${fileLogName}" contains potential interactive prompts: ${matches.join(', ')}. Scripts in skills must be non-interactive.`);
    }
}

function checkPythonPEP723(content, fileLogName) {
    const startRegex = /^[ \t]*#[ \t]*\/\/\/[ \t]*script[ \t]*$/m;
    const endRegex = /^[ \t]*#[ \t]*\/\/\/[ \t]*$/m;
    
    const startMatch = content.match(startRegex);
    if (startMatch) {
        const startIndex = startMatch.index;
        const remaining = content.slice(startIndex + startMatch[0].length);
        const endMatch = remaining.match(endRegex);
        if (!endMatch) {
            logError(`Script "${fileLogName}" contains PEP 723 start block "# /// script" but lacks a closing "# ///" block.`);
        }
    }
}

function validateReferences(refPath, skillPath) {
    const files = fs.readdirSync(refPath);
    const relativeRefDir = path.relative(skillsRoot, refPath).replace(/\\/g, '/');
    
    files.forEach(file => {
        const filePath = path.join(refPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            logWarning(`Found subdirectory "${file}" in "${relativeRefDir}". Keeping files flat in the references directory is recommended.`);
            validateReferences(filePath, skillPath);
            return;
        }
        
        const ext = path.extname(file).toLowerCase();
        if (ext !== '.md' && ext !== '.markdown') {
            logWarning(`Reference file "${file}" in "${relativeRefDir}" is not a markdown file. References should typically be markdown.`);
        }
        
        const basename = path.basename(file, ext);
        if (!isValidFileName(basename)) {
            logError(`Reference filename "${file}" in "${relativeRefDir}" must be lowercase kebab-case (alphanumeric, hyphens, and dots allowed).`);
        }
        
        const rawContent = fs.readFileSync(filePath, 'utf8');
        let parsed;
        try {
            parsed = matter(rawContent);
        } catch (err) {
            logError(`Reference file "${file}" in "${relativeRefDir}" has invalid frontmatter: ${err.message}`);
            return;
        }
        
        const data = parsed.data;
        const content = parsed.content;
        
        // If frontmatter properties exist, validate them
        if (data.name) {
            if (typeof data.name !== 'string' || !isValidName(data.name)) {
                logError(`Reference "${file}" frontmatter "name" ("${data.name}") must be lowercase kebab-case.`);
            }
        }
        if (data.description) {
            if (typeof data.description !== 'string' || data.description.trim().length === 0) {
                logError(`Reference "${file}" frontmatter "description" must be a non-empty string.`);
            }
        }
        
        validateMarkdownLinks(filePath, skillPath, content, file);
    });
}

function validateScripts(scriptPath, skillPath) {
    const files = fs.readdirSync(scriptPath);
    const relativeScriptDir = path.relative(skillsRoot, scriptPath).replace(/\\/g, '/');
    
    files.forEach(file => {
        const filePath = path.join(scriptPath, file);
        const stat = fs.statSync(filePath);
        const fileLogName = path.join(relativeScriptDir, file).replace(/\\/g, '/');
        
        if (stat.isDirectory()) {
            logWarning(`Found subdirectory "${file}" in "${relativeScriptDir}". Scripts are usually kept flat in the scripts folder.`);
            validateScripts(filePath, skillPath);
            return;
        }
        
        const ext = path.extname(file).toLowerCase();
        const basename = path.basename(file, ext);
        
        if (!isValidFileName(basename)) {
            logError(`Script filename "${file}" in "${relativeScriptDir}" must be lowercase kebab-case (alphanumeric, hyphens, and dots allowed).`);
        }
        
        const commonExts = ['.py', '.sh', '.js', '.ts', '.rb', '.ps1', '.bat'];
        if (!commonExts.includes(ext)) {
            logWarning(`Script "${file}" in "${relativeScriptDir}" has uncommon extension "${ext}". Common options include Python, Bash, and JavaScript.`);
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/);
        
        if (ext === '.sh') {
            if (lines.length === 0 || !lines[0].startsWith('#!')) {
                logWarning(`Shell script "${fileLogName}" is missing a shebang (e.g. #!/bin/bash).`);
            }
        }
        
        checkInteractivePrompts(content, ext, fileLogName);
        
        if (ext === '.py') {
            checkPythonPEP723(content, fileLogName);
        }
    });
}

function validateAssets(assetsPath, skillPath) {
    const files = fs.readdirSync(assetsPath);
    const relativeAssetsDir = path.relative(skillsRoot, assetsPath).replace(/\\/g, '/');
    
    files.forEach(file => {
        const filePath = path.join(assetsPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            validateAssets(filePath, skillPath);
            return;
        }
        
        const ext = path.extname(file).toLowerCase();
        const basename = path.basename(file, ext);
        if (!isValidFileName(basename)) {
            logError(`Asset filename "${file}" in "${relativeAssetsDir}" must be lowercase kebab-case (alphanumeric, hyphens, and dots allowed).`);
        }
    });
}

function validateGeneralFilesNaming(skillPath, skillMdFile) {
    const entries = fs.readdirSync(skillPath);
    const skillDirName = path.basename(skillPath);
    
    entries.forEach(entry => {
        const fullPath = path.join(skillPath, entry);
        const stat = fs.statSync(fullPath);
        
        if (entry === skillMdFile) return;
        if (entry.toUpperCase() === 'LICENSE' || entry.toUpperCase() === 'LICENSE.TXT' || entry.toUpperCase() === 'README.MD') return;
        
        const ext = stat.isDirectory() ? '' : path.extname(entry).toLowerCase();
        const namePart = stat.isDirectory() ? entry : path.basename(entry, ext);
        
        if (!isValidFileName(namePart)) {
            logError(`File/folder "${entry}" in skill "${skillDirName}" has invalid name formatting. Use lowercase kebab-case (alphanumeric, hyphens, and dots allowed).`);
        }
    });
}

function validateSkill(skillDirName) {
    const skillPath = path.join(skillsRoot, skillDirName);
    const errorsBefore = errors.length;
    
    if (!isValidName(skillDirName)) {
        logError(`Skill directory name "${skillDirName}" is invalid. Must be lowercase kebab-case (1-64 chars).`);
        return;
    }
    
    checkedSkillsCount++;
    console.log(`\nAnalyzing skill: ${skillDirName}`);
    
    let skillMdFile = null;
    const entries = fs.readdirSync(skillPath);
    for (const entry of entries) {
        if (entry.toUpperCase() === 'SKILL.MD') {
            skillMdFile = entry;
            break;
        }
    }
    
    if (!skillMdFile) {
        logError(`Skill "${skillDirName}" is missing a SKILL.md or skill.md entrypoint.`);
        return;
    }
    
    const skillMdPath = path.join(skillPath, skillMdFile);
    const skillMdRaw = fs.readFileSync(skillMdPath, 'utf8');
    
    let parsed;
    try {
        parsed = matter(skillMdRaw);
    } catch (err) {
        logError(`${skillMdFile} in "${skillDirName}" has invalid frontmatter YAML syntax: ${err.message}`);
        return;
    }
    
    const data = parsed.data;
    const content = parsed.content;
    
    // Validate frontmatter properties
    if (!data.name) {
        logError(`${skillMdFile} in "${skillDirName}" is missing "name" in frontmatter.`);
    } else {
        if (typeof data.name !== 'string') {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "name" must be a string.`);
        } else if (!isValidName(data.name)) {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "name" "${data.name}" is invalid (must be lowercase kebab-case, 1-64 chars).`);
        } else if (data.name !== skillDirName) {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "name" ("${data.name}") must match parent directory name ("${skillDirName}").`);
        }
    }
    
    if (!data.description) {
        logError(`${skillMdFile} in "${skillDirName}" is missing "description" in frontmatter.`);
    } else {
        if (typeof data.description !== 'string') {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "description" must be a string.`);
        } else if (data.description.trim().length === 0) {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "description" cannot be empty.`);
        } else if (data.description.length > 1024) {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "description" exceeds 1024 characters (current: ${data.description.length}).`);
        }
    }
    
    if (data.hasOwnProperty('license') && typeof data.license !== 'string') {
        logError(`${skillMdFile} in "${skillDirName}" frontmatter "license" must be a string if provided.`);
    }
    
    if (data.hasOwnProperty('compatibility')) {
        if (typeof data.compatibility !== 'string') {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "compatibility" must be a string if provided.`);
        } else if (data.compatibility.length > 500) {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "compatibility" exceeds 500 characters.`);
        }
    }
    
    if (data.hasOwnProperty('metadata')) {
        if (typeof data.metadata !== 'object' || data.metadata === null || Array.isArray(data.metadata)) {
            logError(`${skillMdFile} in "${skillDirName}" frontmatter "metadata" must be a key-value mapping if provided.`);
        } else {
            for (const [k, v] of Object.entries(data.metadata)) {
                if (typeof v !== 'string') {
                    logError(`${skillMdFile} in "${skillDirName}" frontmatter metadata key "${k}" has a non-string value.`);
                }
            }
        }
    }
    
    if (data.hasOwnProperty('allowed-tools') && typeof data['allowed-tools'] !== 'string') {
        logError(`${skillMdFile} in "${skillDirName}" frontmatter "allowed-tools" must be a string if provided.`);
    }
    
    const lines = skillMdRaw.split(/\r?\n/);
    if (lines.length > 500) {
        logWarning(`${skillMdFile} in "${skillDirName}" exceeds the recommended 500 lines limit (current: ${lines.length} lines). Consider moving detailed materials to references.`);
    }
    
    validateMarkdownLinks(skillMdPath, skillPath, content, skillMdFile);
    
    const refPath = path.join(skillPath, 'references');
    if (fs.existsSync(refPath) && fs.statSync(refPath).isDirectory()) {
        validateReferences(refPath, skillPath);
    }
    
    const scriptPath = path.join(skillPath, 'scripts');
    if (fs.existsSync(scriptPath) && fs.statSync(scriptPath).isDirectory()) {
        validateScripts(scriptPath, skillPath);
    }

    const assetsPath = path.join(skillPath, 'assets');
    if (fs.existsSync(assetsPath) && fs.statSync(assetsPath).isDirectory()) {
        validateAssets(assetsPath, skillPath);
    }
    
    validateGeneralFilesNaming(skillPath, skillMdFile);
    
    // Log success only if this skill has no errors
    if (errors.length === errorsBefore) {
        logSuccess(`Skill "${skillDirName}" is valid.`);
    }
}

// Entry Point
if (!fs.existsSync(skillsRoot)) {
    console.error(`❌ Skills root directory does not exist at: ${skillsRoot}`);
    process.exit(1);
}

const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && entry.name !== '.git')
    .map(entry => entry.name);

console.log(`Validating ${skillDirs.length} skill(s) in: ${skillsRoot}\n`);

skillDirs.forEach(skillDir => {
    validateSkill(skillDir);
});

console.log(`\n--------------------------------------------`);
console.log(`Validation Summary:`);
console.log(`Skills Checked: ${checkedSkillsCount}`);
console.log(`Total Errors: ${errors.length}`);
console.log(`Total Warnings: ${warnings.length}`);
console.log(`--------------------------------------------`);

if (hasError) {
    console.error(`\n❌ Validation failed. Fix the errors above.`);
    process.exit(1);
} else {
    console.log(`\n✅ All skill(s) successfully validated.`);
    process.exit(0);
}