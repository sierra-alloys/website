/* ========================================
   SIERRA ALLOYS
   LIVE STOCK SEARCH
======================================== */

const API_URL =
  "https://sierra-inventory.mgsong23.workers.dev/";

let stockData = [];


/* ========================================
   ELEMENTS
======================================== */

const stockSearch =
  document.getElementById("stockSearch");

const materialFilter =
  document.getElementById("materialFilter");

const productFilter =
  document.getElementById("productFilter");

const typeFilter =
  document.getElementById("typeFilter");

const sizeFilter =
  document.getElementById("sizeFilter");

const astmFilter =
  document.getElementById("astmFilter");

const scheduleFilter =
  document.getElementById("scheduleFilter");

const resetFilters =
  document.getElementById("resetFilters");

const stockResults =
  document.getElementById("stockResults");

const stockTableBody =
  document.getElementById("stockTableBody");

const stockMobile =
  document.getElementById("stockMobile");

const stockCount =
  document.getElementById("stockCount");

const itemCount =
  document.getElementById("itemCount");

const noResults =
  document.getElementById("noResults");

const noResultTitle =
  document.getElementById("noResultTitle");

const noResultText =
  document.getElementById("noResultText");


/* ========================================
   HELPERS
======================================== */

function normalize(value) {

  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

}


function displayValue(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return value;

}


function scheduleDisplay(value) {

  if (!value) {
    return "—";
  }

  const text =
    String(value)
      .trim()
      .toUpperCase();

  if (
    text === "STD" ||
    text === "XS" ||
    text === "XXS"
  ) {
    return text;
  }

  if (text.startsWith("SCH")) {
    return text.replace(/^SCH\s*/, "SCH ");
  }

  return `SCH ${text}`;

}


function wtDisplay(value) {

  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  return `${value} mm`;

}


function gradeUnsDisplay(item) {

  const grade =
    String(item.grade || "").trim();

  const uns =
    String(item.uns || "").trim();


  if (!grade && !uns) {
    return "—";
  }


  if (
    grade &&
    uns &&
    normalize(grade) === normalize(uns)
  ) {
    return grade;
  }


  if (grade && uns) {
    return `${grade} / ${uns}`;
  }


  return grade || uns;

}


/* ========================================
   SIZE SORT
======================================== */

