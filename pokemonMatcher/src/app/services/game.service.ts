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
}

