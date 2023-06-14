import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { ComponentStore } from '@ngrx/component-store';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, map, switchMap, tap } from 'rxjs';
import { SignalrService } from '../../services/signalr.service';

export interface UserComponentState{
  users: User[];
  currentUser: User;

}

@Injectable({
  providedIn: 'root'
})
export class UserComponentStore extends ComponentStore<UserComponentState> {

  readonly users$ = this.select(x => x.users);
  readonly currentUser$ = this.select(x => x.currentUser);
  readonly getUser$ = this.effect((userId$: Observable<number>) => userId$.pipe(map((userId:number)=> this.select(x=> x.users.find(u=> u.id = userId)))));

  readonly loadUsers = this.effect((userAdded$: Observable<any>) => userAdded$.pipe(
    switchMap((userAdded: any) => this._http.get<User[]>('https://localhost:44368/api/User')),
    tap((users: User[])=> {
      this.updateUsers(users);
    })
  ));

  readonly updateUsers = this.updater((state: UserComponentState, users:User[]) =>  {
    return {...state, users: users.filter(x => x.id != state.currentUser.id)};
  });

  readonly saveUser = this.effect((user$: Observable<User>) => user$.pipe(
    switchMap((user: User) => this._http.post<User>('https://localhost:44368/api/User', user)),
    tap((user: User)=> {
      this.loginStart(user)
    })
  ));

  readonly login = this.effect((user$: Observable<any>) => user$.pipe(
    switchMap((user: any) => this._http.get<User>('https://localhost:44368/api/User/Login', {params: {username: user.username, password: user.password}})),
    tap((user: User)=> {
      this.loginStart(user);
      
    })
  ));

  // try {
  //   await this.signalR.startConnection(this.currentUser);
  //   this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  // } catch (error) {
  //   console.error(`Can't join room, error ${error}`);
  // }

  async canActivate() {
    let userExist!:User;
    
    await this.select(x => x.currentUser).subscribe((user:User) =>  userExist = user);
    if(userExist){
      //this._signalr.startConnection(userExist.username);
      return true;
    }
    this._router.navigate(['/login']);
    return false;
  }

  loginStart(user: User){
      this.patchState({currentUser: user});
      localStorage.setItem('user', JSON.stringify(user));
      this._signalr.startConnection(user.username);
      this._router.navigate(['./']);
  }

  constructor(private _http: HttpClient, private _router: Router, private _signalr: SignalrService) {
    //super({users: [], currentUser: JSON.parse(localStorage.getItem('user')!)});
    super({users: [], currentUser: JSON.parse(localStorage.getItem('prev-user')!)});
    //this.state$.pipe()
  }
}
