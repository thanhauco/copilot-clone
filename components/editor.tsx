"use client";

import { useState } from "react";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const defaultCode = `// Common utility functions with TypeScript
function calculateSum(a: number, b: number): number {
  return a + b;
}

function multiply(a: number, b: number): number {
  return a * b;
}

function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === cleaned.split('').reverse().join('');
}

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`;

const suggestions = {
  "function": [
    "multiply(a: number, b: number): number {\n  return a * b;\n}",
    "divide(a: number, b: number): number {\n  if (b === 0) throw new Error('Cannot divide by zero');\n  return a / b;\n}",
    "square(n: number): number {\n  return n * n;\n}"
  ],
  "const": [
    "result = numbers.reduce((acc, curr) => acc + curr, 0);",
    "filtered = array.filter(item => item > 0);",
    "mapped = array.map(item => item * 2);"
  ]
};

export default function Editor() {
  const [code, setCode] = useState(defaultCode);
  const [suggestion, setSuggestion] = useState("");
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [result, setResult] = useState<string>("");
  const [selectedFunction, setSelectedFunction] = useState("sum");
  
  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    setCode(value);
    
    const lines = value.split("\n");
    const lastLine = lines[lines.length - 1].trim();
    
    for (const [key, values] of Object.entries(suggestions)) {
      if (lastLine.includes(key)) {
        const randomSuggestion = values[Math.floor(Math.random() * values.length)];
        setSuggestion(randomSuggestion);
        return;
      }
    }
    
    setSuggestion("");
  };

  const applySuggestion = () => {
    if (!suggestion) return;
    const lines = code.split("\n");
    lines[lines.length - 1] = lines[lines.length - 1] + "\n  " + suggestion;
    setCode(lines.join("\n"));
    setSuggestion("");
  };

  const executeCode = () => {
    try {
      // Create a safe function execution environment
      const safeEval = new Function('input1', 'input2', `
        ${code}
        switch(arguments[2]) {
          case 'sum':
            return calculateSum(Number(input1), Number(input2));
          case 'multiply':
            return multiply(Number(input1), Number(input2));
          case 'palindrome':
            return isPalindrome(input1);
          case 'fibonacci':
            return fibonacci(Number(input1));
          default:
            return 'Function not selected';
        }
      `);

      const output = safeEval(input1, input2, selectedFunction);
      setResult(String(output));
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Code Editor</TabsTrigger>
          <TabsTrigger value="test">Test Functions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor">
          <Card className="relative border-2 border-border">
            <MonacoEditor
              height="60vh"
              defaultLanguage="typescript"
              theme="vs-dark"
              value={code}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
            {suggestion && (
              <div className="absolute bottom-4 left-4 right-4 bg-secondary/80 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <pre className="text-sm font-mono text-primary">{suggestion}</pre>
                  </div>
                  <Button
                    size="sm"
                    onClick={applySuggestion}
                    className={cn(
                      "bg-primary text-primary-foreground hover:bg-primary/90",
                      "transition-colors duration-200"
                    )}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Label className="w-32">Select Function:</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={selectedFunction}
                  onChange={(e) => setSelectedFunction(e.target.value)}
                >
                  <option value="sum">Calculate Sum</option>
                  <option value="multiply">Multiply</option>
                  <option value="palindrome">Check Palindrome</option>
                  <option value="fibonacci">Fibonacci</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <Label className="w-32">Input 1:</Label>
                <Input
                  type="text"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                  placeholder="Enter first value"
                />
              </div>

              {selectedFunction !== 'palindrome' && selectedFunction !== 'fibonacci' && (
                <div className="flex items-center space-x-4">
                  <Label className="w-32">Input 2:</Label>
                  <Input
                    type="text"
                    value={input2}
                    onChange={(e) => setInput2(e.target.value)}
                    placeholder="Enter second value"
                  />
                </div>
              )}

              <div className="flex items-center space-x-4">
                <Label className="w-32">Result:</Label>
                <div className="flex-1 p-3 bg-muted rounded-md">
                  {result || 'No result yet'}
                </div>
              </div>

              <Button
                onClick={executeCode}
                className="w-full"
                size="lg"
              >
                <Play className="mr-2 h-4 w-4" />
                Run Function
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}