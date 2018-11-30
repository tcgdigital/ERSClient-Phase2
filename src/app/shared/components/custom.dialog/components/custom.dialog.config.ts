import { InjectionToken } from '@angular/core';
import { CustomDialogTheme } from './custom.dialog.theme';


/**
 * Base configuration object. It applies to both local and global
 * settings. Local refers to config passed through the service's
 * methods; Global referes to config passed through the module's
 * .forRoot()
 */
export class CustomDialogsBaseConfig {
  /**
   * Dialog theme
   */
  theme?: CustomDialogTheme;

  /**
   * Text of the 'OK' button
   */
  okButtonText?: string;

  /**
   * Text of the 'Cancel' button
   */
  cancelButtonText?: string;

  /**
   * Color for buttons (fill, labels and borders)
   */
  color?: string;

  constructor() {
    this.theme = 'default';
    this.color = '#3F51B5';
  }
}

/**
 * Object used to set the titles of all dialogs upfront
 */
export interface CustomDialogsGlobalTitles {
  titles?: {
    alert?: string,
    confirm?: string,
    prompt?: string
  };
}

/**
 * Models the props you can change only via service's methods
 */
export interface CustomDialogsLocalConfigComplement {
  title?: string;
  defaultText?: string;
}

/**
 * Represents the allowable interface for global config only
 */
export type CustomDialogsGlobalConfig =
  CustomDialogsBaseConfig &
  CustomDialogsGlobalTitles;

/**
 * Represents the allowable interface for local config only
 */
export type CustomDialogsLocalConfig =
  CustomDialogsBaseConfig &
  CustomDialogsLocalConfigComplement;

/**
 * Represents a union between global and local configs
 */
export type CustomDialogsCompleteConfig =
  CustomDialogsBaseConfig &
  CustomDialogsGlobalTitles &
  CustomDialogsLocalConfigComplement;

/**
 * Configuration injection token
 */
export let CUSTOM_DIALOG_CONFIG =
  new InjectionToken<CustomDialogsGlobalConfig>('custom.dialog.config');