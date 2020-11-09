import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren, ContentChildren, Output, EventEmitter, ViewChild } from '@angular/core';
import { CollapsibleComponent as ABBCollapsibleComponent } from '@abb/abb-common-ux-angular-9/lib/collapsible/collapsible.component';
import { CollapsibleTabDirective } from './collapsible-tab.directive';
import { CollapsibleContainerComponent } from '@abb/abb-common-ux-angular-9/lib/collapsible/collapsible-container/collapsible-container.component';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss']
})
export class CollapsibleComponent implements OnInit, AfterViewInit {

  @Input() onlyOneOpen = true;
  @Input() openFirst = true;

  @Output() selectedItems = new EventEmitter<string[]>();

  @ViewChildren('collapsibleComponent') collapsibleComponents: QueryList<ABBCollapsibleComponent>;
  @ViewChild('collapsibleContainer') collapsibleContainer: CollapsibleContainerComponent;
  @ContentChildren(CollapsibleTabDirective) collapsibleTabDirectives: QueryList<CollapsibleTabDirective>;

  private openedCollapsibleItemId: string;

  constructor() { }

  ngAfterViewInit(): void {
    if (this.onlyOneOpen) {
      this.hackCollapsibleToAllowOnlyOneExpanded();
    }
    if (this.openFirst) {
      setTimeout(() => {
        const firstCollapsible = this.collapsibleComponents.toArray()[0];
        firstCollapsible.openCollapsible();
        this.openedCollapsibleItemId = firstCollapsible.itemId;
      });
    }
  }

  ngOnInit(): void {
  }

  collapsibleClick(event: {
    clicked: ABBCollapsibleComponent;
    parents: ABBCollapsibleComponent[];
  }) {
    /** Due to the 'hackCollapsibleToAllowOnlyOneExpanded' hack this event is triggered twice.
     * - First to close the "opened collapsible", then to open the target one.
     *
     * We need to discard the first event.
     */
    if (event.clicked.itemId === this.openedCollapsibleItemId) {
      return;
    }
    this.openedCollapsibleItemId = event.clicked.itemId;

    /** This should contain something but it's always undefined so we cannot use it
     * this.collapsibleContainer.selectedCollapsibleIds
     */

    // console.log('collapsibleClick', this.collapsibleContainer.selectedCollapsibleIds);
    this.selectedItems.emit([this.openedCollapsibleItemId]);
  }

  private hackCollapsibleToAllowOnlyOneExpanded() {
    type ExtendedCollapsible = ABBCollapsibleComponent & { originalClickHandler: (evt: MouseEvent) => void };
    const extendedCollapsibleComponents = this.collapsibleComponents as QueryList<ExtendedCollapsible>;
    extendedCollapsibleComponents.forEach(collapsible => {
      // we save the original handler in the object as it will be used later
      collapsible.originalClickHandler = collapsible.onClick;
      collapsible.onClick = (evt: MouseEvent) => {
        // we don't close current collapsible unless you click on other collapse
        if (!collapsible.isClosed) { return; }
        /**
         * close the current collapsible
         * notice the event parameter is not the corresponding one (but the other collapsible)
         * but its only used internally for a 'preventDefault'
         */
        extendedCollapsibleComponents.find(x => !x.isClosed)?.originalClickHandler(evt);

        // open current one
        collapsible.originalClickHandler(evt);
      };

    });
  }


}
