import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {MsalService} from "@azure/msal-angular";

export const maslGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const activeAccount = msalService.instance.getActiveAccount();

  if (activeAccount == null) {
    console.log('inside the guard - no active account');
    return false;
  }

  console.log('inside the guard - active account found:', activeAccount);
  return true;
};
