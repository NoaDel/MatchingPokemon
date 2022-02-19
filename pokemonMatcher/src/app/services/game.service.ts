import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cards } from '../interfaces/cards';
import {map } from 'rxjs/operators'
import { User } from '../interfaces/user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { concat, from } from 'rxjs';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  user: User;


  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    
  ) { }
  

  getCardSets(): Observable<Cards>{

    return this.http.get<Cards>("https://api.pokemontcg.io/v1/sets")

  }

  getCardSetById(id: string, page: number) {
    let output
    let card1 = this.http.get(`https://api.pokemontcg.io/v1/cards?setCode=${id}&page=1&pageSize=5`)
    output = card1.subscribe(response => JSON.stringify(response['cards']))
      console.log(output)
      /*.subscribe(users => this.users = users);*/
    /*card1.subscribe(test => { output = test['cards'] })*/
    
    return card1
      .pipe(map(data => data['cards']));
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
}

