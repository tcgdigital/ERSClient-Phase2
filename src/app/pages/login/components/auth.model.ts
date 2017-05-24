export class AuthRequestModel {
    constructor(public username: string,
        public password: string,
        public grant_type: string,
        public client_id: string,
        public device_id?: string) { }
}

export class AuthResponseModel {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export class ForgotPasswordModel{
    EmailOrUserName: string;
    SecurityQuestion: string;
    SecurityAnswer: string;
    NewPassword: string;
    ConfirmPassword: string;
}

export class ChangePasswordModel {
    SecurityQuestion: string;
    SecurityAnswer: string;
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}