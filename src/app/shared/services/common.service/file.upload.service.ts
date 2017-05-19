import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs/Rx';
import { UtilityService } from '../common.service';
import { FileData } from '../../models/base.model';
 
@Injectable()
export class FileUploadService {
    private progressObservable: Observable<number>;
    private progressObserver: Observer<number>;
    private progress: number;
 
    /**
     * Creates an instance of FileUploadService.
     *
     * @memberOf FileUploadService
     */
    constructor() {
        this.progressObservable = new Observable((observer: Observer<number>) => {
            this.progressObserver = observer;
        });
   }
 
    /**
     * Get file upload progress observable;
     *
     * @returns {Observable<number>}
     *
     * @memberOf FileUploadService
     */
    public getProgressObservable(): Observable<number> {
        return this.progressObservable;
    }
 
    /**
     * File uploading service request
     *
     * @template T
     * @param {string} url
     * @param {File[]} files
     * @param {string} [fieldName='']
     * @returns {Observable<T>}
     *
     * @memberOf FileUploadService
     */
    public uploadFiles<T>(url: string, files: FileData[] | File[], fieldName: string = ''): Observable<T> {
        if (files.length > 0) {            
            const fileUploadPromise: Promise<T> = new Promise((resolve, reject) => {
                const formData: FormData = new FormData();
                const xhr: XMLHttpRequest = new XMLHttpRequest();
 
                if (files[0] instanceof FileData) {
                    for (const file of files) {
                        const fileData: FileData = file as FileData;
                        formData.append(fileData.field, fileData.file, fileData.file.name);
                        console.log(formData);
                    }
                }
                else {
                    for (const f of files) {
                        const file: File = f as File;
                        formData.append('uploads[]', file, file.name);
                    }
                }
 
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve((xhr.response !== "") ? JSON.parse(xhr.response) as T : new Object() as T);
                        } else {
                            reject(xhr.response);
                        }
                    }
                };
 
                xhr.upload.onprogress = (event: ProgressEvent) => {
                    this.progress = Math.round(event.loaded / event.total * 100);
                };
 
                xhr.upload.ontimeout = (event: ProgressEvent) => {
                    this.progressObserver.error('Upload timed out');
                };
 
                xhr.open('POST', url, true);
                xhr.send(formData);
            });
 
            return Observable.fromPromise(fileUploadPromise);
        }
    }

     public uploadFilesWithDate<T>(url: string, files: File[], date: string): Observable<T> {
        if (files.length > 0) {            
            const fileUploadPromise: Promise<T> = new Promise((resolve, reject) => {
                const formData: FormData = new FormData();
                const xhr: XMLHttpRequest = new XMLHttpRequest();
                for (const f of files) {
                    const file: File = f as File;
                    formData.append(date, file, file.name);                    
                }                
 
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve((xhr.response !== "") ? JSON.parse(xhr.response) as T : new Object() as T);
                        } else {
                            reject(xhr.response);
                        }
                    }
                };
 
                xhr.upload.onprogress = (event: ProgressEvent) => {
                    this.progress = Math.round(event.loaded / event.total * 100);
                };
 
                xhr.upload.ontimeout = (event: ProgressEvent) => {
                    this.progressObserver.error('Upload timed out');
                };
 
                xhr.open('POST', url, true);
                xhr.send(formData);
            });
 
            return Observable.fromPromise(fileUploadPromise);
        }
    }
 
 
    /**
     * Set interval for frequency with which Observable inside Promise will share data with subscribers.
     *
     * @private
     * @param {number} interval
     *
     * @memberOf FileUploadService
     */
    private setUploadUpdateInterval(interval: number): void {
        setInterval(() => { }, interval);
    }
}