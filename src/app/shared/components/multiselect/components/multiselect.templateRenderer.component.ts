import {
    Component, OnInit, Input, EmbeddedViewRef,
    ViewContainerRef, OnDestroy
} from '@angular/core';

@Component({
    selector: 'c-templateRenderer',
    template: ``
})
export class TemplateRendererComponent implements OnInit, OnDestroy {
    @Input() data: any
    @Input() item: any
    public view: EmbeddedViewRef<any>;

    constructor(public viewContainer: ViewContainerRef) { }

    public ngOnInit(): void {
        this.view = this.viewContainer.createEmbeddedView(this.data.template, {
            '\$implicit': this.data,
            'item': this.item
        });
    }

    public ngOnDestroy(): void {
        this.view.destroy();
    }
}