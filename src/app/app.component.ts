import { Component, OnInit } from '@angular/core';
import { SignalrService } from './services/signalr.service';
import { UserComponentStore } from './user/services/user-component.store';
import { RtcService } from './services/rtc.service';
import { Subscription } from 'rxjs';
import { SignalInfo } from './models/signal.model';
import { PeerData } from './models/peer-data.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'vc-justice';

  user$ = this.userStore.currentUser$;
  users$ = this.userStore.users$;
  subscriptions = new Subscription();
  stream!:string;
  constructor(private _signalr: SignalrService, private userStore: UserComponentStore, private _rtcService: RtcService) {
    
  }

  
  ngOnInit() {
    this.userStore.loadUsers(this._signalr.newPeer$);
    this.userStore.loadUsers(this._signalr.disconnectedPeer$);
    this.userStore.loadUsers(this._signalr.helloAnswer$);

    this.subscriptions.add(this._signalr.signal$.subscribe((signalData: SignalInfo) => {
      this._rtcService.signalPeer(signalData.user, signalData.signal, this.stream);
    }));

    this.subscriptions.add(this._rtcService.onSignalToSend$.subscribe((data: PeerData) => {
      this._signalr.sendSignalToUser(data.data, data.id);
    }));

  }

}
