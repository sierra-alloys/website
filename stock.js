/* ========================================
   SIERRA ALLOYS
   LIVE STOCK SEARCH
======================================== */

const API_URL =
  "https://sierra-inventory.mgsong23.workers.dev/";

let stockData = [];

let inventoryLoaded = false;


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
   GRADE / UNS
======================================== */

function gradeUnsDisplay(item){

  const grade =
    String(item.grade || "").trim();

  const uns =
    String(item.uns || "").trim();


  if(!grade && !uns){

    return "—";

  }


  /*
     Same value:
     S32205 / S32205

     → S32205
  */

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
   SIZE SORT
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
   UPDATE DROPDOWNS
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
     Product dependent
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
     Product + Type dependent
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
     Remaining specification filters
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
   DOES USER HAVE A SEARCH?
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
   INITIAL HIDDEN STATE
======================================== */

function hideResults(){

  stockResults.hidden =
    true;


  stockMobile.hidden =
    true;


  stockCount.hidden =
    true;


  stockTableBody.innerHTML =
    "";


  stockMobile.innerHTML =
    "";


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

function renderDesktop(data){

  stockTableBody.innerHTML =
    "";


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

function renderMobile(data){

  stockMobile.innerHTML =
    "";


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

          <span>
            MATERIAL
          </span>

          <strong>
            ${displayValue(item.material)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            SIZE
          </span>

          <strong>
            ${displayValue(item.size)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            ASTM
          </span>

          <strong>
            ${displayValue(item.astm)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            SCHEDULE
          </span>

          <strong>
            ${scheduleDisplay(item.schedule)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            GRADE / UNS
          </span>

          <strong>
            ${gradeUnsDisplay(item)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            WT
          </span>

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
   SHOW SEARCH RESULTS
======================================== */

function showResults(data){

  itemCount.textContent =
    data.length;


  stockCount.hidden =
    false;


  /*
     Nothing matched
  */

  if(data.length === 0){

    stockResults.hidden =
      true;


    stockMobile.hidden =
      true;


    stockTableBody.innerHTML =
      "";


    stockMobile.innerHTML =
      "";


    noResultTitle.textContent =
      "NO STOCK FOUND";


    noResultText.textContent =
      "Try changing the search term or filters.";


    noResults.style.display =
      "block";


    return;

  }


  /*
     Results found
  */

  noResults.style.display =
    "none";


  renderDesktop(data);

  renderMobile(data);


  /*
     Desktop
  */

  if(window.innerWidth > 850){

    stockResults.hidden =
      false;


    stockMobile.hidden =
      true;

  }


  /*
     Mobile
  */

  else{

    stockResults.hidden =
      true;


    stockMobile.hidden =
      false;

  }

}



/* ========================================
   FILTER STOCK
======================================== */

function filterStock(){

  /*
     No search condition:
     NEVER show stock list.
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
   DEPENDENT FILTER CHANGE
======================================== */

function specificationChanged(){

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
  specificationChanged
);


typeFilter.addEventListener(
  "change",
  specificationChanged
);


materialFilter.addEventListener(
  "change",
  specificationChanged
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

    stockSearch.value =
      "";


    materialFilter.value =
      "";


    productFilter.value =
      "";


    typeFilter.value =
      "";


    sizeFilter.value =
      "";


    astmFilter.value =
      "";


    scheduleFilter.value =
      "";


    updateFilters();

    hideResults();

  }
);



/* ========================================
   WINDOW RESIZE
======================================== */

window.addEventListener(
  "resize",
  () => {

    if(
      inventoryLoaded &&
      hasSearchCondition()
    ){

      filterStock();

    }

  }
);



/* ========================================
   LOAD LIVE AIRTABLE STOCK
======================================== */

async function loadStock(){

  /*
     Results must remain hidden
     while loading.
  */

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


    inventoryLoaded =
      true;


    /*
       Build dropdowns from live
       Airtable inventory.
    */

    updateFilters();


    /*
       CRITICAL:
       Do not render stock here.
    */

    hideResults();


  }catch(error){

    console.error(
      "SIERRA inventory error:",
      error
    );


    stockData =
      [];


    inventoryLoaded =
      false;


    stockResults.hidden =
      true;


    stockMobile.hidden =
      true;


    stockCount.hidden =
      true;


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
