import { CanActivateFn, Router } from '@angular/router';
//import { UserService } from '../user.service';
import { inject } from '@angular/core';
import { UserComponentStore } from './user-component.store';

export const authGuard: CanActivateFn = (route, state) => {
   return inject(UserComponentStore).canActivate();
};
