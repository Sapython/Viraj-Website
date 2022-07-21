import { Injectable } from '@angular/core';
import {
  collection,
  collectionSnapshots,
  deleteDoc,
  Firestore,
  getDocs,
  orderBy,
  query,
  updateDoc,
  Timestamp,
  limit,
  startAt,
  startAfter,
  limitToLast,
  endBefore,
  addDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  getDoc,
  increment,
  endAt,
  setDoc,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  storage = getStorage();

  constructor(private fs: Firestore) {}

  async upload(
    path: string,
    file: File | ArrayBuffer | Blob | Uint8Array
  ): Promise<any> {
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        await task;
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (e: any) {
        console.error(e);
        return e;
      }
    } else {
      return false;
    }
  }
  getSiteData() {
    // alert('Getting site data')
    return getDoc(doc(this.fs, 'siteData/counters'));
  }
  getFirstStock(length: number) {
    // alert('Getting first stock')
    return getDocs(
      query(collection(this.fs, 'stock'), orderBy('name'), limit(length))
    );
  }

  getNextStock(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next stock')
    return getDocs(
      query(
        collection(this.fs, 'stock'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }
  getPreviousStock(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous stock')
    return getDocs(
      query(
        collection(this.fs, 'stock'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async getUnits() {
    // alert('Getting units')
    const data = await getDoc(doc(this.fs, 'siteData/units'));
    if (data.exists()) {
      return data.data()?.['units'].sort();
    } else {
      return [];
    }
  }

  async addStockItem(stockItem: any) {
    // alert('Adding stock item')
    try {
      await addDoc(collection(this.fs, 'stock'), stockItem);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        stockLength: increment(1),
      });
    } catch (e: any) {
      // console.error(e);
      throw new Error(e.toString());
    }
  }

  updateStockItem(stockId: string, stock: any) {
    // alert('Updating stock item')
    return updateDoc(doc(this.fs, 'stock/' + stockId), stock);
  }

  async deleteStockItem(stockId: string) {
    // alert('Deleting stock item')
    try {
      await deleteDoc(doc(this.fs, 'stock/' + stockId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        stockLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getFirstUtilities(length: number) {
    // alert('Getting first utility')
    return getDocs(
      query(collection(this.fs, 'utilities'), orderBy('name'), limit(length))
    );
  }

  getNextUtilities(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next utilities')
    return getDocs(
      query(
        collection(this.fs, 'utilities'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousUtilities(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous utilities')
    return getDocs(
      query(
        collection(this.fs, 'utilities'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  async addUtility(utility: any) {
    // alert('Adding utility')
    try {
      await addDoc(collection(this.fs, 'utilities'), utility);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        utilityLength: increment(1),
      });
    } catch (e: any) {
      // console.error(e);
      throw new Error(e.toString());
    }
  }

  updateUtility(utilityId: string, utility: any) {
    // alert('Updating utility')
    return updateDoc(doc(this.fs, 'utilities/' + utilityId), utility);
  }

  async deleteUtility(utilityId: string) {
    // alert('Deleting utility')
    try {
      await deleteDoc(doc(this.fs, 'utilities/' + utilityId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        utilityLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getRecipe(recipeId: any) {
    // alert('Getting recipe')
    return getDoc(doc(this.fs, 'recipes/' + recipeId));
  }

  getAllRecipes() {
    return getDocs(query(collection(this.fs, 'recipes'), orderBy('name')));
  }

  getFirstRecipes(length: number) {
    // alert('Getting first recipes')
    return getDocs(
      query(collection(this.fs, 'recipes'), orderBy('name'), limit(length))
    );
  }
  getNextRecipes(length: number, lastDocument: DocumentSnapshot) {
    // alert('Getting next recipes')
    return getDocs(
      query(
        collection(this.fs, 'recipes'),
        orderBy('name'),
        limit(length),
        startAfter(lastDocument)
      )
    );
  }

  getPreviousRecipes(length: number, firstDocument: DocumentSnapshot) {
    // alert('Getting previous recipes')
    return getDocs(
      query(
        collection(this.fs, 'recipes'),
        orderBy('name'),
        limitToLast(length),
        endAt(firstDocument)
      )
    );
  }

  getRecipeTypes() {
    // alert('Getting recipe types')
    return getDocs(query(collection(this.fs, 'recipeTypes'), orderBy('name')));
  }

  async addRecipe(recipe: any) {
    // alert('Adding recipe')
    try {
      await addDoc(collection(this.fs, 'recipes'), recipe);
      await this.updateRecipeAnalytics('added');
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editRecipe(recipeId: string, recipe: any) {
    // alert('Editing recipe')
    return updateDoc(doc(this.fs, 'recipes/' + recipeId), recipe);
  }

  async deleteRecipe(recipeId: string) {
    // alert('Deleting recipe')
    try {
      await deleteDoc(doc(this.fs, 'recipes/' + recipeId));
      await this.updateRecipeAnalytics('deleted');
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  updateRecipeAnalytics(action: 'added' | 'deleted') {
    const today = new Date();
    const docId = today.getMonth().toString() + today.getFullYear().toString();
    return setDoc(
      doc(this.fs, 'analytics/' + docId),
      {
        recipesAdded: increment(action == 'added' ? 1 : -1),
      },
      { merge: true }
    );
  }

  getTasks() {
    // alert('Getting tasks')
    return getDocs(query(collection(this.fs, 'tasks'), orderBy('timestamp')));
  }

  getEmployees() {
    // alert('Getting employees')
    return getDocs(query(collection(this.fs, 'employees'), orderBy('name')));
  }

  async addTask(task: any) {
    // alert('Adding task')
    try {
      task['completed'] = false;
      task['timestamp'] = Timestamp.now();
      await addDoc(collection(this.fs, 'tasks'), task);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        tasksLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editTask(taskId: string, task: any) {
    // alert('Editing task')
    return updateDoc(doc(this.fs, 'tasks/' + taskId), task);
  }

  async deleteTask(taskId: string) {
    // alert('Deleting task')
    try {
      await deleteDoc(doc(this.fs, 'tasks/' + taskId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        tasksLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  async addEmployee(employee: any) {
    // alert('Adding employee')
    try {
      await addDoc(collection(this.fs, 'employees'), employee);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        employeeLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editEmployee(employeeId: string, employee: any) {
    // alert('Editing employee')
    return updateDoc(doc(this.fs, 'employees/' + employeeId), employee);
  }

  getEmployee(employeeId: string) {
    // alert('Getting employee')
    return getDoc(doc(this.fs, 'employees/' + employeeId));
  }

  async deleteEmployee(employeeId: string) {
    // alert('Deleting employee')
    try {
      await deleteDoc(doc(this.fs, 'employees/' + employeeId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        employeeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  getCustomers() {
    // alert('Getting customers')
    return getDocs(query(collection(this.fs, 'customers'), orderBy('name')));
  }

  async addCustomer(customer: any) {
    // alert('Adding customer')
    try {
      await addDoc(collection(this.fs, 'customers'), customer);
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        customerLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }

  editCustomer(customerId: string, customer: any) {
    // alert('Editing customer')
    return updateDoc(doc(this.fs, 'customers/' + customerId), customer);
  }

  getCustomer(customerId: string) {
    // alert('Getting customer')
    return getDoc(doc(this.fs, 'customers/' + customerId));
  }

  async deleteCustomer(customerId: string) {
    // alert('Deleting customer')
    try {
      await deleteDoc(doc(this.fs, 'customers/' + customerId));
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        customerLength: increment(1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
  }
  // Utility management starts
  getUtilities() {
    return getDocs(collection(this.fs, 'stockUtilities'));
  }
  // Utility management ends

  getAnalytics(month: number, year: number) {
    return getDoc(
      doc(this.fs, 'analytics/' + month.toString() + year.toString())
    );
  }

  addPieAnalytics(data:any,pieData:any){
    setDoc(doc(this.fs, 'analytics/graphs'), {pieLabels:data,pieData:pieData}, {merge: true});
  }

  getGraphAnalytics(){
    return getDoc(doc(this.fs, 'analytics/graphs'));
  }

  addBarAnalytics(data:any,barData:any){
    setDoc(doc(this.fs, 'analytics/graphs'), {barLabels:data,barData:barData}, {merge: true});
  }
  // categories
  getNewCategories() {
    return collectionSnapshots(collection(this.fs, 'categories'));
  }
  addNewCategory(category: any) {
    return addDoc(collection(this.fs, 'categories'), category);
  }
  deleteNewCategory(categoryId: string) {
    return deleteDoc(doc(this.fs, 'categories/' + categoryId));
  }
  addNewSubcategory(subcategory: any,categoryId:string) {
    return updateDoc(doc(this.fs, 'categories/'+categoryId), {subcategories: arrayUnion(subcategory)});
  }
  deleteNewSubcategory(subcategory: string,categoryId:string) {
    return updateDoc(doc(this.fs, 'categories/'+categoryId), {subcategories: arrayRemove(subcategory)});
  }
}
