export interface PEMInputs {
    activeArea: number;
    numberOfCells: number;
    anodeChannelDepth: number;
    cathodeChannelDepth: number;
    coolantChannelHeight: number;
    activeCellPercentage: number;
    metalPlateThickness: number;
    carbonPlateThickness: number;
    additionalLayerThickness: number;
    meaThickness: number;
    anodeCollectorThickness: number;
    cathodeCollectorThickness: number;
    anodeIsolationThickness: number;
    cathodeIsolationThickness: number;
    anodeEndPlateThickness: number;
    cathodeEndPlateThickness: number;
  }
  
  export interface PEMResults {
    metalStackHeight: number;
    carbonStackHeight: number;
    stackBaseArea: number;
    metalStackVolume: number;
    carbonStackVolume: number;
    metalStackPowerDensity: number;
    carbonStackPowerDensity: number;
  }
  
  export function calculatePEMSpecifics(inputs: PEMInputs, stackPower: number): PEMResults {
    const cellThicknessMetal = inputs.metalPlateThickness * 2 + inputs.meaThickness;
    const cellThicknessCarbon = inputs.carbonPlateThickness * 2 + inputs.meaThickness;
  
    const metalStackHeight = 
      inputs.numberOfCells * cellThicknessMetal +
      inputs.anodeCollectorThickness +
      inputs.cathodeCollectorThickness +
      inputs.anodeIsolationThickness +
      inputs.cathodeIsolationThickness +
      inputs.anodeEndPlateThickness +
      inputs.cathodeEndPlateThickness;
  
    const carbonStackHeight = 
      inputs.numberOfCells * cellThicknessCarbon +
      inputs.anodeCollectorThickness +
      inputs.cathodeCollectorThickness +
      inputs.anodeIsolationThickness +
      inputs.cathodeIsolationThickness +
      inputs.anodeEndPlateThickness +
      inputs.cathodeEndPlateThickness;
  
    const stackBaseArea = inputs.activeArea / (inputs.activeCellPercentage / 100);
  
    const metalStackVolume = (metalStackHeight / 10) * (stackBaseArea / 100); // Convert to liters
    const carbonStackVolume = (carbonStackHeight / 10) * (stackBaseArea / 100); // Convert to liters
  
    const metalStackPowerDensity = stackPower / metalStackVolume / 1000; // Convert to kW/L
    const carbonStackPowerDensity = stackPower / carbonStackVolume / 1000; // Convert to kW/L
  
    return {
      metalStackHeight,
      carbonStackHeight,
      stackBaseArea,
      metalStackVolume,
      carbonStackVolume,
      metalStackPowerDensity,
      carbonStackPowerDensity
    };
  }