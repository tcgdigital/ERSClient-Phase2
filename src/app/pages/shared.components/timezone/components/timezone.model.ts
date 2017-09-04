import { BaseModel, ResponseModel } from '../../../../shared';

export class TimeZoneModel extends BaseModel {
    public TimeZoneId: string;
    public DisplayName: string;

	/**
	 * Creates an instance of TimeZoneModel.
	 * 
	 * @memberOf TimeZoneModel
	 */
    constructor() {
        super();
        this.TimeZoneId = '';
        this.DisplayName = '';
    }
}


export class ZoneIndicator {
    public ZoneName: string;
    
    public Year: string;
    public Month: string;
    public Day: string;
    public Hour: string;
    public Minute: string;
    public Second: string;

    public CurrentTime: Date;
}

export class TimeZoneModels extends BaseModel {
    public TimeZones: ResponseModel<TimeZoneModel>;

	/**
	 * Creates an instance of TimeZoneModel.
	 * 
	 * @memberOf TimeZoneModel
	 */
    constructor() {
        super();

    }
}