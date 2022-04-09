import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ws_url } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TypeUtilsateurService {

  constructor(private http: HttpClient) {}
  findAll() {
    var type_utilisateur: any = this.http.get(ws_url + "type_utilisateur");
    return type_utilisateur;
  }
}
