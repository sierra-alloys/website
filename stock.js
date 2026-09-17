/* =========================================
   SIERRA ALLOYS
   STOCK SEARCH
========================================= */


/* =========================================
   STOCK DATA
========================================= */

const stockData = [

  {
    product: "PIPE",
    type: "SMLS",
    material: "S32750",
    description: "Seamless Pipe",
    size: '2"',
    rating: "",
    schedule: "SCH 80S",
    qty: 48,
    status: "AVAILABLE"
  },

  {
    product: "PIPE",
    type: "SMLS",
    material: "S32205",
    description: "Seamless Pipe",
    size: '4"',
    rating: "",
    schedule: "SCH 40S",
    qty: 32,
    status: "AVAILABLE"
  },

  {
    product: "PIPE",
    type: "WELDED",
    material: "SS304",
    description: "Welded Pipe",
    size: '8"',
    rating: "",
    schedule: "SCH 10S",
    qty: 21,
    status: "AVAILABLE"
  },

  {
    product: "PIPE",
    type: "SMLS",
    material: "NICKEL ALLOY",
    description: "Seamless Pipe",
    size: '2"',
    rating: "",
    schedule: "SCH 40",
    qty: 6,
    status: "AVAILABLE"
  },



  /* =====================================
     FITTING
  ====================================== */

  {
    product: "FITTING",
    type: "SMLS",
    material: "S32205",
    description: "90° Elbow",
    size: '3"',
    rating: "",
    schedule: "SCH 40S",
    qty: 24,
    status: "AVAILABLE"
  },

  {
    product: "FITTING",
    type: "WELDED",
    material: "S32760",
    description: "Equal Tee",
    size: '2"',
    rating: "",
    schedule: "SCH 80S",
    qty: 8,
    status: "AVAILABLE"
  },



  /* =====================================
     FLANGE
  ====================================== */

  {
    product: "FLANGE",
    type: "WELDING NECK",
    material: "S32750",
    description: "Welding Neck Flange",
    size: '4"',
    rating: "CL150",
    schedule: "SCH 40S",
    qty: 18,
    status: "AVAILABLE"
  },

  {
    product: "FLANGE",
    type: "BLIND",
    material: "SS316",
    description: "Blind Flange",
    size: '6"',
    rating: "CL300",
    schedule: "",
    qty: 12,
    status: "AVAILABLE"
  },

  {
    product: "FLANGE",
    type: "SLIP-ON",
    material: "S32205",
    description: "Slip-On Flange",
    size: '4"',
    rating: "CL150",
    schedule: "SCH 40S",
    qty: 14,
    status: "AVAILABLE"
  },

  {
    product: "FLANGE",
    type: "SOCKET WELD",
    material: "SS316",
    description: "Socket Weld Flange",
    size: '2"',
    rating: "CL600",
    schedule: "SCH 80S",
    qty: 10,
    status: "AVAILABLE"
  }

];



/* =========================================
   TYPE OPTIONS
========================================= */

const typeOptions = {

  PIPE: [

    "SMLS",
    "WELDED"

  ],

  FITTING: [

    "SMLS",
    "WELDED"

  ],

  FLANGE: [

    "WELDING NECK",
    "SLIP-ON",
    "BLIND",
    "SOCKET WELD",
    "THREADED",
    "LAP JOINT"

  ]

};



/* =========================================
   ELEMENTS
========================================= */

const stockSearch =
  document.getElementById(
    "stockSearch"
  );


const materialFilter =
  document.getElementById(
    "materialFilter"
  );


const productFilter =
  document.getElementById(
    "productFilter"
  );


const typeFilter =
  document.getElementById(
    "typeFilter"
  );


const sizeFilter =
  document.getElementById(
    "sizeFilter"
  );


const ratingFilter =
  document.getElementById(
    "ratingFilter"
  );


const scheduleFilter =
  document.getElementById(
    "scheduleFilter"
  );


const resetFilters =
  document.getElementById(
    "resetFilters"
  );


const stockTableBody =
  document.getElementById(
    "stockTableBody"
  );


const stockMobile =
  document.getElementById(
    "stockMobile"
  );


const itemCount =
  document.getElementById(
    "itemCount"
  );


const noResults =
  document.getElementById(
    "noResults"
  );



/* =========================================
   UPDATE TYPE FILTER
========================================= */

function updateTypeFilter(){

  const product =
    productFilter.value;


  const currentType =
    typeFilter.value;


  typeFilter.innerHTML =
    '<option value="">ALL TYPES</option>';


  let types = [];


  if(product){

    types =
      typeOptions[product] || [];

  }

  else{

    types = [

      ...new Set(
        Object.values(
          typeOptions
        ).flat()
      )

    ];

  }


  types.forEach(type => {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      type;

    option.textContent =
      type;

    typeFilter.appendChild(
      option
    );

  });


  if(
    types.includes(
      currentType
    )
  ){

    typeFilter.value =
      currentType;

  }

  else{

    typeFilter.value =
      "";

  }

}



