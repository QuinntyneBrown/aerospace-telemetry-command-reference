export interface ChartSeries {
  readonly label: string;
  readonly color: string;
  readonly values: readonly number[];
}

export interface ChartData {
  readonly labels: readonly string[];
  readonly series: readonly ChartSeries[];
}
