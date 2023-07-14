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
  ONE = 4,
  TWO = 7,
  THREE = 10,
}

export const timeBetween = 3;
