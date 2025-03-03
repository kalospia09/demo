
import { useState } from 'react'
import './App.css'

type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume'

interface UnitOption {
  value: string
  label: string
  ratio?: number // ratio to base unit
  convert?: (value: number) => number // custom conversion function
}

export default function App() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [inputValue, setInputValue] = useState<string>('1')
  const [fromUnit, setFromUnit] = useState<string>('m')
  const [toUnit, setToUnit] = useState<string>('km')
  const [result, setResult] = useState<string>('0.001')
  
  const unitCategories: Record<UnitCategory, UnitOption[]> = {
    length: [
      { value: 'mm', label: 'Millimeters (mm)', ratio: 0.001 },
      { value: 'cm', label: 'Centimeters (cm)', ratio: 0.01 },
      { value: 'm', label: 'Meters (m)', ratio: 1 },
      { value: 'km', label: 'Kilometers (km)', ratio: 1000 },
      { value: 'in', label: 'Inches (in)', ratio: 0.0254 },
      { value: 'ft', label: 'Feet (ft)', ratio: 0.3048 },
      { value: 'yd', label: 'Yards (yd)', ratio: 0.9144 },
      { value: 'mi', label: 'Miles (mi)', ratio: 1609.344 }
    ],
    weight: [
      { value: 'mg', label: 'Milligrams (mg)', ratio: 0.001 },
      { value: 'g', label: 'Grams (g)', ratio: 1 },
      { value: 'kg', label: 'Kilograms (kg)', ratio: 1000 },
      { value: 'oz', label: 'Ounces (oz)', ratio: 28.3495 },
      { value: 'lb', label: 'Pounds (lb)', ratio: 453.592 },
      { value: 'ton', label: 'Tons (t)', ratio: 907185 }
    ],
    temperature: [
      { value: 'c', label: 'Celsius (°C)', 
        convert: (val) => val },
      { value: 'f', label: 'Fahrenheit (°F)', 
        convert: (val) => (val * 9/5) + 32 },
      { value: 'k', label: 'Kelvin (K)', 
        convert: (val) => val + 273.15 }
    ],
    volume: [
      { value: 'ml', label: 'Milliliters (ml)', ratio: 0.001 },
      { value: 'l', label: 'Liters (l)', ratio: 1 },
      { value: 'gal', label: 'Gallons (gal)', ratio: 3.78541 },
      { value: 'pt', label: 'Pints (pt)', ratio: 0.473176 },
      { value: 'qt', label: 'Quarts (qt)', ratio: 0.946353 },
      { value: 'cup', label: 'Cups', ratio: 0.236588 }
    ]
  }

  const handleConvert = () => {
    if (!inputValue) return

    const value = parseFloat(inputValue)
    if (isNaN(value)) return

    // Handle temperature (special case)
    if (category === 'temperature') {
      const fromUnitOption = unitCategories.temperature.find(u => u.value === fromUnit)
      const toUnitOption = unitCategories.temperature.find(u => u.value === toUnit)
      
      if (fromUnitOption && toUnitOption && fromUnitOption.convert && toUnitOption.convert) {
        // Convert to Celsius first (our base unit for temperatures)
        let celsiusValue: number
        
        if (fromUnit === 'c') {
          celsiusValue = value
        } else if (fromUnit === 'f') {
          celsiusValue = (value - 32) * 5/9
        } else { // Kelvin
          celsiusValue = value - 273.15
        }
        
        // Convert from Celsius to target unit
        let convertedValue: number
        if (toUnit === 'c') {
          convertedValue = celsiusValue
        } else if (toUnit === 'f') {
          convertedValue = (celsiusValue * 9/5) + 32
        } else { // Kelvin
          convertedValue = celsiusValue + 273.15
        }
        
        setResult(convertedValue.toFixed(6))
        return
      }
    }
    
    // Handle other unit types using ratios
    const fromUnitOption = unitCategories[category].find(u => u.value === fromUnit)
    const toUnitOption = unitCategories[category].find(u => u.value === toUnit)
    
    if (fromUnitOption && toUnitOption && fromUnitOption.ratio && toUnitOption.ratio) {
      // Convert to base unit, then to target unit
      const baseValue = value * fromUnitOption.ratio
      const convertedValue = baseValue / toUnitOption.ratio
      setResult(convertedValue.toFixed(6))
    }
  }

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory)
    setFromUnit(unitCategories[newCategory][0].value)
    setToUnit(unitCategories[newCategory][1].value)
    setResult('')
  }

  return (
    <main className="converter-container">
      <h1>Unit Converter</h1>
      
      <div className="category-selector">
        <label htmlFor="category">Category:</label>
        <select 
          id="category" 
          value={category} 
          onChange={(e) => handleCategoryChange(e.target.value as UnitCategory)}
        >
          <option value="length">Length</option>
          <option value="weight">Weight</option>
          <option value="temperature">Temperature</option>
          <option value="volume">Volume</option>
        </select>
      </div>
      
      <div className="conversion-inputs">
        <div className="input-group">
          <input 
            type="number" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
          />
          
          <select 
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
          >
            {unitCategories[category].map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="arrows">⟷</div>
        
        <div className="input-group">
          <input 
            type="text" 
            value={result}
            readOnly
            placeholder="Result"
          />
          
          <select 
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
          >
            {unitCategories[category].map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <button className="convert-button" onClick={handleConvert}>
        Convert
      </button>
    </main>
  )
}
