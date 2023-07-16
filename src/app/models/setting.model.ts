export interface Setting {
  id: number;
  login: string;
  password: string;
  activations: Activation[];
}

export interface Activation {
  tag: string;
  tab: string;
  activeItemIndexes: number[];
}
