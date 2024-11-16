import { Code2 } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-4">
          <Code2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">Copilot Clone</h1>
            <p className="text-sm text-muted-foreground">
              A simplified version of GitHub Copilot
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}