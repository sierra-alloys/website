/* ========================================
   SIERRA ALLOYS STOCK
   AIRTABLE LIVE INVENTORY
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


function scheduleDisplay(value){

  if(!value){
    return "—";
  }

  const text =
    String(value).trim().toUpperCase();

  if(text.startsWith("SCH")){
    return text.replace(/^SCH\s*/, "SCH ");
  }

  if(
    text === "STD" ||
    text === "XS" ||
    text === "XXS"
  ){
    return text;
  }

  return `SCH ${text}`;

}


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


function materialDisplay(item){

  const material =
    String(item.material || "").trim();

  const grade =
    String(item.grade || "").trim();

  if(!material){
    return grade || "—";
  }

  if(!grade){
    return material;
  }

  /*
     For Duplex / Super Duplex etc.
     show grade together with material.
  */

  if(
    normalize(material).includes("duplex") ||
    normalize(material).includes("nickel") ||
    normalize(material).includes("titanium") ||
    normalize(material).includes("smo")
  ){
    return `${material} ${grade}`;
  }

  return material;

}


function gradeUnsDisplay(item){

  const grade =
    String(item.grade || "").trim();

  const uns =
    String(item.uns || "").trim();

  if(!grade && !uns){
    return "—";
  }

  if(
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
   SORT HELPERS
======================================== */

function sizeToNumber(value){

  const text =
    String(value || "")
      .replace(/"/g, "")
      .trim();

  if(!text){
    return 999999;
  }

  if(text.includes("-")){

    const parts = text.split("-");

    const whole =
      parseFloat(parts[0]) || 0;

    const fraction =
      parts[1] || "";

    if(fraction.includes("/")){

      const f =
        fraction.split("/");

      return whole +
        (parseFloat(f[0]) / parseFloat(f[1]));

    }

  }

  if(text.includes("/")){

    const f =
      text.split("/");

    return parseFloat(f[0]) /
      parseFloat(f[1]);

  }

  return parseFloat(text) || 999999;

}


/* ========================================
   FILTER OPTION GENERATOR
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

  if(sortFunction){
    unique.sort(sortFunction);
  }else{
    unique.sort((a,b) =>
      a.localeCompare(b, undefined, {
        numeric:true,
        sensitivity:"base"
      })
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
    element.value = previous;
  }

}


/* ========================================
   DYNAMIC FILTERS
======================================== */

function updateFilters(){

  /*
    Product options always use all stock.
  */

  setOptions(
    productFilter,
    stockData.map(item => item.product),
    "ALL PRODUCTS"
  );


  /*
    Other dropdowns respond to
    current selections.
  */

  const product =
    productFilter.value;

  const type =
    typeFilter.value;

  const material =
    materialFilter.value;


  const relevantForType =
    stockData.filter(item =>
      !product ||
      item.product === product
    );


  setOptions(
    typeFilter,
    relevantForType.map(item => item.type),
    "ALL TYPES"
  );


  const relevantForMaterial =
    stockData.filter(item =>

      (!product || item.product === product)

      &&

      (!typeFilter.value ||
        item.type === typeFilter.value)

    );


  setOptions(
    materialFilter,
    relevantForMaterial.map(item => item.material),
    "ALL MATERIALS"
  );


  const relevant =
    stockData.filter(item =>

      (!productFilter.value ||
        item.product === productFilter.value)

      &&

      (!typeFilter.value ||
        item.type === typeFilter.value)

      &&

      (!materialFilter.value ||
        item.material === materialFilter.value)

    );


  setOptions(
    sizeFilter,
    relevant.map(item => item.size),
    "ALL SIZES",
    (a,b) =>
      sizeToNumber(a) - sizeToNumber(b)
  );


  setOptions(
    astmFilter,
    relevant.map(item => item.astm),
    "ALL ASTM"
  );


  setOptions(
    scheduleFilter,
    relevant.map(item => item.schedule),
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
   RENDER
======================================== */

function renderStock(data){

  itemCount.textContent =
    data.length;

  renderDesktop(data);

  renderMobile(data);

  noResults.style.display =
    data.length === 0
      ? "block"
      : "none";

}


/* ========================================
   FILTER
======================================== */

function filterStock(){

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

  renderStock(filtered);

}


/* ========================================
   FILTER CHANGE
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

    renderStock(stockData);

  }
);


/* ========================================
   LOAD AIRTABLE STOCK
======================================== */

async function loadStock(){

  noResultTitle.textContent =
    "LOADING STOCK";

  noResultText.textContent =
    "Retrieving current inventory.";

  noResults.style.display =
    "block";


  try{

    const response =
      await fetch(API_URL, {
        cache:"no-store"
      });


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


    updateFilters();

    renderStock(stockData);


    noResultTitle.textContent =
      "NO STOCK FOUND";

    noResultText.textContent =
      "Try changing the search term or filters.";


  }catch(error){

    console.error(
      "SIERRA inventory error:",
      error
    );


    stockData = [];

    itemCount.textContent = "0";

    stockTableBody.innerHTML = "";
    stockMobile.innerHTML = "";


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
