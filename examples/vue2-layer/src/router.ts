export interface RouteApp {
    mount: () => void;
    destroy: () => void;
}

export type RegisterHandle = (router: Router) => RouteApp;

interface LayerState {
    id: number;
    count: number;
}

export class Router {
    public parent: Router | null = null;
    public app: RouteApp | null = null;
    public ready = false;
    private _map = new Map<string, RegisterHandle>();
    public layerId = 1;
    public active = true;
    public get layers(): LayerState[] {
        return history.state.layers ?? []
    }
    public async init(url: string = location.pathname + location.search, parent?: Router) {
        if (parent) {
            this._map = parent._map;
            this.parent = parent;
        }
        if (parent) {
            this.layerId = this.layers.length + 1;
            parent.active = false;
            this._pushState(url, {
                layers: [
                    ...this.layers,
                    {
                        id: this.layerId,
                        count: 1
                    }
                ]
            });
        } else {
            this._replaceState(url, {
                layers: [
                    {
                        id: this.layerId,
                        count: 1
                    }
                ]
            });
        }
        this.app = this.createApp(this);
        this.app.mount();
        window.addEventListener('popstate', this.onPopstate);
        this.ready = true;
    }
    public push(url: string) {
        const layers = [...this.layers];
        layers[layers.length - 1].count++;

        window.history.pushState({
            layers,
        }, '', url);
    }
    public async pushLayer(url: string) {
        const router = new Router();
        await router.init(url, this);
    }
    public close() {
        const { layers } = this;
        const layer = layers[layers.length - 1];
        if (layer) {
            if (this.parent) {
                history.go(-layer.count);
                this.destroy();
            } else if (layer.count > 1) {
                history.go(-layer.count + 1);
            }
        }
    }
    public registerApp(name: string, handel: RegisterHandle) {
        if (!this.ready) {
            this._map.set(name, handel);
        }
    }
    private createApp(router: Router) {
        return this._map.get('html')!(router);
    }
    public _replaceState(url: string, state: Record<string, any>) {
        history.replaceState(state, '', url);
    }
    public _pushState(url: string, state: Record<string, any>) {
        history.pushState(state, '', url);
    }
    private onPopstate = (ev: PopStateEvent) => {
        if (!this.active) return;
        const layers = ev.state.layers ?? [];
        const layer: LayerState = layers[layers.length - 1];
        if (layer) {
            let cur: Router | null = this;
            if (cur.layerId > layer.id) {
                while (cur && cur.layerId > layer.id) {
                    cur.destroy();
                    cur = cur.parent;
                }
            } else {

            }
            if (cur) {
                cur.active = true;
            }
        }
    }
    public destroy() {
        this.app?.destroy();
        this.app = null;
        window.removeEventListener('popstate', this.onPopstate)
    }
}
