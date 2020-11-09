import { Directive, ElementRef, Input, TemplateRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[app-collapsible-tab]',
  exportAs: 'collapsibleTab',
})
export class CollapsibleTabDirective {
  @Input() title: string;
  @Input() icon: string;

  /** Optional: provide an Id to know when a tab open is triggered */
  @Input() itemId: string;


  constructor(
    public templateRef: TemplateRef<any>,
  ) {}
}
