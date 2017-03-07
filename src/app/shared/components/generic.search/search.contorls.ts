import { SearchConfigModel, SearchControlType } from './search.config.model';
import { NameValue } from '../../models';

export class SearchTextBox extends SearchConfigModel<string> {
    /**
     * Creates an instance of SearchTestBox.
     * @param {{}} [options={}] 
     * 
     * @memberOf SearchTestBox
     */
    constructor(options: {} = {}) {
        super(options);
        this.Type = SearchControlType.TEXTBOX;
    }
}

export class SearchDropdown extends SearchConfigModel<number> {
    /**
     * Creates an instance of SearchDropdown.
     * @param {{}} [options={}] 
     * 
     * @memberOf SearchDropdown
     */
    constructor(options: {} = {}) {
        super(options);
        this.Type = SearchControlType.DROPDOWN;
        this.ListData = options['ListData']
    }
}

export class SearchDatepicker extends SearchConfigModel<string>{
    /**
     * Creates an instance of SearchDatepicker.
     * @param {{}} [options={}] 
     * 
     * @memberOf SearchDatepicker
     */
    constructor(options: {} = {}) {
        super(options);
        this.Type = SearchControlType.DATEPICKER;
    }
}