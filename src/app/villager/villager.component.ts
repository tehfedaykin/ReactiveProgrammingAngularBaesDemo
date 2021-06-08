import { Observable } from 'rxjs';
import { Villager } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ApiService } from '../api.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-villager',
  templateUrl: './villager.component.html',
  styleUrls: ['./villager.component.scss']
})
export class VillagerComponent implements OnInit {
  public villager$!: Observable<Villager>;

  constructor(private route: ActivatedRoute, private apiService: ApiService){}

  ngOnInit(): void {
    this.villager$ = this.route.paramMap.pipe(
      // switchMap will flatten the Observables AND cancel a pending request if a new one is issued
    switchMap((params: ParamMap) => {
        return this.apiService.getVillager(params.get('id') as string)
      })
    )
  }

}
