import { Injectable } from '@angular/core';

@Injectable()
export class ImageLoaderService {
    public Load(src): Promise<any> {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = src;
            img.onload = () => {
                resolve();
                // resolve('Image with src ' + src + ' loaded successfully.');
            };
            img.onerror = () => {
                reject('Image with src ' + src + ' not loaded successfully.');
            }
        });
    }
}
