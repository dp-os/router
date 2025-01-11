import fs from 'node:fs';
import path from 'node:path';

const dir = import.meta.dirname;

// 定义源文件夹和目标文件夹的路径
const vue2Dir = path.resolve(dir, './packages/router-vue2/dist');
const vue3Dir = path.resolve(dir, './packages/router-vue3/dist');
const targetDir = path.resolve(dir, './packages/router-vue/lib');
const vue2TargetDir = path.resolve(dir, './packages/router-vue/lib/v2');
const vue3TargetDir = path.resolve(dir, './packages/router-vue/lib/v3');

// 定义一个函数来复制文件夹
function copyFolder(sourceDir, targetDir) {
    // 检查目标文件夹是否存在，如果不存在则创建
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    // 读取源文件夹中的所有文件和子文件夹
    fs.readdir(sourceDir, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Error reading source directory:', err);
            return;
        }

        entries.forEach((entry) => {
            const sourcePath = path.join(sourceDir, entry.name);
            const destPath = path.join(targetDir, entry.name);

            if (entry.isDirectory()) {
                // 如果是文件夹，则递归复制
                copyFolder(sourcePath, destPath);
            } else {
                // 如果是文件，则直接复制
                fs.copyFile(sourcePath, destPath, (err) => {
                    if (err) {
                        console.error('Error copying file:', err);
                    }
                });
            }
        });
    });
}

// 使用函数复制文件夹
copyFolder(vue2Dir, targetDir);
copyFolder(vue2Dir, vue2TargetDir);
copyFolder(vue3Dir, vue3TargetDir);
