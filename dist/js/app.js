"use strict";
const $overlay = document.querySelector("#overlay");
const $modal = document.querySelector("#modal");
const $incomeBtn = document.querySelector("#incomeBtn");
const $expenseBtn = document.querySelector("#expenseBtn");
const $closeBtn = document.querySelector("#closeBtn");
const $transactionForm = document.querySelector("#transactionForm");
const $alertError = document.querySelector("#alertError");
const url = new URL(location.href);
const ALL_TRANSACTIONS = JSON.parse(localStorage.getItem("transactions")) || [];
const getCurrentQuery = () => {
    return new URLSearchParams(location.search).get('modal') || "";
};
const checkModalOpen = () => {
    let openModal = getCurrentQuery();
    let $select = $transactionForm.querySelector("select");
    if (openModal === "income") {
        $overlay.classList.remove("hidden");
        $select.classList.add("hidden");
    }
    else if (openModal === "expense") {
        $overlay.classList.remove("hidden");
        $select.classList.remove("hidden");
    }
    else {
        $overlay.classList.add("hidden");
    }
};
class Transaction {
    transactionName;
    transactionType;
    transactionAmount;
    type;
    date;
    constructor(transactionName, transactionAmount, transactionType, type) {
        this.transactionName = transactionName;
        this.transactionType = transactionType;
        this.transactionAmount = transactionAmount;
        this.type = type;
        this.date = new Date().getTime();
    }
}
const createNewTransaction = (e) => {
    e.preventDefault();
    let timeOut;
    function showToast() {
        $alertError.classList.remove("hidden");
        timeOut = setTimeout(() => {
            $alertError.classList.add("hidden");
            console.log("finished");
        }, 3000);
    }
    const inputs = Array.from($transactionForm.querySelectorAll("input, select"));
    const values = inputs.map((input) => {
        if (input.type === "number") {
            return +input.value;
        }
        return input.value ? input.value : undefined;
    });
    if (values.every((value) => typeof value === "string" ? value?.trim().length > 0 : value && value > 0)) {
        const newTransaction = new Transaction(...values, getCurrentQuery());
        ALL_TRANSACTIONS.push(newTransaction);
        localStorage.setItem("transactions", JSON.stringify(ALL_TRANSACTIONS));
        window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
        checkModalOpen();
    }
    else {
        clearTimeout(timeOut);
        showToast();
    }
};
$incomeBtn.addEventListener("click", () => {
    url.searchParams.set("modal", "income");
    window.history.pushState({ path: location.href + "?" + url.searchParams }, "", location.href + "?" + url.searchParams);
    checkModalOpen();
});
$expenseBtn.addEventListener("click", () => {
    url.searchParams.set("modal", "expense");
    window.history.pushState({ path: location.href + "?" + url.searchParams }, "", location.href + "?" + url.searchParams);
    checkModalOpen();
});
$closeBtn.addEventListener("click", () => {
    window.history.pushState({ path: location.href.split("?")[0] }, "", location.href.split("?")[0]);
    checkModalOpen();
});
checkModalOpen();
$transactionForm.addEventListener("submit", createNewTransaction);
