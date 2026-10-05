import { CheckoutProvider } from "@/components/checkout/checkout-provider";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { PackGiftProvider } from "@/components/pack/pack-gift";
import { getGiftsLeft } from "@/lib/pack-gift";

export default async function StoreLayout({ children }: LayoutProps<"/">) {
  const giftsLeft = await getGiftsLeft();

  return (
    <PackGiftProvider initialLeft={giftsLeft}>
      <CheckoutProvider>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </CheckoutProvider>
    </PackGiftProvider>
  );
}
