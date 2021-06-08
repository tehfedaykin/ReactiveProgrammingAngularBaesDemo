import { Villager } from './../api.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-villager',
  templateUrl: './villager.component.html',
  styleUrls: ['./villager.component.scss']
})
export class VillagerComponent implements OnInit {
  public villager!: Villager;

  constructor(private route: ActivatedRoute, private apiService: ApiService){}

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.apiService.getVillager(params.get('id') as string).subscribe((res) => {
        this.villager = res
      })
    })
  }

}
