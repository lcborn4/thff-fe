import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { ChangeEmailService } from '../../services/user/change-email.service';
import { EmailService } from '../../services/user/email.service';

//debounce
import { Subject } from 'rxjs';

import { map, takeUntil, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.css']
})
export class ChangeEmailComponent implements OnInit {

  newEmail$ = new Subject<string>();

  email: any;
  newEmail: any;
  oldEmail: any;
  nE: any;

  @Input()
  user: any;

  updatedUser: any;

  ValidChangeEmail: any;

  CanChangeEmail = false;

  results: any;

  ShowMessage = false;
  message: any;

  constructor(
    private changeEmailService: ChangeEmailService,
    private emailService: EmailService) {

    this.newEmail$.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(term => {

        this.newEmail = term;
        this.newEmailChange()
      });

  }

  ngOnInit() {

    console.log(this.user.email);

    this.email = this.user.email;

  }

  changeEmail(): void {
    console.log("changeEmail Pressed");

    var data = {
      username: this.user.username,
      email: this.newEmail
    }

    this.ValidChangeEmail = this.changeEmailService.changeEmail(data)
      .subscribe(
        (response) => {

          this.results = response;
          this.oldEmail = this.email;

          console.log('this.oldEmail', this.oldEmail)

          //edit local storage
          this.email = this.newEmail;

          this.newEmail = '';
          //set the subject to '' as well
          this.nE = '';

          this.CanChangeEmail = false;

          this.updatedUser = JSON.parse(localStorage.getItem('currentUser'));

          this.updatedUser.email = this.email;
          localStorage.removeItem('currentUser');
          localStorage.setItem('currentUser', JSON.stringify(this.updatedUser));

          if (this.results.change) {
            console.log('success')

            //output success message
            this.message = this.results.message;
            this.ShowMessage = true;

            setTimeout(() => {
              this.clearMessage();
            }, 3000);

            this.sendUserEmailChangeEmail(this.user);

          }
          else {
            console.log('fail')

            //output fail message
            this.message = 'Email Change was unsuccessful. Try Again.';
            this.ShowMessage = true;
          }

        });
  }//end of changeEmail

  newEmailChange(): void {

    console.log("newEmailChange");

    //add in logic for valid email

    if (this.newEmail != "") {
      this.CanChangeEmail = true;
    }
    else {
      this.CanChangeEmail = false;
    }
  }

  clearMessage() {

    this.message = '';

    this.ShowMessage = false;

  }

  sendUserEmailChangeEmail(user) {

    console.log('new email = ', this.email);
    console.log('old email = ', this.oldEmail);

    this.emailService.sendUserEmailChangeEmail({
      from: 'Mailgun Sandbox <postmaster@sandboxXXXXXXXXXXXXXXXXXXXXX.mailgun.org>',
      to: this.oldEmail,
      name: user.username,
      oldEmail: this.oldEmail,
      newEmail: this.email
    })
      .subscribe(
        () => { },
        err => console.log(err)
      );

  }


}
