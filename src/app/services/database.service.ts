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

  getRecipe(recipeId: any) {
    // alert('Getting recipe')
    return getDoc(doc(this.fs, 'recipes/' + recipeId));
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
      return updateDoc(doc(this.fs, 'siteData/counters'), {
        recipeLength: increment(-1),
      });
    } catch (e: any) {
      throw new Error(e.toString());
    }
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
}
