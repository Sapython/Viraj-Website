import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['../admin.util.scss', './recipes.component.scss'],
})
export class RecipesComponent implements OnInit {
  recipes: any[] = [
    {
      id: 'veg-noodles',
      name: 'Veg Noodles',
      typeId: '4',
      description: 'A Delicious treat for a mouth carving for flavours.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStUT3jiReO7gl1UOeVnY1xQESP_yYxn28WoQ&usqp=CAU',
      shelfLife: '4 days',
      price: '420',
      ingredients: [
        {
          id: 1,
          quantity: 2,
        },
        {
          id: 2,
          quantity: '4',
        },
      ],
      instructions: [
        'Put some ketchup in a bowl',
        'Mix with mustard',
        'Add nutella',
        'Chop onions',
        'Put 2 eggs',
        'Add salt for taste'
      ]
    },
    {
      id: 'manchurian',
      name: 'Manchurian',
      typeId: '2',
      description:
        'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
      image:
        'https://www.cookshideout.com/wp-content/uploads/2014/11/Veg-Manchurian-Low-Fat2S.jpg',
      shelfLife: '4 days',
      price: '420',
      ingredients: [
        {
          id: '1',
          quantity: '2',
        },
        {
          id: '2',
          quantity: '4',
        },
      ],
      instructions: [
        'Put some ketchup in a bowl',
        'Mix with mustard',
        'Add nutella',
        'Chop onions',
        'Put 2 eggs',
        'Add salt for taste'
      ]
    },
  ];

  recipeTypes: any[] = [
    { id: '1', name: 'Chinese Cuisine' },
    { id: '2', name: 'South Indian Cuisine' },
    { id: '3', name: 'Dessert' },
    { id: '4', name: 'Italian Cuisine' },
    { id: '5', name: 'Beverage' },
  ];

  ingredients: any[] = [
    {
      id: '1',
      name: 'Rice',
      unit: 'kg',
    },
    {
      id: '2',
      name: 'Onion',
      unit: 'kg',
    },
    {
      id: '3',
      name: 'Potato',
      unit: 'kg',
    },
    {
      id: '4',
      name: 'Pumpkin',
      unit: 'kg',
    },
    {
      id: '5',
      name: 'Beetroot',
      unit: 'kg',
    },
    {
      id: '6',
      name: 'Carrot',
      unit: 'g',
    },
    {
      id: '7',
      name: 'Mushroom',
      unit: 'mL',
    },
    {
      id: '8',
      name: 'Flour',
      unit: 'L',
    },
  ];

  editMode: boolean = false;
  currentEditId: any = '';
  @ViewChild('photoInput') photoInput: ElementRef;

  recipeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    typeId: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    shelfLife: new FormControl('', [Validators.required]),
  });

  constructor() {}

  ngOnInit(): void {}

  getRecipeType(typeId: any): string {
    return this.recipeTypes.find((recipeType) => recipeType.id == typeId).name;
  }

  imageSelected(): void {
    var selectionIsValid = true;
    const file = this.photoInput.nativeElement.files[0];

    if (this.photoInput.nativeElement.files.length != 1) {
      selectionIsValid = false;
      this.photoInput.nativeElement.value = '';
    } else if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      alert('Your photo should either be in .png or .jpg');
      selectionIsValid = false;
      this.photoInput.nativeElement.value = '';
    } else if (file.size > 100_000) {
      alert("Your photo's size should not exceed 100 KB");
      selectionIsValid = false;
      this.photoInput.nativeElement.value = '';
    }

    if (selectionIsValid) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        document.documentElement.style.setProperty(
          '--photo-background',
          `url('${fileReader.result}')`
        );
      };
    } else {
      document.documentElement.style.setProperty('--photo-background', '');
    }
  }

  addIngredient(ingredientId: any, ingredientQuantity: any): void {
    const ingredientsInputs = document.getElementById('ingredients-inputs');
    if (ingredientsInputs) {
      const ingredientInputContainer = document.createElement('div');
      ingredientInputContainer.classList.add('ingredient-input-container');

      const ingredientSelect = document.createElement('select');
      ingredientSelect.classList.add('admin-input', 'ingredient-select');
      for (const ingredient of this.ingredients) {
        ingredientSelect.innerHTML += `<option value="${ingredient.id}">${ingredient.name}</option>`;
      }
      ingredientSelect.value = ingredientId;

      const ingredientQuantityInput = document.createElement('input');
      ingredientQuantityInput.type = 'number';
      ingredientQuantityInput.min = '0';
      ingredientQuantityInput.value = ingredientQuantity;
      ingredientQuantityInput.classList.add(
        'admin-input',
        'ingredient-quantity'
      );

      const ingredientUnit = document.createElement('span');
      ingredientUnit.classList.add('ingredient-unit');
      ingredientUnit.textContent = (() => {
        if (ingredientId) {
          const ingredient = this.ingredients.find((ingredient) => {
            return ingredient.id === ingredientId;
          });
          if (ingredient) {
            return ingredient.unit;
          }
        }
        return '';
      })();

      ingredientSelect.addEventListener('change', () => {
        for (const ingredient of this.ingredients) {
          if (ingredientSelect.value == ingredient.id) {
            ingredientUnit.textContent = ingredient.unit;
          }
        }
      });

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash');
      deleteIcon.addEventListener(
        'click',
        () => {
          if (ingredientsInputs.contains(ingredientInputContainer)) {
            ingredientsInputs.removeChild(ingredientInputContainer);
          }
        },
        false
      );

      ingredientInputContainer.appendChild(ingredientSelect);
      ingredientInputContainer.appendChild(ingredientQuantityInput);
      ingredientInputContainer.appendChild(ingredientUnit);
      ingredientInputContainer.appendChild(deleteIcon);
      ingredientsInputs.appendChild(ingredientInputContainer);
    }
  }

  addInstruction(instruction: any): void {
    const instructionsInputs = document.getElementById('instructions-inputs');
    if (instructionsInputs) {
      const instructionInputContainer = document.createElement('div');
      instructionInputContainer.style.display = 'flex';
      instructionInputContainer.style.alignItems = 'baseline';

      const instructionInput = document.createElement('input');
      instructionInput.type = 'text';
      instructionInput.classList.add('admin-input');
      instructionInput.style.width = '100%';
      instructionInput.value = instruction;

      const deleteIcon = document.createElement('i');
      deleteIcon.classList.add('fa-solid', 'fa-trash');
      deleteIcon.style.marginLeft = '1em';
      deleteIcon.style.cursor = 'pointer';
      deleteIcon.style.color = 'var(--secondary)';
      deleteIcon.style.fontSize = '1.5rem';
      deleteIcon.addEventListener(
        'click',
        () => {
          if (instructionsInputs.contains(instructionInputContainer)) {
            instructionsInputs.removeChild(instructionInputContainer);
          }
        },
        false
      );

      instructionInputContainer.appendChild(instructionInput);
      instructionInputContainer.appendChild(deleteIcon);
      instructionsInputs.appendChild(instructionInputContainer);
    }
  }

  addRecipe(): void {}

  editRecipe(recipe: any): void {
    this.editMode = true;
    this.currentEditId = recipe.id;

    // Patch values
    this.recipeForm.patchValue(recipe);
    document.documentElement.style.setProperty(
      '--photo-background',
      `url('${recipe.image}')`
    );
    const ingredientsInputs = document.getElementById('ingredients-inputs');
    if (ingredientsInputs) {
      ingredientsInputs.innerHTML = '';
      recipe.ingredients.forEach((ingredient: any) => {
        this.addIngredient(ingredient.id, ingredient.quantity);
      });
    }
    const instructionsInputs = document.getElementById('instructions-inputs');
    if (instructionsInputs) {
      instructionsInputs.innerHTML = '';
      recipe.instructions.forEach((instruction: any) => {
        this.addInstruction(instruction);
      });
    }

    const recipeModal = document.getElementById('recipe-modal');
    if (recipeModal) {
      recipeModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.recipeForm.reset();
        document.documentElement.style.setProperty(
          '--photo-background',
          ''
        );
        if (ingredientsInputs) {
          ingredientsInputs.innerHTML = '';
        }
        if (instructionsInputs) {
          instructionsInputs.innerHTML = '';
        }
      });
      UIkit.modal(recipeModal).show();
    }
  }

  deleteRecipe(): void {}
}
