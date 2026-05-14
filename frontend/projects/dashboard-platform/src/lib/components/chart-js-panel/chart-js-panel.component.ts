import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  booleanAttribute,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { ViamChartCardComponent } from 'white-label-ui';

import { type ChartData } from '../../models';

@Component({
  selector: 'viam-platform-chart-js-panel',
  standalone: true,
  imports: [ViamChartCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chart-js-panel.component.html',
  styleUrl: './chart-js-panel.component.scss',
})
export class ChartJsPanelComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() data: ChartData = { labels: [], series: [] };
  @Input({ transform: booleanAttribute }) compact = false;

  @ViewChild('canvas') private readonly canvas?: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(_: SimpleChanges): void {
    this.renderChart();
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    const canvas = this.canvas?.nativeElement;

    if (!canvas) {
      return;
    }

    this.chart?.destroy();
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: [...this.data.labels],
        datasets: this.data.series.map((series) => ({
          label: series.label,
          data: [...series.values],
          borderColor: series.color,
          backgroundColor: `${series.color}22`,
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 3,
          tension: 0.4,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#c7d0da',
              boxHeight: 3,
              boxWidth: 18,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#8793a0',
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)',
            },
            ticks: {
              color: '#8793a0',
            },
          },
        },
      },
    });
  }
}
