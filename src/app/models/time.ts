export interface Time {
  label: TimeLabel;
  value: TimeValue;
}

export enum TimeLabel {
  ONE = '×1',
  TWO = '×2',
  THREE = '×3',
}

export enum TimeValue {
  ONE = 5,
  TWO = 10,
  THREE = 15,
}

export const timeBetween = 5;
