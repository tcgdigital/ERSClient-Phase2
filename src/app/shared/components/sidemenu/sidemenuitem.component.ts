import {
    Component, ViewEncapsulation,
    Input, Output, EventEmitter
} from '@angular/core';

@Component({
    selector: 'side-menu-item',
    templateUrl: './sidemenuitem.view.html',
    encapsulation: ViewEncapsulation.None
})
export class SideMenuItemComponent {
    @Input() menuItem: any;
    // @Input() child: boolean = false;

    @Output() itemHover = new EventEmitter<any>();
    @Output() toggleMenu = new EventEmitter<any>();
    @Output() menuClick = new EventEmitter<any>();

    public onHoverItem($event): void {
        this.itemHover.emit($event);
    }

    public onToggleMenu($event, item): boolean {
        $event.item = item;
        this.toggleMenu.emit($event);
        return false;
    }

    public onMenuClick($event):void{
        this.menuClick.emit($event);
    }
}