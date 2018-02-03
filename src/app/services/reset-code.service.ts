import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ResetCodeService {

  API_URL = environment.API_URL;

  constructor(private http: HttpClient) { }

  createResetCode(data) {
    //data is the user email
    return this.http.post(this.API_URL + '/CreateResetCode', data)
  }

}
