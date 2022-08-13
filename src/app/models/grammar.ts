import { Adjective } from "./adjective";
import { Adverb } from "./adverb";
import { Conjunction } from "./conjunction";
import { Noun } from "./noun";
import { Phrase } from "./phrase";
import { Verb } from "./verb";

export type Grammar = Adverb | Verb | Noun | Adjective | Conjunction | Phrase;
