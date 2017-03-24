import { BaseModel } from '../../../../shared';
import { FlightModel, AffectedObjectModel } from '../../../shared.components';

export class CargoModel extends BaseModel {
        public CargoId: number;
        public FlightId: number;
        public Details: string;
        public FlightDetails: string;
        public POL: string;
        public POU: string;
        public AWB: string;
        public mftpcs?: number;
        public mftwgt?: number;

        public Flight: FlightModel;

        public AffectedObjects?: AffectedObjectModel[];

        constructor() {
                super();
                this.CargoId = 0;
                this.FlightId = 0;
                this.Details = '';
                this.FlightDetails = '';
                this.POL = '';
                this.POU = '';
                this.AWB = '';
                this.mftpcs = null;
                this.mftwgt = null;
        }

}