import { useState } from "react";
import { Wallet, Plus, History, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { useAppContext } from "@/lib/AppContext";
import { toast } from "sonner";

export function WalletCard() {
  const { walletBalance, addMoneyToWallet } = useAppContext();
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMoney = async () => {
    const amountValue = parseFloat(amount);
    
    if (!amountValue || amountValue <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amountValue > 100000) {
      toast.error("Maximum amount per transaction is ₹100,000");
      return;
    }

    setIsLoading(true);
    try {
      await addMoneyToWallet(amountValue);
      setAmount("");
      setIsAddMoneyOpen(false);
    } catch (error) {
      console.error("Failed to add money:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            <CardTitle>Wallet Balance</CardTitle>
          </div>
          <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
            <DialogTrigger asChild>
              <Button className="px-3 py-1 text-sm">
                Add Money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Money to Wallet</DialogTitle>
                <DialogDescription>
                  Add funds to your wallet for seamless transactions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max="100000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quick Add</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {quickAmounts.map((amt) => (
                      <Button
                        key={amt}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(amt.toString())}
                      >
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddMoneyOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddMoney} disabled={isLoading}>
                  {isLoading ? "Processing..." : "Add Money"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>Available balance in your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              ₹{walletBalance?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span>Credit on delivery</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
              <span>Debit on order</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
