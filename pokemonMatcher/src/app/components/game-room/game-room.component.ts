import { Component, ViewChild, ElementRef, OnInit, Pipe } from '@angular/core';
// import { POKEMON } from '../../pokemon';a
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Cards } from '../../interfaces/cards'
import { GameService } from 'src/app/services/game.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter, map, subscribeOn, tap } from 'rxjs/operators'
import { User } from '../../interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { $ } from 'protractor';
import { createReadStream } from 'fs';
import { HttpClient } from '@angular/common/http';

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
  matched: number;




  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private router: Router,
    private auth: AuthService,
    private db: AngularFirestore,
    private http: HttpClient


  ) {
  }

  ngOnInit() {
    let card = document.getElementsByClassName("memory");
    console.log(card);
    if (window.history.state.selecteds) {
      this.selecteds = window.history.state.selecteds
      console.log(this.selecteds)
    } else {
      this.router.navigateByUrl(`lobby`)
    }
    const id = this.route.snapshot.paramMap.get('id');
    const page = Math.floor(Math.random() * 20);
    const players = this.route.snapshot.paramMap.get('selecteds');
    //calling query for api
    this.cards = this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=${id}&page=${page}&pageSize=5`).pipe(map(data =>
      this.randomizeArray(data['cards'])
    ))
    this.matched = 0;
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
  private randomizeArray(arrayProducts) {
    arrayProducts = arrayProducts.concat(arrayProducts)
    for (let i = arrayProducts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayProducts[i], arrayProducts[j]] = [arrayProducts[j], arrayProducts[i]];
    }
    return arrayProducts
  }
  gamePlayed(userCredentials) {
    this.user = userCredentials

    console.log(this.user)
    const userRef: AngularFirestoreDocument<User> = this.db.collection('Users').doc(userCredentials.uid);




    let gameWon = true

    if (gameWon == true) {

      this.selecteds.forEach(player => {
        userCredentials.wonTo.push(player.displayName)

        const playersRef: AngularFirestoreDocument<User> = this.db.collection('Users').doc(player.uid);

      })

      userRef.get().subscribe(doc => {
        if (doc.exists) {
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
    } else if (gameWon == false) {
      this.selecteds.forEach(player => {
        userCredentials.lostTo.push(player.displayName)
      });
      userRef.get().subscribe(doc => {
        if (doc.exists) {
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
  select() {
    console.log("test");
  }
  carding: any = document.querySelectorAll('.memory');
  clicked(event) {
    event.target.parentNode.classList.toggle('flip');
    console.log(event.target.classList);
    console.log("test");
  }

  hasFlippedCard: boolean = false;
  lockBoard: boolean = false;
  firstCard: any;
  secondCard: any;

  flipCard(event) {
    if (event.target.parentNode.id != 'flipped') {
      if (this.lockBoard === false) {

        if (event.target === this.firstCard) {
          return;
        }

        event.target.parentNode.classList.toggle('flip');


        if (!this.hasFlippedCard) {
          this.hasFlippedCard = true;
          this.firstCard = event.target;

          return;
        }

        this.secondCard = event.target;
        this.lockBoard = true;
        this.checkForMatch();
      }
    }
  }

  checkForMatch() {
    console.log(this.firstCard.parentNode.id)
    console.log(this.secondCard.parentNode.id)
    let isMatch = this.firstCard.parentNode.id === this.secondCard.parentNode.id && this.firstCard.parentNode.title != this.secondCard.parentNode.title;
    console.log(this.firstCard.parentNode.id === this.secondCard.parentNode.id)
    //isMatch ? this.disableCards() : this.unflipCards();
    setTimeout(() => {
      if (isMatch) {
        this.disableCards()
        console.log('cards match')
        this.matched++;
        if (this.matched === 5) {
          this.gamePlayed(this.user)
          alert("you won!!!")
        }
      }
      else {
        this.unflipCards()
        console.log("cards don't match")
        this.lockBoard = false;
      }
    }, 1000);
  }

  disableCards() {
    this.firstCard.parentNode.id = 'flipped';
    this.secondCard.parentNode.id = 'flipped';
  
    this.resetBoard();
    console.log("disabled" + this.firstCard);
  }

  unflipCards() {
    this.lockBoard = true;
      this.firstCard.parentNode.classList.remove('flip');
      this.secondCard.parentNode.classList.remove('flip');

      this.resetBoard();
  }

  resetBoard() {
    [this.hasFlippedCard, this.lockBoard] = [false, false];
    [this.firstCard, this.secondCard] = [null, null];
  }



}
