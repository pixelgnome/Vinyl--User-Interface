import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Save, Eye, EyeOff, ExternalLink, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { discogsAPI } from '../utils/discogs';

const STORAGE_KEY_TOKEN = 'discogs_token';
const STORAGE_KEY_CONSUMER_KEY = 'discogs_consumer_key';
const STORAGE_KEY_CONSUMER_SECRET = 'discogs_consumer_secret';

export function DiscogsSettings() {
  const [token, setToken] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved credentials on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN) || '';
    const savedKey = localStorage.getItem(STORAGE_KEY_CONSUMER_KEY) || '';
    const savedSecret = localStorage.getItem(STORAGE_KEY_CONSUMER_SECRET) || '';

    setToken(savedToken);
    setConsumerKey(savedKey);
    setConsumerSecret(savedSecret);

    // Apply to API client
    if (savedToken) {
      discogsAPI.setToken(savedToken);
    } else if (savedKey && savedSecret) {
      discogsAPI.setConsumerCredentials(savedKey, savedSecret);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);

    try {
      // Validate that at least one method is provided
      if (!token.trim() && (!consumerKey.trim() || !consumerSecret.trim())) {
        toast.error('Please provide either a Personal Access Token or Consumer Key/Secret');
        setIsSaving(false);
        return;
      }

      // Save to localStorage
      if (token.trim()) {
        localStorage.setItem(STORAGE_KEY_TOKEN, token.trim());
        discogsAPI.setToken(token.trim());
        toast.success('Personal Access Token saved successfully!');
      } else {
        localStorage.removeItem(STORAGE_KEY_TOKEN);
      }

      if (consumerKey.trim() && consumerSecret.trim()) {
        localStorage.setItem(STORAGE_KEY_CONSUMER_KEY, consumerKey.trim());
        localStorage.setItem(STORAGE_KEY_CONSUMER_SECRET, consumerSecret.trim());
        discogsAPI.setConsumerCredentials(consumerKey.trim(), consumerSecret.trim());
        toast.success('Consumer credentials saved successfully!');
      } else {
        localStorage.removeItem(STORAGE_KEY_CONSUMER_KEY);
        localStorage.removeItem(STORAGE_KEY_CONSUMER_SECRET);
      }

      toast.success('Discogs API configured successfully!');
    } catch (error) {
      console.error('Error saving credentials:', error);
      toast.error('Failed to save credentials');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    setToken('');
    setConsumerKey('');
    setConsumerSecret('');
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_CONSUMER_KEY);
    localStorage.removeItem(STORAGE_KEY_CONSUMER_SECRET);
    toast.info('Credentials cleared');
  };

  const isConfigured = discogsAPI.isConfigured();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Status Card */}
      {isConfigured && (
        <Card className="bg-green-950/20 border-green-700/50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
            <div className="flex-1">
              <h4 className="text-green-200 font-medium">API Configured</h4>
              <p className="text-green-200/80 text-sm">
                Your Discogs API is configured and ready to use.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions Card */}
      <Card className="bg-card border-border backdrop-blur-sm">
        <div className="p-6">
          <h2 className="text-foreground mb-4">Discogs API Configuration</h2>

          <div className="space-y-4 text-sm text-muted-foreground mb-6">
            <p>
              To use the Discogs search feature, you need to authenticate with the Discogs API.
              You have two options:
            </p>

            <div className="space-y-3 pl-4 border-l-2 border-primary/30">
              <div>
                <p className="text-foreground font-medium">Option 1: Personal Access Token (Recommended)</p>
                <p className="text-xs mt-1">
                  Best for personal use. Quick and simple to set up.
                </p>
              </div>

              <div>
                <p className="text-foreground font-medium">Option 2: Consumer Key & Secret</p>
                <p className="text-xs mt-1">
                  Required if you're building an app that needs OAuth authentication.
                </p>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              <p className="text-foreground font-medium mb-2">How to get your credentials:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Go to Discogs Developer Settings</li>
                <li>Create a new application (if you haven't already)</li>
                <li>For Personal Token: Click "Generate new token"</li>
                <li>For Consumer credentials: Copy your Consumer Key and Secret</li>
                <li>Paste your credentials below</li>
              </ol>
              <a
                href="https://www.discogs.com/settings/developers"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline mt-3 text-xs"
              >
                Open Discogs Developer Settings
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal Access Token */}
            <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="text-foreground font-medium">Option 1: Personal Access Token</h3>

              <div className="space-y-2">
                <Label htmlFor="token" className="text-foreground">
                  Personal Access Token
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="token"
                    type={showToken ? 'text' : 'password'}
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your personal access token"
                    className="flex-1 bg-input-background border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowToken(!showToken)}
                    className="border-border"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your token will be stored locally in your browser
                </p>
              </div>
            </div>

            {/* Consumer Key/Secret */}
            <div className="space-y-4 p-4 rounded-lg bg-muted/50 border border-border">
              <h3 className="text-foreground font-medium">Option 2: Consumer Key & Secret</h3>

              <div className="space-y-2">
                <Label htmlFor="consumer-key" className="text-foreground">
                  Consumer Key
                </Label>
                <Input
                  id="consumer-key"
                  type="text"
                  value={consumerKey}
                  onChange={(e) => setConsumerKey(e.target.value)}
                  placeholder="Enter your consumer key"
                  className="bg-input-background border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consumer-secret" className="text-foreground">
                  Consumer Secret
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="consumer-secret"
                    type={showSecret ? 'text' : 'password'}
                    value={consumerSecret}
                    onChange={(e) => setConsumerSecret(e.target.value)}
                    placeholder="Enter your consumer secret"
                    className="flex-1 bg-input-background border-border text-foreground placeholder:text-muted-foreground font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSecret(!showSecret)}
                    className="border-border"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your credentials will be stored locally in your browser
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-primary hover:bg-[var(--button-primary-hover)] text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </Button>
              <Button
                onClick={handleClear}
                variant="outline"
                className="border-border text-foreground hover:bg-muted"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Privacy Notice */}
      <Card className="bg-card border-border p-4">
        <p className="text-muted-foreground text-xs">
          <span className="text-primary font-medium">Privacy Note:</span> Your API credentials are
          stored locally in your browser and are never sent to any server except Discogs API when
          making search requests. They remain completely private and under your control.
        </p>
      </Card>
    </div>
  );
}
