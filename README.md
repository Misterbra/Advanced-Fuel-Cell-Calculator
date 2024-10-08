# Advanced Fuel Cell Calculator

![Advanced Fuel Cell Calculator](https://raw.githubusercontent.com/Misterbra/advanced-fuel-cell-calculator/main/public/og-image.jpg)

## Overview

The Advanced Fuel Cell Calculator is an open-source web application designed to perform precise calculations and analysis for fuel cell performance. This tool is invaluable for researchers, engineers, and students working in the field of fuel cell technology.

## Features

- Calculate key performance metrics for various types of fuel cells (PEM, SOFC, AFC, MCFC, PAFC)
- Intuitive user interface for inputting fuel cell parameters
- Real-time calculation of results including current density, power density, efficiency, and more
- Interactive performance curves visualization
- Specific calculations for PEM fuel cells, including stack dimensions and power density comparisons

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Misterbra/advanced-fuel-cell-calculator.git
   ```

2. Navigate to the project directory:
   ```
   cd advanced-fuel-cell-calculator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Usage

1. Select the fuel cell type from the dropdown menu.
2. Input the relevant parameters for your fuel cell setup.
3. If you've selected PEM as the fuel cell type, additional PEM-specific inputs will appear.
4. Click the "Calculate Results" button to generate performance metrics.
5. View the results in the "Calculation Results" section.
6. Analyze the performance curves in the interactive chart.

## Contributing

We welcome contributions to the Advanced Fuel Cell Calculator! If you have suggestions for improvements or bug fixes, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with a clear, descriptive message.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

### Contribution idea
Loss models: Loss models (activation, ohmic, concentration) are simplified. It might be beneficial to implement more detailed models for each fuel cell type.

Please ensure your code adheres to the existing style and includes appropriate tests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please contact the project maintainer at kenkan.vl@gmail.com.

## Acknowledgments

- Thanks to all contributors who have helped shape this project.
- Special thanks to the fuel cell research community for their invaluable insights.