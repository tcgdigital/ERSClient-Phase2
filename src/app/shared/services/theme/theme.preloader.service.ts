import { Injectable } from '@angular/core';

@Injectable()
export class ThemePreloaderService {

    private static _loaders: Array<Promise<any>> = [];

    public static RegisterLoader(method: Promise<any>): void {
        ThemePreloaderService._loaders.push(method);
    }

    public static Clear(): void {
        ThemePreloaderService._loaders = [];
    }

    public static Load(): Promise<any> {
        return new Promise((resolve, reject) => {
            ThemePreloaderService.ExecuteAll(resolve);
        });
    }

    private static ExecuteAll(done: Function): void {
        setTimeout(() => {
            Promise.all(ThemePreloaderService._loaders).then((values) => {
                done.call(null, values);
            }).catch((error) => {
                console.error(error);
            });
        });
    }
}
