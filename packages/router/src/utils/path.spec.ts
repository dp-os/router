import { describe, it } from 'vitest';

import { isPathWithProtocolOrDomain, normalizeLocation } from './path';

console.log(normalizeLocation({ path: '/' }));

console.log(isPathWithProtocolOrDomain('/'));
console.log(isPathWithProtocolOrDomain('www.a.b'));
console.log(isPathWithProtocolOrDomain('a.b.cm'));
console.log(isPathWithProtocolOrDomain('http://a.cn'));
console.log(isPathWithProtocolOrDomain('a.b/path'));
