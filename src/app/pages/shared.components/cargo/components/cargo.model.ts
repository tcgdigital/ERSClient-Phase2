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

	public ShipperName : string;
	public ShipperAddress : string;
	public ShipperContactNo : string;
	public ConsigneeName : string;
	public ConsigneeAddress : string;
	public ConsigneeContactNo : string;
	public Origin : string;
	public Destination : string;
	public CargoType : string;
	public AdvisoryToConsignee : string;
	public AWBDocPath : string;

	public Flight: FlightModel;

	public AffectedObjects?: AffectedObjectModel[];

	/**
	 * Creates an instance of CargoModel.
	 * 
	 * @memberOf CargoModel
	 */
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