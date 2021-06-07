import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../environments/environment';
import * as camelcaseKeys from '../../node_modules/camelcase-keys';


export type VillagerSortOptions = keyof Pick<Villager, "personality" | "species" | "hobby" | "birthday" | "name"> ;

export interface Villager {
  id: number;
  fileName: string;
  name: Name;
  personality: Personality;
  birthdayString: string;
  birthday: string;
  species: Species;
  hobby: Hobby;
  gender: string;
  catchPhrase: string;
  iconUri: string;
  imageUri: string;
  bubbleColor: string;
  textColor: string;
  favorite?: boolean;
}

export interface Name {
  'name-USen': string;
  'name-EUen': string;
  'name-EUde': string;
  'name-EUes': string;
  'name-USes': string;
  'name-EUfr': string;
  'name-USfr': string;
  'name-EUit': string;
  'name-EUnl': string;
  'name-CNzh': string;
  'name-TWzh': string;
  'name-JPja': string;
  'name-KRko': string;
  'name-EUru': string;
}

export enum Species {
  Alligator = 'Alligator',
  Anteater = 'Anteater',
  Bear = 'Bear',
  Bird = 'Bird',
  Bull = 'Bull',
  Cat = 'Cat',
  Cub = 'Cub',
  Chicken = 'Chicken',
  Cow = 'Cow',
  Deer = 'Deer',
  Dog = 'Dog',
  Duck = 'Duck',
  Eagle = 'Eagle',
  Elephant = 'Elephant',
  Frog = 'Frog',
  Goat = 'Goat',
  Gorilla = 'Gorilla',
  Hamster = 'Hamster',
  Hippo = 'Hippo',
  Horse = 'Horse',
  Koala = 'Koala',
  Kangaroo = 'Kangaroo',
  Lion = 'Lion',
  Monkey = 'Monkey',
  Mouse = 'Mouse',
  Octopus = 'Octopus',
  Ostrich = 'Ostrich',
  Penguin = 'Penguin',
  Pig = 'Pig',
  Rabbit = 'Rabbit',
  Rhino = 'Rhino',
  Sheep = 'Sheep',
  Squirrel = 'Squirrel',
  Tiger = 'Tiger',
  Wolf = 'Wolf'
}

export enum Hobby {
  Education = 'Education',
  Fitness = 'Fitness',
  Fashion = 'Fashion',
  Nature = 'Nature',
  Play = 'Play',
  Music = 'Music'
}

export enum Personality {
  Cranky = 'Cranky',
  Jock = 'Jock',
  Lazy = 'Lazy',
  Normal = 'Normal',
  Peppy = 'Peppy',
  Smug = 'Smug',
  Snooty = 'Snooty',
  Uchi = 'Uchi',
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getVillagers(): Observable<Villager[]> {
    return this.http.get<Villager[]>(`${environment.apiUrl}/villagers`).pipe(
      map((res) => {
        return res.map((villager) => {
          return {
            ...camelcaseKeys(villager)
          }
        })
      })
    );
  }

  getVillager(id: string): Observable<Villager> {
    return this.http.get(`${environment.apiUrl}/villagers/${id}`).pipe(
      map((res: any) => {
        return {
          ...camelcaseKeys(res)
        };
      })
    );
  }

}
