import { container } from "@sapphire/pieces";
import { ManagerOptions } from "../Typings/index.js";
import { LanguageStore } from "../Stores/LanguageStore.js";

export class i18nManager {
    public options: ManagerOptions;
    public stores: typeof container.stores;

    public constructor(options: ManagerOptions) {
        this.options = options;
        this.stores = options.stores ??= container.stores;

        this.stores.register(new LanguageStore());
        this.stores.registerPath(this.options.baseDirectory);
    }
}
