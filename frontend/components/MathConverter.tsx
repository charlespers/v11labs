'use client'

import { useState } from 'react'

export default function MathConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')

  const convertMath = (text: string): string => {
    let result = text

    // Step 1: Handle the most complex patterns first - dot notation with nested HTML
    // Pattern: _<sub>_x_</sub>_<sub>˙(</sub>_<sub>_t_</sub>_<sub>)</sub>
    result = result.replace(/_<sub>_([a-zA-Z])_<\/sub>_<sub>˙\(<\/sub>_<sub>_([a-z])_<\/sub>_<sub>\)<\/sub>/g, '$\\dot{$1}($2)$')
    
    // Pattern: _<sub>_N_</sub>_<sup>˙ </sup><sub>(</sub>_<sub>_t_</sub>_<sub>)</sub>
    result = result.replace(/_<sub>_([A-Z])_<\/sub>_<sup>˙\s*<\/sup><sub>\(<\/sub>_<sub>_([a-z])_<\/sub>_<sub>\)<\/sub>/g, '$\\dot{$1}($2)$')
    
    // Pattern: _<sub>_N_</sub>_<sup>˙ </sup>(_<sub>_t_</sub>_)
    result = result.replace(/_<sub>_([A-Z])_<\/sub>_<sup>˙\s*<\/sup>\(_<sub>_([a-z])_<\/sub>_\)/g, '$\\dot{$1}($2)$')
    
    // Step 2: Convert fractions: _<sup>_I_</sup><sub>_e_</sub> to \frac{I}{e}
    result = result.replace(/_<sup>_([^<]+)_<\/sup><sub>_([^<]+)_<\/sub>/g, '$\\frac{$1}{$2}$')
    result = result.replace(/<sup>_?([^<]+)_?<\/sup><sub>_?([^<]+)_?<\/sub>/g, '$\\frac{$1}{$2}$')
    
    // Step 3: Convert simple subscripts: _<sub>_x_</sub> or <sub>_x_</sub> or <sub>x</sub>
    result = result.replace(/_?<sub>_?([^<]+)_?<\/sub>/g, '_{$1}')
    
    // Step 4: Convert simple superscripts: _<sup>2</sup> or <sup>2</sup>
    result = result.replace(/_?<sup>_?([^<]+)_?<\/sup>/g, '^{$1}')
    
    // Step 5: Clean up underscores in subscripts/superscripts
    result = result.replace(/_{_+([^}]+)_+}/g, '_{$1}')
    result = result.replace(/\^{_+([^}]+)_+}/g, '^{$1}')
    result = result.replace(/_{([^}]*)_}/g, '_{$1}')
    result = result.replace(/\^{([^}]*)_}/g, '^{$1}')
    
    // Step 6: Convert Greek letters
    const greekMap: { [key: string]: string } = {
      'α': '\\alpha',
      'β': '\\beta',
      'γ': '\\gamma',
      'δ': '\\delta',
      'ε': '\\epsilon',
      'θ': '\\theta',
      'λ': '\\lambda',
      'μ': '\\mu',
      'π': '\\pi',
      'σ': '\\sigma',
      'τ': '\\tau',
      'φ': '\\phi',
      'ϕ': '\\phi',
      'ω': '\\omega'
    }
    
    for (const [greek, latex] of Object.entries(greekMap)) {
      result = result.replace(new RegExp(greek, 'g'), latex)
    }
    
    // Step 7: Convert mathematical operators
    result = result.replace(/×/g, '\\times')
    result = result.replace(/≈/g, '\\approx')
    result = result.replace(/→/g, '\\rightarrow')
    result = result.replace(/≤/g, '\\leq')
    result = result.replace(/≥/g, '\\geq')
    result = result.replace(/−/g, '-')
    
    // Step 8: Clean up spaces
    result = result.replace(/\s+/g, ' ')
    
    // Step 9: Wrap variables with subscripts/superscripts in math mode
    // Match patterns like: letter_{subscript} or letter^{superscript} or letter_{sub}^{sup}
    // But avoid wrapping things already in $...$
    const mathPatterns = [
      // Variables with both sub and superscript
      /([^$])([a-zA-Z])\s*_{([^}]+)}\s*\^{([^}]+)}/g,
      // Variables with subscript
      /([^$])([a-zA-Z])\s*_{([^}]+)}/g,
      // Variables with superscript
      /([^$])([a-zA-Z])\s*\^{([^}]+)}/g,
    ]
    
    mathPatterns.forEach((pattern, index) => {
      if (index === 0) {
        result = result.replace(pattern, '$1$$$2_{$3}^{$4}$')
      } else if (index === 1) {
        result = result.replace(pattern, '$1$$$2_{$3}$')
      } else {
        result = result.replace(pattern, '$1$$$2^{$3}$')
      }
    })
    
    // Step 10: Wrap standalone math expressions
    result = result.replace(/([^$])\\dot\{([^}]+)\}\(([^)]+)\)\s*=/g, '$1$\\dot{$2}($3) =$')
    result = result.replace(/([^$])\(([A-Za-z])\s*-\s*([A-Za-z\\]+)\)/g, '$1$($2 - $3)$')
    
    // Step 11: Clean up multiple dollar signs
    result = result.replace(/\$\$\$+/g, '$$')
    result = result.replace(/\$\s+\$/g, '$$')
    
    // Step 12: Clean up HTML entities
    result = result.replace(/&nbsp;/g, ' ')
    result = result.replace(/&amp;/g, '&')
    result = result.replace(/&lt;/g, '<')
    result = result.replace(/&gt;/g, '>')
    
    return result.trim()
  }

  const handleConvert = () => {
    const converted = convertMath(input)
    setOutput(converted)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    alert('Copied to clipboard!')
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Math Notation Converter</h1>
      <p className="text-sm text-gray-600 mb-4">
        Converts HTML-formatted math (with &lt;sub&gt; and &lt;sup&gt; tags) to LaTeX format for markdown rendering.
      </p>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Input (HTML formatted math):
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
          placeholder="Paste your HTML-formatted math here..."
        />
      </div>

      <button
        onClick={handleConvert}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Convert to LaTeX
      </button>

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">
              Output (LaTeX format):
            </label>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
          />
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> The output uses LaTeX math notation. For inline math, wrap expressions in single dollar signs: $...$. 
              For block math, wrap in double dollar signs: $$...$$
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
