import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, X, Calculator } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WaterAdvisorChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previousReading, setPreviousReading] = useState('');
  const [currentReading, setCurrentReading] = useState('');
  const { toast } = useToast();

  const sendMessage = async (customMessage?: string) => {
    const messageText = customMessage || input;
    if (!messageText.trim() && !previousReading && !currentReading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText || 'Calculate my water bill',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('water-advisor-chat', {
        body: {
          messages: [...messages, userMessage],
          previousReading: previousReading ? parseFloat(previousReading) : undefined,
          currentReading: currentReading ? parseFloat(currentReading) : undefined,
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateBill = () => {
    if (!previousReading || !currentReading) {
      toast({
        title: 'Missing Information',
        description: 'Please enter both meter readings',
        variant: 'destructive',
      });
      return;
    }

    const prev = parseFloat(previousReading);
    const curr = parseFloat(currentReading);

    if (curr < prev) {
      toast({
        title: 'Invalid Reading',
        description: 'Current reading must be greater than previous reading',
        variant: 'destructive',
      });
      return;
    }

    sendMessage(`I want to calculate my water bill. My previous meter reading was ${prev} units and current reading is ${curr} units. Please calculate my bill and give me advice on water conservation.`);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-96 h-[600px] shadow-elevated z-50 flex flex-col">
          <CardHeader className="flex-shrink-0 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">SDG 6 Water Advisor</CardTitle>
                <CardDescription>Bill calculator & conservation tips</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden flex flex-col p-4 space-y-4">
            {/* Bill Calculator Section */}
            {messages.length === 0 && (
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calculator className="h-4 w-4" />
                  Water Bill Calculator
                </div>
                <div className="space-y-2">
                  <div>
                    <Label htmlFor="prev-reading" className="text-xs">Previous Meter Reading (units)</Label>
                    <Input
                      id="prev-reading"
                      type="number"
                      placeholder="e.g., 1000"
                      value={previousReading}
                      onChange={(e) => setPreviousReading(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="curr-reading" className="text-xs">Current Meter Reading (units)</Label>
                    <Input
                      id="curr-reading"
                      type="number"
                      placeholder="e.g., 1050"
                      value={currentReading}
                      onChange={(e) => setCurrentReading(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button onClick={handleCalculateBill} className="w-full h-8 text-sm" size="sm">
                    Calculate Bill & Get Advice
                  </Button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2 border-t pt-3">
              <Textarea
                placeholder="Ask about water conservation or safety..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="min-h-[60px] resize-none text-sm"
              />
              <Button onClick={() => sendMessage()} disabled={loading || (!input.trim())} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default WaterAdvisorChat;
