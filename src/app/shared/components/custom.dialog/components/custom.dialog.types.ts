import { Observable } from 'rxjs/Observable';

/**
 * Available dialog types
 */
export enum CustomDialogType {
  Alert, Confirm, Prompt
}

/**
 * Payload return by the result callback of the prompt dialog
 */
export interface CustomDialogPromptResult {
  result: boolean;
  value: string;
}

/**
 * Generic dialog result type
 */
export type CustomDialogResult = Observable<boolean | CustomDialogPromptResult>;