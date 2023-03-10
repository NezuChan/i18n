import { StoreRegistry } from "@sapphire/pieces";
import { Awaitable } from "@sapphire/utilities";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface ManagerOptions {
    fetchLanguage?: <T>(identifier: string) => Awaitable<T>;
    baseDirectory?: string;
    stores?: StoreRegistry;
}

export interface ILanguagePiece { }
