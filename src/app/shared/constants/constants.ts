import { ITabLinkInterface } from '../components/tab.control/tab.control.interface';
import { PagesPermissionMatrixModel } from '../../pages/masterdata/page.functionality';
declare const CKEDITOR;

export enum EnquiryType {
    None = 0,
    Passenger = 1,
    Cargo = 2,
    Crew = 3,
    Media = 4,
    FutureTravel = 5,
    GeneralUpdate = 6,
    Others = 7,
    SituationalUpdates = 8,
    CustomerDissatisfaction = 9,
    GroundVictim = 10
}

export enum EmergencySituation {
    EmergencyInitiationtoHoD = 1,
    EmergencyInitiationtoTeamMember = 2,
    DemandAssignedToTargetDepartmentSPOC = 3,
    DemandCompletedToRequesterDepartmentSPOC = 4,

    //ChecklistCompletedToDepartmentSPOC = 5,
    //ChecklistReopenedToDepartmentSPOC = 6,
    EmergencyClosureToTeamMember = 7,
    DemandApprovalToApproverDepartmentSPOC = 8,

    BroadcastNotification = 9,
    EmergencyClosureToDepartmentHOD = 11,
    MemberDiscontinuationNotificationToHOD = 13,

    RagStatusChangeNotificationForDemand = 14,
    RagStatusChangeNotificationForChecklist = 15,

    ChecklistNotifiedToDepartmentSPOC = 16,
    ChecklistAssignedToDepartmentSPOC = 17,
    ChecklistDelegatedToDepartmentSPOC = 18,
    ChecklistAcceptedToDepartmentSPOC = 19,
    ChecklistReferredToDepartmentSPOC = 20,
    ChecklistClosedToDepartmentSPOC = 21,

    UserCreationNotification = 22,
    AlertForMediaReleaseOnCrisisNotification = 23,
    GeneralNotification = 24
}

export enum TemplateMediaType {
    Sms = 1,
    PushNotification = 2,
    Email = 3,
    Pdf = 4
}
export interface IEmergencySituationEnum {
    EmergencySituationId: number;
    enumtype: string;
    EmergencySituationName: string;
}
export interface INotificationMessage {
    Type: string;
    Key: string;
    Title: string;
    Message: string;
    ErrorTitle: string;
    ErrorMessage: string;
}
export interface IKeyValue {
    value: string;
    key: number;
}
export interface IEnquiryType {
    value: string;
    caption: string;
    text: string;
}

export interface IPriority {
    value: string;
    caption: string;
    text: string;
}
export interface ICompletionStatusType {
    value: string;
    caption: string;
    text: string;
}
export interface IUploadDocuments {
    value: string;
    caption: string;
    text: string;
}
export interface IMedicalStatus {
    key: number;
    value: string;
    caption: string;
}
export interface IRequesterType {
    value: string;
    enumtype: string;
    caption: string;
}
export interface IActionableStatus {
    key: number;
    value: string;
    caption: string;
}

export enum StorageType {
    SessionStorage,
    LocalStorage
}

export class GlobalConstants {
    public static EXTERNAL_URL: string = process.env.API_URL;
    public static NOTIFICATION_URL: string = `${GlobalConstants.EXTERNAL_URL}Notification/Hubs`;
    public static CLIENT_ID: string = 'A924D89F487E4F888EA8CFDB1AE4E9D3';
    public static GRANT_TYPE: string = 'password';
    public static ODATA: string = 'odata';
    public static API: string = 'api';
    public static TOKEN: string = 'token';
    public static BATCH: string = 'odata/$batch';
    public static ACCESS_TOKEN: string = 'access_token';
    public static AD_AUTH_ENABLED: boolean = false;
    public static PASSWORD_PATTERN: RegExp = /^(?!.*[\s])(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,20}$/ig;
    public static NUMBER_PATTERN: string = '^[0-9-+]*$';
    public static EMAIL_PATTERN: string = '^[_a-z_A-Z0-9-]+(\.[_a-z_A-Z0-9-]+)*@[a-z_A-Z0-9-]+(\.[a-z_A-Z0-9-]+)*(\.[a-z_A-Z]{2,4})$';
    public static URL_PATTERN: string = '^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\~\+#]*[\w\-\@?^=%&amp;\~\+#])?$';
    public static LAST_INCIDENT_PICK_COUNT: string = '5';
    public static ELAPSED_MAX_HOUR_INTERVAL_COUNT_FOR_GRAPH_CREATION: number = 12;
    public static currentLoggedInUser: number = 0;
    public static PagePermissionMatrix: PagesPermissionMatrixModel[] = [];
    public static accessibilityErrorMessage: string = 'Access Restricted';
    public static departmentAndFunctionalityReloginMessage: string = 'Please log out and relogin to take effect.';
    public static INTERCEPTOR_PERFORM: boolean = false;
    public static PRESERVE_DATA_FROM_CONVERSION: string[] = ['EmergencyDate'];
    public static SIGNAL_CONNECTION_DELAY: number = 100;
    public static DEBOUNCE_TIMEOUT: number = 5000;

