export type FuelCellType = 'PEM' | 'SOFC' | 'AFC' | 'MCFC' | 'PAFC';

interface FuelCellInputs {
  voltage: number;
  current: number;
  activeArea: number;
  temperature: number;
  anodePressure: number;
  cathodePressure: number;
  anodeFlow: number;
  cathodeFlow: number;
  anodeComposition: { [key: string]: number };
  cathodeComposition: { [key: string]: number };
  fuelCellType: FuelCellType;
  numberOfCells: number;
}

export interface CalculationResults {
  currentDensity: number;
  powerDensity: number;
  electricalEfficiency: number;
  fuelUtilization: number;
  activationLoss: number;
  ohmicLoss: number;
  concentrationLoss: number;
  nernstVoltage: number;
  totalPower: number;
}

const FARADAY_CONSTANT = 96485; // C/mol
const GAS_CONSTANT = 8.314; // J/(mol·K)

export function calculateDensities(inputs: FuelCellInputs) {
  const currentDensity = inputs.current / inputs.activeArea;
  const powerDensity = inputs.voltage * currentDensity;
  return { currentDensity, powerDensity };
}

export function calculateEfficiencies(inputs: FuelCellInputs) {
  const { voltage, current, anodeFlow, anodeComposition } = inputs;
  const hydrogenFlow = (anodeFlow * anodeComposition.H2) / 100 / 60 / 22.4; // mol/s
  const theoreticalVoltage = 1.23; // V
  
  const electricalEfficiency = voltage / theoreticalVoltage;
  const fuelUtilization = (current / (2 * FARADAY_CONSTANT * hydrogenFlow));
  
  return { electrical: electricalEfficiency, fuelUtilization };
}

export function calculateLosses(inputs: FuelCellInputs) {
  const { current, activeArea, temperature } = inputs;
  const currentDensity = current / activeArea;
  
  // These are simplified models and should be adjusted based on specific fuel cell characteristics
  const activationLoss = 0.05 * Math.log(currentDensity + 1);
  const ohmicLoss = 0.02 * currentDensity;
  const concentrationLoss = 0.05 * Math.exp(currentDensity / 0.5);
  
  return { activation: activationLoss, ohmic: ohmicLoss, concentration: concentrationLoss };
}

export function calculateNernstVoltage(inputs: FuelCellInputs) {
  const { temperature, anodePressure, cathodePressure, anodeComposition, cathodeComposition } = inputs;
  const T = temperature + 273.15; // Convert to Kelvin
  
  const pH2 = (anodeComposition.H2 / 100) * anodePressure;
  const pO2 = (cathodeComposition.O2 / 100) * cathodePressure;
  
  const E0 = 1.23; // Standard electrode potential at 25°C
  
  return E0 - (GAS_CONSTANT * T / (4 * FARADAY_CONSTANT)) * Math.log(1 / (pH2 * Math.pow(pO2, 0.5)));
}