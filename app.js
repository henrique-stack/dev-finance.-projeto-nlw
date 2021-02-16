//Open close web pages
const Modal = {
  open() {
    //Abrir modal
    //Adicionar  a clas active  do modal
    document.querySelector(".modal-overlay").classList.add("active");
  }, //toggle pesquisar
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  },
};
//Eu preciso pegar as minhas transações.
// Substitui os dados do HTML com os dados do JS.


const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("Dev Finances: transactions")) || []
    },
    set(transactions) {  
    localStorage.setItem("Dev Finances:transactions",
    JSON.stringify(transactions))
    }
 } 

 Storage.get()
const Transaction = {
  all: Storage.get(),
     add(transaction) {
      Transaction.all.push(transaction);
      App.reload();
    },
    remove(index) {
      Transaction.all.splice(index, 1);
  
      App.reload();
    },
    incomes() {
      let income = 0;
      Transaction.all.forEach((transaction) => {
        // se for apenas um parametro na função eu posso deixar sem parentesis
        if (transaction.amount > 0) {
          income += transaction.amount;
        }
      });
      //Para cada transação, se ela for maior que zero
      return income;
    },
    expenses() {
      //somar as saidas
      let expense = 0;
      // Pegar todas as transações
      //somar as entradas
      Transaction.all.forEach((transaction) => {
        if (transaction.amount < 0) {
          expense += transaction.amount;
        }
      });
      //Para cada transação
      return expense;
    },
    total() {
      return Transaction.incomes() + Transaction.expenses();
      // entradas - saídas
    },
  };

// Operação

//Pesquisar function toggle.
//Rascunho : $function(){$("span").css({"color": "green"})};
const DOM = {
  // A linha de codigo number 89 está contendo os elementos tr da tabela
  transactionsContainer: document.querySelector("#data-table tbody"),
  //no caso o transaction está sendo usado com return
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);
    //Here be  goning interpolation
    const html = `
    <td class="description">${transaction.description}</td>
    <td class="${CSSclass}">${amount}</td>
    <td class="date">${transaction.date}</td>
    <td>
      <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
    </td>
    `;
    return html;
  },
// Part of balance.
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.formatCurrency(
      Transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};
//Final dom 
const Utils = {
  formatAmount(value) {
    value = Number(value.replace(/\,?\.?/g, ""));
    value = value  * 100;
    return Math.round(value);
  },
  formatDate(date) {
    const splittedDate = date.split("-");
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    //Ternário
    const signal = Number(value) < 0 ? "-" : "";
    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },
  validateFields() {
    const { description, amount, date } = Form.getValues();
    // no if acima eu apenad estou personalizando ele com o operator de varificação.
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos ");
    }
  },
  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();
    try {
      Form.validateFields();
      const transaction = Form.formatValues();
      //Form.formatFields()
      // formatar os dados para salvar
      Transaction.add(transaction);
      // apagar os dados do formulario
      Form.clearFields();
      Modal.close();
      // modal fache
      // Atualizar a aplicação
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
  init() {
    Transaction.all.forEach(DOM.addTransaction);

    DOM.updateBalance();

    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions();
    App.init();
  },
};

App.init();

