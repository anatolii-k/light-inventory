import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";
import { from, Observable, shareReplay } from 'rxjs';

export interface OwnerInfo{
    name:string;
    division:string;
}

@Injectable( {providedIn: 'root'} )
export class OwnerService{

    private readonly ownerInfo$ = from(invoke<OwnerInfo>('get_owner_info')).pipe(
        shareReplay(1)
    );

    getOwnerInfo(): Observable<OwnerInfo> {
        return this.ownerInfo$;
    }
}