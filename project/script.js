let filterCodes = {
    "red": "#ff7675",
    "yellow": "#fdcb6e",
    "green": "#00b894",
    "blue": "#74b9ff"

}
let selectedFilter = "blue";


let allFilters = document.querySelectorAll(".ticket-filter div");
let ticketContainer = document.querySelector(".tickets-containers");
let openModalBtn = document.querySelector(".open-modal");
let closeModalBtn = document.querySelector(".close-modal");

function loadTickets() {
    if (localStorage.getItem("allTickets")) {
        ticketContainer.innerHTML = "";
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));
        for (let i = 0; i < allTickets.length; i++) {
            let { ticketId, ticketFilter, ticketContent } = allTickets[i];
            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
            ticketDiv.innerHTML = ` <div class="ticket-filters ${ticketFilter}"></div>
            <div class="ticket-info">
            <div class="ticket-id">#${ticketId}</div>
            <div class="ticket-delete">
            <i class="fas fa-trash" id=${ticketId}></i>
            </div>
            </div>
            <div class="ticket-content">${ticketContent}</div>`;
            ticketDiv.querySelector(".ticket-filters").addEventListener("click", toggleTicketFilter);
            ticketDiv.querySelector(".ticket-delete i").addEventListener("click", handleTicketDelete);
            ticketContainer.append(ticketDiv);
        }
    }
}
loadTickets();
openModalBtn.addEventListener("click", handleOpenModal);
closeModalBtn.addEventListener("click", handleCloseModal);

function toggleTicketFilter(e) {
    let filters = ["red", "blue", "green", "black"];
    let currentFilter = e.target.classList[1];
    let idx = filters.indexOf(currentFilter);
    idx++;
    idx = idx % filters.length;

    let currentTicket = e.target;
    currentTicket.classList.remove(currentFilter);
    currentTicket.classList.add(filters[idx]);

    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    let id = currentTicket.nextElementSibling.children[0].textContent.split("#")[1];
    console.log(id);

    for (let i = 0; i < allTickets.length; i++) {
        if (allTickets[i].ticketId == id) {
            allTickets[i].ticketFilter = filters[idx];
            break;
        }
    }

    localStorage.setItem("allTickets", JSON.stringify(allTickets));
}

function handleTicketDelete(e) {
    let ticketToBeDeleted = e.target.id;
    let allTickets = JSON.parse(localStorage.getItem("allTickets"));
    let filteredTickets = allTickets.filter(function(ticketObject) {
        return ticketObject.ticketId != ticketToBeDeleted;
    })
    localStorage.setItem("allTickets", JSON.stringify(filteredTickets));
    loadTickets();
}

function handleCloseModal(e) {
    if (document.querySelector(".modal")) {
        document.querySelector(".modal").remove();
    }
}

function handleOpenModal(e) {
    let modal = document.querySelector(".modal");
    if (modal) return;

    let modalDiv = createModal();

    modalDiv.querySelector(".modal-textbox").addEventListener("click", clearModalText);
    modalDiv.querySelector(".modal-textbox").addEventListener("keypress", addTicket);
    let allModalFilters = modalDiv.querySelectorAll(".modal-filter");
    for (let i = 0; i < allModalFilters.length; i++) {
        allModalFilters[i].addEventListener("click", chooseModalFilter);
    }
    ticketContainer.append(modalDiv);
}

function createModal() {
    let modalDiv = document.createElement("div");
    modalDiv.classList.add("modal");

    modalDiv.innerHTML = `<div class="modal-textbox" data-typed="false" contenteditable="true">
    Enter your task here
</div>
<div class="modal-filter-options">
    <div class="modal-filter red"></div>
    <div class="modal-filter yellow"></div>
    <div class="modal-filter green"></div>
    <div class="modal-filter blue active-filter"></div>
</div>`;
    return modalDiv;
}

function chooseModalFilter(e) {
    let selectedModalFilter = e.target.classList[1];
    if (selectedModalFilter == selectedFilter) {
        return;
    }
    selectedFilter = selectedModalFilter;
    document.querySelector(".modal-filter.active-filter").classList.remove("active-filter");
    e.target.classList.add("active-filter");
}

function addTicket(e) {

    if (e.key == "Enter") {
        let modalText = e.target.textContent;
        let ticketDiv = document.createElement("div");
        let ticketId = uid();
        ticketDiv.classList.add("ticket");
        ticketDiv.innerHTML = ` <div class="ticket-filters ${selectedFilter}"></div>
    <div class="ticket-info">
      <div class="ticket-id">#${ticketId}</div>
      <div class="ticket-delete">
      <i class="fas fa-trash" id=${ticketId}></i>
      </div>
      </div>
    <div class="ticket-content">${modalText}</div>`;
        ticketDiv.querySelector(".ticket-filters").addEventListener("click", toggleTicketFilter);
        ticketDiv.querySelector(".ticket-delete").addEventListener("click", handleTicketDelete);
        ticketContainer.append(ticketDiv);
        e.target.parentNode.remove();
        if (!localStorage.getItem('allTickets')) {
            let allTickets = [];

            let ticketObject = {};
            ticketObject.ticketId = ticketId;
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            allTickets.push(ticketObject);

            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        } else {
            let allTickets = JSON.parse(localStorage.getItem("allTickets"));
            let ticketObject = {};
            ticketObject.ticketId = ticketId;
            ticketObject.ticketFilter = selectedFilter;
            ticketObject.ticketContent = modalText;
            allTickets.push(ticketObject);

            localStorage.setItem("allTickets", JSON.stringify(allTickets));
        }
        selectedFilter = "blue";
    }
}

function clearModalText(e) {
    if (e.target.getAttribute("data-typed") == "true") {
        return;
    }
    e.target.innerHTML = "";
    e.target.setAttribute("data-typed", "true");
}
for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", chooseFilter);
}

function chooseFilter(e) {
    if (e.target.classList.contains("active-filter")) {
        e.target.classList.remove("active-filter");
        loadTickets();
        return;
    }
    if (document.querySelector(".filter.active-filter")) {
        document.querySelector(".filter.active-filter").classList.remove("active-filter");
    }
    e.target.classList.add("active-filter");
    let ticketFilter = e.target.classList[1];
    loadSelectedTickets(ticketFilter);
}

function loadSelectedTickets(ticketFilter) {
    if (localStorage.getItem("allTickets")) {
        let allTickets = JSON.parse(localStorage.getItem("allTickets"));

        let filteredTickets = allTickets.filter(function(filterObject) {
            return filterObject.ticketFilter == ticketFilter;
        });
        ticketContainer.innerHTML = "";
        for (let i = 0; i < filteredTickets.length; i++) {
            let { ticketId, ticketFilter, ticketContent } = filteredTickets[i];

            let ticketDiv = document.createElement("div");
            ticketDiv.classList.add("ticket");
            ticketDiv.innerHTML = ` <div class="ticket-filters ${ticketFilter}"></div>
          <div class="ticket-info">
          <div class="ticket-id">#${ticketId}</div>
          <div class="ticket-delete">
          <i class="fas fa-trash" id=${ticketId}></i>
          </div>
          </div>
          <div class="ticket-content">${ticketContent}</div>`;

            ticketDiv.querySelector(".ticket-filters").addEventListener("click", toggleTicketFilter);
            ticketDiv.querySelector(".ticket-delete").addEventListener("click", handleTicketDelete);
            ticketContainer.append(ticketDiv);
        }
    }
}