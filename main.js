import "./style.css";

let selectedType = null;
let isVege = false;
const vegeTypes = ["VEGETABLE", "FRUITS", "CEREALS"];
let types = [];
let catergories = [];

const typeItemTemplate = document.getElementById("Type-item");
const categoryItemTemplate = document.getElementById("Category-item");
const typesListElement = document.getElementById("Types-list");
const categoriesListElement = document.getElementById("Categories-list");

document.getElementById("isVege").addEventListener("change", (e) => {
  isVege = e.target.checked;
  renderTypes();
  renderCategories();
});

const renderType = (type) => {
  const element = typeItemTemplate.content.cloneNode(true);
  const button = element.querySelector("button");
  button.innerHTML = type.name;
  if (selectedType?.id === type.id) {
    button.className = "Type-button selected";
  } else {
    button.className = "Type-button";
  }
  button.addEventListener("click", () => {
    if (selectedType?.id === type.id) {
      selectedType = null;
    } else {
      selectedType = type;
    }
    renderCategories();
    renderTypes();
  });
  return element;
};

const renderCategory = (category) => {
  const element = categoryItemTemplate.content.cloneNode(true);
  element.querySelector("button").addEventListener("click", async () => {
    const res = await fetch(
      "https://api-eko-bazarek.azurewebsites.net/api/products/01d5e2a0-1b34-4644-8205-506130e03b75"
    );
    if (!res.ok) {
      alert("Nie mogę załadować kategorii");
    }
  });
  element.querySelector("img").src = category.iconUrl;
  element.querySelector("div").innerHTML = category.name;
  return element;
};

const renderTypes = () => {
  typesListElement.innerHTML = "";
  types
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((x) => (isVege ? vegeTypes.includes(x.id) : true))
    .forEach((x) => {
      const el = renderType(x);
      typesListElement.appendChild(el);
    });
};

const renderCategories = () => {
  categoriesListElement.innerHTML = "";
  catergories
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter((x) => (isVege ? vegeTypes.includes(x.type) : true))
    .filter((x) => (selectedType ? selectedType.id === x.type : true))
    .forEach((x) => {
      const el = renderCategory(x);
      categoriesListElement.appendChild(el);
    });
};

Promise.all([
  fetch("https://api-eko-bazarek.azurewebsites.net/api/products/types").then(
    async (res) => await res.json()
  ),
  fetch(
    "https://api-eko-bazarek.azurewebsites.net/api/products/categories"
  ).then(async (res) => await res.json()),
])
  .then((data) => {
    types = data[0];
    catergories = data[1];
    renderTypes();
    renderCategories();
  })
  .catch(() => alert("Nie mogę załadować danych"));
