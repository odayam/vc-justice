import { Injectable } from '@angular/core';
import { Participant } from '../../models/participant.model';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { state } from '@angular/animations';
import { RtcService } from '../../services/rtc.service';

export interface ConferenceComponentState{
  participants: Participant[];
  stream: any;
}


@Injectable({
  providedIn: 'root'
})
export class ConferenceComponentStore extends ComponentStore<ConferenceComponentState>{

  readonly participants$ = this.select(x => x.participants.filter(p => !p.user.isAdmin));
  readonly participantsNotCurrent$ = this.select(x => x.participants.filter(p => !p.isCurrent));
  readonly currentParticipant$ = this.select(x => x.participants.find(p => p.isCurrent));
  readonly adminParticipant$ = this.select(x => x.participants.find(p => p.user.isAdmin));
  readonly stream$ = this.select(x => x.stream);

  // readonly straemUpdater$ = this.effect((media: Observable<any>) => madia.patchState())
  readonly updateStream = this.updater((state: ConferenceComponentState, stream:any)=>{
    //const stream = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return {...state, stream};
  });
  readonly mute = this.updater((state: ConferenceComponentState)=>{
    let audioTrack = state.stream.getTracks().find((t: any) => t.kind === 'audio');
    audioTrack.enabled = !audioTrack.enabled;
    //const stream = navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    return {...state};
    }
  );
  readonly updateParticipants = this.updater((state: ConferenceComponentState, participants:Participant[])=>{
    return {...state, participants}
  });

  readonly newParticipant = this.updater((state: ConferenceComponentState, participant:Participant)=>{
    const p = state.participants.find(p => p.user.id == participant.user.id);
    return p? {...state} : {...state, participants: [...state.participants, participant]};
 });

  readonly startUser = this.updater((state: ConferenceComponentState, p:Participant)=>{
    const peer = this._rtcService.createPeer(state.stream, p.connectionId, true);
    this._rtcService.currentPeer = peer;
    return {...state}
  });


  constructor(private _rtcService:RtcService) {
    super({participants: [], stream: {}});
  }
}
