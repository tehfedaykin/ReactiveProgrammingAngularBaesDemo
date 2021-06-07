import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, ApiService} from '../api.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel} from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface CheckboxGroup {
  attribute: VillagerSortOptions,
  list: any
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  private unsubscriber$ = new Subject<void>();
  @ViewChild(MatExpansionPanel) accordion!: MatExpansionPanel;
  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;

  private villagers: Villager[] = [];
  public displayedVillagers: Villager[] = [];
  private checkSelection: VillagerSortOptions[] = [];
  public sortOptions = ["personality", "species", "hobby", "birthday", "name"];
  public checkBoxList: CheckboxGroup[] = [
    {
      attribute: 'personality',
      list: Object.values(Personality)
    },
    {
      attribute: 'species',
      list: Object.values(Species)
    },
    {
      attribute: 'hobby',
      list: Object.values(Hobby)
    }
  ]
  public sortOptionControl = new FormControl({value: null, disabled: false});

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getVillagers().subscribe((villagers: Villager[]) => {
      this.displayedVillagers = this.villagers = this.sortList(villagers, "name");
    });

    this.sortOptionControl.valueChanges.pipe(
      takeUntil(this.unsubscriber$)
    )
    .subscribe((value) => {
      this.setSort(value);
    })
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  sortList(list: Villager[], property: VillagerSortOptions): Villager[] {
    const sortedList = [...list];
    if(property === "birthday") {
      return sortedList.sort(function(a,b){
        var [dayA, monthA] = a.birthday.split('/');
        var dateA = new Date(2020, parseInt(monthA, 10), parseInt(dayA, 10));

        var [dayB, monthB] = b.birthday.split('/');
        var dateB = new Date(2020, parseInt(monthB, 10), parseInt(dayB, 10));

        return dateA.getTime() - dateB.getTime()
      });
    }
    else if(property === "name") {
      return sortedList.sort(function(a, b) {
        var nameA = a.name['name-USen'].toUpperCase();
        var nameB = b.name['name-USen'].toUpperCase();
  
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }    
        return 0;
      });
    }
    else {
      return sortedList.sort(function(a, b) {
        var nameA = a[property].toUpperCase();
        var nameB = b[property].toUpperCase();
  
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }    
        return 0;
      });
    }

  }

  filterList(list: Villager[], filters: VillagerSortOptions[]): Villager[] {
    return list.filter((villager: Villager) => {
      const villagerVals = Object.values(villager);
      const villagerHasTrait = villagerVals.some(r=> filters.includes(r));
      return villagerHasTrait;
    })
  }

  applyFilters() {
    this.accordion.close();
    const filters = this.checkSelection;
    this.displayedVillagers = this.filterList(this.villagers, filters);
  }

  setSort(value: VillagerSortOptions): void {
    this.displayedVillagers = this.sortList(this.villagers, value);
  }

  checkboxChecked(change: MatCheckboxChange) {
    const checkedValue = change.source.value as VillagerSortOptions;
    this.checkSelection  = change.checked ? [...this.checkSelection, checkedValue] : this.checkSelection.filter(item => item !== checkedValue)
  }

  reset() {
    this.displayedVillagers = this.villagers;
    this.sortOptionControl.setValue(null);
    this.checkSelection = [];
    this.checkboxes.forEach((checkbox) => {
      if(checkbox.checked) {
        checkbox.toggle();
      }
    })
  }

}
