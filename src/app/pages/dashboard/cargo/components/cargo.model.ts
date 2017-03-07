import { BaseModel } from '../../../../shared';
import { FlightModel } from '../../Flight';
 
export class CargoModel extends BaseModel {
        public CargoId  : number;
        public FlightId : number;
        public  Details : string;
        public  FlightDetails : string;
        public  POL : string;
        public  POU : string;
        public  AWB : string;
        public  mftpcs ? : number;
        public  mftwgt ? : number;

         public Flight : FlightModel;

}