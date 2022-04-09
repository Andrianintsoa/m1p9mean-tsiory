import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ws_url } from '../../../../environments/environment';
import { InscriptionService } from '../../../services/inscription.service';
import { ToolsService } from '../../../services/tools.service';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  nom: any = ''
  adresse: any = ''
  mdp: any = ''
  email: any = ''
  message: any
  constructor(private http: HttpClient, private inscriptionService: InscriptionService, private toolsService: ToolsService, private router: Router) { }

  ngOnInit(): void {
  }

  public inscriptionClient(data: any) {
    console.warn(data);
    const onSuccess = (response: any) => {
      if (response['meta']['status'] == 200) {
        this.router.navigateByUrl('login');
      } else {
        // status 400
        console.warn(response)
      }
    }
    const onError = (response: any) => {
      console.log("err");
    }
    var input = {
      nom: data.nom,
      adresse: data.adresse,
      mdp: data.mdp,
      email: data.email
    }

    const options = this.toolsService.formOption();
    var observable = this.http.post(ws_url + 'clients', input, options);
    observable.subscribe(onSuccess, onError);
  }

  inscriptionVaovao() {
    const input = {
      nom: this.nom,
      adresse: this.adresse,
      mdp: this.mdp,
      email: this.email
    };

    const onSuccess = (response: any) => {
      if (response['status'] == 200) {
        this.message = 'Ajout ok';
      } else {
        // status 400
        this.message = "Some error";
      }
    }

    const onError = (response: any) => {

    }

    try {
      this.inscriptionService.inscription(input).subscribe(onSuccess, onError);
    } catch (err) {
      this.message = err;
    }
  }
}
