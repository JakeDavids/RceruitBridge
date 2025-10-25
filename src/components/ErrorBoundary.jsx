import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      const pageName = this.props.pageName || "Page";

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <Card className="border-l-4 border-l-red-500 bg-red-50/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 text-lg mb-2">
                      {pageName} Error
                    </h3>
                    <p className="text-red-700 text-sm mb-4">
                      Something went wrong while loading this page. This error has been logged.
                    </p>

                    <details className="mb-4">
                      <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800 mb-2">
                        Show error details
                      </summary>
                      <pre className="text-xs bg-red-100 p-3 rounded overflow-auto max-h-48 text-red-900">
                        {String(this.state.error)}
                        {this.state.errorInfo && `\n\nComponent Stack:\n${this.state.errorInfo.componentStack}`}
                      </pre>
                    </details>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => window.location.reload()}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Reload Page
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/dashboard'}
                        variant="outline"
                        className="border-red-300 text-red-700 hover:bg-red-100"
                      >
                        Go to Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}