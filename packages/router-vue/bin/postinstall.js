import { switchVersion } from './utils.js';

let version = 0;
try {
    const vue = await import('vue');
    version = vue.version;
} catch (error) {}

if (!version || typeof version !== 'string') {
    console.warn(
        '[@gen.router] Vue is not found. Please run "npm install vue" to install.'
    );
} else if (version.startsWith('2.7.')) {
    await switchVersion(2);
} else if (version.startsWith('3.')) {
    await switchVersion(3);
} else {
    console.warn(`[@gen.router] Vue version ${version} is not supported.`);
}
