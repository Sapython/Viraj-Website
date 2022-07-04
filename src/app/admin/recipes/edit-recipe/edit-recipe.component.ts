import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';

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
  cookingCost: number = 0;
  sellingPrice: number = 0;
  recipeIngredients: any[] = [];
  servingInstructions: any[] = [];
  cookingInstructions: any[] = [];
  cookingInstructionsForm =  new FormGroup({})
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
    servingInstructions: new FormControl(this.recipe.recipeData.servingInstructions || '',[Validators.required]),
    preparationTimeValue: new FormControl(this.recipe.recipeData.preparationTimeValue || '',[Validators.required]),
    preparationTimeUnit: new FormControl(this.recipe.recipeData.preparationTimeUnit || '',[Validators.required]),
    cookingTimeValue: new FormControl(this.recipe.recipeData.cookingTimeValue || '',[Validators.required]),
    cookingTimeUnit: new FormControl(this.recipe.recipeData.cookingTimeUnit || '',[Validators.required]),
    servingTimeValue: new FormControl(this.recipe.recipeData.servingTimeValue || '',[Validators.required]),
    servingTimeUnit: new FormControl(this.recipe.recipeData.servingTimeUnit || '',[Validators.required]),
    shelfLifeValue: new FormControl(this.recipe.recipeData.shelfLifeValue || '',[Validators.required]),
    shelfLifeUnit: new FormControl(this.recipe.recipeData.shelfLifeUnit || '',[Validators.required]),
    energyConsumptionPerPreparation: new FormControl(this.recipe.recipeData.energyConsumptionPerPreparation || ''),
  });
  ngAfterViewInit() {
    this.recipeIngredients.forEach((control: any) => {
      console.log("Contrl",control);
    });
    setTimeout(() => {this.calculateCost();},3000)
  }
  ngOnInit(): void {
    console.log(this.recipe, this.recipe.recipeTypes);
    this.recipeIngredients = [];
    this.recipe.recipeData.ingredients.forEach((ingredient: any) => {
      console.log('Yeeahh',ingredient);
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
      this.cookingInstructions.push({
        instruction: new FormControl(instruction,[Validators.required]),
      });
      // this.cookingInstructionsForm.addControl();
    });
    this.recipe.recipeData.servingInstructions?.forEach((instruction: any) => {
      this.servingInstructions.push({
        instruction: new FormControl(instruction,[Validators.required]),
      });
    });
  }
  calculateCost(){
    console.log("Calculating cost");
    this.cookingCost = 0;
    this.recipeIngredients.forEach((control: any) => {
      console.log("Control",control);
      this.cookingCost += parseFloat(this.recipe.ingredients[control['ingredientSelector'].value].rate) * parseFloat(control['ingredientValue'].value);
    });
    this.sellingPrice = Math.ceil(this.cookingCost / 0.3);
    console.log("Calculated cost");
  }
  async submit() {
    if (this.recipeForm.valid) {
      // console.log(this.recipeForm.value);
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
          // ingredientSelector: control.ingredientSelector.value,
          // ingredientValue: control.ingredientValue.value,
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
