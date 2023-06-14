import { Component, OnInit } from '@angular/core';
import { ConferenceComponentStore } from '../services/conference-component.store';
import { RtcService } from '../../services/rtc.service';
import { Participant } from '../../models/participant.model';
import { SignalrService } from '../../services/signalr.service';

@Component({
  selector: 'vc-conference',
  templateUrl: './conference.component.html',
  styleUrls: ['./conference.component.scss']
})
export class ConferenceComponent implements OnInit {

  stream:any;
  
  participants$ = this.conferenceStore.participants$;
  
  currentParticipant$ = this.conferenceStore.currentParticipant$;

  adminParticipant$ = this.conferenceStore.adminParticipant$

  constructor(private conferenceStore: ConferenceComponentStore, private _rtcService: RtcService, private _signalr: SignalrService){

  }
  async ngOnInit(){
    //this.conferenceStore.updateParticipants(this._signalr.helloAnswer$);
    this.conferenceStore.updateParticipants(this._signalr.helloAnswer$);
    this.conferenceStore.newParticipant(this._signalr.newPeer$);
    
    
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.conferenceStore.updateStream(stream);

      // this.currentParticipant$.subscribe((participant) =>{
      //   if(participant){
      //     const peer = this._rtcService.createPeer(this.stream, participant.connectionId, true);
      //     this._rtcService.currentPeer = peer;
      //   }
      // });
    
    }
    catch{}
  }

  public onUserSelected(participant: Participant) {
    
  }


}
