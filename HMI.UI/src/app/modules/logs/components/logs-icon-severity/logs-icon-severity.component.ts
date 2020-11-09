import { Component, Input, OnInit } from '@angular/core';
import { LogSeverity } from '../../services/logs.service';

@Component({
  selector: 'app-logs-icon-severity',
  templateUrl: './logs-icon-severity.component.html',
  styleUrls: ['./logs-icon-severity.component.scss']
})
export class LogsIconSeverityComponent implements OnInit {

  @Input() severity: LogSeverity;
  @Input() sizeClass: 'small' | 'medium' | 'large' = 'small';

  constructor() { }

  ngOnInit(): void {
  }

  getSeverityIcon(): string {
    if (this.severity === 'info') {
      return 'abb/information-circle-1';
    }
    if (this.severity === 'warn') {
      return 'abb/warning-circle-1';
    }
    return 'abb/error-circle-1';
  }

  getSeverityClass() {
    return {
      info: this.severity === 'info',
      warn: this.severity === 'warn',
      error: this.severity === 'error',
    };
  }

}
