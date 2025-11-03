import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Calculator, Droplets } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const Chatbot = () => {
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
      
      let errorMessage = 'Failed to get response';
      
      if (error instanceof Error) {
        if (error.message.includes('Rate limits exceeded')) {
          errorMessage = 'AI rate limit reached. Please wait a moment and try again, or add credits to your workspace in Settings → Usage.';
        } else if (error.message.includes('Payment required')) {
          errorMessage = 'AI credits depleted. Please add credits to your workspace in Settings → Usage to continue using the chatbot.';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Droplets className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-3">SDG 6 Water Advisor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get personalized water bill calculations, conservation tips, and safety advice powered by AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Bill Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Calculate your water bill based on meter readings at 200 shillings per unit
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Conservation Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Get personalized advice on reducing water consumption and avoiding shortages
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Water Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learn about safe water treatment, storage, and quality parameters
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calculator Section */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Water Bill Calculator</CardTitle>
              <CardDescription>Enter your meter readings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="prev-reading">Previous Meter Reading (units)</Label>
                <Input
                  id="prev-reading"
                  type="number"
                  placeholder="e.g., 1000"
                  value={previousReading}
                  onChange={(e) => setPreviousReading(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="curr-reading">Current Meter Reading (units)</Label>
                <Input
                  id="curr-reading"
                  type="number"
                  placeholder="e.g., 1050"
                  value={currentReading}
                  onChange={(e) => setCurrentReading(e.target.value)}
                />
              </div>
              <Button onClick={handleCalculateBill} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Bill
              </Button>
            </CardContent>
          </Card>

          {/* Chat Section */}
          <Card className="lg:col-span-2 flex flex-col h-[600px]">
            <CardHeader className="flex-shrink-0 border-b">
              <CardTitle>Chat with Water Advisor</CardTitle>
              <CardDescription>Ask about water conservation, safety, or bill calculations</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col p-6 space-y-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    <p>Start by calculating your water bill or ask me anything about water conservation and safety!</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-muted p-4 rounded-lg">
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
              <div className="flex gap-2 border-t pt-4">
                <Textarea
                  placeholder="Ask about water conservation, safety, or bills..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="min-h-[80px] resize-none"
                />
                <Button onClick={() => sendMessage()} disabled={loading || (!input.trim())} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
