class UI {
    constructor() {
      this.budgetFeedback = document.querySelector(".budget-feedback");
      this.expenseFeedback = document.querySelector(".expense-feedback");
      this.budgetForm = document.getElementById("budget-form");
      this.budgetInput = document.getElementById("budget-input");
      this.budgetAmount = document.getElementById("budget-amount");
      this.expenseAmount = document.getElementById("expense-amount");
      this.balance = document.getElementById("balance");
      this.balanceAmount = document.getElementById("balance-amount");
      this.expenseForm = document.getElementById("expense-form");
      this.expenseInput = document.getElementById("expense-input");
      this.amountInput = document.getElementById("amount-input");
      this.expenseList = document.getElementById("expense-list");
      this.itemList = [];
      this.itemID = 0;
    }
    
    submitBudgetForm(){
      const value = this.budgetInput.value;
      if(value === '' || value < 0){
        this.budgetFeedback.classList.add('showItem'); //Se agrega la clase llamada showItem que está en CSS para enseñar la ventana roja
        this.budgetFeedback.innerHTML = '<p>El valor no puede estar vacío o negativo</p>'; //Aquí se pone el mensaje, con un formato de párrafo
        const self = this; //Se obtiene el valor del objeto que tiene toda la info para usarla en el método de abajo (para quitar el tiempo)
        setTimeout(function(){
          self.budgetFeedback.classList.remove('showItem'); //Cuando pasen 4000ms (4 segundos) se eliminará esta clase
        }, 4000);
      }
      else {
        this.budgetAmount.textContent = value;
        this.budgetInput.value = '';
        this.showBalance();
      }
    }
  
    //Enseñar el balance
    showBalance(){
      const expense = this.totalExpense();
      const total = parseInt(this.budgetAmount.textContent) - expense;
      this.balanceAmount.textContent = total;
      if(total < 0){
        this.balance.classList.remove('showGreen', 'showBlack'); //El color verde de la clase CSS se va.
        this.balance.classList.add('showRed');
      } else if (total > 0){
        this.balance.classList.remove('showRed', 'showBlack'); //El color rojo de la clase CSS se va y se pone un verde.
        this.balance.classList.add('showGreen');
      } else if (total === 0){
        this.balance.classList.remove('showRed', 'showGreen'); //El color rojo y negro de la clase CSS se va y se pone un verde.
        this.balance.classList.add('showBlack');
      }
    }
  
    //Submit Expense Form
    submitExpenseForm(){
      const expenseValue = this.expenseInput.value;
      const amountValue = this.amountInput.value;
      if(expenseValue === '' || amountValue === '' || amountValue < 0){
        this.expenseFeedback.classList.add('showItem');
        this.expenseFeedback.innerHTML = '<p>Los valores no pueden estar vacíos o ser negativos</p>';
        const self = this;
        setTimeout(function(){
          self.expenseFeedback.classList.remove('showItem');
        }, 4000);
      } else {
        let amount = parseInt(amountValue);
        this.expenseInput.value = '';
        this.amountInput.value = '';
  
        let expense = {
          id: this.itemID,
          title: expenseValue,
          amount: amount,
        }
        this.itemID++;
        this.itemList.push(expense); //Se guarda en un arreglo con todos los gastos guardados
        this.addExpense(expense); //Se enseña el nuevo gasto como un div en el html llamando la función addExpense
        // show balance
        this.showBalance();
      }
    }
  
    //Add expense
    addExpense(expense){
      const div = document.createElement('div');
      div.classList.add('expense');
      div.innerHTML = `
      <div class="expense-item" id="expense-item">

                        <h6 class="expense-title">${expense.title}</h6>
                        <h5 class="expense-amount">$${expense.amount}</h5>

                        <div class="expense-icons">
                            <a href="#" class="edit-icon" data-id="${expense.id}">
                                <img class="fas fa-edit" src="media/edit-icon.png" alt="" srcset="">
                            </a>
                            <a href="#" class="delete-icon" data-id="${expense.id}">
                                <img class="fas fa-trash" src="media/delete-icon.png" alt="">
                            </a>
                        </div>
                    </div>`;
      this.expenseList.appendChild(div) //Se agrega el div que acabamos de crear, para que se agregue en el objeto de la lista de gastos
    }
  
    //Total expense
    totalExpense(){
      let total = 0;
      if(this.itemList.length > 0){
        total = this.itemList.reduce(function(acumulator, current){
          acumulator += current.amount;
          return acumulator;
        }, 0);
      }
      this.expenseAmount.textContent = total;
      return total;
    }
  
    //Edit expense
    editExpense(element){
      let id = parseInt(element.dataset.id);
      let parent = element.parentElement.parentElement.parentElement;
      // Eliminarlo del DOM para que no se vea más en la lista
      this.expenseList.removeChild(parent);
  
      let expense = this.itemList.filter(function(item){
        return item.id === id;
      });
  
      // Enseña el valor en los inputs para poderlo cambiar
      this.expenseInput.value = expense[0].title;
      this.amountInput.value = expense[0].amount;
  
      // Elimina este gasto de la lista para que no aparezca
      let tempList = this.itemList.filter(function(item){
        return item.id !== id;
      });
      this.itemList = tempList;
      this.showBalance();
    }
  
    //Delete expense
    deleteExpense(element){
      let id = parseInt(element.dataset.id);
      let parent = element.parentElement.parentElement.parentElement;
      // Eliminarlo del DOM para que no se vea más en la lista
      this.expenseList.removeChild(parent);
      // Eliminarlo de la lista
      // Elimina este gasto de la lista para que no aparezca
      let tempList = this.itemList.filter(function(item){
        return item.id !== id;
      });
      this.itemList = tempList;
      this.showBalance();
    }
  
  }
  
  function eventListeners(){
    const budgetForm = document.getElementById('budget-form');
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
  
    //Nueva instancia de la clase UI
    const ui = new UI();
  
    // Budget form submit
    budgetForm.addEventListener("submit", function(event){
      event.preventDefault(); //Evita que se refresque la página al presionar el botón. Esta es una acción por default.
      ui.submitBudgetForm();
      
    });
  
    // Expense form submit
    expenseForm.addEventListener("submit", function(event){
      event.preventDefault();
      ui.submitExpenseForm();  
    });
    
    // Expense click
    expenseList.addEventListener("click", function(event){
      event.preventDefault();
      if(event.target.parentElement.classList.contains('edit-icon')){
        ui.editExpense(event.target.parentElement);
      } else if (event.target.parentElement.classList.contains('delete-icon')){
        ui.deleteExpense(event.target.parentElement);
      }
    });
    
  
  }
  
  document.addEventListener('DOMContentLoaded', function(event){
    eventListeners();
  });