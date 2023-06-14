

// import { Injectable} from '@angular/core';
// import { User } from '../models/user.model';
// import { HttpClient } from '@angular/common/http';
// import { tap } from 'rxjs';
// import { Router } from '@angular/router';
// import { UserComponentStore } from '../user-component.store';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   user!: User;
//   constructor(private _http: HttpClient, private _router: Router, private userStore: UserComponentStore) {
    

    
//   }
 
//   get isLoggedIn(): boolean {
//     const user = JSON.parse(localStorage.getItem('user')!);
//     return user !== 'null' ? true : false;
//   }

//   async canActivate() {
//     let userExist = false;
//     await this.userStore.currentUser$.subscribe(user =>  userExist = user!= null);
//     return userExist;
//     // if(this.user){
//     //   return true;
//     // }
//     // else{
//     //   this._router.navigate(['/login']);
//     // }
//     // return this.isLoggedIn;
//   }

//   logOut() {
//     // return this._http.get().then(() => {
//     //   localStorage.removeItem('user');
//     //   this.router.navigate(['sign-in']);
//     // });
//   }

//   saveUser(user: User){
//     this.userStore.saveUser(user);
//     // this._http.post<User>('https://localhost:44368/api/User', user).pipe(
//     //   tap((user:User)=>{
//     //     this.user = user;
//     //     localStorage.setItem('user', JSON.stringify(this.user));
//     //     this._router.navigate(['./']);
//     //   })
//     // ).subscribe();

//   }

//   login(username: string, password: string){
//     this._router.navigate(['./']);
//   }
// }