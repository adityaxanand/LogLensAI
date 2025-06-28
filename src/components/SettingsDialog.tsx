
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Code } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>API Key Configuration</DialogTitle>
          <DialogDescription>
            How to use your own Google AI API key for analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            To protect your credentials, this application is designed to use an environment variable for the API key. This is a secure, industry-standard practice.
          </p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Create a new file named <code className="font-mono bg-muted p-1 rounded-sm">.env.local</code> in the root directory of the project (the same folder as `package.json`).
            </li>
            <li>
              Add the following line to the file, replacing `your_api_key_here` with your actual Google AI API key:
              <div className="p-3 my-2 bg-muted/80 rounded-md text-foreground font-mono text-xs flex items-center gap-2">
                <Code className="h-4 w-4 flex-shrink-0" />
                <span>GOOGLE_GENAI_API_KEY=your_api_key_here</span>
              </div>
            </li>
            <li>
              Restart the development server for the changes to take effect.
            </li>
          </ol>
          <p>
            Your key is used directly on the server and is never exposed to the browser.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
