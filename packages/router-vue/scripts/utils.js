import fs from 'fs';
import path from 'path';

async function copyFolderRecursively(src, dest) {
    await fs.promises.mkdir(dest, { recursive: true });

    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            await copyFolderRecursively(srcPath, destPath);
        } else {
            await fs.promises.copyFile(srcPath, destPath);
        }
    }
}

async function copy(version) {
    const dest = path.resolve('./lib')
    const src = path.join(dest, `v${version}`)

    // unlink for pnpm
    try {
        fs.unlinkSync(dir)
        fs.unlinkSync(dest)
    } catch (error) { }

    // await fs.promises.cp(src, dest)
    await copyFolderRecursively(src, dest)
}

async function switchVersion(version) {
    console.log(`[@gen.router] Switching to v${version}`)
    await copy(version)
}


export { switchVersion };
