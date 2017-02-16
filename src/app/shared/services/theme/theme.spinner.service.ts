import { Injectable } from '@angular/core';

@Injectable()
export class ThemeSpinnerService {

    private _selector: string = 'preloader';
    private _element: HTMLElement;

    constructor() {
        this._element = document.getElementById(this._selector);
    }

    public Show(): void {
        this._element.style['display'] = 'block';
    }

    public Hide(delay: number = 0): void {
        setTimeout(() => {
            this._element.style['display'] = 'none';
        }, delay);
    }
}