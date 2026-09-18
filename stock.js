/* ========================================
   SIERRA ALLOYS
   LIVE INVENTORY SEARCH
======================================== */

const API_URL =
  "https://sierra-inventory.mgsong23.workers.dev/";

let stockData = [];


/* ========================================
   ELEMENTS
======================================== */

const materialFilter =
  document.getElementById("materialFilter");

const productFilter =
  document.getElementById("productFilter");

const typeFilter =
  document.getElementById("typeFilter");

const itemTypeFilter =
  document.getElementById("itemTypeFilter");

const size1Filter =
  document.getElementById("size1Filter");

const size2Filter =
  document.getElementById("size2Filter");

const astmFilter =
  document.getElementById("astmFilter");

const sch1Filter =
  document.getElementById("sch1Filter");

const sch2Filter =
  document.getElementById("sch2Filter");

const ratingFilter =
  document.getElementById("ratingFilter");


const itemTypeGroup =
  document.getElementById("itemTypeGroup");

const size2Group =
  document.getElementById("size2Group");

const sch2Group =
  document.getElementById("sch2Group");

const ratingGroup =
  document.getElementById("ratingGroup");


const size1Label =
  document.getElementById("size1Label");

const sch1Label =
  document.getElementById("sch1Label");


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

function clean(value){

  return String(value ?? "")
    .replace(/\r/g, " ")
    .replace(/\n/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+/g, " ")
    .trim();

}


function normalize(value){

  return clean(value)
    .toLowerCase();

}


function same(a,b){

  return normalize(a) === normalize(b);

}


function displayValue(value){

  const result =
    clean(value);

  return result || "—";

}


/* ========================================
   PRODUCT DETECTION
======================================== */

function selectedProduct(){

  return normalize(
    productFilter.value
  );

}


function isPipe(){

  return selectedProduct() === "pipe";

}


function isFitting(){

  return selectedProduct() === "fitting";

}


function isFlange(){

  return selectedProduct() === "flange";

}


/* ========================================
   SCHEDULE DISPLAY
======================================== */

function scheduleDisplay(value){

  const text =
    clean(value).toUpperCase();


  if(!text){
    return "";
  }


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
   SIZE SORT
======================================== */

function sizeToNumber(value){

  const text =
    clean(value)
      .replace(/"/g, "");


  if(!text){
    return 999999;
  }


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

      const top =
        parseFloat(f[0]);

      const bottom =
        parseFloat(f[1]);


      if(
        !isNaN(top) &&
        !isNaN(bottom) &&
        bottom !== 0
      ){

        return whole +
          top / bottom;

      }

    }

  }


  if(text.includes("/")){

    const f =
      text.split("/");

    const top =
      parseFloat(f[0]);

    const bottom =
      parseFloat(f[1]);


    if(
      !isNaN(top) &&
      !isNaN(bottom) &&
      bottom !== 0
    ){

      return top / bottom;

    }

  }


  const number =
    parseFloat(text);


  return isNaN(number)
    ? 999999
    : number;

}


/* ========================================
   SELECT OPTIONS
======================================== */

