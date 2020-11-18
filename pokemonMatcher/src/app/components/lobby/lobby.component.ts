import { Component,  OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from '../../interfaces/user'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { GameService } from '../../services/game.service'
import { Cards  } from '../../interfaces/cards'
import { PlayerSelect } from '../../interfaces/player-select'


@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {
  public getUsers: AngularFirestoreCollection<User>
  users: User[] = []
  cards: Cards
  optionselected: number
  playerSelect: PlayerSelect[]
  setSelected: string

  user: firebase.User
  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private game: GameService,
  ) {
    this.getUsers = this.db.collection('Users')
  }

  ngOnInit(): void {
    this.playerSelect = [
      {id: 0, viewValue: '--Please choose an option--'},
      {id: 1, viewValue: 'Single Player'},
      {id: 2, viewValue: '2 Players'},
      {id: 3, viewValue: '3 Players'},
      {id: 4, viewValue: '4 Players'}
      ]
      this.optionselected=0
      this.setSelected= "base1"

    this.getSets()
    this.auth.getUserState()
    .subscribe(user => {
      this.user = user;

    })

    this.getUsersObservable().subscribe(users => {
      this.users = users

      console.log(users)
    });

}

  getSets(){
   this.game.getCardSets().subscribe(data =>{
     this.cards = data
     console.log(this.cards)

   })
  }


//getting all users/data
  getUsersObservable(): Observable<User[]> {
    return this.getUsers.snapshotChanges()
      .pipe(
        map((items: DocumentChangeAction<User>[]): User[] => {
          return items.map((item: DocumentChangeAction<User>): User => {
            return {
              uid: item.payload.doc.id,
              displayName: item.payload.doc.data().displayName,
              password: item.payload.doc.data().displayName,
              email: item.payload.doc.data().email,
              photoURL: item.payload.doc.data().photoURL,
              totalBattle: item.payload.doc.data().totalBattle,
              wins: item.payload.doc.data().wins,
              losses: item.payload.doc.data().losses,
              wonTo: item.payload.doc.data().wonTo,
              lostTo: item.payload.doc.data().lostTo
            };
          });
        }),

      );
  }
//pokemon radio btn
selecteds: number[] = [] ;
  clickEvent(selected: number){
    let userCheck = this.optionselected
    const index = this.selecteds.indexOf(selected);

      if (index > 0 ) {
        this.selecteds.splice(index, 1);
      } else if(index == 0){
        this.selecteds.shift()

    } else{
      if(userCheck != this.selecteds.length){
       this.selecteds.push(selected)
      }
    }
}



//game room stuff
goToGame(id: string): void {
  this.router.navigate([`game-room/${id}` ]);
}

}
