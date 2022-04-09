import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { type_user, ws_url } from '../../../../environments/environment';
import { ToolsService } from '../../../services/tools.service';
import { TypeUtilsateurService } from '../../../services/type-utilsateur.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  type_utilisateur: any;
  loginPostUrl: any;
  constructor(private http: HttpClient, private typeUtilisateurService: TypeUtilsateurService, private router: Router, private toolsService: ToolsService) {
    this.loadUtilisateur();
    this.loginPostUrl = ws_url + "login"
  }
  //
  urlLogin(type_utilisateur: string) {
    var lien: string = '';
    switch (type_utilisateur) {
      case type_user.user_client:
        lien = 'index-client'
        break
      case type_user.user_resto:
        lien = 'index-resto'
        break
      case type_user.user_ekaly:
        lien = 'index-ekaly'
        break
      case type_user.user_livreur:
        lien = 'index-livreur'
        break
      default:
        break
    }
    return lien;
  }
  //login
  login(data: any) {
    const onSuccess = (response: any) => {
      if (response['meta']['status'] == 200) {
        localStorage.setItem('token', response['data']['token'])
        localStorage.setItem('id_type_u', response['data']['id_type_u'])
        localStorage.setItem('id_user', response['data']['_id'])
        console.log('USER ' + localStorage.getItem('id_user'))
        var url = this.urlLogin(response['data']['id_type_u'])
        this.router.navigateByUrl(url)
      } else {

      }
    }
    const onError = (response: any) => {
      console.log("err");
    }
    var input = {
      mdp: data.mdp,
      email: data.email,
      id_type_u: data.id_type_u
    }
    const options = this.toolsService.formOption();
    var observable = this.http.post(this.loginPostUrl, input, options);
    observable.subscribe(onSuccess, onError);
  }
  loadUtilisateur() {
    this.type_utilisateur = this.typeUtilisateurService.findAll()
      .subscribe((data: any) => this.type_utilisateur = data);
  }
  ngOnInit(): void {
  }
}
