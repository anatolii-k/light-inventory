import { Injectable } from "@angular/core";
import { invoke } from "@tauri-apps/api/core";
import { from, Observable } from 'rxjs';

export interface OwnerInfo{
    name:string
}

@Injectable( {providedIn: 'root'} )
export class OwnerService{

    getOwnerInfo() : Observable<OwnerInfo>  {
        return from(invoke<OwnerInfo>('get_owner_info'));  
    }
}