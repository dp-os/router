import { Router } from './router';
const time = document.querySelector('time');
setInterval(() => {
    if (time) {
        time.innerText = new Date().toISOString();
    }
}, 1000);

async function init() {
    const router = new Router();
    router.registerApp('html', (router) => {
        let el: HTMLDivElement | null = null;
        return {
            mount() {
                el = document.createElement('div');
                el.classList.add('app-xxxxxxxxxxxxxxxx');
                el.style.cssText = `
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    background: #dcdcdc;
`
                el.innerHTML = `
layers${JSON.stringify(router.layers, null, 4)} <br>
<div class="close">close</div>
<div class="push">push</div>
<div class="pushLayer">pushLayer</div>
`;

                document.body.appendChild(el);
                let count = 0;
                (el.querySelector('.push') as HTMLElement)!.onclick = () => {
                    count++
                    router.push(`/?from=push&count=${count}`);
                };
                (el.querySelector('.pushLayer') as HTMLElement)!.onclick = () => {
                    count++
                    router.pushLayer(`/?from=push&count=${count}`);
                };
                (el.querySelector('.close') as HTMLElement)!.onclick = () => {
                    router.close();
                };
            },
            destroy() {
                console.log('>>>>>> close');
                if (el) {
                    document.body.removeChild(el);
                    el = null;
                }
            }
        };
    });
    await router.init();
}

await init();
