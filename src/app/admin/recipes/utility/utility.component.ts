import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.scss']
})
export class UtilityComponent implements OnInit {
  utilities:Utility[] = []
  seeUtility:boolean = true;
  utilityFormFeatureControls:UtilityFeatureControl[] = []
  utilitiesFeaturesForm = new FormGroup({})
  units:any[] = [];
  unitsLoaded:boolean = false;
  utilityForm:FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    features: this.utilitiesFeaturesForm,
  })
  constructor(private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.getUnits().then((units:any)=>{
      this.units = units
      this.unitsLoaded= true;
    })
    this.databaseService.getUtilities().then((docs:any)=>{
      docs.forEach((element:any) => {
        this.utilities.push(element.data())
        console.log(element)
      });
    })
  }

  addFeature(){
    const name:FormControl = new FormControl('', [Validators.required])
    const pricing:FormControl = new FormControl('', [Validators.required])
    const length = this.utilityFormFeatureControls.length
    this.utilitiesFeaturesForm.addControl('featureName'+length.toString(), name)
    this.utilitiesFeaturesForm.addControl('featurePricing'+length.toString(), pricing)
    this.utilityFormFeatureControls.push({name:name,pricing:pricing})
  }

  removeFeature(index:number){
    this.utilitiesFeaturesForm.removeControl('featureName'+index)
    this.utilitiesFeaturesForm.removeControl('featurePricing'+index)
    this.utilityFormFeatureControls.splice(index,1)
  }

  addUtility(){
    console.log(this.utilityForm.value)
    const data = {
      name:this.utilityForm.value.name,
      
    }
  }

}

export type Utility = {
  name:string;
  pricing:string;
  unit:string;
  types:string;
  utilities:UtilityType[]
}
export type UtilityType = {
  name: string;
  pricing:string;
}
export type UtilityFeatureControl = {
  name:FormControl;
  pricing:FormControl;
}