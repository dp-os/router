import { describe, it } from 'vitest';

import { isPathWithProtocolOrDomain, normalizeLocation } from './path';

// console.log(normalizeLocation({ path: '/' }));

// console.log(isPathWithProtocolOrDomain('/'));
// console.log(isPathWithProtocolOrDomain('www.a.b'));
// console.log(isPathWithProtocolOrDomain('a.b.cm'));
// console.log(isPathWithProtocolOrDomain('http://a.cn'));
// console.log(isPathWithProtocolOrDomain('a.b/path'));

describe('testing normalizeLocation', () => {
    it('testing normal domain', ({ expect }) => {
        expect(
            normalizeLocation(
                'http://localhost:5173/en/en/en/en/en',
                'http://localhost:5173/en/'
            ).path
        ).toBe('/en/en/en/en');
    });
});
