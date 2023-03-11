import { container } from "@sapphire/pieces";
import { ManagerOptions } from "../Typings/index.js";
import { LanguageStore } from "../Stores/LanguageStore.js";

export class i18nManager {
    public options: ManagerOptions;
    public stores: typeof container.stores;

    public constructor(options: ManagerOptions) {
        this.options = options;
        this.stores = options.stores ??= container.stores;
        container.i18nManager = this;

        this.stores.register(new LanguageStore());
        this.stores.registerPath(this.options.baseDirectory);
    }

    public get languages(): string[] {
        return [...new Set(this.stores.get("languages").map(x => x.name.split("/")[0]).map(x => x))];
    }
}

declare module "@sapphire/pieces" {
    interface Container {
        i18nManager: i18nManager;
    }

    interface StoreRegistryEntries {
        languages: LanguageStore;
    }
}
