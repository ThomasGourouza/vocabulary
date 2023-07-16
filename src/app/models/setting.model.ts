export interface Account {
  id: number;
  login: string;
  password: string;
}

export interface Setting {
  account_id: number;
  tag: string;
  tab: string;
  activeItemIndexes: number[];
}
