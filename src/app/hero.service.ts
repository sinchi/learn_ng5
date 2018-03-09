import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
     'Content-Type': 'application/json'
     })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes'; // URL to web api

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  handleError<T> (operation= 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    this.messageService.add('HeroService: fetched heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
              tap(heroes => this.log(`fetchedheroes`)),
              catchError(this.handleError('getHeroes', []))
            );
  }
  /**PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap( _ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updatedHero'))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap( _ => this.log(`fetched hero id=${id}`) ),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
    .pipe(
      tap((her: Hero) => this.log(`added hero w/id=${her.id}`)),
      catchError(this.handleError<Hero>('addedHero'))
    );
  }

  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, httpOptions)
    .pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

}
