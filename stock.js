/* ========================================
   SIERRA ALLOYS STOCK
   AIRTABLE LIVE INVENTORY
======================================== */

const API_URL =
  "https://sierra-inventory.mgsong23.workers.dev/";

let stockData = [];
let hasSearched = false;


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

const stockTableBody =
  document.getElementById("stockTableBody");

const stockMobile =
  document.getElementById("stockMobile");

const itemCount =
  document.getElementById("itemCount");

const noResults =
  document.getElementById("noResults");

const noResultTitle =
  document.getElementById("noResultTitle");

const noResultText =
  document.getElementById("noResultText");

const tableWrap =
  document.querySelector(".table-wrap");


/* ========================================
   BASIC HELPERS
======================================== */

function normalize(value){

  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

}


function displayValue(value){

  if(
    value === "" ||
    value === null ||
    value === undefined
  ){
    return "—";
  }

  return value;

}


/* ========================================
   SCHEDULE DISPLAY
======================================== */

function scheduleDisplay(value){

  if(!value){
    return "—";
  }

  const text =
    String(value)
      .trim()
      .toUpperCase();

  if(
    text === "STD" ||
    text === "XS" ||
    text === "XXS"
  ){
    return text;
  }

  if(text.startsWith("SCH")){

    return text.replace(
      /^SCH\s*/,
      "SCH "
    );

  }

  return `SCH ${text}`;

}


/* ========================================
   WT DISPLAY
======================================== */

function wtDisplay(value){

  if(
    value === "" ||
    value === null ||
    value === undefined
  ){
    return "—";
  }

  return `${value} mm`;

}


/* ========================================
   MATERIAL DISPLAY
======================================== */

function materialDisplay(item){

  const material =
    String(item.material || "").trim();

  if(!material){
    return "—";
  }

  return material;

}


/* ========================================
   GRADE / UNS DISPLAY

   Example:

   Grade = S31803 / S32205
   UNS   = S31803 / S32205

   Result:
   S31803 / S32205

   Not:
   S31803 / S32205 /
   S31803 / S32205
======================================== */

function gradeUnsDisplay(item){

  const grade =
    String(item.grade || "").trim();

  const uns =
    String(item.uns || "").trim();


  if(!grade && !uns){
    return "—";
  }


  if(
    grade &&
    uns &&
    normalize(grade) === normalize(uns)
  ){
    return grade;
  }


  if(grade && uns){
    return `${grade} / ${uns}`;
  }


  return grade || uns;

}


/* ========================================
   SIZE SORTING
======================================== */

