# Linear Algebra Matrix Database

A web-based tool for exploring and searching matrices based on their mathematical properties. This project helps users find matrix examples that satisfy specific properties while respecting mathematical rules and theorems.

## Features

### 🔍 Matrix Search
- Search for matrices by including or excluding specific properties
- Smart property suggestions with auto-complete
- Support for multiple comma-separated properties
- Case-insensitive search

### 📦 Matrix Database
- Organized collection of matrices with their properties
- Each matrix entry includes:
  - Name/identifier
  - List of properties (tags)
  - Unique ID for reference

### 📜 Logical Rules Engine
The system enforces mathematical theorems and properties through logical rules. For example:
- Spectral Theorem: Real symmetric matrices are diagonalizable with real eigenvalues
- Complex Spectral Theorem: Hermitian matrices are diagonalizable with real eigenvalues
- Property exclusions: Matrices with real eigenvalues cannot have pure imaginary eigenvalues

### 🛠️ Administration
- Interface for proposing changes to the database
- Structured data format for matrices and rules

## Usage

1. **Search for Matrices**
   - Use the "Proprietà incluse" field to specify required properties
   - Type partial property names for suggestions
   - Add multiple properties using commas
   - Use arrow keys or mouse to select from suggestions

2. **Exclude Properties**
   - Use the "Proprietà escluse" field to specify properties you don't want
   - Works with the same suggestion system as inclusion

3. **View Results**
   - Click "Cerca" to search
   - Results show matching matrices and their properties
   - System checks for rule violations before showing results

4. **Propose Changes**
   - Click "🛠️ Proponi una modifica al database" to suggest additions or modifications

## Data Structure

### Matrix Entry Format (`data/database.json`):
```json
{
  "id": 1,
  "nome": "Matrix Name",
  "tags": ["property1", "property2", ...]
}
```

### Rule Format (`data/regole.json`):
```json
{
  "id": 1,
  "nome": "Rule Name",
  "se": [
    {"tag": "property1", "negato": false},
    {"tag": "property2", "negato": true}
  ],
  "allora": [
    {"tag": "result1", "negato": false}
  ]
}
```

## Local Development

1. Clone the repository
2. Serve the directory using a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit http://localhost:8000 in your browser

## Contributing

To contribute new matrices or rules:
1. Use the admin interface to propose changes
2. Ensure new entries follow the existing JSON structure
3. Verify that new rules are mathematically sound

## License

This project is part of educational resources for Linear Algebra. Please check with the repository owner for specific licensing terms.