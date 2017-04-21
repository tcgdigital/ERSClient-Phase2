import { Subject } from 'rxjs/Subject';

export class BroadcastEventListener<T> extends Subject<T> {

    /**
     * Creates an instance of BroadcastEventListener.
     * @param {string} event
     *
     * @memberOf BroadcastEventListener
     */
    constructor(public event: string) {
        super();
        if (event == null || event === '') {
            throw new Error('Failed to create BroadcastEventListener. Argument \'event\' can not be empty');
        }
    }
}
