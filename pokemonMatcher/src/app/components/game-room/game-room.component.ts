import { Component, ViewChild, ElementRef, OnInit, Pipe } from '@angular/core';
// import { POKEMON } from '../../pokemon';a
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import {Cards} from '../../interfaces/cards'
import { GameService } from 'src/app/services/game.service';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators'
import { User } from '../../interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { $ } from 'protractor';
import { createReadStream } from 'fs';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {

  cards: Observable<Cards>
selecteds: Array<User>
user: User;
fbuser: firebase.User;
public getUser: AngularFirestoreDocument<User>;





  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    private auth: AuthService,
    private db: AngularFirestore,



  ){
  }
  // @ViewChild('canvas', { static: true })
  // canvas: ElementRef<HTMLCanvasElement>;

  // private ctx: CanvasRenderingContext2D;

  ngOnInit(): void {
    let card = document.getElementsByClassName("memory");
    console.log(card);
    if(window.history.state.selecteds){
      this.selecteds = window.history.state.selecteds
      console.log(this.selecteds)
    } else {
      this.router.navigateByUrl(`lobby`)
    }


    const id = this.route.snapshot.paramMap.get('id');
    const page = Math.floor(Math.random() * 20);
    const players = this.route.snapshot.paramMap.get('selecteds');
    this.cards = this.gameService.getCardSetById(id,page);
    console.log(this.cards);


    this.auth.getUserState()
    .subscribe(fbuser => {
      this.fbuser = fbuser;
      this.getUser = this.db.doc<User>(`Users/${this.fbuser.uid}`);
      this.getUserObservable().subscribe(user => {
        this.user = user;
        console.log(user);
      });
      console.log(fbuser);
    });

  }



  getUserObservable(): Observable<User> {
    return this.getUser.valueChanges();
  }

  gamePlayed(userCredentials){
    this.user = userCredentials

    console.log(this.user)
    const userRef: AngularFirestoreDocument<User> = this.db.collection('Users').doc(userCredentials.uid);




    let gameWon = true

    if(gameWon == true){

      this.selecteds.forEach(player =>{
        userCredentials.wonTo.push(player.displayName)

        const playersRef: AngularFirestoreDocument<User> = this.db.collection('Users').doc(player.uid);
        // playersRef.get().subscribe(doc => {

        //   if (doc.exists){
        //     playersRef.update({
        //       uid: player.uid,
        //       email: player.email,
        //       displayName: player.displayName,
        //       totalBattle: player.totalBattle + 1,
        //       wins: player.wins + 1,
        //       losses: player.losses,
        //       wonTo: player.wonTo,
        //       lostTo: player.lostTo
        //     });
        //   }

        // });

      })

      userRef.get().subscribe(doc => {
        if (doc.exists){
          userRef.update({
            uid: userCredentials.uid,
            email: userCredentials.email,
            displayName: userCredentials.displayName,
            totalBattle: userCredentials.totalBattle + 1,
            wins: userCredentials.wins + 1,
            losses: userCredentials.losses,
            wonTo: userCredentials.wonTo,
            lostTo: userCredentials.lostTo
          });
        }

      });
    } else if(gameWon == false){
      this.selecteds.forEach(player => {
        userCredentials.lostTo.push(player.displayName)
      });
      userRef.get().subscribe(doc => {
        if (doc.exists){
          userRef.update({
            uid: userCredentials.uid,
            email: userCredentials.email,
            displayName: userCredentials.displayName,
            totalBattle: userCredentials.totalBattle + 1,
            wins: userCredentials.wins,
            losses: userCredentials.losses + 1,
            wonTo: userCredentials.wonTo,
            lostTo: userCredentials.lostTo
          });
        }
      });

    }
  }
  select(){
    console.log("test");
  }
  carding: any = document.querySelectorAll('.memory');
  clicked(event){
    event.target.parentNode.classList.toggle('flip');
    console.log(event.target.classList);
    console.log("test");
  }

hasFlippedCard: boolean = false;
lockBoard: boolean = false;
firstCard: any;
secondCard: any;

  flipCard(event) {
  /*if (this.lockBoard) {
    return;
  }
    if (event.target.parentNode === this.firstCard) {
    return;
  }*/

  event.target.parentNode.classList.toggle('flip');


  /*if (!this.hasFlippedCard) {
    this.hasFlippedCard = true;
    this.firstCard = event.target.parentNode;

    return;
  }*/

  this.secondCard = event.target.parentNode;
  this.checkForMatch();
}

checkForMatch() {
  let isMatch = this.firstCard.parentNode.dataset.framework === this.secondCard.parentNode.dataset.framework;

  isMatch ? this.disableCards() : this.unflipCards();
}

disableCards() {
  /*this.firstCard.removeEventListener('click', this.flipCard);
  this.secondCard.removeEventListener('click', this.flipCard);

  this.resetBoard();*/
  console.log("disabled" + this.firstCard);
  }

unflipCards() {
  this.lockBoard = true;

  setTimeout(() => {
    this.firstCard.parentNode.classList.remove('flip');
    this.secondCard.parentNode.classList.remove('flip');

    this.resetBoard();
  }, 15);
}

resetBoard() {
  [this.hasFlippedCard, this.lockBoard] = [false, false];
  [this.firstCard, this.secondCard] = [null, null];
}



}
