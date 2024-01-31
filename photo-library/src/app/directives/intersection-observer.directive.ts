import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { Observable, Subscription, debounceTime, distinctUntilChanged } from 'rxjs'

@Directive({
  selector: '[appObserveElement]',
  exportAs: 'intersection',
  standalone: true
})
export class IntersectionListenerDirective implements OnInit, AfterViewInit, OnDestroy {
  @Input() threshold = 0.9
  @Input() debounceTime = 500
  @Input() isContinuous = false

  @Output() isIntersecting = new EventEmitter<boolean>()

  _isIntersecting = false
  subscription!: Subscription;
  private hasLoadedData = false;

  private observer = new MutationObserver(() => this.createAndObserve());

  constructor (private element: ElementRef) {}

  ngOnInit () {}

  ngAfterViewInit() {
    this.subscription = this.createAndObserve();
    this.registerListenerForDomChanges();
  }

  ngOnDestroy () {
    this.subscription.unsubscribe();
    this.observer.disconnect();
  }

  createAndObserve () {
    const options: IntersectionObserverInit = {
      threshold: this.threshold,
    }

    return new Observable<any>(subscriber => {
      const intersectionObserver = new IntersectionObserver(entries => {
        const { isIntersecting } = entries[0]
        this.hasLoadedData = false;
        subscriber.next({isIntersecting, entry: entries[0]})

        isIntersecting &&
          !this.isContinuous &&
          intersectionObserver.disconnect()
      }, options)

      const lastElementInLastRow = this.getLastElementInGrid();
      if (lastElementInLastRow === undefined) return

      intersectionObserver.observe(lastElementInLastRow);

      return {
        unsubscribe () {
          intersectionObserver.disconnect()
        },
      }
    })
      .pipe(debounceTime(this.debounceTime), distinctUntilChanged((previous, current) => {
        return previous === current
      }))
      .subscribe(status => {
        if (status?.isIntersecting) {
          this.isIntersecting.emit(status)
        }
      })
  }

  private registerListenerForDomChanges() {
		const attributes = false;
		const childList = true;
		const subtree = true;
		this.observer.observe(this.element.nativeElement, { attributes, childList, subtree });
	}

  private getLastElementInGrid(): Element {
    // Get the photo-list-container element
    const container = document.querySelector('.content') as HTMLElement;

    // Get all the items in the grid
    const items = container.querySelectorAll('.item');

    const lastElement = items[items.length -1];

    return lastElement;
  }
}
