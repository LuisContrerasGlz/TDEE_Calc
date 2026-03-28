const tdeeForm = document.getElementById("tdeeForm");
const errorMessage = document.getElementById("errorMessage");
const resultSection = document.getElementById("resultSection");

const bmrValue = document.getElementById("bmrValue");
const tdeeValue = document.getElementById("tdeeValue");
const cutValue = document.getElementById("cutValue");
const bulkValue = document.getElementById("bulkValue");
const proteinValue = document.getElementById("proteinValue");
const fatValue = document.getElementById("fatValue");
const carbValue = document.getElementById("carbValue");

function parseInputValue(selector, fallback = NaN) {
  const el = document.querySelector(selector);
  if (!el) return fallback;
  const value = Number(el.value);
  return Number.isFinite(value) ? value : fallback;
}

function calculateBMR({ gender, weight, height, age }) {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function calculateMacros({ weight, tdee }) {
  const proteinPerKg = 2.0;
  const fatPerKg = 0.8;
  const proteinCalories = proteinPerKg * weight * 4;
  const fatCalories = fatPerKg * weight * 9;
  const carbsCalories = Math.max(tdee - (proteinCalories + fatCalories), 0);

  return {
    protein: proteinPerKg * weight,
    fat: fatPerKg * weight,
    carbs: carbsCalories / 4
  };
}

function validateInput(state) {
  const errors = [];
  if (!(state.age >= 10 && state.age <= 120)) errors.push("Edad válida entre 10 y 120.");
  if (!(state.weight >= 20 && state.weight <= 300)) errors.push("Peso válido entre 20 y 300 kg.");
  if (!(state.height >= 80 && state.height <= 250)) errors.push("Altura válida entre 80 y 250 cm.");
  if (!state.activity) errors.push("Seleccione nivel de actividad.");
  return errors;
}

// Form submission
tdeeForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const state = {
    gender: tdeeForm.gender.value,
    age: parseInputValue("#age"),
    weight: parseInputValue("#weight"),
    height: parseInputValue("#height"),
    activity: parseInputValue("#activity"),
    bodyFat: parseInputValue("#bodyFat", null)
  };

  const errors = validateInput(state);

  if (errors.length > 0) {
    errorMessage.textContent = errors.join(" ");
    resultSection.classList.add("hidden");
    return;
  }

  errorMessage.textContent = "";

  const bmr = calculateBMR(state);
  const tdee = bmr * state.activity;

  const macros = calculateMacros({ weight: state.weight, tdee });

  const cut = tdee * 0.85;
  const bulk = tdee * 1.15;

  bmrValue.textContent = Math.round(bmr);
  tdeeValue.textContent = Math.round(tdee);
  cutValue.textContent = Math.round(cut);
  bulkValue.textContent = Math.round(bulk);
  proteinValue.textContent = macros.protein.toFixed(1);
  fatValue.textContent = macros.fat.toFixed(1);
  carbValue.textContent = macros.carbs.toFixed(1);

  resultSection.classList.remove("hidden");
});