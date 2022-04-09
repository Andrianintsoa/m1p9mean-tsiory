import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ws_url } from '../../environments/environment';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class InscriptionService {

  constructor(private http: HttpClient, private toolsServ: ToolsService) { }
  inscription(input: any) {
    const options = this.toolsServ.formOption();
    return this.http.post(ws_url + 'clients', input, options);
  }
}
