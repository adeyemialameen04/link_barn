"use client";
import { CheckCircle, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { saveUserDetails } from "@/lib/saveUserDetails";
import { UserData } from "@/types/links";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { sendSTXTransaction } from "@/lib/sendSTXTransaction";
import { checkTransactionStatus } from "@/lib/checkTransactionStatus";
import { holdsUnik } from "@/lib/holdsUnik";
import { Button } from "./ui/button";

interface PremiumOptionProps {
  title: string;
  price: string;
  txStatus: string;
  user: UserData | undefined;
}

export function PremiumOption({
  title,
  price,
  txStatus,
  user,
}: PremiumOptionProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    if (price === "3" && !(await holdsUnik(user?.stx_address_mainnet))) {
      toast.error("You need to hold UNIKIND to use this option", {
        richColors: true,
      });
      setLoading(false);
      return;
    } else {
      const txId = await sendSTXTransaction(price, title);
      if (user && txId) {
        user.prevTxID = txId;
        console.log(user);
        await saveUserDetails(user);
        console.log("tx ID handle payment = ", user.prevTxID);
        const status = await checkTransactionStatus(txId);
        toast.success(
          "Your transaction have been sent, please refresh this page",
          { richColors: true },
        );
        console.log("tx status = ", status);
      }
    }
    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-2xl font-bold mb-4">{price}stx one time payment</p>
      <ul className="space-y-2">
        {[
          "Remove Link Barn Branding",
          "Appearance Customization",
          "Product support",
        ].map((benefit, index) => (
          <li key={index} className="flex items-center">
            <CheckCircle className="text-green-500 mr-2" size={16} />
            {benefit}
          </li>
        ))}
      </ul>
      <Button
        className={cn(
          "w-full mt-4 bg-base-dark gap-4",
          txStatus === "success" && "cursor-not-allowed",
        )}
        onClick={handlePayment}
        disabled={txStatus === "success" || txStatus === "pending" || loading}
      >
        Choose {title}{" "}
        <LoaderCircle
          className={cn(
            `animate-spin`,
            loading || txStatus === "pending" ? "flex" : "hidden",
          )}
          size={16}
        />
      </Button>
    </div>
  );
}
