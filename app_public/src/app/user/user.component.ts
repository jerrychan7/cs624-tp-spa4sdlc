import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  nowUsr: any = {
    id: "132",
    username: "asdf",
    email: "email",
    email_verified: true,
  };

  constructor() { }

  ngOnInit(): void {
  }

}
