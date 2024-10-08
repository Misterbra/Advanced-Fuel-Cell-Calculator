"use client";

import React, { useState } from 'react';
import { 
  calculateDensities, 
  calculateEfficiencies, 
  calculateLosses, 
  calculateNernstVoltage,
  FuelCellType,
  CalculationResults,
  FuelCellInputs
} from '../utils/fuelCellCalculations';
import { calculatePEMSpecifics, PEMInputs, PEMResults } from '../utils/pemCalculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartDataPoint = {
  voltage: number;
  current: number;
  power: number;
};

const FuelCellCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<FuelCellInputs>({
    voltage: 0.7,
    current: 10,
    activeArea: 100,
    temperature: 80,
    anodePressure: 1,
    cathodePressure: 1,
    anodeFlow: 1,
    cathodeFlow: 2,
    anodeComposition: { H2: 100, CO: 0, CO2: 0, CH4: 0, N2: 0 },
    cathodeComposition: { O2: 21, N2: 79 },
    fuelCellType: 'PEM' as FuelCellType,
    numberOfCells: 1,
  });

  const [pemInputs, setPemInputs] = useState<PEMInputs>({
    activeArea: 100,
    numberOfCells: 1,
    anodeChannelDepth: 0.5,
    cathodeChannelDepth: 0.5,
    coolantChannelHeight: 1,
    activeCellPercentage: 80,
    metalPlateThickness: 0.1,
    carbonPlateThickness: 1,
    additionalLayerThickness: 0,
    meaThickness: 0.5,
    anodeCollectorThickness: 2,
    cathodeCollectorThickness: 2,
    anodeIsolationThickness: 0.5,
    cathodeIsolationThickness: 0.5,
    anodeEndPlateThickness: 10,
    cathodeEndPlateThickness: 10,
  });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [pemResults, setPemResults] = useState<PEMResults | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleCompositionChange = (gas: 'anode' | 'cathode', component: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [`${gas}Composition`]: { ...prev[`${gas}Composition`], [component]: value }
    }));
  };

  const handlePemInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPemInputs(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleCalculate = () => {
    const densities = calculateDensities(inputs);
    const efficiencies = calculateEfficiencies(inputs);
    const losses = calculateLosses(inputs);
    const nernstVoltage = calculateNernstVoltage(inputs);

    const newResults = {
      currentDensity: densities.currentDensity,
      powerDensity: densities.powerDensity,
      electricalEfficiency: efficiencies.electrical,
      fuelUtilization: efficiencies.fuelUtilization,
      activationLoss: losses.activation,
      ohmicLoss: losses.ohmic,
      concentrationLoss: losses.concentration,
      nernstVoltage,
      totalPower: densities.powerDensity * inputs.activeArea * inputs.numberOfCells,
    };

    if (inputs.fuelCellType === 'PEM') {
      const pemSpecifics = calculatePEMSpecifics(pemInputs, newResults.totalPower);
      setPemResults(pemSpecifics);
    } else {
      setPemResults(null);
    }

    setResults(newResults);
    setChartData(generateChartData(inputs, newResults));
  };

  const generateChartData = (inputs: FuelCellInputs, results: CalculationResults): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    for (let i = 0; i <= 1; i += 0.1) {
      const voltage = i * results.nernstVoltage;
      const current = (results.nernstVoltage - voltage) / (results.activationLoss + results.ohmicLoss);
      data.push({
        voltage,
        current,
        power: voltage * current,
      });
    }
    return data;
  };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
        <div className="max-w-7xl mx-auto bg-white shadow-2xl">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-3xl font-bold text-white text-center">Advanced Fuel Cell Calculator</h1>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="Voltage (V)" name="voltage" value={inputs.voltage} onChange={handleInputChange} />
              <Input label="Current (A)" name="current" value={inputs.current} onChange={handleInputChange} />
              <Input label="Active Area (cm²)" name="activeArea" value={inputs.activeArea} onChange={handleInputChange} />
              <Input label="Temperature (°C)" name="temperature" value={inputs.temperature} onChange={handleInputChange} />
              <Input label="Anode Pressure (atm)" name="anodePressure" value={inputs.anodePressure} onChange={handleInputChange} />
              <Input label="Cathode Pressure (atm)" name="cathodePressure" value={inputs.cathodePressure} onChange={handleInputChange} />
              <Input label="Anode Flow (L/min)" name="anodeFlow" value={inputs.anodeFlow} onChange={handleInputChange} />
              <Input label="Cathode Flow (L/min)" name="cathodeFlow" value={inputs.cathodeFlow} onChange={handleInputChange} />
              <Input label="Number of Cells" name="numberOfCells" value={inputs.numberOfCells} onChange={handleInputChange} />
            </div>
            
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Cell Type</label>
            <select
              name="fuelCellType"
              value={inputs.fuelCellType}
              onChange={(e) => setInputs((prev: typeof inputs) => ({ ...prev, fuelCellType: e.target.value as FuelCellType }))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 font-medium"
            >
              <option value="PEM">PEM</option>
              <option value="SOFC">SOFC</option>
              <option value="AFC">AFC</option>
              <option value="MCFC">MCFC</option>
              <option value="PAFC">PAFC</option>
            </select>
          </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Anode Composition (%)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(inputs.anodeComposition).map(([gas, value]) => (
                  <Input
                    key={gas}
                    label={gas}
                    name={`anode${gas}`}
                    value={value}
                    onChange={(e) => handleCompositionChange('anode', gas, parseFloat(e.target.value))}
                  />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Cathode Composition (%)</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(inputs.cathodeComposition).map(([gas, value]) => (
                  <Input
                    key={gas}
                    label={gas}
                    name={`cathode${gas}`}
                    value={value}
                    onChange={(e) => handleCompositionChange('cathode', gas, parseFloat(e.target.value))}
                  />
                ))}
              </div>
            </div>

            {inputs.fuelCellType === 'PEM' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">PEM Specific Inputs</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(pemInputs).map(([key, value]) => (
                    <Input
                      key={key}
                      label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      name={key}
                      value={value as number}
                      onChange={handlePemInputChange}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleCalculate}
              className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Calculate Results
            </button>
          </div>

          <div className="space-y-8">
            {results && (
              <>
                <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
                  <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Calculation Results</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Result label="Current Density" value={results.currentDensity.toFixed(4)} unit="A/cm²" />
                    <Result label="Power Density" value={results.powerDensity.toFixed(4)} unit="W/cm²" />
                    <Result label="Electrical Efficiency" value={(results.electricalEfficiency * 100).toFixed(2)} unit="%" />
                    <Result label="Fuel Utilization" value={(results.fuelUtilization * 100).toFixed(2)} unit="%" />
                    <Result label="Activation Loss" value={results.activationLoss.toFixed(4)} unit="V" />
                    <Result label="Ohmic Loss" value={results.ohmicLoss.toFixed(4)} unit="V" />
                    <Result label="Concentration Loss" value={results.concentrationLoss.toFixed(4)} unit="V" />
                    <Result label="Nernst Voltage" value={results.nernstVoltage.toFixed(4)} unit="V" />
                    <Result label="Total Power" value={results.totalPower.toFixed(4)} unit="W" />
                  </div>
                </div>

                {pemResults && (
                  <div className="bg-indigo-50 p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-indigo-800 mb-4">PEM Specific Results</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Result label="Metal Stack Height" value={pemResults.metalStackHeight.toFixed(2)} unit="mm" />
                      <Result label="Carbon Stack Height" value={pemResults.carbonStackHeight.toFixed(2)} unit="mm" />
                      <Result label="Stack Base Area" value={pemResults.stackBaseArea.toFixed(2)} unit="cm²" />
                      <Result label="Metal Stack Volume" value={pemResults.metalStackVolume.toFixed(2)} unit="L" />
                      <Result label="Carbon Stack Volume" value={pemResults.carbonStackVolume.toFixed(2)} unit="L" />
                      <Result label="Metal Stack Power Density" value={pemResults.metalStackPowerDensity.toFixed(2)} unit="kW/L" />
                      <Result label="Carbon Stack Power Density" value={pemResults.carbonStackPowerDensity.toFixed(2)} unit="kW/L" />
                    </div>
                  </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Curves</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="voltage" label={{ value: 'Voltage (V)', position: 'insideBottom', offset: -5 }} />
                      <YAxis yAxisId="left" label={{ value: 'Current (A)', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Power (W)', angle: 90, position: 'insideRight' }} />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="current" stroke="#4F46E5" strokeWidth={2} name="Current" />
                      <Line yAxisId="right" type="monotone" dataKey="power" stroke="#10B981" strokeWidth={2} name="Power" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Input: React.FC<{ label: string; name: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="number"
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 font-medium"
    />
  </div>
);

const Result: React.FC<{ label: string; value: string; unit: string }> = ({ label, value, unit }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm">
    <dt className="text-sm font-medium text-gray-800 mb-1">{label}</dt>
    <dd className="text-lg font-semibold text-indigo-800">{value} <span className="text-sm font-normal text-indigo-800">{unit}</span></dd>
  </div>
);

export default FuelCellCalculator;