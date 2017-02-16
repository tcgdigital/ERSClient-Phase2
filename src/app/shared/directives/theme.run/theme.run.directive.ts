import { Directive, HostBinding, OnInit } from '@angular/core';

import { ThemeConfigProviderService } from '../../services';
import { isMobile } from '../../constants';

@Directive({
    selector: '[themeRunDirective]'
})
export class ThemeRunDirective implements OnInit {

    private _classes: Array<string> = [];
    @HostBinding('class') classesString: string;

    constructor(private themeConfig: ThemeConfigProviderService) {
    }

    public ngOnInit(): void {
        this.AssignTheme();
        this.AssignMobile();
    }

    private AssignTheme(): void {
        this.AddClass(this.themeConfig.get().theme.name);
    }

    private AssignMobile(): void {
        if (isMobile()) {
            this.AddClass('mobile');
        }
    }

    private AddClass(cls: string) {
        this._classes.push(cls);
        this.classesString = this._classes.join(' ');
    }
}
