import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './conference/conference.component';
import { VideoComponent } from './video/video.component';
import { ConferenceRoutingModule } from './conference-routing.module';
import { ActiveConferenceComponent } from './active-conference/active-conference.component';
import { ParticipantListComponent } from './participant-list/participant-list.component';



@NgModule({
  declarations: [
    ConferenceComponent,
    VideoComponent,
    ActiveConferenceComponent,
    ParticipantListComponent
  ],
  imports: [
    CommonModule,
    ConferenceRoutingModule
  ]
})
export class ConferenceModule { }
