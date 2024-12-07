import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../../services/storage/storage.service';
import { Router} from '@angular/router';
import { AuthGoogleService } from '../../../auth-google.service';
import {MsalService} from "@azure/msal-angular";
import {AuthenticationResult} from "@azure/msal-browser";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit{
  loginForm!: FormGroup;
  hidePassword: boolean = true;
  private apiUrl = 'http://localhost:8082';

  loginForm2!: FormGroup;
  //isLoggedin?: boolean;

  constructor(
    private fb: FormBuilder,


    private authService: AuthService,
    private snackbar: MatSnackBar,
    private Router: Router,
    private authGoogleService: AuthGoogleService,
    private msalService: MsalService
  ) {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    this.authGoogleService.login();
    const data: any = JSON.stringify(this.authGoogleService.getProfile());
    console.log(data);
    if (StorageService.isEmployeeLoggedIn()) {
      this.Router.navigateByUrl('/employee/dashboard');
    }

    this.authService.loginGmail(JSON.parse(data).email).subscribe((res) => {
      console.log(res);

      if (res.userId != null) {
        const user = {
          id: res.userId,
          role: res.userRole,
          name: res.name,
        };
        StorageService.saveUser(user);
        StorageService.saveToken(res.jwt);

        this.snackbar.open('Login successful', 'Close', { duration: 5000 });
      } else {
        this.snackbar.open('Invalid credentials', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      }
    });
  }

  ngOnInit() {
    if (StorageService.isEmployeeLoggedIn()) {
      this.Router.navigateByUrl('/employee/dashboard');
    }

    // this.msalService.instance.handleRedirectPromise().then(
    //   res => {
    //     if(res != null && res.account != null)
    //     {
    //       this.msalService.instance.setActiveAccount(res.account)
    //      // this.Router.navigateByUrl('/employee/dashboard');
    //
    //
    //     }
    //   }
    // )


  }

  onSubmit() {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe((res) => {
      console.log(res);
      if (res.userId != null) {
        const user = {
          id: res.userId,
          role: res.userRole,
          name: res.name,
        };
        StorageService.saveUser(user);
        StorageService.saveToken(res.jwt);
        if (StorageService.isAdminLoggedIn())
          this.Router.navigateByUrl('/admin/dashboard');
        else if (StorageService.isEmployeeLoggedIn())
          this.Router.navigateByUrl('/employee/dashboard');
        this.snackbar.open('Login successful', 'Close', { duration: 5000 });
      } else {
        this.snackbar.open('Invalid credentials', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar',
        });
      }
    });
  }
  // loginWithMicrosoft() {
  //   this.msalService.loginRedirect();
  //
  //    this.msalService.instance.handleRedirectPromise().then(() => {
  //      this.msalService.loginPopup().subscribe((response: AuthenticationResult) => {
  //        this.msalService.instance.setActiveAccount(response.account);
  //        console.log('Login successful');
  //     }, error => {
  //        console.log('Error during login:', error);
  //     });
  //    }).catch((error) => {
  //     console.error('Error initializing MSAL:', error);
  //    });
  // }
  loginWithMicrosoft()
  {
    window.location.href = `${this.apiUrl}`;
  }

}