function sizeToNumber(value) {

  const text =
    String(value || "")
      .replace(/"/g, "")
      .trim();


  if (!text) {
    return 999999;
  }


  if (text.includes("-")) {

    const parts =
      text.split("-");

    const whole =
      parseFloat(parts[0]) || 0;

    const fraction =
      parts[1] || "";


    if (fraction.includes("/")) {

      const f =
        fraction.split("/");

      const numerator =
        parseFloat(f[0]);

      const denominator =
        parseFloat(f[1]);


      if (
        !isNaN(numerator) &&
        !isNaN(denominator) &&
        denominator !== 0
      ) {

        return whole +
          numerator / denominator;

      }

    }

  }


  if (text.includes("/")) {

    const f =
      text.split("/");

    const numerator =
      parseFloat(f[0]);

    const denominator =
      parseFloat(f[1]);


    if (
      !isNaN(numerator) &&
      !isNaN(denominator) &&
      denominator !== 0
    ) {

      return numerator / denominator;

    }

  }


  const number =
    parseFloat(text);


  return isNaN(number)
    ? 999999
    : number;

}


/* ========================================
   SET SELECT OPTIONS
======================================== */

function fillSelect(
  select,
  values,
  firstLabel,
  sorter = null
) {

  const unique =
    [...new Set(
      values
        .filter(value =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
        )
        .map(value =>
          String(value).trim()
        )
    )];


  if (sorter) {

    unique.sort(sorter);

  } else {

    unique.sort((a, b) =>
      a.localeCompare(
        b,
        undefined,
        {
          numeric: true,
          sensitivity: "base"
        }
      )
    );

  }


  select.innerHTML = "";


  const firstOption =
    document.createElement("option");

  firstOption.value = "";

  firstOption.textContent =
    firstLabel;

  select.appendChild(firstOption);


  unique.forEach(value => {

    const option =
      document.createElement("option");

    option.value =
      value;

    option.textContent =
      value;

    select.appendChild(option);

  });

}


/* ========================================
   BUILD FILTERS FROM AIRTABLE STOCK
======================================== */

function buildFilters() {

  fillSelect(
    productFilter,
    stockData.map(item => item.product),
    "ALL PRODUCTS"
  );


  fillSelect(
    typeFilter,
    stockData.map(item => item.type),
    "ALL TYPES"
  );


  fillSelect(
    materialFilter,
    stockData.map(item => item.material),
    "ALL MATERIALS"
  );


  fillSelect(
    sizeFilter,
    stockData.map(item => item.size),
    "ALL SIZES",
    (a, b) =>
      sizeToNumber(a) -
      sizeToNumber(b)
  );


  fillSelect(
    astmFilter,
    stockData.map(item => item.astm),
    "ALL ASTM"
  );


  fillSelect(
    scheduleFilter,
    stockData.map(item => item.schedule),
    "ALL SCHEDULES"
  );

}


/* ========================================
   SEARCH CONDITION
======================================== */

function hasSearchCondition() {

  return (

    normalize(stockSearch.value) !== ""

    ||

    productFilter.value !== ""

    ||

    typeFilter.value !== ""

    ||

    materialFilter.value !== ""

    ||

    sizeFilter.value !== ""

    ||

    astmFilter.value !== ""

    ||

    scheduleFilter.value !== ""

  );

}


/* ========================================
   HIDE RESULTS
======================================== */

function hideResults() {

  stockResults.hidden = true;

  stockMobile.hidden = true;

  stockCount.hidden = true;

  stockTableBody.innerHTML = "";

  stockMobile.innerHTML = "";


  noResultTitle.textContent =
    "SEARCH AVAILABLE STOCK";

  noResultText.textContent =
    "Select a filter or enter a search term to check our current availability.";

  noResults.style.display =
    "block";

}


/* ========================================
   DESKTOP RENDER
======================================== */

function renderDesktop(data) {

  stockTableBody.innerHTML = "";


  data.forEach(item => {

    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>
        ${displayValue(item.product)}
      </td>

      <td>
        ${displayValue(item.type)}
      </td>

      <td>
        ${displayValue(item.material)}
      </td>

      <td>
        ${displayValue(item.astm)}
      </td>

      <td>
        ${gradeUnsDisplay(item)}
      </td>

      <td>
        ${displayValue(item.size)}
      </td>

      <td>
        ${scheduleDisplay(item.schedule)}
      </td>

      <td>
        ${wtDisplay(item.wt)}
      </td>

      <td>
        <span class="status">
          ${displayValue(
            item.status || "AVAILABLE"
          )}
        </span>
      </td>

    `;


    stockTableBody.appendChild(row);

  });

}


/* ========================================
   MOBILE RENDER
======================================== */

function renderMobile(data) {

  stockMobile.innerHTML = "";


  data.forEach(item => {

    const card =
      document.createElement("article");

    card.className =
      "stock-card";


    card.innerHTML = `

      <div class="stock-card-top">

        <div>

          <p class="stock-card-product">
            ${displayValue(item.product)}
          </p>

          <p class="stock-card-type">
            ${displayValue(item.type)}
          </p>

        </div>


        <span class="status">
          ${displayValue(
            item.status || "AVAILABLE"
          )}
        </span>

      </div>


      <div class="stock-card-grid">


        <div class="stock-card-item">

          <span>MATERIAL</span>

          <strong>
            ${displayValue(item.material)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>SIZE</span>

          <strong>
            ${displayValue(item.size)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>ASTM</span>

          <strong>
            ${displayValue(item.astm)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>SCHEDULE</span>

          <strong>
            ${scheduleDisplay(item.schedule)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>GRADE / UNS</span>

          <strong>
            ${gradeUnsDisplay(item)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>WT</span>

          <strong>
            ${wtDisplay(item.wt)}
          </strong>

        </div>


      </div>

    `;


    stockMobile.appendChild(card);

  });

}


/* ========================================
   SHOW RESULTS
======================================== */

function showResults(data) {

  itemCount.textContent =
    data.length;

  stockCount.hidden =
    false;


  if (data.length === 0) {

    stockResults.hidden =
      true;

    stockMobile.hidden =
      true;

    noResultTitle.textContent =
      "NO STOCK FOUND";

    noResultText.textContent =
      "Try changing the search term or filters.";

    noResults.style.display =
      "block";

    return;

  }


  noResults.style.display =
    "none";


  renderDesktop(data);

  renderMobile(data);


  if (window.innerWidth <= 850) {

    stockResults.hidden =
      true;

    stockMobile.hidden =
      false;

  } else {

    stockResults.hidden =
      false;

    stockMobile.hidden =
      true;

  }

}


/* ========================================
   FILTER STOCK
======================================== */

function filterStock() {

  if (!hasSearchCondition()) {

    hideResults();

    return;

  }


  const search =
    normalize(stockSearch.value);


  const filtered =
    stockData.filter(item => {


      const searchable =
        normalize(`

          ${item.product}
          ${item.type}
          ${item.construction}
          ${item.itemType}
          ${item.material}
          ${item.astm}
          ${item.grade}
          ${item.uns}
          ${item.size}
          ${item.schedule}
          ${item.wt}

        `);


      return (

        (
          !search ||
          searchable.includes(search)
        )

        &&

        (
          !productFilter.value ||
          item.product ===
            productFilter.value
        )

        &&

        (
          !typeFilter.value ||
          item.type ===
            typeFilter.value
        )

        &&

        (
          !materialFilter.value ||
          item.material ===
            materialFilter.value
        )

        &&

        (
          !sizeFilter.value ||
          item.size ===
            sizeFilter.value
        )

        &&

        (
          !astmFilter.value ||
          item.astm ===
            astmFilter.value
        )

        &&

        (
          !scheduleFilter.value ||
          item.schedule ===
            scheduleFilter.value
        )

      );

    });


  showResults(filtered);

}


/* ========================================
   EVENTS
======================================== */

stockSearch.addEventListener(
  "input",
  filterStock
);


productFilter.addEventListener(
  "change",
  filterStock
);


typeFilter.addEventListener(
  "change",
  filterStock
);


materialFilter.addEventListener(
  "change",
  filterStock
);


sizeFilter.addEventListener(
  "change",
  filterStock
);


astmFilter.addEventListener(
  "change",
  filterStock
);


scheduleFilter.addEventListener(
  "change",
  filterStock
);


/* ========================================
   RESET
======================================== */

resetFilters.addEventListener(
  "click",
  () => {

    stockSearch.value = "";

    productFilter.value = "";

    typeFilter.value = "";

    materialFilter.value = "";

    sizeFilter.value = "";

    astmFilter.value = "";

    scheduleFilter.value = "";

    hideResults();

  }
);


/* ========================================
   RESIZE
======================================== */

window.addEventListener(
  "resize",
  () => {

    if (hasSearchCondition()) {
      filterStock();
    }

  }
);


/* ========================================
   LOAD INVENTORY
======================================== */

async function loadStock() {

  stockResults.hidden =
    true;

  stockMobile.hidden =
    true;

  stockCount.hidden =
    true;


  noResultTitle.textContent =
    "LOADING INVENTORY";

  noResultText.textContent =
    "Retrieving current stock availability.";

  noResults.style.display =
    "block";


  try {

    const response =
      await fetch(
        API_URL,
        {
          cache: "no-store"
        }
      );


    if (!response.ok) {

      throw new Error(
        `API error ${response.status}`
      );

    }


    const result =
      await response.json();


    if (
      result.success !== true ||
      !Array.isArray(result.stock)
    ) {

      throw new Error(
        "Invalid inventory response"
      );

    }


    stockData =
      result.stock;


    console.log(
      "SIERRA stock loaded:",
      stockData
    );


    /*
       IMPORTANT

       Build dropdowns
       but DO NOT show stock.
    */

    buildFilters();

    hideResults();


  } catch (error) {

    console.error(
      "SIERRA inventory error:",
      error
    );


    stockData = [];


    noResultTitle.textContent =
      "INVENTORY TEMPORARILY UNAVAILABLE";

    noResultText.textContent =
      "Please contact SIERRA ALLOYS for current availability.";

    noResults.style.display =
      "block";

  }

}


/* ========================================
   START
======================================== */

loadStock();
