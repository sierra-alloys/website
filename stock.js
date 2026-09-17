const stockData = [

  {
    product: "PIPE",
    material: "S32750",
    description: "Seamless Pipe",
    size: '2"',
    spec: "SCH 80S",
    qty: 48,
    status: "AVAILABLE"
  },

  {
    product: "PIPE",
    material: "S32205",
    description: "Seamless Pipe",
    size: '4"',
    spec: "SCH 40S",
    qty: 32,
    status: "AVAILABLE"
  },

  {
    product: "FLANGE",
    material: "S32750",
    description: "Welding Neck Flange",
    size: '4"',
    spec: "CL150",
    qty: 18,
    status: "AVAILABLE"
  },

  {
    product: "FLANGE",
    material: "SS316",
    description: "Blind Flange",
    size: '6"',
    spec: "CL300",
    qty: 12,
    status: "AVAILABLE"
  },

  {
    product: "FITTING",
    material: "S32205",
    description: "90° Elbow",
    size: '3"',
    spec: "SCH 40S",
    qty: 24,
    status: "AVAILABLE"
  },

  {
    product: "FITTING",
    material: "S32760",
    description: "Equal Tee",
    size: '2"',
    spec: "SCH 80S",
    qty: 8,
    status: "AVAILABLE"
  },

  {
    product: "PIPE",
    material: "SS304",
    description: "Welded Pipe",
    size: '8"',
    spec: "SCH 10S",
    qty: 21,
    status: "AVAILABLE"
  },

  {
    product: "PIPE",
    material: "Nickel Alloy",
    description: "Seamless Pipe",
    size: '2"',
    spec: "SCH 40",
    qty: 6,
    status: "AVAILABLE"
  }

];


const stockBody =
  document.getElementById("stockBody");

const stockSearch =
  document.getElementById("stockSearch");

const gradeFilter =
  document.getElementById("gradeFilter");

const productFilter =
  document.getElementById("productFilter");

const resetFilters =
  document.getElementById("resetFilters");

const stockCount =
  document.getElementById("stockCount");

const noResult =
  document.getElementById("noResult");


function renderStock(data){

  stockBody.innerHTML = "";

  stockCount.textContent = data.length;


  if(data.length === 0){

    noResult.style.display = "block";

    return;

  }


  noResult.style.display = "none";


  data.forEach(item => {

    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>
        ${item.product}
      </td>

      <td>
        ${item.material}
      </td>

      <td>
        ${item.description}
      </td>

      <td>
        ${item.size}
      </td>

      <td>
        ${item.spec}
      </td>

      <td>
        ${item.qty}
      </td>

      <td>

        <span class="status">
          ${item.status}
        </span>

      </td>

    `;


    stockBody.appendChild(row);

  });

}


function filterStock(){

  const search =
    stockSearch.value
      .toLowerCase()
      .trim();

  const grade =
    gradeFilter.value;

  const product =
    productFilter.value;


  const filtered =
    stockData.filter(item => {


      const searchable = `

        ${item.product}

        ${item.material}

        ${item.description}

        ${item.size}

        ${item.spec}

      `.toLowerCase();


      const searchMatch =
        searchable.includes(search);


      const gradeMatch =
        !grade ||
        item.material === grade;


      const productMatch =
        !product ||
        item.product === product;


      return (
        searchMatch &&
        gradeMatch &&
        productMatch
      );

    });


  renderStock(filtered);

}


stockSearch.addEventListener(
  "input",
  filterStock
);


gradeFilter.addEventListener(
  "change",
  filterStock
);


productFilter.addEventListener(
  "change",
  filterStock
);


resetFilters.addEventListener(
  "click",
  () => {

    stockSearch.value = "";

    gradeFilter.value = "";

    productFilter.value = "";

    renderStock(stockData);

  }
);


renderStock(stockData);
