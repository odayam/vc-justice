import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { map, takeUntil } from 'rxjs';
import { Participant } from 'src/app/models/participant.model';
import { User } from 'src/app/models/user.model';
import { UserComponentStore } from '../../user/services/user-component.store';
import { ConferenceComponentStore } from '../services/conference-component.store';
import { PeerData } from 'src/app/models/peer-data.model';
import { RtcService } from 'src/app/services/rtc.service';
import { SignalrService } from 'src/app/services/signalr.service';
import { SignalInfo } from 'src/app/models/signal.model';

@Component({
  selector: 'vc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements AfterViewInit{

  @Input() participant: Participant | null | undefined;
  
  @ViewChild('videoPlayer')  videoPlayer!: ElementRef;
 

  canMute:boolean = false;
  isMute:boolean = false;

  constructor(private userStor: UserComponentStore, private conferenceStore: ConferenceComponentStore, private _rtcService:RtcService, private _signalr: SignalrService){
    // this.participant = null;
   

    

  }
  ngAfterViewInit(): void {
    
    if(this.participant?.isCurrent){
      this.canMute = true;
      
      
      
    }else{
      this.conferenceStore.currentParticipant$.pipe().subscribe((p: Participant | undefined)=> {
        this.canMute = p?.user.isAdmin || this.canMute;
      });
    }
    this.canMute = this.participant && this.participant.isCurrent || false; 
    this.conferenceStore.currentParticipant$.pipe().subscribe((p: Participant | undefined)=> {
      this.canMute = p?.user.isAdmin || this.participant?.user.id == p?.user.id;
    });

    this._signalr.mute$.subscribe(async data => {this.conferenceStore.mute();
      //const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      //let audioTrack = stream.getTracks().find((t: any) => t.kind === 'audio');
      //this.conferenceStore.updateStream(stream);
    });
    this._signalr.muteUpdate$.subscribe((data: SignalInfo) => {
      if(data.user == this.participant?.connectionId){
        this.isMute = data.signal;
      }
      //const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      //let audioTrack = stream.getTracks().find((t: any) => t.kind === 'audio');
      //this.conferenceStore.updateStream(stream);
    });

    this.conferenceStore.stream$.pipe().subscribe((stream)=> {
      if(this.participant?.isCurrent){
        if(this.videoPlayer){
        this.videoPlayer.nativeElement.srcObject = stream;
        this.videoPlayer.nativeElement.load();
        this.videoPlayer.nativeElement.controls = false;
        this.videoPlayer.nativeElement.play();

        }
        let audioTrack = stream.getTracks().find((t: any) => t.kind === 'audio');
        if(this.isMute != audioTrack.enabled){
            this.isMute = audioTrack.enabled;
            this._signalr.updateMuteState(this.participant?.connectionId || '', this.isMute)
        }
        
      }
    });

    this._rtcService.onStream$.subscribe((data: PeerData) => {
    if(data.id == this.participant?.connectionId){
      this.videoPlayer.nativeElement.srcObject = data.data;
      this.videoPlayer.nativeElement.load();
      this.videoPlayer.nativeElement.controls = false;
      this.videoPlayer.nativeElement.play();
      let audioTrack = data.data.getTracks().find((t: any) => t.kind === 'audio');
      this.isMute = audioTrack.enabled;

    }
    
  });
  }

  async mute(){
    if(this.participant?.isCurrent){
        // const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        // this.conferenceStore.updateStream(stream);
        this.conferenceStore.mute();
        
    }
    else if(this.canMute){//checkifadmin
      this._signalr.muteUser(this.participant?.connectionId || '' );
    }

  }

  // loadStrem(){
    
  //     this.userVideo = data.id;
  //     this.videoPlayer.nativeElement.srcObject = data.data;
  //     this.videoPlayer.nativeElement.load();
  //     this.videoPlayer.nativeElement.controls = false;
  //     this.videoPlayer.nativeElement.play();
  //   }));
  // }

}