function sizeToNumber(value){

  const text =
    String(value || "")
      .replace(/"/g, "")
      .trim();


  if(!text){
    return 999999;
  }


  /*
     1-1/2
     2-1/2
  */

  if(text.includes("-")){

    const parts =
      text.split("-");

    const whole =
      parseFloat(parts[0]) || 0;

    const fraction =
      parts[1] || "";


    if(fraction.includes("/")){

      const f =
        fraction.split("/");

      const numerator =
        parseFloat(f[0]);

      const denominator =
        parseFloat(f[1]);


      if(
        !isNaN(numerator) &&
        !isNaN(denominator) &&
        denominator !== 0
      ){

        return whole +
          numerator / denominator;

      }

    }

  }


  /*
     1/2
     3/4
  */

  if(text.includes("/")){

    const f =
      text.split("/");

    const numerator =
      parseFloat(f[0]);

    const denominator =
      parseFloat(f[1]);


    if(
      !isNaN(numerator) &&
      !isNaN(denominator) &&
      denominator !== 0
    ){

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
   OPTION GENERATOR
======================================== */

function setOptions(
  element,
  values,
  allLabel,
  sortFunction = null
){

  const previous =
    element.value;


  const unique =
    [
      ...new Set(

        values

          .filter(value =>

            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""

          )

          .map(value =>
            String(value).trim()
          )

      )
    ];


  if(sortFunction){

    unique.sort(sortFunction);

  }else{

    unique.sort((a,b) =>

      a.localeCompare(
        b,
        undefined,
        {
          numeric:true,
          sensitivity:"base"
        }
      )

    );

  }


  element.innerHTML =
    `<option value="">${allLabel}</option>`;


  unique.forEach(value => {

    const option =
      document.createElement("option");

    option.value =
      value;

    option.textContent =
      value;

    element.appendChild(option);

  });


  if(unique.includes(previous)){

    element.value =
      previous;

  }

}


/* ========================================
   DYNAMIC FILTER OPTIONS
======================================== */

function updateFilters(){

  /*
     PRODUCT
  */

  setOptions(
    productFilter,
    stockData.map(item => item.product),
    "ALL PRODUCTS"
  );


  /*
     TYPE

     Depends on selected Product.
  */

  const typeData =
    stockData.filter(item =>

      !productFilter.value ||
      item.product === productFilter.value

    );


  setOptions(
    typeFilter,
    typeData.map(item => item.type),
    "ALL TYPES"
  );


  /*
     MATERIAL

     Depends on Product + Type.
  */

  const materialData =
    stockData.filter(item =>

      (
        !productFilter.value ||
        item.product === productFilter.value
      )

      &&

      (
        !typeFilter.value ||
        item.type === typeFilter.value
      )

    );


  setOptions(
    materialFilter,
    materialData.map(item => item.material),
    "ALL MATERIALS"
  );


  /*
     SIZE / ASTM / SCHEDULE

     Depends on Product + Type + Material.
  */

  const specificationData =
    stockData.filter(item =>

      (
        !productFilter.value ||
        item.product === productFilter.value
      )

      &&

      (
        !typeFilter.value ||
        item.type === typeFilter.value
      )

      &&

      (
        !materialFilter.value ||
        item.material === materialFilter.value
      )

    );


  setOptions(
    sizeFilter,
    specificationData.map(item => item.size),
    "ALL SIZES",
    (a,b) =>
      sizeToNumber(a) -
      sizeToNumber(b)
  );


  setOptions(
    astmFilter,
    specificationData.map(item => item.astm),
    "ALL ASTM"
  );


  setOptions(
    scheduleFilter,
    specificationData.map(item => item.schedule),
    "ALL SCHEDULES"
  );

}


/* ========================================
   DESKTOP TABLE
======================================== */

function renderDesktop(data){

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
        ${materialDisplay(item)}
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
          ${displayValue(item.status)}
        </span>
      </td>

    `;


    stockTableBody.appendChild(row);

  });

}


/* ========================================
   MOBILE CARDS
======================================== */

function renderMobile(data){

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
          ${displayValue(item.status)}
        </span>

      </div>


      <div class="stock-card-grid">


        <div class="stock-card-item">

          <span>MATERIAL</span>

          <strong>
            ${materialDisplay(item)}
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
   INITIAL / HIDDEN STATE
======================================== */

function hideResults(){

  hasSearched = false;

  itemCount.textContent = "0";

  stockTableBody.innerHTML = "";

  stockMobile.innerHTML = "";


  /*
     Desktop table hidden
  */

  if(tableWrap){
    tableWrap.style.display = "none";
  }


  /*
     Mobile result area hidden
  */

  stockMobile.style.display = "none";


  /*
     Initial guidance
  */

  noResultTitle.textContent =
    "SEARCH AVAILABLE STOCK";

  noResultText.textContent =
    "Select a filter or enter a search term to check our current availability.";

  noResults.style.display =
    "block";

}


/* ========================================
   SHOW RESULTS
======================================== */

function showResults(data){

  hasSearched = true;

  itemCount.textContent =
    data.length;


  if(data.length === 0){

    stockTableBody.innerHTML = "";
    stockMobile.innerHTML = "";


    if(tableWrap){
      tableWrap.style.display = "none";
    }

    stockMobile.style.display =
      "none";


    noResultTitle.textContent =
      "NO STOCK FOUND";

    noResultText.textContent =
      "Try changing the search term or filters.";

    noResults.style.display =
      "block";

    return;

  }


  /*
     Results exist
  */

  noResults.style.display =
    "none";


  renderDesktop(data);

  renderMobile(data);


  /*
     CSS controls which result layout
     is visible according to screen size.
  */

  if(window.innerWidth <= 850){

    if(tableWrap){
      tableWrap.style.display = "none";
    }

    stockMobile.style.display =
      "block";

  }else{

    if(tableWrap){
      tableWrap.style.display = "block";
    }

    stockMobile.style.display =
      "none";

  }

}


/* ========================================
   CHECK IF USER HAS ENTERED
   ANY SEARCH CONDITION
======================================== */

function hasSearchCondition(){

  return(

    normalize(stockSearch.value) !== ""

    ||

    materialFilter.value !== ""

    ||

    productFilter.value !== ""

    ||

    typeFilter.value !== ""

    ||

    sizeFilter.value !== ""

    ||

    astmFilter.value !== ""

    ||

    scheduleFilter.value !== ""

  );

}


/* ========================================
   FILTER STOCK
======================================== */

function filterStock(){

  /*
     If all conditions are empty,
     return to initial hidden state.
  */

  if(!hasSearchCondition()){

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


      return(

        (
          !search ||
          searchable.includes(search)
        )

        &&

        (
          !materialFilter.value ||
          item.material ===
            materialFilter.value
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
   MAIN FILTER CHANGE
======================================== */

function filterChanged(){

  updateFilters();

  filterStock();

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
  filterChanged
);


typeFilter.addEventListener(
  "change",
  filterChanged
);


materialFilter.addEventListener(
  "change",
  filterChanged
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


    updateFilters();

    hideResults();

  }
);


/* ========================================
   RESPONSIVE RESULT SWITCH
======================================== */

window.addEventListener(
  "resize",
  () => {

    if(!hasSearched){
      return;
    }


    /*
       Re-run current filter so
       desktop/mobile result layout
       switches correctly.
    */

    filterStock();

  }
);


/* ========================================
   LOAD AIRTABLE STOCK
======================================== */

async function loadStock(){

  /*
     Don't show inventory while loading.
  */

  itemCount.textContent = "0";

  if(tableWrap){
    tableWrap.style.display = "none";
  }

  stockMobile.style.display =
    "none";


  noResultTitle.textContent =
    "LOADING INVENTORY";

  noResultText.textContent =
    "Retrieving current stock availability.";

  noResults.style.display =
    "block";


  try{

    const response =
      await fetch(
        API_URL,
        {
          cache:"no-store"
        }
      );


    if(!response.ok){

      throw new Error(
        `API error ${response.status}`
      );

    }


    const result =
      await response.json();


    if(
      !result.success ||
      !Array.isArray(result.stock)
    ){

      throw new Error(
        "Invalid inventory response"
      );

    }


    stockData =
      result.stock;


    /*
       Build dropdowns from current
       Airtable stock.
    */

    updateFilters();


    /*
       IMPORTANT:
       Do NOT display stock automatically.
    */

    hideResults();


  }catch(error){

    console.error(
      "SIERRA inventory error:",
      error
    );


    stockData = [];


    itemCount.textContent =
      "0";


    stockTableBody.innerHTML =
      "";

    stockMobile.innerHTML =
      "";


    if(tableWrap){
      tableWrap.style.display =
        "none";
    }


    noResultTitle.textContent =
      "INVENTORY TEMPORARILY UNAVAILABLE";

    noResultText.textContent =
      "Please contact SIERRA ALLOYS for current availability.";

    noResults.style.display =
      "block";

  }

}


/* ========================================
   INITIAL
======================================== */

loadStock();
