import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, combineLatest, of } from 'rxjs';
import { Cards } from '../interfaces/cards';
import {map } from 'rxjs/operators'
import { User } from '../interfaces/user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { concat, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  user: User;
  cards: Observable<Cards>
  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    
  ) { }
  

  getCardSets(): Observable<Cards>{

    return this.http.get<Cards>("https://api.pokemontcg.io/v1/sets")

  }
  /*getData(): Observable<Cards> {
    return this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=base1&page=1&pageSize=5`)
  }

  async checkDuplicate() {
    var response = await this.getData().toPromise();
    console.log(response)
    if (response) {
      this.cards = of(response)
      console.log("Inside");
    }
  }

  async getCardSetById(id: string, page: number) {
    await this.checkDuplicate();
    console.log("finished");
  }
  getCards(): Promise<Observable<Cards>>{
    console.log(this.cards)
    return this.cards
}*/

  //getCardSetById(id: string, page: number): Observable<Cards> {
    /*let output
    let card1 = this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=base1&page=1&pageSize=5`)
    let card1 = this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=${id}&page=1&pageSize=5`)
    return card1.subscribe(results => {
      results[0] = results[1];
      let resultarray1 = results[0]['cards']
      let resultarray2 = results[1]['cards']
      
      console.log(results[0])
      output = resultarray1.concat(resultarray2);
      output.subscribe(shore => console.log(shore['cards']))
      console.log(output)
      return output
    });
    let test = combineLatest(card1, card2)
    console.log(output)*/
    /*return this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=base1&page=1&pageSize=5`)
      .pipe(map(data => data['cards']));
    
  }*/


  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array
  }
}

