/* eslint-disable @typescript-eslint/no-empty-interface */
import { AliasPiece, AliasPieceOptions } from "@sapphire/pieces";
import { ILanguagePiece } from "../Typings/index.js";

export class LanguagePiece<O extends LanguageOptions = LanguageOptions> extends AliasPiece<O> implements ILanguagePiece {
    public constructor(context: AliasPiece.Context, options: LanguageOptions) {
        super(context, options);
    }
}


export interface LanguageOptions extends AliasPieceOptions { }