    public static EditorToolbarConfig: any = {
        // uiColor: '#99000',
        enterMode: CKEDITOR.ENTER_BR,
        allowedContent: true,
        extraAllowedContent: 'br',
        removePlugins: 'elementspath',
        toolbar: [
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] },
            { name: 'links', items: ['Link', 'Unlink'] },
            { name: 'insert', items: ['Table', 'HorizontalRule', 'SpecialChar'] },
            { name: 'tools', items: ['Maximize'] },
            '/',
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] },
            { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
            { name: 'styles', items: ['Styles', 'Format'] },
        ]
    };

    public static LicenseValidationCode: IKeyValue[] = [
        { key: 101, value: 'License is valid.' },
        { key: 102, value: 'License info file not found. Please contact the Administrator.' },
        { key: 103, value: 'License info file is invalid or corrupted. Please contact the Administrator.' },
        { key: 104, value: 'Current machine is not registered with the license. Please contact the Administrator.' },
        { key: 105, value: 'License key is invalid or not provided. Please enter your license key or contact the Administrator.' },
        { key: 106, value: 'License has expired. To renew the license please contact the Administrator.' }
    ];

    public static EmergencyCategories: IKeyValue[] = [
        { value: 'FlightRelated', key: 1 },
        { value: 'NonFlightRelated', key: 2 }
    ];

    public static MediaReleaseStatuses: IKeyValue[] = [
        { value: 'Saved', key: 1 },
        { value: 'SentForApproval', key: 2 },
        { value: 'Approved', key: 3 },
        { value: 'Published', key: 4 }
    ];

    public static ActiveFlag: IKeyValue[] = [
        { value: 'Active', key: 0 },
        { value: 'InActive', key: 1 }
    ];

    public static TemplateMediaType: IKeyValue[] = [
        { value: 'Sms', key: 1 },
        { value: 'PushNotification', key: 2 },
        { value: 'Email', key: 3 },
        { value: 'Pdf', key: 4 }
    ];

    public static EnquiryType: IEnquiryType[] = [
        {
            value: '1',
            caption: 'Passenger',
            text: 'Passenger related'
        }, {
            value: '2',
            caption: 'Cargo',
            text: 'Cargo related'
        }, {
            value: '3',
            caption: 'Media',
            text: 'Media related',
        }, {
            value: '4',
            caption: 'Others',
            text: 'Others',
        }, {
            value: '5',
            caption: 'Crew',
            text: 'Crew',
        }];

    public static ExternalInputEnquiryType: IEnquiryType[] = [
        {
            value: '1',
            // caption: 'Passenger',
            caption: EnquiryType[1].toString(),
            text: `${EnquiryType[1].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Passenger enquiry'
        }, {
            value: '2',
            // caption: 'Cargo',
            caption: EnquiryType[2].toString(),
            text: `${EnquiryType[2].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Cargo enquiry'
        }, {
            value: '3',
            // caption: 'Crew',
            caption: EnquiryType[3].toString(),
            text: `${EnquiryType[3].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Crew enquiry',
        }, {
            value: '4',
            // caption: 'Media',
            caption: EnquiryType[4].toString(),
            text: `${EnquiryType[4].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Media enquiry',
        }, {
            value: '5',
            // caption: 'FutureTravel',
            caption: EnquiryType[5].toString(),
            text: `${EnquiryType[5].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Future Travel enquiry',
        }, {
            value: '6',
            // caption: 'GeneralUpdate',
            caption: EnquiryType[6].toString(),
            text: `${EnquiryType[6].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'General Update enquiry',
        }, {
            value: '7',
            // caption: 'Others',
            caption: EnquiryType[7].toString(),
            text: `${EnquiryType[7].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Other enquiry',
        }, {
            value: '8',
            // caption: 'SituationalUpdates',
            caption: EnquiryType[8].toString(),
            text: `${EnquiryType[8].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Situational Updates enquiry',
        }, {
            value: '9',
            // caption: 'CustomerDissatisfaction',
            caption: EnquiryType[9].toString(),
            text: `${EnquiryType[9].replace(/([A-Z])/g, ' $1').trim()}` //'Customer Dissatisfaction',
        }, {
            value: '10',
            // caption: 'CustomerDissatisfaction',
            caption: EnquiryType[10].toString(),
            text: `${EnquiryType[10].replace(/([A-Z])/g, ' $1').trim()} enquiry` //'Customer Dissatisfaction',
        }
    ];


    public static Priority: IPriority[] = [
        {
            value: '1',
            caption: 'High',
            text: 'High'
        }, {
            value: '2',
            caption: 'Medium',
            text: 'Medium',
        }, {
            value: '3',
            caption: 'Low',
            text: 'Low'
        }
    ];

    public static CompletionStatusType: ICompletionStatusType[] = [
        {
            value: '1',
            caption: 'Notified',
            text: 'Notified'
        }, {
            value: '2',
            caption: 'Assigned',
            text: 'Assigned',
        }, {
            value: '3',
            caption: 'Delegated',
            text: 'Delegated'
        }, {
            value: '4',
            caption: 'Accepted',
            text: 'Accepted'
        }, {
            value: '5',
            caption: 'ReferredTo',
            text: 'Referred To'
        }, {
            value: '6',
            caption: 'Closed',
            text: 'Closed'
        }
    ];

    public static UploadDocuments: IUploadDocuments[] = [
        {
            value: '1',
            caption: 'ViewLessonsLearnt',
            text: 'Lessons Learnt'
        }, {
            value: '2',
            caption: 'ViewAuditReport',
            text: 'Audit Report'
        }
    ];

    // Page permission string
    public static EmergencySituationEnum: IEmergencySituationEnum[] = [
        {
            EmergencySituationId: 1,
            enumtype: EmergencySituation[1].toString(),
            EmergencySituationName: `${EmergencySituation[1].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 2,
            enumtype: EmergencySituation[2].toString(),
            EmergencySituationName: `${EmergencySituation[2].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 3,
            enumtype: EmergencySituation[3].toString(),
            EmergencySituationName: `${EmergencySituation[3].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 4,
            enumtype: EmergencySituation[4].toString(),
            EmergencySituationName: `${EmergencySituation[4].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, /*{
            EmergencySituationId: 5,
            enumtype: EmergencySituation[5].toString(),
            EmergencySituationName: `${EmergencySituation[5].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 6,
            enumtype: EmergencySituation[6].toString(),
            EmergencySituationName: `${EmergencySituation[6].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        },*/ {
            EmergencySituationId: 7,
            enumtype: EmergencySituation[7].toString(),
            EmergencySituationName: `${EmergencySituation[7].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 8,
            enumtype: EmergencySituation[8].toString(),
            EmergencySituationName: `${EmergencySituation[8].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 9,
            enumtype: EmergencySituation[9].toString(),
            EmergencySituationName: `${EmergencySituation[9].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 11,
            enumtype: EmergencySituation[11].toString(),
            EmergencySituationName: `${EmergencySituation[11].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 13,
            enumtype: EmergencySituation[13].toString(),
            EmergencySituationName: `${EmergencySituation[13].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 14,
            enumtype: EmergencySituation[14].toString(),
            EmergencySituationName: `${EmergencySituation[14].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 15,
            enumtype: EmergencySituation[15].toString(),
            EmergencySituationName: `${EmergencySituation[15].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 16,
            enumtype: EmergencySituation[1].toString(),
            EmergencySituationName: `${EmergencySituation[1].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 17,
            enumtype: EmergencySituation[17].toString(),
            EmergencySituationName: `${EmergencySituation[17].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 18,
            enumtype: EmergencySituation[18].toString(),
            EmergencySituationName: `${EmergencySituation[18].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 19,
            enumtype: EmergencySituation[19].toString(),
            EmergencySituationName: `${EmergencySituation[19].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 20,
            enumtype: EmergencySituation[20].toString(),
            EmergencySituationName: `${EmergencySituation[20].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 21,
            enumtype: EmergencySituation[21].toString(),
            EmergencySituationName: `${EmergencySituation[21].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 22,
            enumtype: EmergencySituation[22].toString(),
            EmergencySituationName: `${EmergencySituation[22].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 23,
            enumtype: EmergencySituation[23].toString(),
            EmergencySituationName: `${EmergencySituation[23].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }, {
            EmergencySituationId: 24,
            enumtype: EmergencySituation[24].toString(),
            EmergencySituationName: `${EmergencySituation[24].replace(/([a-z])([A-Z])/g, '$1 $2').trim()}`
        }
    ];

    public static InvolvedPartyType: object = [
        { value: 'Flight', key: 1 },
        { value: 'NonFlight', key: 2 }
    ];

    public static DemandTypeId: number = 1;
    public static RequiredLocation: string = 'Office';
    public static ScheduleTimeForCallback: number = 75;
    public static ScheduleTimeForTravel: number = 90;
    public static ScheduleTimeForAdmin: number = 60;
    public static ScheduleTimeForDemandForCrew: number = 70;
    public static RequesterTypeDemand: string = 'Demand';
    public static RequesterTypeEnquiry: string = 'Enquiry';
    public static InteractionDetailsTypeDemand: string = 'DemandType';
    public static InteractionDetailsTypeEnquiry: string = 'EnquiryType';
    public static MedicalStatus: IMedicalStatus[] = [
        {
            key: 1,
            value: 'Uninjured',
            caption: 'Uninjured'
        }, {
            key: 2,
            value: 'Injured',
            caption: 'Injured'
        }, {
            key: 3,
            value: 'Missing',
            caption: 'Missing'
        }, {
            key: 4,
            value: 'Deceased',
            caption: 'Deceased'
        }, {
            key: 5,
            value: 'Others',
            caption: 'Others'
        }, {
            key: 6,
            value: 'UnidentifiedPDA',
            caption: 'Unidentified PDA'
        }
    ];

    public static ActionableStatus: IActionableStatus[] = [
        {
            key: 1,
            value: 'Notified',
            caption: 'Notified'
        }, {
            key: 2,
            value: 'Assigned',
            caption: 'Assigned'
        }, {
            key: 3,
            value: 'Delegated',
            caption: 'Delegated'
        }, {
            key: 4,
            value: 'Accepted',
            caption: 'Accepted'
        }, {
            key: 5,
            value: 'Refferedto',
            caption: 'Reffered To'
        }, {
            key: 6,
            value: 'Closed',
            caption: 'Closed'
        },
    ];


    public static RequesterType: IRequesterType[] = [
        {
            value: '1',
            enumtype: 'PDA',
            caption: 'PDA'
        }, {
            value: '2',
            enumtype: 'NOK',
            caption: 'NOK'
        }, {
            value: '3',
            enumtype: 'Staff',
            caption: 'Staff'
        }, {
            value: '4',
            enumtype: 'Others',
            caption: 'Others'
        }
    ];

    public static CargoStatus: IMedicalStatus[] = [
        {
            key: 1,
            value: 'Missing',
            caption: 'Missing'
        }, {
            key: 2,
            value: 'Found',
            caption: 'Found'
        }, {
            key: 3,
            value: 'Others',
            caption: 'Others'
        }
    ];

    public static NotificationMessage: INotificationMessage[] = [
        {
            Type: 'PassengerImportNotification',
            Key: 'ReceivePassengerImportCompletionResponse',
            Title: 'Passenger Imported',
            Message: 'Passengers has been imported. Please refer to tab section "Affected People".',
            ErrorTitle: 'Passenger Import Failed',
            ErrorMessage: 'Passenger import operation has been failed due to some exception.'
        }, {
            Type: 'CargoImportNotification',
            Key: 'ReceiveCargoImportCompletionResponse',
            Title: 'Cargo Imported',
            Message: 'Cargo has been imported. Please refer to tab section "Affected People".',
            ErrorTitle: 'Cargo Import Failed',
            ErrorMessage: 'Cargo import operation has been failed due to some exception.'
        }, {
            Type: 'CrewImportNotification',
            Key: 'ReceiveCrewImportCompletionResponse',
            Title: 'Crew Imported',
            Message: 'Crew has been imported. Please refer to tab section "Affected People".',
            ErrorTitle: 'Crew Import Failed',
            ErrorMessage: 'Crew import operation has been failed due to some exception.'
        }, {
            Type: 'IncidentBorrowNotification',
            Key: 'ReceiveIncidentBorrowingCompletionResponse',
            Title: 'Incident Borrowed',
            Message: 'Incident has been borrowed successfully.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'BroadcastNotification',
            Key: 'ReceiveBroadcastCreationResponse',
            Title: 'Broadcast Created',
            Message: 'A new Broadcast has been created. Please refer to tab section "Broadcast Message".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'BroadcastNotification',
            Key: 'ReceiveBroadcastModificationResponse',
            Title: 'Broadcast Modified',
            Message: 'A existing Broadcast message has been modified. Please refer to tab section "Broadcast Message".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'ChecklistNotification',
            Key: 'ReceiveChecklistCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'ChecklistNotification',
            Key: 'ReceiveChecklistStatusChangeResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'ChecklistNotification',
            Key: 'ReceiveChecklistClosureResponse',
            Title: 'Checklist Closed',
            Message: 'A Checklist has been closed. Please refer to tab section "Checklist > Closed".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, /*{
            Type: 'ChecklistNotification',
            Key: 'ReceiveChecklistActivationResponse',
            Title: 'Checklist Reopened',
            Message: 'A Checklist has been reopened. Please refer to tab section "Checklist > Active"'
        },*/ {
            Type: 'CrisisCreationNotification',
            Key: 'ReceiveCrisisCreationResponse',
            Title: 'Crisis Created',
            Message: 'A new crisis has been initiated. Please logout and re-login to the system to see the details of the new crisis.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'CrisisCreationNotification',
            Key: 'ReceiveDepartmentCreationResponse',
            Title: 'Department Created',
            Message: 'A new department has been created. Please logout and re-login to the system to see the new department.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'CrisisClosureNotification',
            Key: 'ReceiveCrisisClosureResponse',
            Title: 'Crisis Closed',
            Message: 'Current crisis has been closed by {0:model.UserName}, you will be redirected to login page.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'CasualtyNotification',
            Key: 'ReceiveCasualtyCountResponse',
            Title: 'Casualty Status',
            Message: 'Additional information has been changed. Please refer to dashboard\'s "PDA Casualty Status Block".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandCreationResponse',
            Title: 'Demand Created',
            Message: 'A new {0:model.DemandCode} Demand has been created. Please refer to tab section "Demand > My Demands".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandApprovalPendingResponse',
            Title: 'Demand Approval Pending',
            Message: 'A Demand has been assigned for your approval. Please refer to tab section "Demand > Approval Pending".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandApprovedResponse',
            Title: 'Demand Approved',
            Message: 'Corresponding demand has been approved.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandAssignedResponse',
            Title: 'Demand Assigned to Me',
            Message: 'A new Demand has been assigned to you. Please refer to tab section "Demand > Assigned to Me".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveCompletedDemandAssignedResponse',
            Title: 'Demand Completed',
            Message: 'Corresponding demand has been completed.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandRejectedFromApprovalResponse',
            Title: 'Demand Rejected',
            Message: 'Corresponding demand has been rejected by Approver Department.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandClosedResponse',
            Title: 'Demand Completed',
            Message: 'A Demand has been completed. Please refer to tab section "Demand > Completed".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveDemandStatusUpdateResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
            // Title: 'Demand Status Updated',
            // Message: 'A Demand\'s status has been updated. Please refer to tab section "Demand > My Demands"'
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveCompletedDemandstoCloseResponse',
            Title: 'Demand Closed',
            Message: 'A Demand has been closed. Please refer to tab section "Demand > Completed".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveRejectedDemandsFromClosureResponse',
            Title: 'Demand Rejected',
            Message: 'Corresponding demand has been rejected by Initiator Department after completion.',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'DemandNotification',
            Key: 'ReceiveRejectedDemandstoAssignResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageNotification',
            Key: 'ReceivePresidentsMessageResponse',
            Title: 'Presidents Message Published',
            Message: 'A Presidents Message has been published. Please refer to dashboard\'s "Presidents Message Block".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageWorkflowNotification',
            Key: 'ReceivePresidentsMessageCreatedResponse',
            Title: 'Presidents Message Created',
            Message: 'A Presidents Message has been created. Please refer to tab section "Presidents Message > Presidents Message Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageWorkflowNotification',
            Key: 'ReceivePresidentsMessageSendForApprovalResponse',
            Title: 'Presidents Message is Sent for Approval',
            Message: 'A Presidents Message has been sent for approval. Please refer to tab section "Presidents Message > Pending Approval".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageWorkflowNotification',
            Key: 'ReceivePresidentsMessageApprovedResponse',
            Title: 'Presidents Message Approved',
            Message: 'A Presidents Message has been approved. Please refer to tab section "Presidents Message > Presidents Message Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageWorkflowNotification',
            Key: 'ReceivePresidentsMessageRejectedResponse',
            Title: 'Presidents Message Rejected',
            Message: 'A Presidents Message has been rejected. Please refer to tab section "Presidents Message > Presidents Message Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageWorkflowNotification',
            Key: 'ReceivePresidentsMessagePublishedResponse',
            Title: 'Presidents Message Published',
            Message: 'A Presidents Message has been published. Please refer to tab section "Presidents Message > Presidents Message Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'PresidentsMessageWorkflowNotification',
            Key: 'ReceivePresidentsMessageUpdateResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageNotification',
            Key: 'ReceiveMediaMessageResponse',
            Title: 'Media Release Published',
            Message: 'A Media Release has been published. Please refer to dashboard\'s "Media Release Block".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageWorkflowNotification',
            Key: 'ReceiveMediaMessageCreatedResponse',
            Title: 'Media Release Created',
            Message: 'A Media Release has been created. Please refer to tab section "Media Management > Media Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageWorkflowNotification',
            Key: 'ReceiveMediaMessageSendForApprovalResponse',
            Title: 'Media Release is Sent for Approval',
            Message: 'A Media Release has been sent for approval. Please refer to tab section "Media Management > Pending Approval".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageWorkflowNotification',
            Key: 'ReceiveMediaMessageApprovedResponse',
            Title: 'Media Release Approved',
            Message: 'A Media Release has been approved. Please refer to tab section "Media Management > Media Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageWorkflowNotification',
            Key: 'ReceiveMediaMessageRejectedResponse',
            Title: 'Media Release Rejected',
            Message: 'A Media Release has been rejected. Please refer to tab section "Media Management > Media Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageWorkflowNotification',
            Key: 'ReceiveMediaMessagePublishedResponse',
            Title: 'Media Release Published',
            Message: 'A Media Release has been published. Please refer to tab section "Media Management > Media Release".',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'MediaMessageWorkflowNotification',
            Key: 'ReceiveMediaMessageUpdateResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveCargoEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedCargoEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveCrewEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedCrewEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveMediaEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedMediaEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveOtherEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedOtherEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceivePassangerEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedPassangerEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveFutureTravelEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedFutureTravelEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveGeneralUpdateEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedGeneralUpdateEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveSituationalUpdatesEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedSituationalUpdatesEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveCustomerDissatisfactionEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedCustomerDissatisfactionEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'ReceiveGroundVictimEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }, {
            Type: 'EnquiryNotification',
            Key: 'AssignedGroundVictimEnquiryCreationResponse',
            Title: '',
            Message: '',
            ErrorTitle: '',
            ErrorMessage: ''
        }
    ];

    public static DataExchangeConstant = {
        IncidentChangefromDashboard: 'incidentChangefromDashboard',
        CallRecieved: 'CallRecieved',
        DepartmentChange: 'departmentChange',
        IncidentChange: 'incidentChange',
        OpenActionablePageInitiate: 'OpenActionablePageInitiate',
        DepartmentChangeFromDashboard: 'departmentChangeFromDashboard',
        ContactClicked: 'contactClicked',
        OnDemandUpdate: 'OnDemandUpdate',
        OnDemandDetailClick: 'OnDemandDetailClick',
        DemandAddedUpdated: 'DemandAddedUpdated',
        DemandApproved: 'DemandApproved',
        DemandAssigned: 'DemandAssigned',
        DemandCompleted: 'DemandCompleted',
        OnMediaReleaseApproverUpdate: 'OnMediaReleaseApproverUpdate',
        BroadcastPublished: 'BroadcastPublished',
        CheckListStatusChange: 'checkListStatusChange',
        MediaReleasePublished: 'MediaReleasePublished',
        PresidentMessagePublished: 'PresidentMessagePublished',

        ClearAutoCompleteInput: 'clearAutoCompleteInput',
        OpenInvalidCargoes: 'OpenInvalidCargoes',
        OpenInvalidCrews: 'OpenInvalidCrews',
        OpenInvalidGroundVictims: 'OpenInvalidGroundVictims',
        OpenInvalidPassengers: 'OpenInvalidPassengers',
        OpenCargoes: 'OpenCargoes',
        OpenCrews: 'OpenCrews',
        OpenGroundVictims: 'OpenGroundVictims',
        OpenPassengers: 'OpenPassengers',
        ChecklistModelEdited: 'checklistModelEdited',
        CheckListModelSaved: 'checkListModelSaved',
        CheckListListReload: 'checkListListReload',
        FileUploadedSuccessfullyCheckList: 'FileUploadedSuccessfullyCheckList',
        DemandTypeModelSaved: 'demandTypeModelSaved',
        DemandTypeModelUpdated: 'demandTypeModelUpdated',
        DepartmentModelEdited: 'departmentModelEdited',
        DepartmentSavedOrEdited: 'departmentSavedOrEdited',
        OnEmergencyLocationUpdate: 'OnEmergencyLocationUpdate',
        EmergencyLocationModelSaved: 'EmergencyLocationModelSaved',
        EmergencyLocationModelUpdated: 'EmergencyLocationModelUpdated',
        FileUploadedSuccessfully: 'FileUploadedSuccessfully',
        EmergencyTypeModelSaved: 'EmergencyTypeModelSaved',
        EmergencyTypeModelUpdated: 'EmergencyTypeModelUpdated',
        OnEmergencyTypeUpdate: 'OnEmergencyTypeUpdate',
        QuickLinkModelEdited: 'quickLinkModelEdited',
        QuickLinkModelSaved: 'quickLinkModelSaved',
        QuickLinkModelModified: 'quickLinkModelModified',
        UserProfileModelToBeModified: 'UserProfileModelToBeModified',
        UserProfileModelCreated: 'UserProfileModelCreated',
        UserProfileModelModified: 'UserProfileModelModified',
        UserProfileLoadedFromFile: 'UserProfileLoadedFromFile',
        CloseActionablePageInitiate: 'CloseActionablePageInitiate',
        OnBroadcastUpdate: 'OnBroadcastUpdate',
        BroadcastModelUpdated: 'BroadcastModelUpdated',
        BroadcastModelSaved: 'BroadcastModelSaved',
        MediaModelSentForApproval: 'MediaModelSentForApproval',
        OnMediaReleaseUpdate: 'OnMediaReleaseUpdate',
        MediaModelSaved: 'MediaModelSaved',
        MediaModelUpdated: 'MediaModelUpdated',
        MediaModelApprovalUpdated: 'MediaModelApprovalUpdated',
        OnPresidentMessageApprovalUpdate: 'OnPresidentMessageApprovalUpdate',
        PresidentsMessageSentForApproval: 'PresidentsMessageSentForApproval',
        PresidentMessageApprovalUpdated: 'PresidentMessageApprovalUpdated',
        OnPresidentMessageUpdate: 'OnPresidentMessageUpdate',
        PresidentMessageModelSaved: 'PresidentMessageModelSaved',
        PresidentMessageModelUpdated: 'PresidentMessageModelUpdated',

        AffectedPersonSelected: 'AffectedPersonSelected',
        CareMemberCreated: 'CareMemberCreated',
        CareMemberForAllPDACreated: 'CareMemberForAllPDACreated'
    };

    public static NotificationConstant = {
        ReceivePassengerImportCompletionResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePassengerImportCompletionResponse'),
        ReceiveCargoImportCompletionResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCargoImportCompletionResponse'),
        ReceiveCrewImportCompletionResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCrewImportCompletionResponse'),
        ReceiveIncidentBorrowingCompletionResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveIncidentBorrowingCompletionResponse'),
        ReceiveBroadcastCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveBroadcastCreationResponse'),
        ReceiveBroadcastModificationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveBroadcastModificationResponse'),
        ReceiveChecklistCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveChecklistCreationResponse'),
        ReceiveChecklistStatusChangeResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveChecklistStatusChangeResponse'),
        ReceiveChecklistClosureResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveChecklistClosureResponse'),
        ReceiveCrisisCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCrisisCreationResponse'),
        ReceiveDepartmentCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDepartmentCreationResponse'),
        ReceiveCrisisClosureResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCrisisClosureResponse'),
        ReceiveCasualtyCountResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCasualtyCountResponse'),
        ReceiveDemandCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandCreationResponse'),
        ReceiveDemandApprovalPendingResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandApprovalPendingResponse'),
        ReceiveDemandApprovedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandApprovedResponse'),
        ReceiveDemandAssignedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandAssignedResponse'),
        ReceiveCompletedDemandAssignedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCompletedDemandAssignedResponse'),
        ReceiveDemandRejectedFromApprovalResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandRejectedFromApprovalResponse'),
        ReceiveDemandClosedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandClosedResponse'),
        ReceiveDemandStatusUpdateResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveDemandStatusUpdateResponse'),
        ReceiveCompletedDemandstoCloseResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCompletedDemandstoCloseResponse'),
        ReceiveRejectedDemandsFromClosureResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveRejectedDemandsFromClosureResponse'),
        ReceiveRejectedDemandstoAssignResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveRejectedDemandstoAssignResponse'),
        ReceivePresidentsMessageResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessageResponse'),
        ReceivePresidentsMessageCreatedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessageCreatedResponse'),
        ReceivePresidentsMessageSendForApprovalResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessageSendForApprovalResponse'),
        ReceivePresidentsMessageApprovedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessageApprovedResponse'),
        ReceivePresidentsMessageRejectedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessageRejectedResponse'),
        ReceivePresidentsMessagePublishedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessagePublishedResponse'),
        ReceivePresidentsMessageUpdateResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePresidentsMessageUpdateResponse'),
        ReceiveMediaMessageResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessageResponse'),
        ReceiveMediaMessageCreatedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessageCreatedResponse'),
        ReceiveMediaMessageSendForApprovalResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessageSendForApprovalResponse'),
        ReceiveMediaMessageApprovedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessageApprovedResponse'),
        ReceiveMediaMessageRejectedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessageRejectedResponse'),
        ReceiveMediaMessagePublishedResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessagePublishedResponse'),
        ReceiveMediaMessageUpdateResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaMessageUpdateResponse'),
        ReceiveCargoEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCargoEnquiryCreationResponse'),
        AssignedCargoEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedCargoEnquiryCreationResponse'),
        ReceiveCrewEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCrewEnquiryCreationResponse'),
        AssignedCrewEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedCrewEnquiryCreationResponse'),
        ReceiveMediaEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveMediaEnquiryCreationResponse'),
        AssignedMediaEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedMediaEnquiryCreationResponse'),
        ReceiveOtherEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveOtherEnquiryCreationResponse'),
        AssignedOtherEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedOtherEnquiryCreationResponse'),
        ReceivePassangerEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceivePassangerEnquiryCreationResponse'),
        AssignedPassangerEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedPassangerEnquiryCreationResponse'),
        ReceiveFutureTravelEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveFutureTravelEnquiryCreationResponse'),
        AssignedFutureTravelEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedFutureTravelEnquiryCreationResponse'),
        ReceiveGeneralUpdateEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveGeneralUpdateEnquiryCreationResponse'),
        AssignedGeneralUpdateEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedGeneralUpdateEnquiryCreationResponse'),
        ReceiveSituationalUpdatesEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveSituationalUpdatesEnquiryCreationResponse'),
        AssignedSituationalUpdatesEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedSituationalUpdatesEnquiryCreationResponse'),
        ReceiveCustomerDissatisfactionEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveCustomerDissatisfactionEnquiryCreationResponse'),
        AssignedCustomerDissatisfactionEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedCustomerDissatisfactionEnquiryCreationResponse'),
        ReceiveGroundVictimEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'ReceiveGroundVictimEnquiryCreationResponse'),
        AssignedGroundVictimEnquiryCreationResponse: GlobalConstants.NotificationMessage.find(x => x.Key == 'AssignedGroundVictimEnquiryCreationResponse')
    };

    public static DashboardTabLinks: ITabLinkInterface[] = [
        {
            id: 'Checklist',
            title: 'Checklists',
            url: '/pages/dashboard/actionable',
            selected: true,
            hidden: false,
            order: 1,
            subtab: [
                {
                    id: 'ActiveChecklist',
                    title: 'Open Checklist',
                    url: './open',
                    selected: true,
                    hidden: false,
                    order: 1
                }, {
                    id: 'ClosedChecklist',
                    title: 'Close Checklist',
                    url: './close',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'Demand',
            title: 'Demand',
            url: '/pages/dashboard/demand',
            selected: false,
            hidden: false,
            order: 2,
            subtab: [
                {
                    id: 'AssignedToMeDemand',
                    title: 'Assigned To Me',
                    url: './assigned',
                    selected: true,
                    hidden: false,
                    order: 1
                }, {
                    id: 'MyDemand',
                    title: 'My Demands',
                    url: './own',
                    selected: false,
                    hidden: false,
                    order: 2
                }, {
                    id: 'PendingDemand',
                    title: 'Approval Pending',
                    url: './approval',
                    selected: false,
                    hidden: false,
                    order: 3
                }, {
                    id: 'CompleteDemand',
                    title: 'Completed',
                    url: './completed',
                    selected: false,
                    hidden: false,
                    order: 4
                }
            ]
        }, {
            id: 'AffectedPeople',
            title: 'Affected People',
            url: '/pages/dashboard/people',
            selected: false,
            hidden: false,
            order: 3,
            subtab: [
                {
                    id: 'AffectedPeople',
                    title: 'Affected People',
                    url: './detail',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'VerifyAffectedPeople',
                    title: 'Verify Affected People',
                    url: './verify',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'GroundVictims',
            title: 'Ground Victims',
            url: '/pages/dashboard/groundmembers',
            selected: false,
            hidden: false,
            order: 4
        }, {
            id: 'AffectedCargo',
            title: 'Affected Cargo',
            url: '/pages/dashboard/cargo',
            selected: false,
            hidden: false,
            order: 5,
            subtab: [
                {
                    id: 'Cargo',
                    title: 'Cargo',
                    url: './detail',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'VerifyCargo',
                    title: 'Verify Cargo',
                    url: './verify',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'BroadcastMessage',
            title: 'Broadcast Messages',
            // icon: 'fa fa-envira fa-2x',
            url: '/pages/dashboard/broadcast',
            selected: false,
            hidden: false,
            order: 6
        }, {
            id: 'PresidentMessage',
            title: 'President Messages',
            url: '/pages/dashboard/presidentMessage',
            selected: false,
            hidden: false,
            order: 7,
            subtab: [
                {
                    id: 'PresidentMessageRelease',
                    title: 'President Message Release',
                    url: './release',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'PresidentMessagePendingApprovals',
                    title: 'Pending Approvals',
                    url: './approvalpending',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'MediaMessage',
            title: 'Media Messages',
            url: '/pages/dashboard/media',
            selected: false,
            hidden: false,
            order: 8,
            subtab: [
                {
                    id: 'MediaMessageRelease',
                    title: 'Media Release',
                    url: './release',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'MediaMessagePendingApprovals',
                    title: 'Pending Approvals',
                    url: './approvalpending',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'PassengerQuery',
            title: 'Passenger Query',
            url: '/pages/dashboard/passengerquery',
            selected: false,
            hidden: false,
            order: 9,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'GroundVictimQuery',
            title: 'Ground Victim Query',
            url: '/pages/dashboard/groundvictimquery',
            selected: false,
            hidden: false,
            order: 10,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedCalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CrewQuery',
            title: 'Crew Query',
            url: '/pages/dashboard/crewQuery',
            selected: false,
            hidden: false,
            order: 11,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CargoQuery',
            title: 'Cargo Query',
            url: '/pages/dashboard/cargoquery',
            selected: false,
            hidden: false,
            order: 12,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'MediaQuery',
            title: 'Media Query',
            url: '/pages/dashboard/mediaquery',
            selected: false,
            hidden: false,
            order: 13,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'GeneralUpdateQuery',
            title: 'General Update Query',
            url: '/pages/dashboard/generalupdatequery',
            selected: false,
            hidden: false,
            order: 14,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'SituationalUpdatesQuery',
            title: 'Situational Updates Query',
            url: '/pages/dashboard/situationalupdatesquery',
            selected: false,
            hidden: false,
            order: 15,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'FutureTravelQuery',
            title: 'Future Travel Query',
            url: '/pages/dashboard/futuretravelquery',
            selected: false,
            hidden: false,
            order: 16,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CustomerDissatisfactionQuery',
            title: 'Customer Dissatisfaction Query',
            url: '/pages/dashboard/customerdissatisfactionquery',
            selected: false,
            hidden: false,
            order: 17,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'OtherQuery',
            title: 'Other Query',
            url: '/pages/dashboard/otherQuery',
            selected: false,
            hidden: false,
            order: 18,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }
    ] as ITabLinkInterface[];

    public static ArchieveDashboardTabLinks: ITabLinkInterface[] = [
        {
            id: 'Checklist',
            title: 'Checklists',
            // icon: 'fa fa-edge fa-2x',
            url: '/pages/archivedashboard/actionable',
            selected: true,
            hidden: false,
            order: 1,
            subtab: [
                {
                    id: 'ActiveChecklist',
                    title: 'Open Checklist',
                    url: './open',
                    selected: true,
                    hidden: false,
                    order: 1
                }, {
                    id: 'ClosedChecklist',
                    title: 'Close Checklist',
                    url: './close',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'Demand',
            title: 'Demand',
            // icon: 'fa fa-linux fa-2x',
            url: '/pages/archivedashboard/demand',
            selected: false,
            hidden: false,
            order: 2,
            subtab: [
                {
                    id: 'AssignedToMeDemand',
                    title: 'Assigned To Me',
                    url: './assigned',
                    selected: true,
                    hidden: false,
                    order: 1
                }, {
                    id: 'MyDemand',
                    title: 'My Demands',
                    url: './own',
                    selected: false,
                    hidden: false,
                    order: 2
                }, {
                    id: 'PendingDemand',
                    title: 'Approval Pending',
                    url: './approval',
                    selected: false,
                    hidden: false,
                    order: 3
                }, {
                    id: 'CompleteDemand',
                    title: 'Completed',
                    url: './completed',
                    selected: false,
                    hidden: false,
                    order: 4
                }
            ]
        }, {
            id: 'AffectedPeople',
            title: 'Affected People',
            // icon: 'fa fa-apple fa-2x',
            url: '/pages/archivedashboard/people',
            selected: false,
            hidden: false,
            order: 3,
            subtab: [
                {
                    id: 'AffectedPeople',
                    title: 'Affected People',
                    url: './detail',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'VerifyAffectedPeople',
                    title: 'Verify Affected People',
                    url: './verify',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'AffectedCargo',
            title: 'Affected Cargo',
            // icon: 'fa fa-chrome fa-2x',
            url: '/pages/archivedashboard/cargo',
            selected: false,
            hidden: false,
            order: 4,
            subtab: [
                {
                    id: 'Cargo',
                    title: 'Cargo',
                    url: './detail',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'VerifyCargo',
                    title: 'Verify Cargo',
                    url: './verify',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'BroadcastMessage',
            title: 'Broadcast Messages',
            // icon: 'fa fa-envira fa-2x',
            url: '/pages/archivedashboard/broadcast',
            selected: false,
            hidden: false,
            order: 5
        }, {
            id: 'PresidentMessage',
            title: 'President Messages',
            // icon: 'fa fa-firefox fa-2x',
            url: '/pages/archivedashboard/presidentMessage',
            selected: false,
            hidden: false,
            order: 6,
            subtab: [
                {
                    id: 'PresidentMessageRelease',
                    title: 'President Message Release',
                    url: './release',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'PresidentMessagePendingApprovals',
                    title: 'Pending Approvals',
                    url: './approvalpending',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'MediaMessage',
            title: 'Media Messages',
            // icon: 'fa fa-medium fa-2x',
            url: '/pages/archivedashboard/media',
            selected: false,
            hidden: false,
            order: 7,
            subtab: [
                {
                    id: 'MediaMessageRelease',
                    title: 'Media Release',
                    url: './release',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'MediaMessagePendingApprovals',
                    title: 'Pending Approvals',
                    url: './approvalpending',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'OtherQuery',
            title: 'Other Query',
            // icon: 'fa fa-windows fa-2x',
            url: '/pages/archivedashboard/otherQuery',
            selected: false,
            hidden: false,
            order: 8,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CrewQuery',
            title: 'Crew Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/crewQuery',
            selected: false,
            hidden: false,
            order: 9,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'PassengerQuery',
            title: 'Passenger Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/passengerquery',
            selected: false,
            hidden: false,
            order: 10,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CargoQuery',
            title: 'Cargo Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/cargoquery',
            selected: false,
            hidden: false,
            order: 11,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'MediaQuery',
            title: 'Media Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/mediaquery',
            selected: false,
            hidden: false,
            order: 12,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'FutureTravelQuery',
            title: 'Future Travel Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/futuretravelquery',
            selected: false,
            hidden: false,
            order: 13,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'GeneralUpdateQuery',
            title: 'General Update Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/generalupdatequery',
            selected: false,
            hidden: false,
            order: 14,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'SituationalUpdatesQuery',
            title: 'Situational Updates Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/situationalupdatesquery',
            selected: false,
            hidden: false,
            order: 15,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'CustomerDissatisfactionQuery',
            title: 'Customer Dissatisfaction Query',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/customerdissatisfactionquery',
            selected: false,
            hidden: false,
            order: 16,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedcalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }, {
            id: 'GroundVictims',
            title: 'Ground Victims',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/archivedashboard/groundmembers',
            selected: false,
            hidden: false,
            order: 17
        }, {
            id: 'GroundVictimQuery',
            title: 'Ground Victim Query',
            url: '/pages/archivedashboard/groundvictimquery',
            selected: false,
            hidden: false,
            order: 18,
            subtab: [
                {
                    id: 'ReceivedCalls',
                    title: 'Received Calls',
                    url: './receivedCalls',
                    selected: false,
                    hidden: false,
                    order: 1
                }, {
                    id: 'AssignedCalls',
                    title: 'Assigned Calls',
                    url: './assignedCalls',
                    selected: false,
                    hidden: false,
                    order: 2
                }
            ]
        }

    ] as ITabLinkInterface[];

    public static MasterDataTAB_LINKS: ITabLinkInterface[] = [
        {
            id: 'userprofile',
            title: 'User Profile',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/masterdata/userprofile',
            selected: false,
            hidden: false,
            order: 1
        }, {
            id: 'masterdatachecklist',
            title: 'Checklist',
            // icon: 'fa fa-chrome fa-2x',
            url: '/pages/masterdata/checklist',
            selected: false,
            hidden: false,
            order: 2
        }, {
            id: 'User-DeptMapping',
            title: 'User Department Mapping',
            // icon: 'fa fa-linux fa-2x',
            url: '/pages/masterdata/userpermission',
            selected: false,
            hidden: false,
            order: 3
        }, {
            id: 'department',
            title: 'Department',
            // icon: 'fa fa-apple fa-2x',
            url: '/pages/masterdata/department',
            selected: true,
            hidden: false,
            order: 4
        }, {
            id: 'emergencytype',
            title: 'Crisis Type',
            // icon: 'fa fa-drupal fa-2x',
            url: '/pages/masterdata/emergencytype',
            selected: false,
            hidden: false,
            order: 5
        }, {
            id: 'emergencydepartment',
            title: 'Crisis Department Mapping',
            // icon: 'fa fa-firefox fa-2x',
            url: '/pages/masterdata/emergencydepartment',
            selected: false,
            hidden: false,
            order: 6
        }, {

            id: 'emergencylocation',
            title: 'Responsible Station',
            // icon: 'fa fa-twitter fa-2x',
            url: '/pages/masterdata/affectedstation',
            selected: false,
            hidden: false,
            order: 7
        }, {
            id: 'demandtype',
            title: 'Demand Type',
            // icon: 'fa fa-edge fa-2x',
            url: '/pages/masterdata/demandtype',
            order: 8
        }, {
            id: 'Dept-FunctionalityMapping',
            title: 'Department Functionality Mapping',
            // icon: 'fa fa-windows fa-2x',
            url: '/pages/masterdata/pagefunctionality',
            selected: false,
            hidden: false,
            order: 9
        }, {
            id: 'quicklink',
            title: 'Quicklinks',
            // icon: 'fa fa-envira fa-2x',
            url: '/pages/masterdata/quicklink',
            selected: false,
            hidden: false,
            order: 10
        }, {
            id: 'template',
            title: 'Notification Template',
            // icon: 'fa fa-medium fa-2x',
            url: '/pages/masterdata/template',
            selected: false,
            hidden: false,
            order: 11
        }, {
            id: 'broadcastdepartment',
            title: 'Broadcast Department Mapping',
            // icon: 'fa fa-medium fa-2x',
            url: '/pages/masterdata/broadcastdepartment',
            selected: false,
            hidden: false,
            order: 12
        }, {
            id: 'spiel',
            title: 'Configuration',
            // icon: 'fa fa-medium fa-2x',
            url: '/pages/masterdata/spiel',
            selected: false,
            hidden: false,
            order: 13
        }
    ] as ITabLinkInterface[];
}

export enum DataModels {
    DEPARTMENT = 'departments' as any,
}

export const LayoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const WEBREQUEST = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
};

export const IMAGES_ROOT = 'assets/images/';

export const LayoutPaths = {
    images: {
        root: IMAGES_ROOT,
        profile: IMAGES_ROOT + 'app/profile/'
        // amMap: 'assets/img/theme/vendor/ammap/',
        // amChart: 'assets/img/theme/vendor/amcharts/dist/amcharts/images/'
    }
};

export const layoutSizes = {
    resWidthCollapseSidebar: 1200,
    resWidthHideSidebar: 500
};

export const isMobile = () =>
    (/android|webos|iphone|ipad|ipod|blackberry|windows phone/)
        .test(navigator.userAgent.toLowerCase());

export const NotificationEvents = {
    IncidentChangeFromDashboardEvent: 'incidentChangefromDashboard',
    DepartmentChangeFromDashboardEvent: 'departmentChangeFromDashboard',
    IncidentCreatedEvent: 'incidentCreate',
    ContactClickedEvent: 'contactClicked',
    DepartmentChangedEvent: 'departmentChange',
    IncidentChangedEvent: 'incidentChange',
    CheckListStatusChangedEvent: 'checkListStatusChange',
    AffectedPersonStatusChangedEvent: 'AffectedPersonStatusChanged',
    BroadcastPublishedEvent: 'BroadcastPublished',
    CallRecievedEvent: 'CallRecieved',
    ClosePDAEnqueryReceivedEvent: 'closePDAEnqReceived',
    DemandApprovedEvent: 'DemandApproved',
    DemandAssignedEvent: 'DemandAssigned',
    DemandCompletedEvent: 'DemandCompleted',
    DemandAddedUpdatedEvent: 'DemandAddedUpdated',
    OnDemandUpdateEvent: 'OnDemandUpdate',
    OnDemandDetailClickEvent: 'OnDemandDetailClick',
    MediaReleasePublishedEvent: 'MediaReleasePublished',
    PresidentsMessagePublishedEvent: 'PresidentsMessagePublished',
    PresidentMessagePublished: 'PresidentMessagePublished',
    ActiveLinkClickedEvent: 'menu.activeLink',

    DemandCreationResponse: 'ReceiveDemandCreationResponse',
    DemandApprovedResponse: 'ReceiveDemandApprovedResponse',
    DemandAssignedResponse: 'ReceiveDemandAssignedResponse',
    DemandClosedResponse: 'ReceiveDemandClosedResponse',
    CompletedDemandAssignedResponse: 'ReceiveCompletedDemandAssignedResponse',
    CompletedDemandstoCloseResponse: 'ReceiveCompletedDemandstoCloseResponse',
    DemandRejectedFromApprovalResponse: 'ReceiveDemandRejectedFromApprovalResponse',
    RejectedDemandsFromClosureResponse: 'ReceiveRejectedDemandsFromClosureResponse'
}