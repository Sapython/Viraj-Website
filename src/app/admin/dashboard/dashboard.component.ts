import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { Chart, registerables } from 'chart.js';
import { DataProvider } from 'src/app/providers/data.provider';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    public dataProvider: DataProvider,
    private databaseService: DatabaseService
  ) {
    Chart.register(...registerables);
  }

  async ngOnInit(): Promise<void> {
    await this.loadRecipeGraph();
    // this.loadStockPie();
  }

  async loadRecipeGraph() {
    const recipeGraph = document.getElementById(
      'recipe-graph'
    ) as HTMLCanvasElement;
    const stockPie = document.getElementById('stock-pie') as HTMLCanvasElement;
    if (recipeGraph && stockPie) {
      this.dataProvider.pageSetting.blur = true;
      this.databaseService.getGraphAnalytics().then((docs:any) => {
        new Chart(recipeGraph, {
          type: 'line',
          data: {
            labels: docs.data().barLabels,
            datasets: [
              {
                label: 'Recipes Added',
                data: docs.data().barData,
                borderColor: '#d06212',
                tension: 0.2,
              },
            ],
          },
        });
        new Chart(stockPie, {
          type: 'pie',
          data: {
            labels: docs.data().pieLabels,
            datasets: [
              {
                label: 'Dataset 1',
                data: docs.data().pieData,
                backgroundColor: [
                  '#d06212',
                  '#ff9100',
                  '#ffc400',
                  '#00c853',
                  '#00b0f3',
                  '#D7E8BA',
                  '#2F4858',
                  '#7F055F',
                  '#F8F272',
                  '#653239',
                ],
              },
            ],
          },
          options: {
            responsive: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  font: {
                    size: 12,
                  },
                },
              },
              title: {
                display: true,
                text: 'Stock Distribution',
                font: {
                  size: 12,
                },
              },
            },
          },
        });
        this.dataProvider.pageSetting.blur = false;
      })
      // // Get graph labels & data
      // const months = [];
      // const recipesAdded: number[] = [];

      // const today = new Date();
      // var month = today.getMonth();
      // var year = today.getFullYear();

      // for (var i = 1; i <= 12; i++) {
      //   // Get labels (month, year)
      //   months.unshift(
      //     new Date(year, month).toLocaleDateString('en-us', {
      //       month: 'short',
      //       year: '2-digit',
      //     })
      //   );

      //   // Get analytics data for this month
      //   await this.databaseService.getAnalytics(month, year).then((doc) => {
      //     var monthRecipes = 0;
      //     if (doc.exists()) {
      //       monthRecipes = doc.data()!['recipesAdded'];
      //     }
      //     recipesAdded.unshift(monthRecipes);
      //   });

      //   year = month == 0 ? year - 1 : year;
      //   month = month == 0 ? 11 : month - 1;
      // }
      // console.log(recipesAdded);
      // this.databaseService.addBarAnalytics(months,recipesAdded)
    }
  }

  async getTopIngrs() {
    // Get ingredients distribution
    const ingredients: {
      [key: string]: number;
    } = {};
    await this.databaseService.getAllRecipes().then((docs) => {
      docs.forEach((doc) => {
        const recipe = doc.data()!;
        if (recipe) {
          const ingrs = recipe['ingredients'];
          if (ingrs) {
            ingrs.forEach((ingr: any) => {
              if (ingr.id in ingredients) {
                ingredients[ingr.id] += ingr.quantity;
              } else {
                ingredients[ingr.id] = ingr.quantity;
              }
            });
          }
        }
      });
    });

    // Get top 10 used ingredients
    const sortable = [];
    for (const ingredient in ingredients) {
      sortable.push([ingredient, ingredients[ingredient]]);
    }
    sortable.sort((a: any, b: any) => {
      return b[1] - a[1];
    });
    const topIngredients: string[] = [];
    const topIngredientsData: number[] = [];
    sortable.slice(1, 11).forEach((item) => {
      topIngredients.push((item[0] as string).toUpperCase());
      topIngredientsData.push(item[1] as number);
    });

    return [topIngredients, topIngredientsData];
  }

  async loadStockPie() {
    const stockPie = document.getElementById('stock-pie') as HTMLCanvasElement;
    if (stockPie) {
      this.dataProvider.pageSetting.blur = true;

      const result = await this.getTopIngrs();
      const topIngredients = result[0] as string[];
      const topIngredientsData = result[1];
      console.log(topIngredientsData,topIngredients);
      this.databaseService.addPieAnalytics(topIngredients, topIngredientsData)
      new Chart(stockPie, {
        type: 'pie',
        data: {
          labels: topIngredients,
          datasets: [
            {
              label: 'Dataset 1',
              data: topIngredientsData,
              backgroundColor: [
                '#d06212',
                '#ff9100',
                '#ffc400',
                '#00c853',
                '#00b0f3',
                '#D7E8BA',
                '#2F4858',
                '#7F055F',
                '#F8F272',
                '#653239',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                font: {
                  size: 32,
                },
              },
            },
            title: {
              display: true,
              text: 'Stock Distribution',
              font: {
                size: 32,
              },
            },
          },
        },
      });

      this.dataProvider.pageSetting.blur = false;
    }
  }
}
