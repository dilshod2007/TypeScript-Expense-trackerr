const $overlay = document.querySelector("#overlay") as HTMLDivElement;
const $modal = document.querySelector("#modal") as HTMLDivElement;
const $incomeBtn = document.querySelector("#incomeBtn") as HTMLButtonElement;
const $expenseBtn = document.querySelector("#expenseBtn") as HTMLButtonElement;
const $closeBtn = document.querySelector("#closeBtn") as HTMLButtonElement;
const $transactionForm = document.querySelector("#transactionForm") as HTMLFormElement;
const $alertError = document.querySelector("#alertError") as HTMLDivElement;
const $transactionList = document.querySelector("#transactionList") as HTMLDivElement; 

const url = new URL(location.href);

let ALL_TRANSACTIONS: Transaction[] = JSON.parse(localStorage.getItem("transactions") as string) || [];

const renderTransactions = () => {
    $transactionList.innerHTML = ''; 
    ALL_TRANSACTIONS.forEach((transaction: Transaction) => {
        const li = document.createElement('li');
        li.className = "list-group-item flex items-center justify-between";
        li.innerHTML = `
            <div>
                <div class="font-bold">${transaction.transactionName}</div>
                <div class="text-sm text-gray-600">${transaction.transactionType || 'Type yo\'q'}</div>
            </div>
            <div class="font-bold">${transaction.transactionAmount} UZS</div>
        `;
        $transactionList.appendChild(li); 
        
    });
};


const getCurrentQuery = () => {
    return new URLSearchParams(location.search).get('modal') || "" as string;
};

const checkModalOpen = () => {
    let openModal = getCurrentQuery();
    let $select = $transactionForm.querySelector("select") as HTMLSelectElement;
    if (openModal === "income") {
        $overlay.classList.remove("hidden");
        $select.classList.add("hidden");
    } else if (openModal === "expense") {
        $overlay.classList.remove("hidden");
        $select.classList.remove("hidden");
    } else {
        $overlay.classList.add("hidden");
    }
};

class Transaction {
    transactionName: string;
    transactionType: string | undefined;
    transactionAmount: number;
    type: string;
    date: number;
    constructor(transactionName: string, transactionAmount: number, transactionType: string | undefined, type: string) {
        this.transactionName = transactionName;
        this.transactionType = transactionType;
        this.transactionAmount = transactionAmount;
        this.type = type;
        this.date = new Date().getTime();
    }
}

const createNewTransaction = (e: Event) => {
    e.preventDefault();

    let timeOut;
    function showToast() {
        $alertError.classList.remove("hidden");
        timeOut = setTimeout(() => {
            $alertError.classList.add("hidden");
            
        }, 3000);
    }

    const inputs = Array.from($transactionForm.querySelectorAll("input, select")) as HTMLInputElement[];
    const values: (string | number | undefined)[] = inputs.map((input) => {
        if (input.type === "number") {
            return +input.value;
        }
        return input.value ? input.value : undefined;
    });

    if (values.every((value) => (typeof value === "string" ? value?.trim().length > 0 : value && value > 0))) {
        const newTransaction = new Transaction(...(values as [string, number, string | undefined]), getCurrentQuery());
        ALL_TRANSACTIONS.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(ALL_TRANSACTIONS));
        renderTransactions(); 
        window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
        checkModalOpen();
    } else {
        clearTimeout(timeOut);
        showToast();
    }
};

$incomeBtn.addEventListener("click", () => {
    url.searchParams.set("modal", "income");
    window.history.pushState({ path: location.href.split("?")[0] + "?" + url.searchParams }, "", location.href.split("?")[0] + "?" + url.searchParams);
    checkModalOpen();
});

$expenseBtn.addEventListener("click", () => {
    url.searchParams.set("modal", "expense");
    window.history.pushState({ path: location.href.split("?")[0] + "?" + url.searchParams }, "", location.href.split("?")[0] + "?" + url.searchParams);
    checkModalOpen();
});

$closeBtn.addEventListener("click", () => {
    window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
    checkModalOpen();
});

$transactionForm.addEventListener("submit", createNewTransaction);

window.onload = () => {
    checkModalOpen();
    renderTransactions(); 
};
