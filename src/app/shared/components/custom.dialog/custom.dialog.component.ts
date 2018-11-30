import {
    Component, OnInit, ViewEncapsulation,
    ChangeDetectionStrategy, AfterViewInit,
    OnDestroy, HostBinding, ElementRef, ViewChild, Inject, Optional
} from '@angular/core';
import { fadeInOut } from './components/custom.dialog.annimation';
import { Subject, Observable } from 'rxjs';
import { CustomDialogPromptResult, CustomDialogType } from './components/custom.dialog.types';
import {
    CustomDialogsLocalConfig, CustomDialogsCompleteConfig,
    CustomDialogsGlobalConfig, CustomDialogsBaseConfig, CUSTOM_DIALOG_CONFIG
} from './components/custom.dialog.config';
import { CustomDialogTheme } from './components/custom.dialog.theme';

@Component({
    selector: 'custom-dialog',
    templateUrl: './views/custom.dialog.view.html',
    styleUrls: ['./styles/custom.dialog.style.scss'],
    animations: [fadeInOut],
    host: {
        '(@fadeInOut.done)': 'animationDone()'
    },
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomDialogComponent implements OnInit, AfterViewInit, OnDestroy {
    /**
 * Subject used to stream close events
 */
    private closeSubject: Subject<boolean | CustomDialogPromptResult> = new Subject();

    /**
     * Observable that emits on every close action
     */
    $close: Observable<boolean | CustomDialogPromptResult> = this.closeSubject.asObservable();

    /**
     * The type of the dialog
     */
    type: CustomDialogType;

    /**
     * List of all the available dialg types
     */
    types = CustomDialogType;

    /**
     * Main text to render inside the dialog
     */
    message: string;

    /**
     * Whether or not the dialog is closing
     */
    closing = false;

    /**
     * Whether or not to listen to 'enter' key
     */
    canListenToEnter = false;

    /**
     * Element that is focused prior to modal opening
     */
    private elWithFocus: HTMLElement;

    /**
     * Whether or not to enable host animation
     */
    @HostBinding('@fadeInOut')
    animation = true;

    /**
     * Class to be applied according to the desired theme
     */
    @HostBinding('class')
    themeClass: string;

    /**
     * Reference to the prompt text input
     */
    @ViewChild('promptInput')
    promptInput: ElementRef;

    /**
     * Reference to the dialog content
     */
    @ViewChild('dialogContent')
    dialogContent: ElementRef;

    /**
     * Whether or not to set the host class
     */
    @HostBinding('class.ngx-cool-dialog')
    setHostClass = true;

    /**
     * The config passed by the user via service methods
     */
    localConfig: CustomDialogsLocalConfig;

    /**
     * Mapped config that blends both local and global configs
     */
    private _config: CustomDialogsCompleteConfig;

    /**
     * The current mapped config
     */
    get config(): CustomDialogsCompleteConfig {
        return this._config;
    }

    /**
     * The current theme
     */
    get theme(): CustomDialogTheme {
        return this.config.theme;
    }

    /**
   * Initializes the component
   * @param globalConfig - the configuration passed via .forRoot()
   */
    constructor(@Optional()
    @Inject(CUSTOM_DIALOG_CONFIG)
    private globalConfig: CustomDialogsGlobalConfig) { }

    /**
    * Initializes the component with the theme and mapped configs
    */
    ngOnInit() {
        this.elWithFocus = document.activeElement as HTMLElement;
        const defaultConfig = new CustomDialogsBaseConfig();
        this._config = Object.assign({}, defaultConfig, this.globalConfig, this.localConfig);
        this.themeClass = `ngx-cool-dialog--${this.theme}-theme`;
    }

    /**
    * Called after Angular initializes the component's views
    */
    ngAfterViewInit() {
        // set the focus to 'content' so that ESC can be listened right away
        this.dialogContent.nativeElement.focus();

        // if the type is Prompt, then set the focus to the input and select
        // the text, just as window.prompt does
        if (this.type === CustomDialogType.Prompt) {
            const input = this.promptInput.nativeElement as HTMLInputElement;
            input.focus();
            const defaultText = this.config.defaultText;
            if (defaultText) {
                input.value = defaultText;
                input.setSelectionRange(0, defaultText.length);
            }
        }
    }

    /**
    * Listener for the 'esc' key
    */
    escKey() {
        this.close();
    }

    /**
    * Listener for the 'enter' key. It needs a fake 'debounce' otherwise
    * the dialog would close immediately after it's opened, if it
    * was trigger via an 'enter' key prior to dialog opening.
    */
    enterKey() {
        if (this.canListenToEnter) {
            this.close(true);
        }
    }

    /**
    * Closes the current dialog. Emits an event with the payload.
    * The payload can either be a boolean, or an object if the type
    * is Prompt.
    * @param result - whether it was 'Cancel': false, or 'OK': true
    */
    close(result = false) {
        this.closing = true;
        requestAnimationFrame(() => {
            let payload;
            if (this.type === CustomDialogType.Prompt) {
                payload = {
                    result,
                    value: this.promptInput.nativeElement.value || ''
                };
            } else {
                payload = result;
            }
            this.closeSubject.next(payload);
        });
    }

    /**
    * Listener for click events on the 'x' button
    */
    onCloseBtnClick() {
        this.close();
    }

    /**
    * Function called when the main host animation finishes
    */
    animationDone() {
        this.canListenToEnter = true;
    }

    /**
    * Listener for click events on the 'OK' button
    */
    onOkBtnClick() {
        this.close(true);
    }

    /**
    * Listener for click events on the 'Cancel' button
    */
    onCancelBtnClick() {
        this.close();
    }

    /**
    * Listener for click events on the backdrop shadow
    */
    onBackdropClick() {
        this.close();
    }

    /**
    * The dialog's title
    */
    getTitle() {
        // if a generic title exists, then use that
        let title = this.config.title;
        if (title) {
            return title;
        }

        // if no title was passed on `open()`, then search
        // through the titles set via global configs
        const titles = this.config.titles || {};
        if (this.type === CustomDialogType.Alert) {
            title = titles.alert;
        } else if (this.type === CustomDialogType.Confirm) {
            title = titles.confirm;
        } else {
            title = titles.prompt;
        }
        return title;
    }

    /**
    * Component cleanup. return the focus to the element that was active
    * prior to the dialog opening
    */
    ngOnDestroy() {
        const body = document.body;
        const elWithFocus = this.elWithFocus;

        let elementToFocus;
        if (elWithFocus && elWithFocus.focus && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        } else {
            elementToFocus = body;
        }
        elementToFocus.focus();
        this.elWithFocus = null;
    }

    /**
    * Returns the fill color of the 'OK' button
    */
    getOkButtonTextColor(): string {
        // only for material theme the 'OK' has a color different than white
        if (this.theme === 'material') {
            return this.config.color;
        }
    }

    /**
    * Returns the fill color of the 'OK' button
    */
    getOkButtonFillColor(): string {
        // material theme doesn't have filled buttons
        if (this.theme !== 'material') {
            return this.config.color;
        }
    }

    /**
    * Returns the border color of the 'Cancel' button
    */
    getCancelButtonBorderColor(): string {
        // material theme doesn't have border
        if (this.theme !== 'material') {
            return this.config.color;
        }
    }

    /**
    * Returns the text color of the 'Cancel' button
    */
    getCancelButtonTextColor(): string {
        // for dark theme the text should always be white
        if (this.theme !== 'dark') {
            return this.config.color;
        }
    }
}