function fillSelect(
  select,
  values,
  firstLabel,
  sorter = null
){

  const previous =
    select.value;


  const unique =
    [...new Set(

      values
        .map(clean)
        .filter(Boolean)

    )];


  if(sorter){

    unique.sort(sorter);

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


  select.innerHTML = "";


  const first =
    document.createElement("option");


  first.value = "";

  first.textContent =
    firstLabel;


  select.appendChild(first);


  unique.forEach(value => {

    const option =
      document.createElement("option");


    option.value =
      value;


    option.textContent =
      value;


    select.appendChild(option);

  });


  if(
    unique.some(value =>
      same(value,previous)
    )
  ){

    const matched =
      unique.find(value =>
        same(value,previous)
      );


    select.value =
      matched;

  }

}


/* ========================================
   FILTER DATA FOR DROPDOWNS
======================================== */

function dataMatching(
  ignoreField = ""
){

  return stockData.filter(item => {


    if(
      ignoreField !== "product" &&
      productFilter.value &&
      !same(item.product,productFilter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "material" &&
      materialFilter.value &&
      !same(item.material,materialFilter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "type" &&
      typeFilter.value &&
      !same(item.type,typeFilter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "itemType" &&
      itemTypeFilter.value &&
      !same(item.itemType,itemTypeFilter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "size1" &&
      size1Filter.value &&
      !same(item.size1,size1Filter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "size2" &&
      size2Filter.value &&
      !same(item.size2,size2Filter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "astm" &&
      astmFilter.value &&
      !same(item.astm,astmFilter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "sch1" &&
      sch1Filter.value &&
      !same(item.sch1,sch1Filter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "sch2" &&
      sch2Filter.value &&
      !same(item.sch2,sch2Filter.value)
    ){
      return false;
    }


    if(
      ignoreField !== "rating" &&
      ratingFilter.value &&
      !same(item.rating,ratingFilter.value)
    ){
      return false;
    }


    return true;

  });

}


/* ========================================
   PRODUCT-SPECIFIC FILTER UI
======================================== */

function updateFilterVisibility(){

  /*
     DEFAULT
  */

  itemTypeGroup.hidden =
    true;

  size2Group.hidden =
    true;

  sch2Group.hidden =
    true;

  ratingGroup.hidden =
    true;


  size1Label.textContent =
    "SIZE";

  sch1Label.textContent =
    "SCHEDULE";


  /*
     PIPE
  */

  if(isPipe()){

    return;

  }


  /*
     FITTING
  */

  if(isFitting()){

    size1Label.textContent =
      "SIZE 1";

    sch1Label.textContent =
      "SCH 1";


    /*
       Item Type only if fitting stock
       actually contains values.
    */

    const fittingData =
      stockData.filter(item =>
        same(item.product,"Fitting")
      );


    const hasItemType =
      fittingData.some(item =>
        clean(item.itemType)
      );


    const hasSize2 =
      fittingData.some(item =>
        clean(item.size2)
      );


    const hasSch2 =
      fittingData.some(item =>
        clean(item.sch2)
      );


    itemTypeGroup.hidden =
      !hasItemType;


    size2Group.hidden =
      !hasSize2;


    sch2Group.hidden =
      !hasSch2;


    return;

  }


  /*
     FLANGE
  */

  if(isFlange()){

    ratingGroup.hidden =
      false;

    return;

  }

}


/* ========================================
   BUILD / UPDATE DROPDOWNS
======================================== */

function updateDropdowns(){

  fillSelect(
    productFilter,
    dataMatching("product")
      .map(item => item.product),
    "ALL PRODUCTS"
  );


  fillSelect(
    materialFilter,
    dataMatching("material")
      .map(item => item.material),
    "ALL MATERIALS"
  );


  fillSelect(
    typeFilter,
    dataMatching("type")
      .map(item => item.type),
    "ALL TYPES"
  );


  fillSelect(
    itemTypeFilter,
    dataMatching("itemType")
      .map(item => item.itemType),
    "ALL ITEM TYPES"
  );


  fillSelect(
    size1Filter,
    dataMatching("size1")
      .map(item => item.size1),
    "ALL SIZES",
    (a,b) =>
      sizeToNumber(a) -
      sizeToNumber(b)
  );


  fillSelect(
    size2Filter,
    dataMatching("size2")
      .map(item => item.size2),
    "ALL SIZE 2",
    (a,b) =>
      sizeToNumber(a) -
      sizeToNumber(b)
  );


  fillSelect(
    astmFilter,
    dataMatching("astm")
      .map(item => item.astm),
    "ALL ASTM"
  );


  fillSelect(
    sch1Filter,
    dataMatching("sch1")
      .map(item => item.sch1),
    "ALL SCHEDULES"
  );


  fillSelect(
    sch2Filter,
    dataMatching("sch2")
      .map(item => item.sch2),
    "ALL SCH 2"
  );


  fillSelect(
    ratingFilter,
    dataMatching("rating")
      .map(item => item.rating),
    "ALL RATINGS"
  );


  updateFilterVisibility();

}


/* ========================================
   SEARCH CONDITION
======================================== */

function hasSearchCondition(){

  return Boolean(

    productFilter.value ||

    materialFilter.value ||

    typeFilter.value ||

    itemTypeFilter.value ||

    size1Filter.value ||

    size2Filter.value ||

    astmFilter.value ||

    sch1Filter.value ||

    sch2Filter.value ||

    ratingFilter.value

  );

}


/* ========================================
   FILTER STOCK
======================================== */

function getFilteredStock(){

  return stockData.filter(item => {


    if(
      productFilter.value &&
      !same(item.product,productFilter.value)
    ){
      return false;
    }


    if(
      materialFilter.value &&
      !same(item.material,materialFilter.value)
    ){
      return false;
    }


    if(
      typeFilter.value &&
      !same(item.type,typeFilter.value)
    ){
      return false;
    }


    if(
      itemTypeFilter.value &&
      !same(item.itemType,itemTypeFilter.value)
    ){
      return false;
    }


    if(
      size1Filter.value &&
      !same(item.size1,size1Filter.value)
    ){
      return false;
    }


    if(
      size2Filter.value &&
      !same(item.size2,size2Filter.value)
    ){
      return false;
    }


    if(
      astmFilter.value &&
      !same(item.astm,astmFilter.value)
    ){
      return false;
    }


    if(
      sch1Filter.value &&
      !same(item.sch1,sch1Filter.value)
    ){
      return false;
    }


    if(
      sch2Filter.value &&
      !same(item.sch2,sch2Filter.value)
    ){
      return false;
    }


    if(
      ratingFilter.value &&
      !same(item.rating,ratingFilter.value)
    ){
      return false;
    }


    return true;

  });

}


/* ========================================
   SIZE DISPLAY
======================================== */

function sizeDisplay(item){

  const size1 =
    clean(item.size1);

  const size2 =
    clean(item.size2);


  if(size1 && size2){

    return `${size1} × ${size2}`;

  }


  return size1 || size2 || "—";

}


/* ========================================
   SPECIFICATION DISPLAY
======================================== */

function specificationDisplay(item){

  const parts = [];


  const sch1 =
    scheduleDisplay(item.sch1);

  const sch2 =
    scheduleDisplay(item.sch2);

  const rating =
    clean(item.rating);


  /*
     RATING
  */

  if(rating){

    parts.push(rating);

  }


  /*
     SCH 1 + SCH 2
  */

  if(sch1 && sch2){

    parts.push(
      `${sch1} × ${sch2}`
    );

  }

  else if(sch1){

    parts.push(sch1);

  }

  else if(sch2){

    parts.push(sch2);

  }


  return parts.length
    ? parts.join(" · ")
    : "—";

}


/* ========================================
   GRADE / UNS DISPLAY
======================================== */

function gradeUnsDisplay(item){

  const grade =
    clean(item.grade);

  const uns =
    clean(item.uns);


  if(!grade && !uns){

    return "—";

  }


  if(
    grade &&
    uns &&
    same(grade,uns)
  ){

    return grade;

  }


  if(grade && uns){

    return `${grade} / ${uns}`;

  }


  return grade || uns;

}


/* ========================================
   ITEM DISPLAY
======================================== */

function itemDisplay(item){

  const itemType =
    clean(item.itemType);

  const construction =
    clean(item.construction);


  if(itemType){

    return itemType;

  }


  if(construction){

    return construction;

  }


  return "—";

}


/* ========================================
   HIDE RESULTS
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
    "SELECT STOCK FILTERS";


  noResultText.textContent =
    "Select one or more specifications to check our current availability.";


  noResults.style.display =
    "block";

}


/* ========================================
   DESKTOP RESULTS
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
        ${itemDisplay(item)}
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
        ${sizeDisplay(item)}
      </td>

      <td>
        ${specificationDisplay(item)}
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
   MOBILE RESULTS
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
            ITEM
          </span>

          <strong>
            ${itemDisplay(item)}
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
            GRADE / UNS
          </span>

          <strong>
            ${gradeUnsDisplay(item)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            SIZE
          </span>

          <strong>
            ${sizeDisplay(item)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            SPECIFICATION
          </span>

          <strong>
            ${specificationDisplay(item)}
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

function showResults(data){

  itemCount.textContent =
    data.length;


  stockCount.hidden =
    false;


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
      "Try changing the selected specifications.";


    noResults.style.display =
      "block";


    return;

  }


  noResults.style.display =
    "none";


  renderDesktop(data);

  renderMobile(data);


  if(window.innerWidth <= 850){

    stockResults.hidden =
      true;


    stockMobile.hidden =
      false;

  }else{

    stockResults.hidden =
      false;


    stockMobile.hidden =
      true;

  }

}


/* ========================================
   APPLY FILTER
======================================== */

function applyFilters(){

  if(!hasSearchCondition()){

    hideResults();

    return;

  }


  const filtered =
    getFilteredStock();


  showResults(filtered);

}


/* ========================================
   FILTER CHANGE
======================================== */

function filterChanged(){

  updateDropdowns();

  applyFilters();

}


/* ========================================
   EVENTS
======================================== */

productFilter.addEventListener(
  "change",
  filterChanged
);


materialFilter.addEventListener(
  "change",
  filterChanged
);


typeFilter.addEventListener(
  "change",
  filterChanged
);


itemTypeFilter.addEventListener(
  "change",
  filterChanged
);


size1Filter.addEventListener(
  "change",
  filterChanged
);


size2Filter.addEventListener(
  "change",
  filterChanged
);


astmFilter.addEventListener(
  "change",
  filterChanged
);


sch1Filter.addEventListener(
  "change",
  filterChanged
);


sch2Filter.addEventListener(
  "change",
  filterChanged
);


ratingFilter.addEventListener(
  "change",
  filterChanged
);


/* ========================================
   RESET
======================================== */

resetFilters.addEventListener(
  "click",
  () => {

    productFilter.value = "";

    materialFilter.value = "";

    typeFilter.value = "";

    itemTypeFilter.value = "";

    size1Filter.value = "";

    size2Filter.value = "";

    astmFilter.value = "";

    sch1Filter.value = "";

    sch2Filter.value = "";

    ratingFilter.value = "";


    updateDropdowns();

    hideResults();

  }
);


/* ========================================
   RESIZE
======================================== */

window.addEventListener(
  "resize",
  () => {

    if(hasSearchCondition()){

      applyFilters();

    }

  }
);


/* ========================================
   LOAD INVENTORY
======================================== */

async function loadStock(){

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
      result.success !== true ||
      !Array.isArray(result.stock)
    ){

      throw new Error(
        "Invalid inventory response"
      );

    }


    stockData =
      result.stock.map(item => ({

        ...item,

        product:
          clean(item.product),

        type:
          clean(item.type),

        construction:
          clean(item.construction),

        itemType:
          clean(item.itemType),

        material:
          clean(item.material),

        astm:
          clean(item.astm),

        grade:
          clean(item.grade),

        uns:
          clean(item.uns),

        size1:
          clean(item.size1),

        size2:
          clean(item.size2),

        sch1:
          clean(item.sch1),

        sch2:
          clean(item.sch2),

        rating:
          clean(item.rating),

        wt:
          clean(item.wt),

        status:
          clean(item.status) || "AVAILABLE"

      }));


    updateDropdowns();

    hideResults();


  }catch(error){

    console.error(
      "SIERRA inventory error:",
      error
    );


    stockData = [];


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
   START
======================================== */

loadStock();
