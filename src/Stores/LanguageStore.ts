import { AliasStore } from "@sapphire/pieces";
import { LanguagePiece } from "./LanguagePiece.js";

export class LanguageStore extends AliasStore<LanguagePiece> {
    public constructor() {
        super(LanguagePiece, { name: "languages" });
    }
}
