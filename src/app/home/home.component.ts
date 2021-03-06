import { Component, OnInit } from '@angular/core';

import { environment } from '../../environments/environment';

import { AuthService } from '../auth/auth.service';

import { GetUserService } from '../services/user/get-user.service'; //used for getting organizations
import { InOrgService } from "../services/user/in-org.service";
import { DirectorService } from "../services/user/director.service";

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  currentUser: any;

  userName: string;
  accessLevel: number; //debug

  organizations: any;

  title = "Home"

  fullImagePath = '/assets/images/thfflogo1.JPG';
  fullImagePath2 = '/assets/images/cv_busses1.JPG';

  env: any;
  API: any;

  InOrganization: boolean;

  inOrgCheck: boolean;

  IsDirector: boolean;

  /* Constructor */
  constructor(
    public authService: AuthService,
    private inOrg: InOrgService,
    private getUserService: GetUserService,
    private directorService: DirectorService) {

    console.log("Home Constructor")

    this.getBackendURL();

    this.inOrg.currentInOrg.subscribe(message => {

      this.inOrgCheck = message;

      console.log('inOrgCheck change', this.inOrgCheck)
      if (this.inOrgCheck) {
        console.log('in org')
        this.InOrganization = true;

      }
      else {
        this.InOrganization = false;
      }

    })

    // this.directorService.currentIsDirector.subscribe(message => {

    //   this.IsDirector = message;

    // })

    this.env = environment.envName;

    //if not production get the localhost from the environment file
    if (!environment.production) {
      this.API = environment.API_URL;
    }
    //else it doesn't need to be set

    console.log("this.authService.isExpired()", this.authService.isExpired())

    if (!this.authService.isExpired()) {
      console.log("currentUser");
      console.log(localStorage.getItem('currentUser'));

      if (localStorage.getItem('currentUser')) {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        console.log(this.currentUser.username);
        this.userName = this.currentUser.username;
        this.accessLevel = this.currentUser.accessLevel;

        if (this.accessLevel > 1) {
          this.IsDirector = true;

          //   this.directorService.changeMessage(this.IsDirector)

        }
        else {
          this.IsDirector = false;

          //   this.directorService.changeMessage(this.IsDirector)
          // 
        }

        this.getOrganizations();

      }

    }

  }//end of constructor

  /* ngOnInit */

  ngOnInit() {

    console.log("ngOnInit")

    if (!this.authService.isExpired()) {
      console.log("currentUser");
      console.log(localStorage.getItem('currentUser'));

      if (localStorage.getItem('currentUser')) {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        console.log(this.currentUser.username);
        this.userName = this.currentUser.username;
        this.accessLevel = this.currentUser.accessLevel;

        if (this.accessLevel > 1) {
          this.IsDirector = true;

          // this.directorService.changeMessage(this.IsDirector)

        }
        else {
          this.IsDirector = false;

          // this.directorService.changeMessage(this.IsDirector)

        }


        this.getOrganizations();

      }

    }

  }//end of ngOnInit

  //check if user is in an organization
  getOrganizations() {

    console.log('get organizations');

    this.getUserService.getUserbyUsername(this.userName)
      .subscribe(
        (user) => {

          console.log('user', user);

          if (user.length > 0) {

            if (user[0].organizations.length > 0) {

              this.organizations = user[0].organizations;

              console.log('this.organizations', this.organizations)

              this.InOrganization = true;

              this.inOrg.changeMessage(true)

            }
            else {
              console.log('not in any organizations')

              this.InOrganization = false;

              this.inOrg.changeMessage(false)

            }

          }
          else {

            console.log('no user')

          }

        })

  }//end of getOrganizations

  getBackendURL() {

    if (environment.production) {

      this.authService.initializeBackendURL().subscribe(
        (backendUrl) => {

          console.log('backendUrl', backendUrl.url);

          if (backendUrl) {
            sessionStorage.setItem('backend_url', backendUrl.url);
          }
          else {
            console.log('Can´t find the backend URL, using a failover value');
            sessionStorage.setItem('backend_url', 'https://failover-url.com');
          }

          this.API = backendUrl.url;

        })

    }

  }

}