/* =========================================
   DISPLAY VALUE
========================================= */

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



/* =========================================
   RENDER DESKTOP TABLE
========================================= */

function renderDesktop(data){

  stockTableBody.innerHTML =
    "";


  data.forEach(item => {

    const row =
      document.createElement(
        "tr"
      );


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
        ${displayValue(item.description)}
      </td>

      <td>
        ${displayValue(item.size)}
      </td>

      <td>
        ${displayValue(item.rating)}
      </td>

      <td>
        ${displayValue(item.schedule)}
      </td>

      <td>
        ${displayValue(item.qty)}
      </td>

      <td>
        <span class="status">
          ${displayValue(item.status)}
        </span>
      </td>

    `;


    stockTableBody.appendChild(
      row
    );

  });

}



/* =========================================
   RENDER MOBILE
========================================= */

function renderMobile(data){

  stockMobile.innerHTML =
    "";


  data.forEach(item => {

    const card =
      document.createElement(
        "article"
      );


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
            RATING
          </span>

          <strong>
            ${displayValue(item.rating)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            SCHEDULE
          </span>

          <strong>
            ${displayValue(item.schedule)}
          </strong>

        </div>


        <div class="stock-card-item">

          <span>
            QTY
          </span>

          <strong>
            ${displayValue(item.qty)}
          </strong>

        </div>


        <div
          class="
            stock-card-item
            stock-card-description
          "
        >

          <span>
            DESCRIPTION
          </span>

          <strong>
            ${displayValue(item.description)}
          </strong>

        </div>


      </div>

    `;


    stockMobile.appendChild(
      card
    );

  });

}



/* =========================================
   RENDER ALL
========================================= */

function renderStock(data){

  itemCount.textContent =
    data.length;


  renderDesktop(
    data
  );


  renderMobile(
    data
  );


  if(
    data.length === 0
  ){

    noResults.style.display =
      "block";

  }

  else{

    noResults.style.display =
      "none";

  }

}



/* =========================================
   SEARCH NORMALIZER
========================================= */

function normalize(value){

  return String(
    value || ""
  )

  .toLowerCase()

  .replace(/\s+/g," ")

  .trim();

}



/* =========================================
   FILTER
========================================= */

function filterStock(){

  const search =
    normalize(
      stockSearch.value
    );


  const material =
    materialFilter.value;


  const product =
    productFilter.value;


  const type =
    typeFilter.value;


  const size =
    sizeFilter.value;


  const rating =
    ratingFilter.value;


  const schedule =
    scheduleFilter.value;



  const filtered =
    stockData.filter(item => {


      const searchable =
        normalize(`

          ${item.product}

          ${item.type}

          ${item.material}

          ${item.description}

          ${item.size}

          ${item.rating}

          ${item.schedule}

          ${item.qty}

          ${item.status}

        `);


      const searchMatch =
        !search ||
        searchable.includes(
          search
        );


      const materialMatch =
        !material ||
        item.material ===
        material;


      const productMatch =
        !product ||
        item.product ===
        product;


      const typeMatch =
        !type ||
        item.type ===
        type;


      const sizeMatch =
        !size ||
        item.size ===
        size;


      const ratingMatch =
        !rating ||
        item.rating ===
        rating;


      const scheduleMatch =
        !schedule ||
        item.schedule ===
        schedule;


      return(

        searchMatch &&

        materialMatch &&

        productMatch &&

        typeMatch &&

        sizeMatch &&

        ratingMatch &&

        scheduleMatch

      );

    });


  renderStock(
    filtered
  );

}



/* =========================================
   PRODUCT CHANGE
========================================= */

productFilter.addEventListener(

  "change",

  () => {

    updateTypeFilter();

    filterStock();

  }

);



/* =========================================
   FILTER EVENTS
========================================= */

stockSearch.addEventListener(

  "input",
  filterStock

);


materialFilter.addEventListener(

  "change",
  filterStock

);


typeFilter.addEventListener(

  "change",
  filterStock

);


sizeFilter.addEventListener(

  "change",
  filterStock

);


ratingFilter.addEventListener(

  "change",
  filterStock

);


scheduleFilter.addEventListener(

  "change",
  filterStock

);



/* =========================================
   RESET
========================================= */

resetFilters.addEventListener(

  "click",

  () => {

    stockSearch.value =
      "";


    materialFilter.value =
      "";


    productFilter.value =
      "";


    sizeFilter.value =
      "";


    ratingFilter.value =
      "";


    scheduleFilter.value =
      "";


    updateTypeFilter();


    typeFilter.value =
      "";


    renderStock(
      stockData
    );

  }

);



/* =========================================
   INITIAL LOAD
========================================= */

updateTypeFilter();

renderStock(
  stockData
);
