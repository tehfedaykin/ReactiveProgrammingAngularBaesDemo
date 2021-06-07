import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Villager, Personality, Species, Hobby, VillagerSortOptions, ApiService} from '../api.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel} from '@angular/material/expansion';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, combineLatest, fromEvent, merge, Observable, Subject } from 'rxjs';
import { map, mapTo, startWith, tap, share } from 'rxjs/operators';
import { MatButton } from '@angular/material/button';
interface CheckboxGroup {
  attribute: VillagerSortOptions,
  list: any
}
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @ViewChild(MatExpansionPanel) accordion!: MatExpansionPanel;
  @ViewChildren(MatCheckbox) checkboxes!: QueryList<MatCheckbox>;
  @ViewChild('resetButton', { static: true }) button!: MatButton;

  public displayedVillagers$!: Observable<Villager[]>;
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
  private filterOptions$ = new BehaviorSubject<VillagerSortOptions[]>([]);
  public displayedVillagerCount$!: Observable<number>;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    const villagers$ = this.apiService.getVillagers().pipe(
      map((villagers) => {
        // we're just pretending this is our initial sort
        return this.sortList(villagers, "name")
      }),
      // sharing the execution of this call to avoid triggering an http request per subscription
      share()
    );
    
    const resetEvent$ = fromEvent(this.button._elementRef.nativeElement, 'click').pipe(
      tap(() => {
        // some gross imperative stuff to perform, but fairly representative of real-world use
        this.checkSelection = [];
        this.checkboxes.forEach((checkbox) => {
          if(checkbox.checked) {
            checkbox.toggle();
          }
        })
        this.sortOptionControl.setValue(null);
      })
    );

    const sortOption$ = this.sortOptionControl.valueChanges.pipe(
        // we need an initial value "nexted" for the combineLatest filter
        // we could do this by calling `setValue` on our formControl as well.
        startWith(null)
    );

    const filterReset$ = resetEvent$.pipe(
        // returning an empty array representing no filters selected
      mapTo([])
    )

    // merging the 'reset' stream with the user selected filterOptions BehaviorSubject.
    const filterOptions$:Observable<VillagerSortOptions[] |[]> = merge(this.filterOptions$, filterReset$)

    // combining the villagersAPI stream, sortOption stream, and filterOptions stream.
    this.displayedVillagers$ = combineLatest([villagers$, sortOption$, filterOptions$]).pipe(
      map(([villagers, sortOption, filterOption]) => {
          //returning a modified villagers list depending on sort or filter values
          const sortedList =  sortOption ? this.sortList(villagers, sortOption) : villagers;
          return filterOption.length ? this.filterList(sortedList, filterOption): sortedList
        })
    );

    // using the displayedVillagers observable to always update the number of villagers showing
    this.displayedVillagerCount$ = this.displayedVillagers$.pipe(
      map((villagers) => {
        return villagers.length
      })
    )
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
    // calling .next() method on this stream will emit the new value to be picked up by our combineLatest operator
    this.filterOptions$.next(this.checkSelection);
  }

  checkboxChecked(change: MatCheckboxChange) {
    const checkedValue = change.source.value as VillagerSortOptions;
    this.checkSelection  = change.checked ? [...this.checkSelection, checkedValue] : this.checkSelection.filter(item => item !== checkedValue)
  }

}
