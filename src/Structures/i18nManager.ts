import { Collection } from "@discordjs/collection";
import { Backend, PathResolvable } from "@skyra/i18next-backend";
import { opendir } from "node:fs/promises";
import i18next, { InitOptions, TFunction } from "i18next";
import { join } from "node:path";
import { PathLike } from "node:fs";
import { getRootData } from "@sapphire/pieces";

export class i18nManager {
    public namespaces = new Set<string>();
    public languages = new Collection<string, TFunction>();
    public languagesLoaded = false;

    public constructor(options?: InitOptions, public languagesDirectory = join(getRootData().root, "languages")) {
        void this.init(options);
    }

    // Code taken from https://github.com/sapphiredev/plugins/blob/bc91d27cfaf09906a45641516e880b37909e11a4/packages/i18next/src/lib/InternationalizationHandler.ts#L200
    public async walkRootDirectory(directory: PathLike): Promise<{ namespaces: string[]; languages: string[] }> {
        const languages = new Set<string>();
        const namespaces = new Set<string>();

        const dir = await opendir(directory);
        for await (const entry of dir) {
            if (!entry.isDirectory()) continue;

            languages.add(entry.name);

            for await (const namespace of this.walkLocaleDirectory(join(dir.path, entry.name), "")) {
                namespaces.add(namespace);
            }
        }

        return { namespaces: [...namespaces], languages: [...languages] };
    }

    public getLanguage(locale: string): TFunction | undefined {
        return this.languages.get(locale);
    }

    private async init(options?: InitOptions): Promise<void> {
        const { namespaces, languages } = await this.walkRootDirectory(this.languagesDirectory);

        const languagePaths = new Set<PathResolvable>([
            join(this.languagesDirectory, "{{lng}}", "{{ns}}.json"),
            ...options?.backend?.paths ?? []
        ]);

        const backend = {
            paths: [...languagePaths],
            ...options?.backend ?? {}
        };

        i18next.use(Backend);
        await i18next.init({
            backend,
            initImmediate: false,
            load: "all",
            defaultNS: "default",
            ns: namespaces,
            preload: languages,
            ...options
        });

        this.namespaces = new Set(namespaces);
        for (const item of languages) {
            this.languages.set(item, i18next.getFixedT(item));
        }
        this.languagesLoaded = true;
    }

    // Code taken from https://github.com/sapphiredev/plugins/blob/bc91d27cfaf09906a45641516e880b37909e11a4/packages/i18next/src/lib/InternationalizationHandler.ts#L245
    private async * walkLocaleDirectory(directory: string, ns: string): AsyncGenerator<string> {
        const dir = await opendir(directory);
        for await (const entry of dir) {
            if (entry.isDirectory()) {
                yield * this.walkLocaleDirectory(join(dir.path, entry.name), `${ns}${entry.name}/`);
            } else if (entry.isFile() && entry.name.endsWith(".json")) {
                yield `${ns}${entry.name.slice(0, -5)}`;
            }
        }
    }
}
