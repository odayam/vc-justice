import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
//import { UserService } from '../user.service';
import { User } from '../../models/user.model';
import { UserComponentStore } from '../services/user-component.store';

@Component({
  selector: 'vc-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userForm!:FormGroup;
  isRegister = false;

  constructor(private formBuilder: FormBuilder, private userStore: UserComponentStore){

  }

  ngOnInit() {
        let user:User = JSON.parse(localStorage.getItem('user')!);
    this.userForm = this.formBuilder.group({
       firstName: new FormControl(user?.firstName),
       lastName: new FormControl(user?.lastName),
       username: new FormControl(user?.username),
       password: new FormControl(user?.password),
       jobTitle: new FormControl(user?.jobTitle),
       isAdmin: new FormControl(user?.isAdmin)
       });
    }

  onSubmit(): void {
    if(this.isRegister){
      this.userStore.saveUser({...this.userForm.value, connectionId: ''});
    }
    else{
      this.userStore.login({username: this.userForm.value['username'], password: this.userForm.value['password']});
    }
    
    
  }

}
