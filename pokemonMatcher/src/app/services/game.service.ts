import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
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


  constructor(
    private http: HttpClient,
    private db: AngularFirestore,
    
  ) { }
  

  getCardSets(): Observable<Cards>{

    return this.http.get<Cards>("https://api.pokemontcg.io/v1/sets")

  }

  getCardSetById(id: string, page: number): Observable<Cards> {
    let output
    let card1 = this.http.get<Cards>(`https://api.pokemontcg.io/v1/cards?setCode=${id}&page=1&pageSize=5`)
    let card2 = card1
    forkJoin([card1, card2]).subscribe(results => {
      // results[0] is our character
      // results[1] is our character homeworld
      results[0] = results[1];
      let resultarray1 = results[0]['cards']
      let resultarray2 = results[1]['cards']
      
      /*console.log(results)
      resultarray.concat(results[1])*/
      console.log(results[0])
      output = resultarray1.concat(resultarray2);
    });
    console.log(output)
    console.log('output')
    console.log(this.shuffle(output))
    return output
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

