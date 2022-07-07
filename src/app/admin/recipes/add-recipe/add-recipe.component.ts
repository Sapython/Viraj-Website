import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.scss'],
})
export class AddRecipeComponent implements OnInit {
  constructor(
    private alertService: AlertsAndNotificationsService,
    @Inject(MAT_DIALOG_DATA) public recipe: any,
    private matDialogRef: MatDialogRef<AddRecipeComponent>,
    private databaseService:DatabaseService
  ) {}
  // Constants
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Variables
  files: FileList;
  utilities:any[] = [];
  cookingCost: number = 0;
  sellingPrice: number = 0;
  recipeIngredients: any[] = [];
  servingInstructions: any[] = [];
  cookingInstructions: any[] = [];
  validImages:string[] = []
  // Forms
  recipeForm: FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required]),
    photos: new FormControl([],[Validators.required]),
    type: new FormControl('',[Validators.required]),
    flavourPalette: new FormControl('',[Validators.required]),
    bestSeasonFrom: new FormControl('',[Validators.required]),
    bestSeasonTo: new FormControl('',[Validators.required]),
    description: new FormControl('',[Validators.required]),
    // ingredients: new FormControl([],[Validators.required]),
    // cookingInstructions: new FormControl([],[Validators.required]),
    // servingInstructions: new FormControl([],[Validators.required]),
    preparationTimeValue: new FormControl(0,[Validators.required]),
    preparationTimeUnit: new FormControl('minute(s)',[Validators.required]),
    cookingTimeValue: new FormControl(0,[Validators.required]),
    cookingTimeUnit: new FormControl('minute(s)',[Validators.required]),
    servingTimeValue: new FormControl(0,[Validators.required]),
    servingTimeUnit: new FormControl('minute(s)',[Validators.required]),
    shelfLifeValue: new FormControl(0,[Validators.required]),
    shelfLifeUnit: new FormControl('minute(s)',[Validators.required]),
    flameThrow:new FormControl('',[]),
    energyConsumptionPerPreparation: new FormControl(''),
  });

  ngOnInit(): void {
    console.log(this.recipe.ingredients, this.recipe.recipeTypes);
    this.databaseService.getUtilities().then((docs:any)=>{
      docs.forEach((element:any) => {
        this.utilities.push(element.data());
      });
    })
  }
  calculateCost(){
    this.cookingCost = 0;
    this.recipeIngredients.forEach((control: any) => {
      this.cookingCost += parseFloat(this.recipe.ingredients[this.getObject(control.ingredientSelector.value).id].rate) * parseFloat(control.ingredientValue.value);
    });
    this.cookingCost = Math.ceil(this.cookingCost);
    this.sellingPrice = Math.ceil(this.cookingCost / 0.3);
  }
  getLpgData():any{
    const data = this.utilities.find((value:any,index:number)=>{if (value.name==='LPG'){return true} else {return false}});
    return data;
    if (this.recipe.ingredients){
      const data = Object.keys(this.recipe.ingredients).filter((data: any) => {
        data = this.recipe.ingredients[data];
        if(data.name=='LPG Gas'){
          // console.log(data);
          return true;
        } else {
          return false;
        }
      })
      return this.recipe.ingredients[data.toString()];
    } else {
      return {rate:0};
    }
  }
  get energyPerSecond(){
    return 10;
  }
  get totalAvailableEnergy(){
    const lpg = this.getLpgData();
    var totalGas = lpg.unitCost*lpg.quantity;
    var totalEnergy = 46452 * totalGas;
    return totalEnergy
  }
  calculateEnergyConsumption(){
    function getCookingTime(recipeForm:any):number{
      if(recipeForm.get('cookingTimeUnit').value=='minutes'){
        return recipeForm.get('cookingTimeValue').value*60;
      } else if (recipeForm.get('cookingTimeUnit').value=='hours'){
        return recipeForm.get('cookingTimeValue').value*60*60;
      } else if (recipeForm.get('cookingTimeUnit').value=='days'){
        return recipeForm.get('cookingTimeValue').value*60*60*24;
      } else {
        return 0;
      }
    }
    // console.log(this.getLpgData().rate,getCookingTime(this.recipeForm),this.recipeForm.value.cookingTimeUnit,parseFloat(this.recipeForm.value.flameThrow));
    if (this.recipeForm.value.cookingTimeValue){
      this.recipeForm.value.energyConsumptionPerPreparation = Math.ceil((( getCookingTime(this.recipeForm)) * (this.energyPerSecond/parseFloat(this.recipeForm.value.flameThrow))));
      console.log('Value',this.recipeForm.value.energyConsumptionPerPreparation);
      return this.recipeForm.value.energyConsumptionPerPreparation;
    } else {
      return 0;
    }
  }
  checkForCalculation(){
    if (this.recipeForm.value.cookingTimeUnit && this.recipeForm.value.cookingTimeValue && this.recipeForm.value.flameThrow){
      this.calculateEnergyConsumption();
    }
  }
  async submit() {
    console.log(this.recipeForm);
    if (this.recipeForm.valid) {
      let servingInstructions: string[] = [];
      this.servingInstructions.forEach((control: FormControl) => {
        servingInstructions.push(control.value);
        console.log('servingInstructions',control.value);
      });
      let cookingInstructions: string[] = [];
      this.cookingInstructions.forEach((control: FormControl) => {
        cookingInstructions.push(control.value);
        console.log('CookingInstructions',control.value);
      });
      let recipeIngredients: any[] = [];
      var cookingCost = 0;
      this.recipeIngredients.forEach((control: any) => {
        const data = this.getObject(control.ingredientSelector.value)
        recipeIngredients.push({
          id: data.id,
          unit: data.unit,
          quantity: control.ingredientValue.value,
          ingredientSelector: control.ingredientSelector.value,
          ingredientValue: control.ingredientValue.value,
        });
        console.log('recipeIngredients',data.id,data.unit,control.ingredientValue.value);
          cookingCost += parseFloat(this.recipe.ingredients[this.getObject(control.ingredientSelector.value).id].rate) * parseFloat(control.ingredientValue.value);
      });
      this.cookingCost = cookingCost;
      this.sellingPrice = (this.cookingCost / 0.3);
      let photos = [];
      if(this.files){
        for (let index = 0; index < this.files.length; index++) {
          const file = this.files[index];
          const path = `recipes/${this.recipeForm.value.name}/${file.name}`;
          photos.push(await this.databaseService.upload(path, file));
          console.log(photos);
        }
      } else {
        this.alertService.presentToast('Please add at least one photo','error');
        return
      }
      this.recipeForm.value.photos = photos;
      const recipe = {
        ...this.recipeForm.value,
        cookingCost: this.cookingCost,
        sellingPrice: this.sellingPrice,
        ingredients: recipeIngredients,
        cookingInstructions: cookingInstructions,
        servingInstructions: servingInstructions,
      };
      console.log('Recipe final data ',recipe);
      this.databaseService.addRecipe(recipe).then(() => {
        this.alertService.presentToast('Recipe added successfully','info');
        this.matDialogRef.close();
      }).catch(() => {
        this.alertService.presentToast('Error adding recipe','error');
      });
    } else {
      let problems:string[] = [];
      Object.keys(this.recipeForm.controls).forEach((key) => {
        if (this.recipeForm.controls[key].status !== 'VALID'){
          problems.push(key);
        }
      })
      const problem = problems.join(', ');
      this.alertService.presentToast('Please fill all the required fields, Error with '+problem,'error');
    }
  }
  getString(value: any) {
    return JSON.stringify(value);
  }
  getObject(value: string) {
    return JSON.parse(value);
  }
  validateImages(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files != null) {
      for (var i = 0; i < files!.length; i++) {
        const file = files![i];
        var fileIsValid = false;
        if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
          this.alertService.presentToast(
            'Only png, jpeg and jpg images are allowed',
            'error'
          );
        } else if (file.size >= 100_000) {
          this.alertService.presentToast(
            "Each image's size must be less than 100Kb",
            'error'
          );
        } else {
          this.validImages.push(URL.createObjectURL(file));
          fileIsValid = true;
          this.files = files;
        }
        if (!fileIsValid) {
          target.value = '';
        }
      }
    }
  }
  log(data: any) {
    console.log(data);
  }
  addIngredient() {
    this.recipeIngredients.push({
      ingredientSelector: new FormControl('',[Validators.required]),
      ingredientValue: new FormControl('',[Validators.required]),
    });
    this.calculateCost();
  }
  deleteIngredient(index: number) {
    this.recipeIngredients.splice(index, 1);
  }
  addInstruction(type: 'serving' | 'cooking') {
    if (type === 'serving') {
      this.servingInstructions.push(new FormControl('',[Validators.required]));
    } else {
      this.cookingInstructions.push(new FormControl('',[Validators.required]));
    }
  }

  deleteInstruction(type: 'serving' | 'cooking', index: number) {
    if (type === 'serving') {
      this.servingInstructions.splice(index, 1);
    } else {
      this.cookingInstructions.splice(index, 1);
    }
  }
}
