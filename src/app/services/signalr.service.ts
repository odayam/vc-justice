import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import  * as signalR  from '@aspnet/signalr'
import { User } from '../models/user.model';
import { SignalInfo } from '../models/signal.model';
import { Participant } from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class SignalrService {
private hubConnection!: signalR.HubConnection;

private newPeer = new Subject<Participant>();
public newPeer$ = this.newPeer.asObservable();

private helloAnswer = new Subject<Participant[]>();
public helloAnswer$ = this.helloAnswer.asObservable();

private mute = new Subject<SignalInfo>();
public mute$ = this.mute.asObservable();

private muteUpdate = new Subject<SignalInfo>();
public muteUpdate$ = this.muteUpdate.asObservable();

private disconnectedPeer = new Subject<Participant>();
public disconnectedPeer$ = this.disconnectedPeer.asObservable();

private signal = new Subject<SignalInfo>();
public signal$ = this.signal.asObservable();

  constructor() { }

  public async startConnection(currentUser: string): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44368/signalrtc')
      .build();

    await this.hubConnection.start();
    console.log('Connection started');

    this.hubConnection.on('NewUserArrived', (data) => {
      this.newPeer.next(JSON.parse(data));
    });

    this.hubConnection.on('Hello', (data) => {
      this.helloAnswer.next(JSON.parse(data));
    });
    this.hubConnection.on('Mute', (data) => {
      this.mute.next(JSON.parse(data));
    });

    this.hubConnection.on('MuteUpdate', (data) => {
      this.muteUpdate.next(JSON.parse(data));
    });

    this.hubConnection.on('UserDisconnect', (data) => {
      this.disconnectedPeer.next(JSON.parse(data));
    });

    this.hubConnection.on('SendSignal', (user, signal) => {
      this.signal.next({ user, signal });
    });

    this.hubConnection.invoke('NewUser', currentUser);
  }

  public sendSignalToUser(signal: string, user: string) {
    this.hubConnection.invoke('SendSignal', signal, user);
  }
  
  public sayHello(userName: string, user: string): void {
    this.hubConnection.invoke('HelloUser', userName, user);
  }

  public muteUser(user: string, ): void {
    this.hubConnection.invoke('Mute', user);
  }
  public updateMuteState(user: string, isMute:boolean): void {
    this.hubConnection.invoke('IAmMute', user, isMute);
  }
  
}
