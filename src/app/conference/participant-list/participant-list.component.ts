import { Component } from '@angular/core';
import { UserComponentStore } from '../../user/services/user-component.store';
import { ConferenceComponentStore } from '../services/conference-component.store';
import { User } from 'src/app/models/user.model';
import { Participant } from 'src/app/models/participant.model';

@Component({
  selector: 'vc-participant-list',
  templateUrl: './participant-list.component.html',
  styleUrls: ['./participant-list.component.scss']
})
export class ParticipantListComponent {
  participantsNotCurrent$ = this.conferenceStore.participantsNotCurrent$;
  //users$ = this.userStore.users$;

  constructor(private userStore: UserComponentStore, private conferenceStore:ConferenceComponentStore){}

  startUser(p: Participant){

    this.conferenceStore.startUser(p);
  }
}
