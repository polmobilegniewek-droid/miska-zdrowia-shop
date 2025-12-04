import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const SetupApilo = () => {
  const [apiUrl, setApiUrl] = useState("https://miskazdrowia.apilo.com");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke('apilo-auth', {
        body: { clientId, clientSecret, authCode, apiUrl }
      });

      if (error) {
        setResult(JSON.stringify({ error: error.message }, null, 2));
        toast.error("Błąd podczas pobierania tokena");
      } else {
        setResult(JSON.stringify(data, null, 2));
        if (data?.success && data?.data?.accessToken) {
          toast.success("Token wygenerowany pomyślnie!");
        } else if (data?.success && data?.data?.access_token) {
          toast.success("Token wygenerowany pomyślnie!");
        } else {
          toast.info("Otrzymano odpowiedź z Apilo");
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Nieznany błąd";
      setResult(JSON.stringify({ error: errorMessage }, null, 2));
      toast.error("Błąd połączenia");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Skopiowano do schowka");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Konfiguracja Apilo API</CardTitle>
          <CardDescription>
            Wprowadź dane autoryzacyjne, aby wygenerować Access Token
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">Adres sklepu Apilo</Label>
              <Input
                id="apiUrl"
                type="url"
                placeholder="https://mojsklep.apilo.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                type="text"
                placeholder="1"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="text"
                placeholder="abc4f0b2-1b0e-5cf2-..."
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authCode">Kod autoryzacji</Label>
              <Input
                id="authCode"
                type="text"
                placeholder="9006ebb2-282c-5827-..."
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Pobieranie...
                </>
              ) : (
                "Pobierz Token"
              )}
            </Button>
          </form>

          {result && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label>Odpowiedź z Apilo:</Label>
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Textarea
                value={result}
                readOnly
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupApilo;
