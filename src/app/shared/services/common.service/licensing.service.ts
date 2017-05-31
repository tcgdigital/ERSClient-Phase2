import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { GlobalConstants } from '../../constants'
import { DataService, DataServiceFactory, DataProcessingService } from '../data.service';
import { LicenseVerificationResponse, LicenseInformationModel } from '../../models'

@Injectable()
export class LicensingService {
    private _licenseValidationService: DataService<any>;
    private _licenseInformationService: DataService<any>;
    private _licenseSetService : DataService<any>;

    constructor(private dataServiceFactory: DataServiceFactory) {
        const option: DataProcessingService = new DataProcessingService();
        option.ExceptionHandler = this.LicenseVerificationResponseExceptionHandler;

        this._licenseValidationService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix('License', 'VerifyLicense', option);
            
        this._licenseInformationService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix( 'License', 'GetLicenseInfo', option );
             this._licenseSetService = this.dataServiceFactory
            .CreateServiceWithOptionsAndActionSuffix( 'License', 'SetLicenseKey', option );
    }

    LicenseVerificationResponseExceptionHandler(error: Response): Observable<LicenseVerificationResponse> {
        return Observable.of(JSON.parse(error.text()) as LicenseVerificationResponse);
    }

    public VerifyLicense(): Observable<LicenseVerificationResponse> {
        return this._licenseValidationService.SimpleGet()
            .Execute()
            .map((response: any) => {
                return response as LicenseVerificationResponse;
            });
    }
    public GetLicenseInfo(): Observable<LicenseInformationModel> {
        return this._licenseInformationService.SimpleGet()
        .Execute()
        .map((response: any) => {
            return response as LicenseInformationModel;
        });
    }
    public SetLicenseInfo(onClickVerify): Observable<LicenseInformationModel>{
        return this._licenseSetService.JsonPost(onClickVerify)
        .Execute()
        .map((response: any) => {
            return response as LicenseInformationModel;
        });
    }
}