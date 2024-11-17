import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataProvider } from 'src/app/providers/data.provider';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { ManageCategoriesComponent } from './manage-categories/manage-categories.component';

@Component({
  selector: 'app-edit-recipe',
  templateUrl: './edit-recipe.component.html',
  styleUrls: ['./edit-recipe.component.scss'],
})
export class EditRecipeComponent implements OnInit, AfterViewInit {
  constructor(
    private alertService: AlertsAndNotificationsService,
    @Inject(MAT_DIALOG_DATA) public recipe: any,
    private matDialogRef: MatDialogRef<AddRecipeComponent>,
    private databaseService:DatabaseService,
    private dialog:MatDialog,
    private dataProvider:DataProvider
  ) {}
  selectedCategories:any[] = []
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
  utilities:any[] = [];
  files: FileList;
  cookingCost: number = 0;
  sellingPrice: number = 0;
  costPercentage: string = '1';
  recipeIngredients: any[] = [];
  servingInstructions: any[] = [];
  cookingInstructions: any[] = [];
  cookingInstructionsForm =  new FormGroup({})
  servingInstructionsForm = new FormGroup({})
  // Forms
  recipeForm: FormGroup = new FormGroup({
    name: new FormControl(this.recipe.recipeData.name,[Validators.required]),
    photos: new FormControl([],[]),
    type: new FormControl(this.recipe.recipeData.type || '',[Validators.required]),
    flavourPalette: new FormControl(this.recipe.recipeData.flavourPalette || '',[Validators.required]),
    bestSeasonFrom: new FormControl(this.recipe.recipeData.bestSeasonFrom || '',[Validators.required]),
    bestSeasonTo: new FormControl(this.recipe.recipeData.bestSeasonTo || '',[Validators.required]),
    description: new FormControl(this.recipe.recipeData.description || '',[Validators.required]),
    ingredients: new FormControl(this.recipe.recipeData.ingredients || '',[Validators.required]),
    cookingInstructions:this.cookingInstructionsForm,
    servingInstructions: this.servingInstructionsForm,
    preparationTimeValue: new FormControl(this.recipe.recipeData.preparationTimeValue || '',[Validators.required]),
    preparationTimeUnit: new FormControl(this.recipe.recipeData.preparationTimeUnit || '',[Validators.required]),
    cookingTimeValue: new FormControl(this.recipe.recipeData.cookingTimeValue || '',[Validators.required]),
    cookingTimeUnit: new FormControl(this.recipe.recipeData.cookingTimeUnit || '',[Validators.required]),
    servingTimeValue: new FormControl(this.recipe.recipeData.servingTimeValue || '',[Validators.required]),
    servingTimeUnit: new FormControl(this.recipe.recipeData.servingTimeUnit || '',[Validators.required]),
    shelfLifeValue: new FormControl(this.recipe.recipeData.shelfLifeValue || '',[Validators.required]),
    shelfLifeUnit: new FormControl(this.recipe.recipeData.shelfLifeUnit || '',[Validators.required]),
    flameThrow:new FormControl(this.recipe.recipeData.flameThrow,[]),
    energyConsumptionPerPreparation: new FormControl(this.recipe.recipeData.energyConsumptionPerPreparation || ''),
  });
  ngAfterViewInit() {
    setTimeout(() => {this.calculateCost();this.checkForCalculation()},3000)
  }
  ngOnInit(): void {
    console.log(this.recipe, this.recipe.recipeTypes);
    this.recipeIngredients = [];
    this.databaseService.getUtilities().then((docs:any)=>{
      docs.forEach((element:any) => {
        this.utilities.push(element.data());
      });
    })
    this.recipe.recipeData.ingredients.forEach((ingredient: any) => {
      const sel = new FormControl(JSON.stringify(ingredient.id),[Validators.required]);
      const val =  new FormControl(ingredient.quantity || 0,[Validators.required]);
      this.recipeIngredients.push({
        ingredientSelector: sel,
        ingredientValue: val,
        unit:ingredient.unit
      });
      val.setValue(ingredient.quantity || 0);
      sel.setValue(JSON.stringify(ingredient.id));
    });
    console.log(this.recipeIngredients);
    this.recipe.recipeData.cookingInstructions?.forEach((instruction: any) => {
      const control = new FormControl(instruction);
      this.cookingInstructions.push({instruction:control});
      this.cookingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'cookingInstruction',control);
    });
    this.recipe.recipeData.servingInstructions?.forEach((instruction: any) => {
      const control = new FormControl(instruction);
      this.servingInstructions.push({instruction:control});
      this.servingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'servingInstruction',control);
    });
    this.cookingCost = this.recipe.recipeData.cookingCost
    this.sellingPrice = this.recipe.recipeData.sellingPrice
    if (this.recipe.recipeData.costPercentage !== undefined){
      this.costPercentage = this.recipe.recipeData.costPercentage; 
    } else {
      this.alertService.presentToast('Cost percentage is not defined. Defaulting to 1');
      this.costPercentage = '1';
    }
  }
  getIngredient(ingredient: any) {
    // console.log('ingredient',ingredient);
    if (ingredient.ingredientSelector.value){
      return this.recipe.ingredients[JSON.parse(ingredient.ingredientSelector.value)];
    }
  }
  calculateCost(){
    // console.log("Calculating cost");
    this.cookingCost = 0;
    this.recipeIngredients.some((control: any) => {
      console.log(control);
      if (this.getIngredient(control)){
        this.cookingCost += parseFloat(this.getIngredient(control).rate) * parseFloat(control['ingredientValue'].value);
      }
    });
    // console.log('1 Percent:',(this.cookingCost / 100),'CPercent:',this.costPercentage,this.cookingCost+((this.cookingCost / 100)*parseInt(this.costPercentage)));
    this.sellingPrice = Math.ceil(((this.cookingCost* 100)/parseInt(this.costPercentage)));
    // console.log("Calculated cost");
  }
  checkForCalculation(){
    if (this.recipeForm.value.cookingTimeUnit && this.recipeForm.value.cookingTimeValue && this.recipeForm.value.flameThrow){
      this.calculateEnergyConsumption();
    }
  }
  getLpgData():any{
    const data = this.utilities.find((value:any,index:number)=>{if (value.name==='LPG'){return true} else {return false}});
    return data;
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
    if (this.recipeForm.value.cookingTimeValue){
      const offset = -2;
      this.recipeForm.controls['energyConsumptionPerPreparation'].setValue(Math.ceil(( getCookingTime(this.recipeForm)) * (2/parseFloat(this.recipeForm.value.flameThrow))) + offset);
      console.log('Value',this.recipeForm.value.energyConsumptionPerPreparation);
      return this.recipeForm.value.energyConsumptionPerPreparation;
    } else {
      return 0;
    }
  }
  async submit() {
    this.calculateCost();
    console.log(this.recipeForm.value);
    if (this.recipeForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      console.log("Valid",this.servingInstructions,this.cookingInstructions);
      let servingInstructions: string[] = [];
      this.servingInstructions.forEach((control:{instruction:FormControl}) => {
        servingInstructions.push(control.instruction.value);
      });
      let cookingInstructions: string[] = [];
      this.cookingInstructions.forEach((control: {instruction:FormControl}) => {
        cookingInstructions.push(control.instruction.value);
      });
      let recipeIngredients: any[] = [];
      this.recipeIngredients.forEach((control: any) => {
        console.log(control);
        const data = this.getIngredient(control)
        console.log(data);
        recipeIngredients.push({
          id: data.id,
          unit: data.unit,
          quantity: control.ingredientValue.value,
          ingredientSelector: control.ingredientSelector.value,
          ingredientValue: control.ingredientValue.value,
        });
      });
      
      let photos = [];
      if(this.files){
        for (let index = 0; index < this.files.length; index++) {
          const file = this.files[index];
          const path = `recipes/${this.recipeForm.value.name}/${file.name}`;
          photos.push(await this.databaseService.upload(path, file));
          console.log(photos);
        }
        this.recipeForm.value.photos = photos;
      } else {
        if (!this.recipe.recipeData.photos){
          this.alertService.presentToast('Please add at least one photo','error');
          return
        }
      }
      const recipe = {
        ...this.recipe.recipeData,
        ...this.recipeForm.value,
        photos:this.recipe.recipeData.photos ? this.recipe.recipeData.photos.concat(photos) : photos,
        cookingCost: this.cookingCost,
        sellingPrice: this.sellingPrice,
        ingredients: recipeIngredients,
        costPercentage:this.costPercentage,
        cookingInstructions: cookingInstructions,
        servingInstructions: servingInstructions,
        selectedCategories:this.selectedCategories
      };
      console.log('Recipe final data ',recipe);
      this.databaseService.editRecipe(this.recipe.recipeData.id,recipe).then(() => {
        this.alertService.presentToast('Recipe updated successfully','info');
        this.matDialogRef.close();
        this.dataProvider.pageSetting.blur = false;
      }).catch((error) => {
        this.dataProvider.pageSetting.blur = false;
        this.alertService.presentToast('Error adding recipe: '+error.message,'error');
      });
    } else {
      this.alertService.presentToast('Please fill all the required fields','error');
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
      const control = new FormControl('',[Validators.required]); 
      this.servingInstructions.push({instruction:control});
      this.servingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'servingInstruction',control);
    } else {
      const control = new FormControl('',[Validators.required]);
      this.cookingInstructions.push({instruction:control});
      this.cookingInstructionsForm.addControl(this.cookingInstructions.length.toString()+'cookingInstruction',control);
    }
  }

  deleteInstruction(type: 'serving' | 'cooking', index: number) {
    if (type === 'serving') {
      this.servingInstructions.splice(index, 1);
      this.servingInstructionsForm.removeControl(index+'servingInstruction');
    } else {
      this.cookingInstructions.splice(index, 1);
      this.cookingInstructionsForm.removeControl(index+'cookingInstruction');
    }
  }
  
  manageCategories() {
    console.log("this.recipe.recipeData",this.recipe.recipeData)
    const dialogRef = this.dialog.open(ManageCategoriesComponent,{
      data:this.recipe.recipeData.selectedCategories
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      console.log('result', result);
      this.selectedCategories = result;
      this.alertService.presentToast('Categories updated successfully','info');
    });
  }
}
