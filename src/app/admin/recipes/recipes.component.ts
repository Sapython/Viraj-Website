import { Component, OnInit } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FormControl, FormGroup } from '@angular/forms';
import { DataProvider } from 'src/app/providers/data.provider';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import {MatDialog} from '@angular/material/dialog';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { LoaderComponent } from './loader/loader.component';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['../admin.util.scss', './recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  recipes: any[];
  recipeTypes: any[];
  ingredients: any;
  recipeLength: number = 0;
  lastDocReference: any;
  firstDocReference: any;
  serialNumberAdditionalCounter: number = 0;
  // files: FileList | null;
  // cookingCost: string = '0.00';
  // sellingPrice: string = '0.00';
  // recipeTypeDataLoaded: boolean = false;
  // stocksDataLoaded: boolean = false;
  // months: string[] = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December',
  // ];

  // editMode: boolean = false;
  // currentEditId: string = '';
  // currentDeleteId: string = '';
  // recipeDataLoaded: boolean = false;
  // recipeForm: FormGroup = new FormGroup({
  //   name: new FormControl(''),
  //   photos: new FormControl([]),
  //   type: new FormControl(''),
  //   flavourPalette: new FormControl(''),
  //   bestSeasonFrom: new FormControl(''),
  //   bestSeasonTo: new FormControl(''),
  //   description: new FormControl(''),
  //   ingredients: new FormControl([]),
  //   cookingInstructions: new FormControl([]),
  //   servingInstructions: new FormControl([]),
  //   preparationTimeValue: new FormControl(0),
  //   preparationTimeUnit: new FormControl('minute(s)'),
  //   cookingTimeValue: new FormControl(0),
  //   cookingTimeUnit: new FormControl('minute(s)'),
  //   servingTimeValue: new FormControl(0),
  //   servingTimeUnit: new FormControl('minute(s)'),
  //   shelfLifeValue: new FormControl(0),
  //   shelfLifeUnit: new FormControl('minute(s)'),
  //   energyConsumptionPerPreparation: new FormControl(''),
  // });

  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertsAndNotificationsService,
    private blurSiteService: BlurSiteService,
    private dataProvider:DataProvider,
    public dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    // Get ingredients
    await this.getSiteData();
    await this.getRecipes();
  }

  async getCurrentStocks() {
    if (!this.dataProvider.ingredientsCopy){
      await this.databaseService.getFirstStock(500).then((stock: any) => {
        this.ingredients = {};
        stock.forEach((stockItem: any) => {
          this.ingredients[stockItem.id] = stockItem.data();
          this.ingredients[stockItem.id].id = stockItem.id;
        });
        console.log(this.ingredients);
      });
    } else {
      return
    }
  }

  async getRecipeTypes() {
    await this.databaseService
      .getRecipeTypes()
      .then((recipeTypes: any) => {
        this.recipeTypes = [];
        recipeTypes.forEach((recipeType: any) => {
          this.recipeTypes.push({
            id: recipeType.id,
            ...recipeType.data(),
          });
        });
      })
      .catch((error) => {
        this.alertService.presentToast('Cannot get recipe types.', 'error');
      });
  }

  async getRecipes() {
    await this.databaseService
      .getFirstRecipes(10)
      .then((recipes: any) => {
        this.setCurrentViewData(recipes);
        this.blurSiteService.stopBlur();
      })
      .catch(() => {
        this.alertService.presentToast('Cannot get recipes.', 'error');
      });
  }

  async getNextRecipes(event: any) {
    console.log(event);
    if (event.previousPageIndex < event.pageIndex) {
      console.log('Moved next');
      const lastDoc = this.lastDocReference;
      const length = event.pageSize;
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService.getNextRecipes(length, lastDoc).then((docs: any) => {
        // this.allStocks.push(...docs)
        this.setCurrentViewData(docs);
      });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService
        .getPreviousRecipes(event.pageSize, this.firstDocReference)
        .then((docs: any) => {
          // this.allStocks.push(...docs)
          this.setCurrentViewData(docs);
        });
    } else if (
      event.previousPageIndex === event.pageIndex &&
      event.pageIndex === 0
    ) {
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService.getFirstRecipes(event.pageSize).then((docs: any) => {
        this.setCurrentViewData(docs);
        // this.allStocks.push(...docs)
      });
    }
    console.log(
      event.previousPageIndex,
      (event.pageIndex + 1) * event.pageSize
    );
  }

  setCurrentViewData(docs: DocumentReference[]) {
    this.recipes = [];
    let setFirstDoc = true;
    docs.forEach((doc: any) => {
      if (setFirstDoc) {
        this.firstDocReference = doc;
        setFirstDoc = false;
      }
      this.recipes.push(doc.data());
      this.lastDocReference = doc;
    });
  }

  async getSiteData() {
    await this.databaseService
      .getSiteData()
      .then((data) => {
        if (data.exists()) {
          const siteData = data.data();
          this.recipeLength = siteData['recipeLength'];
        } else {
          this.recipeLength = 0;
        }
      })
      .catch((error) => {
        this.alertService.presentToast('Cannot get site data.', 'error');
      });
  }

  async checkAndGetData() {
    console.log('Checking data',this.ingredients, this.recipeTypes,this.ingredients === undefined,this.recipeTypes === undefined);
    if (this.ingredients === undefined){
      await this.getCurrentStocks()
    }
    if(this.recipeTypes === undefined){
      await this.getRecipeTypes()
    }
  }
  addRecipe(){
    const loaderRef = this.dialog.open(LoaderComponent)
    this.checkAndGetData().then(() => {
      loaderRef.close()
      const dialogRef = this.dialog.open(AddRecipeComponent,{
        data:{
          ingredients: this.ingredients,
          ingredientsKeys: Object.keys(this.ingredients),
          recipeTypes: this.recipeTypes,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("result",result);
      })
    })
  }
  deleteRecipe(recipeId:string){
  }
  async editRecipe(recipeData:any){
    const loaderRef = this.dialog.open(LoaderComponent)
    if (!this.ingredients){
      await this.getCurrentStocks();
    }
    if(!this.recipeTypes){
      await this.getRecipeTypes();
    }
    const dialogRef = this.dialog.open(EditRecipeComponent, {
      data: {
        recipeData: recipeData,
        ingredients: this.ingredients,
        ingredientsKeys: Object.keys(this.ingredients),
        recipeTypes: this.recipeTypes,
      }
    });
    loaderRef.close()
    dialogRef.afterClosed().subscribe(result => {
      console.log("result",result);
    })
  }
  viewRecipe(recipe:any){
    console.log({
      recipeId: recipe.id
    })
    const dialogRef = this.dialog.open(RecipePageComponent, {
      data: recipe
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("result",result);
    })
  }
  // async openAddRecipeModal() {
  //   this.editMode = false;
  //   this.recipeForm.reset();
  //   this.files = null;
  //   await this.checkAndGetData();
  //   UIkit.modal('#recipe-modal').show();
  // }

  // ngAfterViewInit(): void {
  //   const ingredientInputContainers = document.getElementsByClassName(
  //     'ingredient-input-container'
  //   );

  //   // Calculate cooking cost & selling price in add recipe modal
  //   const onEvent = () => {
  //     var cookingCost = 0;
  //     for (var i = 0; i < ingredientInputContainers.length; i++) {
  //       const ingredientInputContainer = ingredientInputContainers[i];
  //       const ingredientSelect = ingredientInputContainer.querySelector(
  //         '.ingredient-select'
  //       ) as HTMLSelectElement;
  //       const ingredientQuantityInput = ingredientInputContainer.querySelector(
  //         '.ingredient-quantity'
  //       ) as HTMLInputElement;
  //       if (
  //         ingredientSelect.value !== '' &&
  //         ingredientQuantityInput.value != '0'
  //       ) {
  //         cookingCost +=
  //           parseFloat(this.ingredients[ingredientSelect.value].rate) *
  //           parseFloat(ingredientQuantityInput.value);
  //       }
  //     }

  //     this.cookingCost = cookingCost.toFixed(2);
  //     this.sellingPrice` = (cookingCost / 0.3).toFixed(2);
  //   };

  //   const ingredientsInputs = document.getElementById('ingredients-inputs');
  //   ingredientsInputs?.addEventListener('change', onEvent, false);
  //   ingredientsInputs?.addEventListener('input', onEvent, false);
  //   ingredientsInputs?.addEventListener('click', onEvent, false);
  // }

  // validateImages(event: Event): void {
  //   const target = event.target as HTMLInputElement;
  //   const files = target.files;
  //   if (files != null) {
  //     for (var i = 0; i < files!.length; i++) {
  //       const file = files![i];
  //       var fileIsValid = false;
  //       if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
  //         this.alertService.presentToast(
  //           'Only png, jpeg and jpg images are allowed',
  //           'error'
  //         );
  //       } else if (file.size >= 100_000) {
  //         this.alertService.presentToast(
  //           "Each image's size must be less than 100Kb",
  //           'error'
  //         );
  //       } else {
  //         fileIsValid = true;
  //         this.files = files;
  //       }
  //       if (!fileIsValid) {
  //         target.value = '';
  //       }
  //     }
  //   }
  // }

  // addIngredient(
  //   event: Event | null,
  //   ingredientId: any,
  //   ingredientQuantity: any
  // ): void {
  //   if (event) {
  //     event.preventDefault();
  //   }
  //   const ingredientsInputs = document.getElementById('ingredients-inputs');
  //   if (ingredientsInputs) {
  //     const ingredientInputContainer = document.createElement('div');
  //     ingredientInputContainer.classList.add('ingredient-input-container');
  //     const ingredientSelect = document.createElement('select');
  //     // console.log('Step 1');
  //     ingredientSelect.classList.add('admin-input', 'ingredient-select');
  //     // console.log('Step 2');
  //     ingredientSelect.innerHTML = `<option value="" disabled>Choose ingredient</option>`;
  //     // console.log('Step 3', this.ingredients,this.dataProvider.ingredientsCopy);
  //     // console.log(Object.keys(this.ingredients));
  //     if (!this.ingredients){
  //       this.ingredients = JSON.parse(JSON.stringify(this.dataProvider.ingredientsCopy));
  //     }
  //     // console.log('Step 3', this.ingredients,this.dataProvider.ingredientsCopy);
  //     for (const mainIngredientId of Object.keys(this.ingredients)) {
  //       ingredientSelect.innerHTML += `<option value="${mainIngredientId}">${this.ingredients[mainIngredientId].name}</option>`;
  //     }
  //     // console.log('Step 4');
  //     ingredientSelect.value = ingredientId;

  //     const ingredientQuantityInput = document.createElement('input');
  //     ingredientQuantityInput.type = 'number';
  //     ingredientQuantityInput.min = '0';
  //     ingredientQuantityInput.value = ingredientQuantity;
  //     ingredientQuantityInput.classList.add(
  //       'admin-input',
  //       'ingredient-quantity'
  //     );
  //     const ingredientUnit = document.createElement('span');
  //     ingredientUnit.classList.add('ingredient-unit');
  //     ingredientUnit.textContent = (() => {
  //       if (ingredientId) {
  //         const ingredient = this.ingredients[ingredientId];
  //         if (ingredient) {
  //           return ingredient.unit;
  //         }
  //       }
  //       return '';
  //     })();
  //     // console.log('Step 5');
  //     ingredientSelect.addEventListener('change', () => {
  //       ingredientUnit.textContent =
  //         this.ingredients[ingredientSelect.value].unit;
  //     });
  //     // console.log('Step 6');
  //     const deleteIcon = document.createElement('i');
  //     deleteIcon.classList.add('fa-solid', 'fa-trash');
  //     deleteIcon.addEventListener(
  //       'click',
  //       () => {
  //         if (ingredientsInputs.contains(ingredientInputContainer)) {
  //           ingredientsInputs.removeChild(ingredientInputContainer);
  //         }
  //       },
  //       false
  //     );
  //     // console.log('Step 7');
  //     ingredientInputContainer.appendChild(ingredientSelect);
  //     ingredientInputContainer.appendChild(ingredientQuantityInput);
  //     ingredientInputContainer.appendChild(ingredientUnit);
  //     ingredientInputContainer.appendChild(deleteIcon);
  //     ingredientsInputs.appendChild(ingredientInputContainer);
  //   }
  // }

  // addInstruction(
  //   event: Event | null,
  //   type: 'cooking' | 'serving',
  //   instruction: any
  // ): void {
  //   if (event) {
  //     event.preventDefault();
  //   }
  //   const instructionsInputs = document.getElementById(
  //     type + '-instructions-inputs'
  //   );
  //   if (instructionsInputs) {
  //     const instructionInputContainer = document.createElement('div');
  //     instructionInputContainer.style.display = 'flex';
  //     instructionInputContainer.style.alignItems = 'baseline';

  //     const instructionInput = document.createElement('input');
  //     instructionInput.type = 'text';
  //     instructionInput.classList.add('admin-input', type + '-instruction');
  //     instructionInput.style.width = '100%';
  //     instructionInput.value = instruction;

  //     const deleteIcon = document.createElement('i');
  //     deleteIcon.classList.add('fa-solid', 'fa-trash');
  //     deleteIcon.style.marginLeft = '1em';
  //     deleteIcon.style.cursor = 'pointer';
  //     deleteIcon.style.color = 'var(--secondary)';
  //     deleteIcon.style.fontSize = '1.5rem';
  //     deleteIcon.addEventListener(
  //       'click',
  //       () => {
  //         if (instructionsInputs.contains(instructionInputContainer)) {
  //           instructionsInputs.removeChild(instructionInputContainer);
  //         }
  //       },
  //       false
  //     );

  //     instructionInputContainer.appendChild(instructionInput);
  //     instructionInputContainer.appendChild(deleteIcon);
  //     instructionsInputs.appendChild(instructionInputContainer);
  //   }
  // }

  // async submit(): Promise<any> {
  //   // Set ingredients form control
  //   this.recipeForm.value.ingredients = [];
  //   const ingredientInputContainers = document.getElementsByClassName(
  //     'ingredient-input-container'
  //   );
  //   for (var i = 0; i < ingredientInputContainers.length; i++) {
  //     const ingredientInputContainer = ingredientInputContainers[i];
  //     const ingredientSelect = ingredientInputContainer.querySelector(
  //       '.ingredient-select'
  //     ) as HTMLSelectElement;
  //     const ingredientQuantityInput = ingredientInputContainer.querySelector(
  //       '.ingredient-quantity'
  //     ) as HTMLInputElement;
  //     const ingredientUnit = ingredientInputContainer.querySelector(
  //       '.ingredient-unit'
  //     ) as HTMLSpanElement;
  //     if (
  //       ingredientSelect.value !== '' &&
  //       ingredientQuantityInput.value != '0'
  //     ) {
  //       this.recipeForm.value.ingredients.push({
  //         id: ingredientSelect.value,
  //         quantity: ingredientQuantityInput.value,
  //         unit: ingredientUnit.textContent,
  //       });
  //     }
  //   }

  //   // Set cookingInstructions form control
  //   this.recipeForm.value.cookingInstructions = [];
  //   const cookingInstructions = document.getElementsByClassName(
  //     'cooking-instruction'
  //   );
  //   for (var i = 0; i < cookingInstructions.length; i++) {
  //     this.recipeForm.value.cookingInstructions.push(
  //       (cookingInstructions[i] as HTMLInputElement).value
  //     );
  //   }

  //   // Set servingInstructions form control
  //   this.recipeForm.value.servingInstructions = [];
  //   const servingInstructions = document.getElementsByClassName(
  //     'serving-instruction'
  //   );
  //   for (var i = 0; i < servingInstructions.length; i++) {
  //     this.recipeForm.value.servingInstructions.push(
  //       (servingInstructions[i] as HTMLInputElement).value
  //     );
  //   }

  //   if (
  //     this.recipeForm.value.name.trim() !== '' &&
  //     this.recipeForm.value.ingredients.length > 0
  //   ) {
  //     this.blurSiteService.startBlur();

  //     // Upload images if they're selected
  //     this.recipeForm.value.photos = [];
  //     if (this.files) {
  //       const urls: string[] = [];
  //       for (var i = 0; i < this.files.length; i++) {
  //         const file = this.files[i];
  //         await this.databaseService
  //           .upload('recipes/' + new Date().getTime(), file)
  //           .then((url) => {
  //             this.recipeForm.value.photos.push(url);
  //           });
  //       }
  //     }

  //     if (this.editMode) {
  //       this.databaseService
  //         .editRecipe(this.currentEditId, this.recipeForm.value)
  //         .then(() => {
  //           UIkit.modal(document.getElementById('recipe-modal')).hide();
  //           this.ngOnInit();
  //           this.blurSiteService.stopBlur();
  //           this.alertService.presentToast(
  //             'Recipe edited successfully',
  //             'info'
  //           );
  //         });
  //     } else {
  //       this.databaseService.addRecipe(this.recipeForm.value).then(() => {
  //         UIkit.modal(document.getElementById('recipe-modal')).hide();
  //         this.ngOnInit();
  //         this.recipeForm.reset();
  //         (document.getElementById('photos-input') as HTMLInputElement).value =
  //           '';
  //         this.files = null;
  //         document.getElementById('ingredients-inputs')!.innerHTML = '';
  //         document.getElementById('cooking-instructions-inputs')!.innerHTML =
  //           '';
  //         document.getElementById('serving-instructions-inputs')!.innerHTML =
  //           '';
  //         this.blurSiteService.stopBlur();
  //         this.alertService.presentToast('Recipe added successfully!');
  //       });
  //     }
  //   } else {
  //     this.alertService.presentToast(
  //       'Please fill all the required fields',
  //       'error'
  //     );
  //   }
  // }

  

  // async editRecipe(recipe: any) {
  //   await this.checkAndGetData().then((data) => {
  //     this.editMode = true;
  //     this.currentEditId = recipe.id;
  //     // Patch values
  //     this.recipeForm.patchValue(recipe);
  //     const ingredientsInputs = document.getElementById('ingredients-inputs');
  //     if (ingredientsInputs) {
  //       ingredientsInputs.innerHTML = '';
  //       recipe.ingredients.forEach((ingredient: any) => {
  //         this.addIngredient(null, ingredient.id, ingredient.quantity);
  //       });
  //     }
  //     const instructionsInputs = document.getElementById('instructions-inputs');
  //     if (instructionsInputs) {
  //       instructionsInputs.innerHTML = '';
  //       recipe.instructions.forEach((instruction: any) => {
  //         this.addInstruction(null, 'cooking', instruction);
  //       });
  //     }
  //     const recipeModal = document.getElementById('recipe-modal');
  //     if (recipeModal) {
  //       recipeModal.addEventListener('hidden', () => {
  //         // this.editMode = false;
  //         this.currentEditId = '';

  //         // Reset the form
  //         this.recipeForm.reset();
  //         (document.getElementById('photos-input') as HTMLInputElement).value =
  //           '';

  //         if (ingredientsInputs) {
  //           ingredientsInputs.innerHTML = '';
  //         }
  //         if (instructionsInputs) {
  //           instructionsInputs.innerHTML = '';
  //         }
  //       });
  //       UIkit.modal(recipeModal).show();
  //     }
  //   });
  // }

  // requestDelete(recipeId: string): void {
  //   UIkit.modal(document.getElementById('confirm-delete-modal')).show();
  //   this.currentDeleteId = recipeId;
  // }

  // deleteRecipe(): void {
  //   this.blurSiteService.startBlur();
  //   this.databaseService.deleteRecipe(this.currentDeleteId).then(() => {
  //     this.ngOnInit();
  //     this.blurSiteService.stopBlur();
  //     this.alertService.presentToast('Recipe deleted successfully', 'info');
  //   });
  // }
}
