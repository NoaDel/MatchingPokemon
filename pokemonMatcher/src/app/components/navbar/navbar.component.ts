import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit(): void {

  }

  handleLogout(){
    this.auth.logout();
  }

}
