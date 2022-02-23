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
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.scss']
})
export class GameRoomComponent implements OnInit {

  //cards: any[]
  cards: Observable<Cards>
  //cardss: Observable<Subscription>
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
    private http: HttpClient


  ) {
  }
  /*loadProducts(): Observable<Cards> {
    debugger;
    this.cards = this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=base1&page=1&pageSize=5`).pipe(data => this.randomizeArray(data['cards']))
    return this.cards
  }*/
  // @ViewChild('canvas', { static: true })
  // canvas: ElementRef<HTMLCanvasElement>;

  // private ctx: CanvasRenderingContext2D;

  ngOnInit() {
    let card = document.getElementsByClassName("memory");
    console.log(card);
    if (window.history.state.selecteds) {
      this.selecteds = window.history.state.selecteds
      console.log(this.selecteds)
    } else {
      this.router.navigateByUrl(`lobby`)
    }
    let et
    this.cards = this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=base1&page=1&pageSize=5`).pipe(map(data =>
      this.randomizeArray(data['cards'])
    ))
    const id = this.route.snapshot.paramMap.get('id');
    const page = Math.floor(Math.random() * 20);
    const players = this.route.snapshot.paramMap.get('selecteds');
    //this.cards = this.gameService.getCardSetById(id, page).then(this.gameService.getCards())
    /*this.cards.subscribe(_products => {
        this.randomizeArray(_products);
    })*/
    /*this.cards = this.gameService.getCardSetById(id, page)*/
    /*this.cards = this.gameService.getCardSetById(id, page)
    this.cards.subscribe(_products => {
      this.randomizeArray(_products);
      return this.randomProductsSource.asObservable
        
    })*/
    /*this.cards = this.gameService.getCards();*/
    /*console.log('line3')
    console.log(this.cards.subscribe(results => {

      console.log(results);
    }))*/


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
    if (this.lockBoard) {
      return;
    }
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
    this.checkForMatch();
  }

  checkForMatch() {
    console.log(this.firstCard.parentNode.id)
    console.log(this.secondCard.parentNode.id)
    let isMatch = this.firstCard.parentNode.id === this.secondCard.parentNode.id;
    console.log(this.firstCard.parentNode.id === this.secondCard.parentNode.id)
    //isMatch ? this.disableCards() : this.unflipCards();
    setTimeout(() => {
      this.unflipCards()
    }, 1000);
  }

  disableCards() {
    this.firstCard.removeEventListener('click', this.flipCard);
    this.secondCard.removeEventListener('click', this.flipCard);
  
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
