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
} from '@angular/fire/firestore';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { addDoc, doc, getDoc } from '@firebase/firestore';

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

  getStock() {
    return getDocs(
      query(collection(this.fs, 'stock'), orderBy('name'))
    );
  }

  getUnits() {
    return getDocs(query(collection(this.fs, 'units'), orderBy('name')));
  }

  addStockItem(stockItem: any) {
    return addDoc(collection(this.fs, 'stock'), stockItem);
  }

  editStockItem(stockId: string, stock: any) {
    return updateDoc(doc(this.fs, 'stock/' + stockId), stock);
  }

  deleteStockItem(stockId: string) {
    return deleteDoc(doc(this.fs, 'stock/' + stockId));
  }

  getRecipe(recipeId: any) {
    return getDoc(doc(this.fs, 'recipes/' + recipeId));
  }

  getRecipes() {
    return getDocs(
      query(collection(this.fs, 'recipes'), orderBy('name'))
    );
  }

  getRecipeTypes() {
    return getDocs(query(collection(this.fs, 'recipeTypes'), orderBy('name')));
  }

  addRecipe(recipe: any) {
    return addDoc(collection(this.fs, 'recipes'), recipe);
  }

  editRecipe(recipeId: string, recipe: any) {
    return updateDoc(doc(this.fs, 'recipes/' + recipeId), recipe);
  }

  deleteRecipe(recipeId: string) {
    return deleteDoc(doc(this.fs, 'recipes/' + recipeId));
  }

  getTasks() {
    return getDocs(query(collection(this.fs, 'tasks'), orderBy('timestamp')));
  }

  getEmployees() {
    return getDocs(query(collection(this.fs, 'employees'), orderBy('name')));
  }

  addTask(task: any) {
    task['completed'] = false;
    task['timestamp'] = Timestamp.now();
    return addDoc(collection(this.fs, 'tasks'), task);
  }

  editTask(taskId: string, task: any) {
    return updateDoc(doc(this.fs, 'tasks/' + taskId), task);
  }

  deleteTask(taskId: string) {
    return deleteDoc(doc(this.fs, 'tasks/' + taskId));
  }

  addEmployee(employee: any) {
    return addDoc(collection(this.fs, 'employees'), employee);
  }

  editEmployee(employeeId: string, employee: any) {
    return updateDoc(doc(this.fs, 'employees/' + employeeId), employee);
  }

  getEmployee(employeeId: string) {
    return getDoc(doc(this.fs, 'employees/' + employeeId));
  }

  deleteEmployee(employeeId: string) {
    return deleteDoc(doc(this.fs, 'employees/' + employeeId));
  }

  getCustomers() {
    return getDocs(query(collection(this.fs, 'customers'), orderBy('name')));
  }

  addCustomer(customer: any) {
    return addDoc(collection(this.fs, 'customers'), customer);
  }

  editCustomer(customerId: string, customer: any) {
    return updateDoc(doc(this.fs, 'customers/' + customerId), customer);
  }

  getCustomer(customerId: string) {
    return getDoc(doc(this.fs, 'customers/' + customerId));
  }

  deleteCustomer(customerId: string) {
    return deleteDoc(doc(this.fs, 'customers/' + customerId));
  }
}
