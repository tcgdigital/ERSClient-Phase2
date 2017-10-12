import { BaseModel } from './base.model';

export class KeyValueModel extends BaseModel {

        public KeyValueId: number;
        public Key: string;
        public Value: string;
        public Description: string;

        constructor() {
                super();
                this.KeyValueId = 1;
                this.Key = '';
                this.Value = '';
                this.Description = '';
        }
}